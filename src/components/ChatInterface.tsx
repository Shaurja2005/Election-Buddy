"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage, ChatApiRequest, ChatApiResponse, ChatSession } from "@/types";
import ChatBubble, { TypingBubble } from "./ChatBubble";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const QUICK_QUESTION_KEYS = [
  "chat.suggested.register",
  "chat.suggested.checkName",
  "chat.suggested.findBooth",
  "chat.suggested.documents",
  "chat.suggested.evm",
] as const;

interface ChatInterfaceProps {
  address: string;
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
}

export default function ChatInterface({ address, messages, onAddMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useAuth();
  const { t, locale } = useLanguage();

  // Auto-inject welcome message if empty
  useEffect(() => {
    if (messages.length === 0 || !messages.some(m => m.id === "welcome")) {
      onAddMessage({
        id: "welcome",
        role: "assistant",
        content: t("chat.welcome"),
        timestamp: new Date(),
        responseType: "text",
      });
    }
  }, [messages.length, onAddMessage, messages, t]);

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

      const reqBody: ChatApiRequest = { message: text.trim(), address, history, locale };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });

      const data: ChatApiResponse = await res.json();

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply || (data.errorKey ? t(data.errorKey) : t("chat.noResponse")),
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
        content: t("error.network"),
        timestamp: new Date(),
        responseType: "text",
      };
      onAddMessage(errorMessage);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const url = await uploadFile(file);
    if (url) {
      setInput((prev) => prev + (prev ? "\n" : "") + `[${t("chat.attachedFile")}: ${file.name}](${url})`);
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    <div className="flex flex-col flex-1 min-h-0 h-full w-full">

      {/* ── Message list (aria-live for screen readers) ── */}
      <div
        role="log"
        aria-live="polite"
        aria-label={t("chat.messagesLabel")}
        aria-relevant="additions"
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{ minHeight: 0 }}
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingBubble />}
        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* ── Quick Questions ── */}
      <nav aria-label={t("chat.quickLabel")} className="px-4 py-2 border-t border-base-200">
        <div className="flex gap-2 flex-wrap" role="group" aria-label={t("chat.quickLabel")}>
          {QUICK_QUESTION_KEYS.map((key) => {
            const question = t(key);
            return (
              <button
                key={key}
                onClick={() => sendMessage(question)}
                disabled={isLoading}
                aria-label={t("chat.ask", { question })}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-content transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                id={`quick-${key.split(".").pop()}`}
              >
                {question}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Input area ── */}
      <div className="px-4 py-3 border-t border-base-200 bg-base-100" role="form" aria-label={t("chat.inputFormLabel")}>
        <div
          className="flex min-w-0 items-end gap-2 rounded-2xl border border-base-300 bg-base-200 px-3 py-2 sm:px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*,.pdf" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isUploading}
            aria-label={t("chat.uploadDocument")}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-base-300 hover:bg-base-300/80 text-base-content/70 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 mb-0.5"
          >
            {isUploading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            )}
          </button>
          
          <label htmlFor="chat-input" className="sr-only">
            {t("chat.inputLabel")}
          </label>
          <textarea
            ref={inputRef}
            id="chat-input"
            rows={1}
            className="min-w-0 flex-1 resize-none bg-transparent text-base-content placeholder-base-content/40 text-sm focus:outline-none max-h-32 leading-relaxed py-1"
            placeholder={t("chat.placeholder")}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-describedby="chat-input-hint"
            style={{ height: "36px" }}
          />
          <span id="chat-input-hint" className="sr-only">
            {t("chat.inputHint")}
          </span>
          <button
            id="chat-send-btn"
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            aria-label={t("chat.send")}
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
