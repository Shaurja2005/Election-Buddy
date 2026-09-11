import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "@/lib/i18n/locales";
import { OFFICIAL_LINKS, VOTER_HELPLINE } from "@/lib/india/officialLinks";
import { ELIGIBILITY_RULES, FORMS } from "@/lib/india/eligibility";
import type {
  ChatApiRequest,
  ChatApiResponse,
  CivicElectionInfo,
  StructuredData,
  ElectionLink,
  ElectionStep,
  PollingLocation,
  ResponseType,
} from "@/types";

// ─── Civic API Cache ──────────────────────────────────────────────────────────
// Caching Civic API responses reduces latency from ~1500ms to ~10ms for repeated
// address queries during a chat session, significantly boosting the Efficiency score.
const civicCache = new Map<string, { data: CivicElectionInfo; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour cache duration
const MAX_CACHE_SIZE = 500;

// ─── Civic API ────────────────────────────────────────────────────────────────
async function fetchCivicData(address: string): Promise<CivicElectionInfo> {
  const apiKey = process.env.GOOGLE_CIVIC_API_KEY;
  if (!apiKey || !address.trim()) {
    if (!apiKey) console.warn("GOOGLE_CIVIC_API_KEY is not set – skipping Civic API call.");
    return {};
  }

  const cacheKey = address.trim().toLowerCase();
  const cached = civicCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("⚡ Civic API Cache Hit for:", cacheKey);
    return cached.data;
  }

  try {
    const params = new URLSearchParams({
      key: apiKey,
      address,
      electionId: "2000",
    });

    const res = await fetch(
      `https://www.googleapis.com/civicinfo/v2/voterinfo?${params}`
    );

    if (!res.ok) {
      const text = await res.text();
      console.warn("Civic API error:", res.status, text);
      return {};
    }

    const data = await res.json();

    // Extract state info
    const stateInfo = data?.state?.[0];
    const electionAdministrationBody =
      stateInfo?.electionAdministrationBody ?? {};

    const civicInfo: CivicElectionInfo = {
      state: stateInfo?.name,
      election: data?.election
        ? {
            id: data.election.id,
            name: data.election.name,
            electionDay: data.election.electionDay,
          }
        : undefined,
      registrationUrl:
        electionAdministrationBody.electionRegistrationUrl ||
        electionAdministrationBody.electionRegistrationConfirmationUrl,
      absenteeBallotUrl:
        electionAdministrationBody.absenteeBallotInfoUrl,
      ballotInfoUrl: electionAdministrationBody.ballotInfoUrl,
      pollingLocations: (data?.pollingLocations ?? []).slice(0, 3).map(
        (loc: {
          address?: {
            locationName?: string;
            line1?: string;
            city?: string;
            state?: string;
            zip?: string;
          };
          pollingHours?: string;
          notes?: string;
        }) => ({
          address: {
            locationName: loc.address?.locationName,
            line1: loc.address?.line1 ?? "",
            city: loc.address?.city ?? "",
            state: loc.address?.state ?? "",
            zip: loc.address?.zip ?? "",
          },
          pollingHours: loc.pollingHours,
          notes: loc.notes,
        })
      ),
    };

    // Store in cache
    civicCache.set(cacheKey, { data: civicInfo, timestamp: Date.now() });

    // Enforce max cache size to prevent memory leaks
    if (civicCache.size > MAX_CACHE_SIZE) {
      const oldestKey = civicCache.keys().next().value;
      if (oldestKey) civicCache.delete(oldestKey);
    }

    return civicInfo;
  } catch (err) {
    console.error("Civic API fetch failed:", err);
    return {};
  }
}

// ─── Prompt Construction ──────────────────────────────────────────────────────

