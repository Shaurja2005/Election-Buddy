import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import type {
  ChatApiRequest,
  ChatApiResponse,
  CivicElectionInfo,
  StructuredData,
  ElectionLink,
  PollingLocation,
  ResponseType,
} from "@/types";

// ─── Civic API ────────────────────────────────────────────────────────────────

async function fetchCivicData(address: string): Promise<CivicElectionInfo> {
  const apiKey = process.env.GOOGLE_CIVIC_API_KEY;
  if (!apiKey) {
    console.warn("GOOGLE_CIVIC_API_KEY is not set – skipping Civic API call.");
    return {};
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

    return civicInfo;
  } catch (err) {
    console.error("Civic API fetch failed:", err);
    return {};
  }
}

// ─── Prompt Construction ──────────────────────────────────────────────────────

function buildSystemPrompt(civicData: CivicElectionInfo, address: string): string {
  const lines: string[] = [
    "You are 'Ballot Buddy', a friendly, neutral, and knowledgeable AI election assistant.",
    "You help voters around the world — including India, the United States, and other democracies — understand election processes, timelines, results, and how to participate.",
    "Always be encouraging, non-partisan, and accurate. Use your training knowledge for general election facts.",
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
    lines.push(
      "No live civic data was retrieved (either the address is outside the US, no active election in the system, or the Civic API key is not configured).",
      "Use your training knowledge to answer the user's question accurately.",
      ""
    );
  }

  lines.push(
    "IMPORTANT INSTRUCTIONS:",
    "- Answer questions about any country's elections — India (including state elections like West Bengal, Tamil Nadu, etc.), USA, UK, and others.",
    "- For Indian elections, use your knowledge of the Election Commission of India (ECI), Vidhan Sabha, Lok Sabha, state assembly results, etc.",
    "- For election results questions, share what you know from your training data and note that for real-time results the user should check the official Election Commission website.",
    "- When explaining a process (like registration or voting), present it as clear numbered steps.",
    "- When sharing URLs, present them clearly labeled.",
    "- Keep answers concise, friendly, and easy to understand.",
    "- If you lack specific data, say so honestly and direct users to official sources (eci.gov.in for India, vote.gov for USA).",
    "- Never recommend a candidate or party. Always remain strictly non-partisan.",
    "- Structure your response clearly with short paragraphs.",
    "- For real-time information (live results, today's news), clarify that your knowledge has a training cutoff and direct them to official sources."
  );

  return lines.join("\n");
}

// ─── Parse AI Response for Structure ─────────────────────────────────────────

function parseResponseType(text: string, civicData: CivicElectionInfo): {
  responseType: ResponseType;
  structuredData?: StructuredData;
} {
  const lower = text.toLowerCase();
  const hasSteps =
    /step\s+\d|^\d+\.\s/m.test(text) ||
    lower.includes("first,") ||
    lower.includes("next,") ||
    lower.includes("finally,");

  const hasLinks =
    civicData.registrationUrl ||
    civicData.absenteeBallotUrl ||
    civicData.ballotInfoUrl;

  const hasPolling =
    civicData.pollingLocations && civicData.pollingLocations.length > 0;

  const links: ElectionLink[] = [];
  if (civicData.registrationUrl) {
    links.push({
      title: "Voter Registration",
      url: civicData.registrationUrl,
      description: "Register to vote or check your registration status",
      type: "registration",
    });
  }
  if (civicData.absenteeBallotUrl) {
    links.push({
      title: "Absentee Ballot Info",
      url: civicData.absenteeBallotUrl,
      description: "Request an absentee or mail-in ballot",
      type: "ballot",
    });
  }
  if (civicData.ballotInfoUrl) {
    links.push({
      title: "Sample Ballot",
      url: civicData.ballotInfoUrl,
      description: "Preview your sample ballot",
      type: "ballot",
    });
  }


  const pollingLocations: PollingLocation[] = (
    civicData.pollingLocations ?? []
  ).map((loc) => ({
    name: loc.address.locationName || "Polling Place",
    address: `${loc.address.line1}, ${loc.address.city}, ${loc.address.state} ${loc.address.zip}`,
    hours: loc.pollingHours,
    notes: loc.notes,
  }));

  if (hasPolling && lower.includes("poll")) {
    return {
      responseType: "location",
      structuredData: { pollingLocations, links },
    };
  }

  if (hasLinks && (lower.includes("register") || lower.includes("url") || lower.includes("link") || lower.includes("website"))) {
    return {
      responseType: "links",
      structuredData: { links, pollingLocations },
    };
  }

  if (hasSteps) {
    return {
      responseType: "steps",
      structuredData: { links, pollingLocations },
    };
  }

  return {
    responseType: "text",
    structuredData: links.length > 0 ? { links } : undefined,
  };
}

// ─── API Route Handler ────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: ChatApiRequest = await req.json();
    const { message, address, history } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required." } as ChatApiResponse,
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey || geminiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is not configured.",
          reply: "⚠️ The Gemini API key has not been set up yet. Please open the `.env.local` file in the project root and replace `your_gemini_api_key_here` with your actual key from https://aistudio.google.com/app/apikey — then restart the dev server.",
          responseType: "text",
        } as ChatApiResponse,
        { status: 503 }
      );
    }

    // 1. Fetch civic data in parallel with no blocking
    const civicData = await fetchCivicData(address || "");

    // 2. Construct system prompt
    const systemPrompt = buildSystemPrompt(civicData, address || "unknown address");

    // 3. Initialize Gemini
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    // 4. Build chat history
    const chatHistory = (history ?? [])
      .filter((m) => m.content?.trim())
      .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    // 5. Send message
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const replyText = result.response.text();

    // 6. Parse response for UI hints
    const { responseType, structuredData } = parseResponseType(replyText, civicData);

    const response: ChatApiResponse = {
      reply: replyText,
      responseType,
      structuredData,
      civicData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    const rawMessage = error instanceof Error ? error.message : "An unexpected error occurred.";

    // Provide user-friendly messages for common API key errors
    let userFriendlyReply = "I'm sorry, something went wrong on my end. Please try again in a moment.";

    if (rawMessage.includes("API key not valid") || rawMessage.includes("API_KEY_INVALID")) {
      userFriendlyReply =
        "⚠️ **Invalid API Key**: The Gemini API key in `.env.local` is not valid. Please:\n\n" +
        "1. Go to https://aistudio.google.com/app/apikey\n" +
        "2. Create or copy a valid API key\n" +
        "3. Paste it as `GEMINI_API_KEY=...` in your `.env.local` file\n" +
        "4. Restart the dev server (`npm run dev`)";
    } else if (rawMessage.includes("quota") || rawMessage.includes("RESOURCE_EXHAUSTED")) {
      userFriendlyReply =
        "⚠️ **API Quota Exceeded**: Your Gemini API quota has been reached. Please wait a moment or check your usage at https://aistudio.google.com";
    } else if (rawMessage.includes("fetch") || rawMessage.includes("network") || rawMessage.includes("ECONNREFUSED")) {
      userFriendlyReply =
        "⚠️ **Network Error**: Could not reach the AI service. Please check your internet connection and try again.";
    }

    return NextResponse.json(
      { error: rawMessage, reply: userFriendlyReply, responseType: "text" } as ChatApiResponse,
      { status: 500 }
    );
  }
}
