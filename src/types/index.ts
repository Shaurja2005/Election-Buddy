// Shared TypeScript types for the Election Assistant
import type { User } from "firebase/auth";
import type { Locale } from "@/lib/i18n/locales";

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
  url: string;
  type: "registration" | "polling" | "official" | "ballot" | "general";
  /** Literal label, for links that carry their own name. */
  title?: string;
  description?: string;
  /** Dictionary keys, for links the server builds. Take precedence over the literals. */
  titleKey?: string;
  descriptionKey?: string;
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
  /** Locale the assistant must reply in. Defaults to English when absent. */
  locale?: Locale;
}

export interface ChatApiResponse {
  reply?: string;
  responseType: ResponseType;
  structuredData?: StructuredData;
  civicData?: CivicElectionInfo;
  /** Developer-facing detail; never shown to users. */
  error?: string;
  /** Dictionary key the client translates into the user's language. */
  errorKey?: string;
}

// ---------- COMPONENT PROPS ----------

export interface StepsRendererProps {
  text: string;
  /** Steps returned as data by the model; falls back to parsing `text`. */
  steps?: ElectionStep[];
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
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  uploadFile: (file: File) => Promise<string | null>;
}