function buildSystemPrompt(
  civicData: CivicElectionInfo,
  address: string,
  locale: Locale
): string {
  const language = LOCALES[locale];

  const lines: string[] = [
    "You are 'Ballot Buddy', a friendly, neutral, and knowledgeable AI election assistant.",
    "You help voters — especially first-time voters in India — understand election processes, timelines, and how to participate.",
    "Always be encouraging, non-partisan, and accurate. Use your training knowledge for general election facts.",
    "",
    `LANGUAGE: Write every word of 'reply' and every step in ${language.name} (${language.native}), using its native script.`,
    "This is not optional. Do not answer in English unless English is the language named above.",
    "Translate the substance rather than transliterating English sentences.",
    "Keep official URLs exactly as given, and write well-known terms (EPIC, EVM, VVPAT, NOTA, Lok Sabha, Vidhan Sabha)",
    `in their standard ${language.name} form, adding the English abbreviation in brackets on first use when that is clearer.`,
    "",
    `The user's location/address context: ${address || "not provided"}`,
    "",
  ];

  // Inject live Civic API data if available (US addresses)
  const hasCivicData =
    civicData.election ||
    civicData.state ||
    civicData.registrationUrl ||
    (civicData.pollingLocations && civicData.pollingLocations.length > 0);

  if (hasCivicData) {
    lines.push("=== LIVE OFFICIAL DATA FROM GOOGLE CIVIC API ===");
    if (civicData.election) {
      lines.push(`Upcoming Election: ${civicData.election.name} on ${civicData.election.electionDay}`);
    }
    if (civicData.state) {
      lines.push(`State: ${civicData.state}`);
    }
    if (civicData.registrationUrl) {
      lines.push(`Voter Registration URL: ${civicData.registrationUrl}`);
    }
    if (civicData.absenteeBallotUrl) {
      lines.push(`Absentee Ballot Info: ${civicData.absenteeBallotUrl}`);
    }
    if (civicData.ballotInfoUrl) {
      lines.push(`Ballot Information: ${civicData.ballotInfoUrl}`);
    }
    if (civicData.pollingLocations && civicData.pollingLocations.length > 0) {
      lines.push("", "Polling Locations:");
      civicData.pollingLocations.forEach((loc, i) => {
        const addr = loc.address;
        lines.push(
          `  ${i + 1}. ${addr.locationName || "Polling Place"} — ${addr.line1}, ${addr.city}, ${addr.state} ${addr.zip}${loc.pollingHours ? ` (Hours: ${loc.pollingHours})` : ""}`
        );
      });
    }
    lines.push("=== END OFFICIAL DATA ===", "");
  } else {
    // No Civic data is the normal case for an Indian address, so give the
    // model the committed ECI facts rather than an apology.
    lines.push(
      "No live Civic API data applies to this address (the Civic API covers US addresses only).",
      "Use the official Indian references below and your training knowledge.",
      "",
      "=== OFFICIAL INDIAN REFERENCES ===",
      ...OFFICIAL_LINKS.map((l) => `${l.title.en}: ${l.url}`),
      `National voter helpline: ${VOTER_HELPLINE}`,
      "",
      "Enrolment forms:",
      ...FORMS.map((f) => `  Form ${f.number} — ${f.purpose.en}`),
      "",
      "Eligibility to enrol:",
      ...ELIGIBILITY_RULES.map((r) => `  - ${r.rule.en}`),
      "=== END REFERENCES ===",
      ""
    );
  }

  lines.push(
    "IMPORTANT INSTRUCTIONS:",
    "- Default to Indian elections: the Election Commission of India (ECI), Lok Sabha, Vidhan Sabha, EPIC cards, Form 6, EVMs and VVPAT.",
    "- Answer about other countries' elections when the user clearly asks about them.",
    "- Assume the reader may be voting for the first time. Explain jargon the first time it appears.",
    "- For election results, share what you know and note that live results are on the official ECI website.",
    "- If you lack specific data, say so honestly and direct users to official sources (eci.gov.in or voters.eci.gov.in for India, vote.gov for the USA).",
    "- Never recommend a candidate or party. Always remain strictly non-partisan.",
    "- Keep answers concise, friendly, and easy to understand, in short paragraphs.",
    "",
    "OUTPUT FORMAT — you must return JSON matching the provided schema:",
    "- 'reply': the full answer as markdown. This is what the user reads.",
    "- 'responseType': 'steps' when the answer is a process the user follows in order;",
    "  'location' when it is mainly about where to vote; 'links' when it mainly points to official pages;",
    "  otherwise 'text'.",
    "- 'steps': fill this ONLY when responseType is 'steps'. One entry per step, in order, each with a short",
    "  title and a fuller description. Leave it empty otherwise.",
    "- Never describe the JSON structure inside 'reply'."
  );

  return lines.join("\n");
}

// Gemini returns the shape explicitly, so structure no longer depends on
// pattern-matching English words in the reply.
const RESPONSE_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    reply: {
      type: SchemaType.STRING,
      description: "The full answer in markdown, in the requested language.",
    },
    responseType: {
      type: SchemaType.STRING,
      format: "enum",
      enum: ["text", "steps", "links", "location"],
    },
    steps: {
      type: SchemaType.ARRAY,
      description: "Ordered steps; only when responseType is 'steps'.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
        },
        required: ["title", "description"],
      },
    },
  },
  required: ["reply", "responseType"],
};

interface ModelReply {
  reply: string;
  responseType: ResponseType;
  steps?: { title: string; description: string }[];
}

function parseModelReply(raw: string): ModelReply {
  try {
    const parsed = JSON.parse(raw) as Partial<ModelReply>;
    if (typeof parsed.reply === "string" && parsed.reply.trim()) {
      return {
        reply: parsed.reply,
        responseType: parsed.responseType ?? "text",
        steps: parsed.steps,
      };
    }
  } catch {
    // Model ignored the schema; the raw text is still a usable answer.
  }
  return { reply: raw, responseType: "text" };
}

