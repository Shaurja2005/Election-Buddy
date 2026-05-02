import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatInterface from "@/components/ChatInterface";
import type { ChatMessage } from "@/types";

// Mock fetch globally
global.fetch = jest.fn();

const mockOnAddMessage = jest.fn();

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm **Ballot Buddy** 🗳️",
  timestamp: new Date("2024-01-01T10:00:00"),
  responseType: "text",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ChatInterface", () => {
  it("renders the message list and input", () => {
    render(
      <ChatInterface
        address="123 Main St"
        messages={[welcomeMessage]}
        onAddMessage={mockOnAddMessage}
      />
    );

    expect(screen.getByPlaceholderText(/ask about elections/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/send message/i)).toBeInTheDocument();
  });

  it("renders quick question buttons", () => {
    render(
      <ChatInterface
        address=""
        messages={[welcomeMessage]}
        onAddMessage={mockOnAddMessage}
      />
    );

    expect(screen.getByText("How do I register to vote?")).toBeInTheDocument();
    expect(screen.getByText("When is the next election?")).toBeInTheDocument();
  });

  it("disables send button when input is empty", () => {
    render(
      <ChatInterface
        address=""
        messages={[welcomeMessage]}
        onAddMessage={mockOnAddMessage}
      />
    );

    const sendBtn = screen.getByLabelText(/send message/i);
    expect(sendBtn).toBeDisabled();
  });

  it("enables send button when user types input", async () => {
    const user = userEvent.setup();
    render(
      <ChatInterface
        address=""
        messages={[welcomeMessage]}
        onAddMessage={mockOnAddMessage}
      />
    );

    const textarea = screen.getByPlaceholderText(/ask about elections/i);
    await user.type(textarea, "How do I register?");

    const sendBtn = screen.getByLabelText(/send message/i);
    expect(sendBtn).not.toBeDisabled();
  });

  it("calls onAddMessage with user message on send", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        reply: "You can register online at vote.gov",
        responseType: "text",
      }),
    });

    render(
      <ChatInterface
        address="123 Main St"
        messages={[welcomeMessage]}
        onAddMessage={mockOnAddMessage}
      />
    );

    const textarea = screen.getByPlaceholderText(/ask about elections/i);
    await user.type(textarea, "How do I register?");
    await user.click(screen.getByLabelText(/send message/i));

    expect(mockOnAddMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        role: "user",
        content: "How do I register?",
      })
    );
  });

  it("sends message on Enter key (without Shift)", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        reply: "Here is the info",
        responseType: "text",
      }),
    });

    render(
      <ChatInterface
        address=""
        messages={[welcomeMessage]}
        onAddMessage={mockOnAddMessage}
      />
    );

    const textarea = screen.getByPlaceholderText(/ask about elections/i);
    await user.type(textarea, "Vote registration");
    await user.keyboard("{Enter}");

    expect(mockOnAddMessage).toHaveBeenCalledWith(
      expect.objectContaining({ role: "user" })
    );
  });

  it("adds error message when API fetch fails", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(
      <ChatInterface
        address=""
        messages={[welcomeMessage]}
        onAddMessage={mockOnAddMessage}
      />
    );

    const textarea = screen.getByPlaceholderText(/ask about elections/i);
    await user.type(textarea, "Test question");
    await user.click(screen.getByLabelText(/send message/i));

    await waitFor(() => {
      const calls = mockOnAddMessage.mock.calls.map((c) => c[0]);
      const errorMsg = calls.find(
        (m) =>
          m.role === "assistant" &&
          m.content.toLowerCase().includes("something went wrong")
      );
      expect(errorMsg).toBeTruthy();
    });
  });

  it("sends a quick question when clicked", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ reply: "Here are your polling locations", responseType: "location" }),
    });

    render(
      <ChatInterface
        address="123 Main St"
        messages={[welcomeMessage]}
        onAddMessage={mockOnAddMessage}
      />
    );

    await user.click(screen.getByText("Where is my polling place?"));

    expect(mockOnAddMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        role: "user",
        content: "Where is my polling place?",
      })
    );
  });
});
