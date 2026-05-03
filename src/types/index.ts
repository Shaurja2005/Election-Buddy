// Shared TypeScript types for the Election Assistant
import type { User } from "firebase/auth";

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  responseType?: ResponseType;
  structuredData?: StructuredData;
}

export interface ChatSession {
  id: string;
  title: string;
  address: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export type ResponseType =
  | "text"
  | "steps"
  | "links"
  | "location"
  | "mixed";

export interface ElectionStep {
  title: string;
  description: string;
  deadline?: string;
  status?: "completed" | "active" | "upcoming";
}

export interface ElectionLink {
  title: string;
  url: string;
  description?: string;
  type: "registration" | "polling" | "official" | "ballot" | "general";
}

export interface PollingLocation {
  name: string;
  address: string;
  hours?: string;
  notes?: string;
}

export interface StructuredData {
  steps?: ElectionStep[];
  links?: ElectionLink[];
  pollingLocations?: PollingLocation[];
}

// Civic API types
export interface CivicElectionInfo {
  state?: string;
  election?: {
    id: string;
    name: string;
    electionDay: string;
  };
  registrationUrl?: string;
  absenteeBallotUrl?: string;
  ballotInfoUrl?: string;
  pollingLocations?: {
    address: {
      locationName?: string;
      line1: string;
      city: string;
      state: string;
      zip: string;
    };
    pollingHours?: string;
    notes?: string;
  }[];
}

export interface ChatApiRequest {
  message: string;
  address: string;
  history: { role: MessageRole; content: string }[];
}

export interface ChatApiResponse {
  reply: string;
  responseType: ResponseType;
  structuredData?: StructuredData;
  civicData?: CivicElectionInfo;
  error?: string;
}

// ---------- COMPONENT PROPS ----------

export interface StepsRendererProps {
  text: string;
}

export interface PollingLocationsProps {
  locations: PollingLocation[];
}

export interface AddressInputProps {
  address: string;
  onChange: (val: string) => void;
  onSubmit: (address: string) => void;
  disabled?: boolean;
}

export interface GooglePlaceAutocomplete {
  addListener: (event: string, handler: () => void) => void;
  getPlace: () => { formatted_address?: string };
}

export interface LinksRendererProps {
  links: ElectionLink[];
  title?: string;
}

export interface ChatBubbleProps {
  message: ChatMessage;
}

export interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

// ---------- CONTEXT TYPES ----------

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}
