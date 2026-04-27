"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage, ChatApiRequest, ChatApiResponse, ChatSession } from "@/types";
import ChatBubble, { TypingBubble } from "./ChatBubble";

const QUICK_QUESTIONS = [
  "How do I register to vote?",
  "When is the next election?",
  "Where is my polling place?",
  "How do I request an absentee ballot?",
  "What ID do I need to vote?",
];

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm **Ballot Buddy** 🗳️ — your non-partisan election assistant.\n\nI can help you with:\n- Voter registration steps\n- Polling locations near you\n- Absentee & mail-in ballots\n- Election dates and deadlines\n- Privileges for senior citizens and PwDs\n\nEnter your address above for personalized info, or pick a quick question below!",
  timestamp: new Date(),
  responseType: "text",
};

interface ChatInterfaceProps {
  address: string;
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
}

export default function ChatInterface({ address, messages, onAddMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-inject welcome message if empty
  useEffect(() => {
    if (messages.length === 0 || !messages.some(m => m.id === "welcome")) {
      onAddMessage(WELCOME_MESSAGE);
    }
  }, [messages.length, onAddMessage, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    onAddMessage(userMessage);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const reqBody: ChatApiRequest = { message: text.trim(), address, history };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });

      const data: ChatApiResponse = await res.json();

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply || data.error || "Sorry, I couldn't get a response.",
        timestamp: new Date(),
        responseType: data.responseType ?? "text",
        structuredData: data.structuredData,
      };

      onAddMessage(assistantMessage);
    } catch (err) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "I'm sorry, something went wrong connecting to the server. Please check your connection and try again.",
        timestamp: new Date(),
        responseType: "text",
      };
      onAddMessage(errorMessage);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Auto-grow textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ minHeight: 0 }}>
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingBubble />}
        <div ref={bottomRef} />
      </div>

      {/* ── Quick Questions ── */}
      <div className="px-4 py-2 border-t border-base-200">
        <div className="flex gap-2 flex-wrap">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-content transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              id={`quick-${q.replace(/\s+/g, "-").toLowerCase().slice(0, 20)}`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input area ── */}
      <div className="px-4 py-3 border-t border-base-200 bg-base-100">
        <div
          className="flex items-end gap-2 rounded-2xl border border-base-300 bg-base-200 px-4 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
        >
          <textarea
            ref={inputRef}
            id="chat-input"
            rows={1}
            className="flex-1 resize-none bg-transparent text-base-content placeholder-base-content/40 text-sm focus:outline-none max-h-32 leading-relaxed py-1"
            placeholder="Ask about elections, registration, polling places…"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            style={{ height: "36px" }}
          />
          <button
            id="chat-send-btn"
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-primary text-primary-content disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-200 mb-0.5"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
