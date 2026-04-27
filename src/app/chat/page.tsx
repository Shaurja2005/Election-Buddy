"use client";

import { useState, useEffect, useCallback } from "react";
import AddressInput from "@/components/AddressInput";
import ChatInterface from "@/components/ChatInterface";
import Sidebar from "@/components/Sidebar";
import { useChatHistory } from "@/hooks/useChatHistory";
import { ChatSession } from "@/types";

export default function ChatApp() {
  const {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    updateSession,
    deleteSession,
    addMessage,
    isLoaded,
  } = useChatHistory();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [draftAddress, setDraftAddress] = useState("");

  useEffect(() => {
    // on desktop, we want it open initially
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  // Sync draft address when switching sessions
  useEffect(() => {
    if (activeSession) {
      setDraftAddress(activeSession.address || "");
    }
  }, [activeSession?.id, activeSession?.address]);

  // If loaded and no session exists, create one automatically
  useEffect(() => {
    if (isLoaded && sessions.length === 0) {
      createSession();
    }
  }, [isLoaded, sessions.length, createSession]);

  const handleAddressSubmit = (addr: string) => {
    if (activeSessionId) {
      updateSession(activeSessionId, { address: addr });
    }
  };

  const handleAddMessage = useCallback((message: any) => {
    if (activeSessionId) {
      addMessage(activeSessionId, message);
    }
  }, [activeSessionId, addMessage]);

  if (!isLoaded || !activeSession) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] overflow-hidden relative">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelect={setActiveSessionId}
        onNewChat={() => createSession()}
        onDelete={deleteSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
        <div className="flex items-center px-4 py-3 bg-base-100 z-10 w-full mb-1">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="btn btn-ghost btn-sm btn-square -ml-2 mr-2 hover:bg-base-200 transition-all"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col p-4 gap-4 overflow-hidden">
          {/* Address Input Section - Only show prominently if no address is set, otherwise small indicator */}
          {!activeSession.address ? (
            <section className="px-2 shrink-0 animate-in fade-in slide-in-from-top-4 duration-500">
              <AddressInput
                address={draftAddress}
                onChange={setDraftAddress}
                onSubmit={handleAddressSubmit}
              />
            </section>
          ) : (
            <div className="flex items-center justify-center shrink-0 py-2">
              <div className="flex items-center gap-2 text-sm text-base-content dark:text-white/90 font-medium">
                <span>Using data for: <strong className="font-bold text-primary">{activeSession.address.length > 35 ? activeSession.address.slice(0, 35) + "..." : activeSession.address}</strong></span>
                <button
                  onClick={() => updateSession(activeSession.id, { address: "" })}
                  className="ml-2 text-[11px] opacity-60 hover:opacity-100 hover:text-primary transition-colors uppercase tracking-wider font-bold"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {/* Chat Interface */}
          <section className="card-themed overflow-hidden flex flex-col flex-1 min-h-0 relative shadow-sm">
            {/* Header */}
            <div className="flex items-center px-4 py-3 bg-primary text-primary-content">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Ballot Buddy Avatar"
                  className="w-10 h-10 rounded-full object-cover shadow-inner border-2 border-black"
                />
                <div className="flex flex-col">
                  <span className="text-base font-bold leading-tight">Ballot Buddy</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 border border-green-200 shadow-sm" />
                    <span className="text-xs font-medium opacity-90">Online Now</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-h-0 bg-base-50/50">
              <ChatInterface
                address={activeSession.address}
                messages={activeSession.messages}
                onAddMessage={handleAddMessage}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
