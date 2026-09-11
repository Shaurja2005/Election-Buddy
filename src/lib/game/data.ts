export const GAME_STAGES = [
  "state",
  "character",
  "documents",
  "roll",
  "booth",
  "electionDay",
  "officer",
  "evm",
  "done",
] as const;

export type GameStage = (typeof GAME_STAGES)[number];

/** The map file ships two pre-2011 names; the ECI uses the current ones. */
export const STATE_NAME_FIXES: Record<string, string> = {
  Orissa: "Odisha",
  Uttaranchal: "Uttarakhand",
  "Dādra and Nagar Haveli and Damān and Diu": "Dadra and Nagar Haveli and Daman and Diu",
};

export interface GameDoc {
  id: string;
  img: string;
  /** Accepted by the ECI as proof of identity at the polling station. */
  valid: boolean;
  /** Where the item sits on the desk, in percent of the scene box. */
  x: number;
  y: number;
  w: number;
  rotate: number;
}

/**
 * Seven valid IDs plus three decoys. Positions are hand-placed to sit in the
 * clutter of the desk photo rather than in a tidy grid — finding them is the
 * whole point of the stage.
 */
export const GAME_DOCS: GameDoc[] = [
  { id: "votercard", img: "doc_votercard", valid: true, x: 8, y: 12, w: 17, rotate: -7 },
  { id: "aadhar", img: "doc_aadhar", valid: true, x: 63, y: 8, w: 17, rotate: 5 },
  { id: "passport", img: "doc_passport", valid: true, x: 39, y: 55, w: 13, rotate: -3 },
  { id: "drivinglicense", img: "doc_drivinglicense", valid: true, x: 79, y: 46, w: 17, rotate: 9 },
  { id: "pancard", img: "doc_pancard", valid: true, x: 22, y: 64, w: 15, rotate: 4 },
  { id: "mnrega", img: "doc_mnrega", valid: true, x: 47, y: 4, w: 14, rotate: -5 },
  { id: "passbook", img: "doc_passbook", valid: true, x: 4, y: 42, w: 14, rotate: 11 },
  { id: "grocery", img: "grocery_list", valid: false, x: 66, y: 66, w: 13, rotate: -9 },
  { id: "library", img: "library_card", valid: false, x: 30, y: 30, w: 14, rotate: 6 },
  { id: "receipt", img: "item_reciept", valid: false, x: 88, y: 16, w: 10, rotate: -4 },
];

export const VALID_DOC_COUNT = GAME_DOCS.filter((d) => d.valid).length;

export interface GameBuilding {
  id: string;
  correct: boolean;
  /** Horizontal position along the street, in percent. */
  x: number;
  color: string;
  roof: string;
}

export const GAME_BUILDINGS: GameBuilding[] = [
  { id: "bank", correct: false, x: 4, color: "#c9d8e8", roof: "#5b7fa6" },
  { id: "postOffice", correct: false, x: 23, color: "#f4d7c2", roof: "#c9714a" },
  { id: "pollingStation", correct: true, x: 42, color: "#e6f0d8", roof: "#5d8a4a" },
  { id: "hospital", correct: false, x: 61, color: "#fbe3e6", roof: "#b8535f" },
  { id: "school", correct: false, x: 80, color: "#e8e0f2", roof: "#6f5b9e" },
];

/** Filler names the player's own name is hidden among on the electoral roll. */
export const ROLL_FILLER_NAMES = [
  "Ananya Iyer",
  "Rakesh Kumar Verma",
  "Fatima Sheikh",
  "Joseph Mathew",
  "Priya Nair",
  "Harpreet Singh",
  "Meenakshi Rao",
  "Abdul Rahman",
  "Sunita Devi",
  "Vikram Chauhan",
  "Lakshmi Narayanan",
  "Tenzin Dorjee",
  "Rohit Banerjee",
  "Zoya Khan",
  "Mahesh Patil",
  "Deepa Krishnan",
  "Imran Qureshi",
  "Kavita Joshi",
  "Sanjay Gowda",
  "Nisha Pillai",
];

/** Mock parties. Real party names and symbols stay out of a civic tutorial. */
export const GAME_CANDIDATES = [
  { id: 1, symbol: "🪁" },
  { id: 2, symbol: "🏺" },
  { id: 3, symbol: "🌾" },
  { id: 4, symbol: "🚲" },
  { id: 5, symbol: "nota" },
] as const;

export const OFFICER_LINES = ["greet", "askId", "checkRoll", "found", "ink", "proceed"] as const;

export const GAME_STORAGE_KEY = "ballot-buddy-game";