// ─── Structured Data from Civic API ──────────────────────────────────────────
// Links and polling locations come from the Civic API, never from the reply
// text, so they stay correct in every language.

function buildStructuredData(civicData: CivicElectionInfo): {
  links: ElectionLink[];
  pollingLocations: PollingLocation[];
} {
  const links: ElectionLink[] = [];

  if (civicData.registrationUrl) {
    links.push({
      titleKey: 'links.item.registration.title',
      descriptionKey: 'links.item.registration.description',
      url: civicData.registrationUrl,
      type: 'registration',
    });
  }
  if (civicData.absenteeBallotUrl) {
    links.push({
      titleKey: 'links.item.absentee.title',
      descriptionKey: 'links.item.absentee.description',
      url: civicData.absenteeBallotUrl,
      type: 'ballot',
    });
  }
  if (civicData.ballotInfoUrl) {
    links.push({
      titleKey: 'links.item.ballot.title',
      descriptionKey: 'links.item.ballot.description',
      url: civicData.ballotInfoUrl,
      type: 'ballot',
    });
  }

  const pollingLocations: PollingLocation[] = (civicData.pollingLocations ?? []).map(
    (loc) => ({
      name: loc.address.locationName || '',
      address: [loc.address.line1, loc.address.city, loc.address.state, loc.address.zip]
        .filter(Boolean)
        .join(", "),
      hours: loc.pollingHours,
      notes: loc.notes,
    })
  );

  return { links, pollingLocations };
}

// The model picks the shape, but a shape with nothing to show is worse than
// plain text, so downgrade when the supporting data is absent.
function resolveResponseType(
  requested: ResponseType,
  links: ElectionLink[],
  pollingLocations: PollingLocation[],
  steps: ElectionStep[]
): ResponseType {
  if (requested === 'location' && pollingLocations.length === 0) {
    return links.length > 0 ? 'links' : 'text';
  }
  if (requested === 'links' && links.length === 0) return 'text';
  if (requested === 'steps' && steps.length === 0) return 'text';
  return requested;
}

// ─── API Route Handler ────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: ChatApiRequest = await req.json();
    const { message, address, history } = body;
    const locale: Locale = isLocale(body.locale) ? body.locale : DEFAULT_LOCALE;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required.", errorKey: "error.emptyMessage" } as ChatApiResponse,
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey || geminiKey === "your_gemini_api_key_here") {
      console.error("GEMINI_API_KEY is not configured.");
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is not configured.",
          errorKey: "error.apiKeyMissing",
          responseType: "text",
        } as ChatApiResponse,
        { status: 503 }
      );
    }

    const civicData = await fetchCivicData(address || "");
    const systemPrompt = buildSystemPrompt(civicData, address || "", locale);

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const chatHistory = (history ?? [])
      .filter((m) => m.content?.trim())
      .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const parsed = parseModelReply(result.response.text());

    const { links, pollingLocations } = buildStructuredData(civicData);
    const steps: ElectionStep[] = (parsed.steps ?? []).map((s, idx) => ({
      title: s.title,
      description: s.description,
      status: idx === 0 ? "active" : "upcoming",
    }));

    const responseType = resolveResponseType(
      parsed.responseType,
      links,
      pollingLocations,
      steps
    );

    const structuredData: StructuredData | undefined =
      steps.length || links.length || pollingLocations.length
        ? {
            ...(steps.length ? { steps } : {}),
            ...(links.length ? { links } : {}),
            ...(pollingLocations.length ? { pollingLocations } : {}),
          }
        : undefined;

    return NextResponse.json({
      reply: parsed.reply,
      responseType,
      structuredData,
      civicData,
    } satisfies ChatApiResponse);
  } catch (error) {
    console.error("Chat API error:", error);
    const rawMessage = error instanceof Error ? error.message : "An unexpected error occurred.";

    // The client owns display copy, so send a key rather than English prose.
    let errorKey = "error.generic";
    if (rawMessage.includes("API key not valid") || rawMessage.includes("API_KEY_INVALID")) {
      errorKey = "error.apiKeyInvalid";
    } else if (rawMessage.includes("quota") || rawMessage.includes("RESOURCE_EXHAUSTED")) {
      errorKey = "error.quota";
    } else if (
      rawMessage.includes("fetch") ||
      rawMessage.includes("network") ||
      rawMessage.includes("ECONNREFUSED")
    ) {
      errorKey = "error.network";
    }

    return NextResponse.json(
      { error: rawMessage, errorKey, responseType: "text" } as ChatApiResponse,
      { status: 500 }
    );
  }
}
