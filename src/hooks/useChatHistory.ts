"use client";

import { useState, useEffect } from "react";
import { ChatSession, ChatMessage } from "@/types";

const STORAGE_KEY = "ballot-buddy-chats";
const ADDRESS_KEY = "ballot-buddy-last-address";

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [lastUsedAddress, setLastUsedAddress] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // Hydrate dates properly and deduplicate messages by ID
        const parsed = JSON.parse(stored).map((s: any) => {
          const uniqueIds = new Set();
          return {
            ...s,
            messages: s.messages
              .filter((m: any) => {
                if (uniqueIds.has(m.id)) return false;
                uniqueIds.add(m.id);
                return true;
              })
              .map((m: any) => ({
                ...m,
                timestamp: new Date(m.timestamp),
              })),
          };
        });
        setSessions(parsed);
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id); // default to most recent
        }
      }
      const storedAddress = localStorage.getItem(ADDRESS_KEY);
      if (storedAddress) {
        setLastUsedAddress(storedAddress);
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions, isLoaded]);

  useEffect(() => {
    if (isLoaded && lastUsedAddress) {
      localStorage.setItem(ADDRESS_KEY, lastUsedAddress);
    }
  }, [lastUsedAddress, isLoaded]);

  // Indic scripts build one visible character from several code points, so a
  // code-unit slice can cut a syllable in half. Segment by grapheme instead.
  const titleFrom = (content: string, max = 30) => {
    const graphemes =
      typeof Intl !== "undefined" && "Segmenter" in Intl
        ? Array.from(
            new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(content),
            (s) => s.segment
          )
        : Array.from(content);
    return graphemes.length > max
      ? graphemes.slice(0, max).join("") + "…"
      : graphemes.join("");
  };

  const createSession = (address: string = lastUsedAddress) => {
    // Prevent creating a new chat if the active one is already empty
    const currentActive = sessions.find(s => s.id === activeSessionId);
    if (currentActive && currentActive.messages.length <= 1) {
      // It's empty (only has welcome message), don't create a new one
      return currentActive;
    }

    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      // Empty means "untitled" — the sidebar supplies a translated label.
      title: "",
      address: address,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    if (address) setLastUsedAddress(address);
    return newSession;
  };

  const addMessage = (sessionId: string, message: ChatMessage) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          // Prevent duplicates
          if (s.messages.some((m) => m.id === message.id)) return s;
          const updatedMessages = [...s.messages, message];
          const updated = { ...s, messages: updatedMessages, updatedAt: Date.now() };

          if (!s.title && message.role === "user") {
            updated.title = titleFrom(message.content);
          }
          return updated;
        }
        return s;
      }).sort((a, b) => b.updatedAt - a.updatedAt)
    );
  };

  const updateSession = (
    id: string,
    updates: Partial<Pick<ChatSession, "title" | "address" | "messages">>
  ) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...updates, updatedAt: Date.now() };
          // Auto-generate title from first user message if it's currently "New Chat"
          if (updates.messages && !s.title && updates.messages.length > 0) {
            const firstUserMsg = updates.messages.find(m => m.role === "user");
            if (firstUserMsg) {
              updated.title = titleFrom(firstUserMsg.content);
            }
          }
          if (updates.address) {
            setLastUsedAddress(updates.address);
          }
          return updated;
        }
        return s;
      }).sort((a, b) => b.updatedAt - a.updatedAt)
    );
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (activeSessionId === id) {
        setActiveSessionId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const clearAll = () => {
    setSessions([]);
    setActiveSessionId(null);
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  return {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    updateSession,
    deleteSession,
    addMessage,
    clearAll,
    isLoaded,
    lastUsedAddress,
  };
}
