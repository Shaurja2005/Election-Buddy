import { render, screen } from "@testing-library/react";
import ChatBubble, { TypingBubble } from "@/components/ChatBubble";
import type { ChatMessage } from "@/types";

describe("ChatBubble", () => {
  it("renders a user message bubble on the right", () => {
    const msg: ChatMessage = {
      id: "1",
      role: "user",
      content: "Hello there!",
      timestamp: new Date("2024-01-01T10:00:00"),
      responseType: "text",
    };

    const { container } = render(<ChatBubble message={msg} />);
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
    // User bubbles are right-aligned
    expect(container.querySelector(".justify-end")).toBeTruthy();
  });

  it("renders an assistant message bubble on the left", () => {
    const msg: ChatMessage = {
      id: "2",
      role: "assistant",
      content: "I can help with elections!",
      timestamp: new Date("2024-01-01T10:01:00"),
      responseType: "text",
    };

    render(<ChatBubble message={msg} />);
    // Bot avatar is decorative (aria-hidden), check by article label
    expect(screen.getByRole("article", { name: /ballot buddy response/i })).toBeInTheDocument();
  });

  it("renders TypingBubble with loading indicator", () => {
    const { container } = render(<TypingBubble />);
    // The loading dots span should be present
    expect(container.querySelector(".loading-dots")).toBeTruthy();
  });

  it("renders steps responseType correctly", () => {
    const msg: ChatMessage = {
      id: "3",
      role: "assistant",
      content: "Step 1. Visit vote.gov\nStep 2. Fill the form",
      timestamp: new Date("2024-01-01T10:02:00"),
      responseType: "steps",
    };

    render(<ChatBubble message={msg} />);
    // Steps renderer should be triggered — just check content is in DOM
    expect(screen.getByText(/Visit vote\.gov|Step/i)).toBeInTheDocument();
  });

  it("renders links responseType with links renderer", () => {
    const msg: ChatMessage = {
      id: "4",
      role: "assistant",
      content: "Here are some useful links",
      timestamp: new Date("2024-01-01T10:03:00"),
      responseType: "links",
      structuredData: {
        links: [
          { title: "Voter Registration", url: "https://vote.gov", type: "registration" },
        ],
      },
    };

    render(<ChatBubble message={msg} />);
    expect(screen.getByText("Voter Registration")).toBeInTheDocument();
  });

  it("renders polling locations for location responseType", () => {
    const msg: ChatMessage = {
      id: "5",
      role: "assistant",
      content: "Here are your polling locations",
      timestamp: new Date("2024-01-01T10:04:00"),
      responseType: "location",
      structuredData: {
        pollingLocations: [
          { name: "Central Library", address: "123 Main St, Springfield, IL 62701" },
        ],
      },
    };

    render(<ChatBubble message={msg} />);
    expect(screen.getByText("Central Library")).toBeInTheDocument();
  });
});
