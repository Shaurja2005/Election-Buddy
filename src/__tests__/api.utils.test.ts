// Unit tests for route utility functions extracted from the API route

/**
 * Tests for response parsing logic used in /api/chat
 * We test the pure functions independently from the HTTP handler
 */

import type { CivicElectionInfo } from "@/types";

// ── Inline the parseResponseType logic for unit testing ──────────────────────
// (This mirrors the logic in route.ts; in a refactor these would be importable)

type ResponseType = "text" | "steps" | "links" | "location" | "mixed";

function parseResponseType(
  text: string,
  civicData: CivicElectionInfo
): { responseType: ResponseType } {
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

  if (hasPolling && lower.includes("poll")) {
    return { responseType: "location" };
  }

  if (
    hasLinks &&
    (lower.includes("register") ||
      lower.includes("url") ||
      lower.includes("link") ||
      lower.includes("website"))
  ) {
    return { responseType: "links" };
  }

  if (hasSteps) {
    return { responseType: "steps" };
  }

  return { responseType: "text" };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("parseResponseType", () => {
  const emptyCivic: CivicElectionInfo = {};

  it("returns 'text' for a plain answer with no civic data", () => {
    const result = parseResponseType("Elections are held every 4 years.", emptyCivic);
    expect(result.responseType).toBe("text");
  });

  it("returns 'steps' when response contains numbered steps", () => {
    const text = "1. Go to vote.gov\n2. Fill out the form\n3. Submit";
    expect(parseResponseType(text, emptyCivic).responseType).toBe("steps");
  });

  it("returns 'steps' when response mentions first/next/finally", () => {
    const text = "First, gather your ID. Next, go to the polling place. Finally, vote!";
    expect(parseResponseType(text, emptyCivic).responseType).toBe("steps");
  });

  it("returns 'location' when civic data has polling locations and text mentions poll", () => {
    const civic: CivicElectionInfo = {
      pollingLocations: [
        {
          address: {
            line1: "123 Main St",
            city: "Springfield",
            state: "IL",
            zip: "62701",
          },
        },
      ],
    };
    const result = parseResponseType("Here are your polling locations.", civic);
    expect(result.responseType).toBe("location");
  });

  it("returns 'links' when civic has registrationUrl and text mentions register", () => {
    const civic: CivicElectionInfo = {
      registrationUrl: "https://vote.gov/register",
    };
    const result = parseResponseType("You can register to vote here.", civic);
    expect(result.responseType).toBe("links");
  });

  it("returns 'text' when civic has registrationUrl but text does not mention links/register", () => {
    const civic: CivicElectionInfo = {
      registrationUrl: "https://vote.gov/register",
    };
    const result = parseResponseType("Elections are important.", civic);
    expect(result.responseType).toBe("text");
  });

  it("prioritizes 'location' over 'links' when polling is present", () => {
    const civic: CivicElectionInfo = {
      registrationUrl: "https://vote.gov/register",
      pollingLocations: [
        {
          address: {
            line1: "456 Oak Ave",
            city: "Chicago",
            state: "IL",
            zip: "60601",
          },
        },
      ],
    };
    // mentions poll AND register/link
    const result = parseResponseType("Here is your polling location and registration link.", civic);
    expect(result.responseType).toBe("location");
  });
});

describe("buildSystemPrompt", () => {
  // Test that the prompt builder injects civic data properly
  function buildSystemPrompt(civicData: CivicElectionInfo, address: string): string {
    const lines: string[] = [
      "You are 'Ballot Buddy'",
      `The user's location/address context: ${address || "not provided"}`,
    ];

    const hasCivicData =
      civicData.election ||
      civicData.state ||
      civicData.registrationUrl ||
      (civicData.pollingLocations && civicData.pollingLocations.length > 0);

    if (hasCivicData) {
      lines.push("=== LIVE OFFICIAL DATA FROM GOOGLE CIVIC API ===");
      if (civicData.state) lines.push(`State: ${civicData.state}`);
      if (civicData.registrationUrl) {
        lines.push(`Voter Registration URL: ${civicData.registrationUrl}`);
      }
    } else {
      lines.push("No live civic data was retrieved");
    }

    return lines.join("\n");
  }

  it("includes address in system prompt", () => {
    const prompt = buildSystemPrompt({}, "123 Main St, Springfield, IL");
    expect(prompt).toContain("123 Main St, Springfield, IL");
  });

  it("includes civic data block when civic data is available", () => {
    const civic: CivicElectionInfo = {
      state: "Illinois",
      registrationUrl: "https://vote.gov/register",
    };
    const prompt = buildSystemPrompt(civic, "Springfield, IL");
    expect(prompt).toContain("LIVE OFFICIAL DATA FROM GOOGLE CIVIC API");
    expect(prompt).toContain("Illinois");
    expect(prompt).toContain("https://vote.gov/register");
  });

  it("shows fallback message when no civic data available", () => {
    const prompt = buildSystemPrompt({}, "Some address");
    expect(prompt).toContain("No live civic data was retrieved");
  });
});
