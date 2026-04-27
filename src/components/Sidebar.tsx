"use client";

import { ChatSession } from "@/types";

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelect,
  onNewChat,
  onDelete,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar spacer for desktop pushing */}
      <div
        className={`hidden md:block flex-shrink-0 transition-all duration-300 ease-in-out ${
          isOpen ? "w-72" : "w-0"
        }`}
      />

      {/* Actual sliding sidebar container */}
      <div
        className={`fixed md:absolute inset-y-0 left-0 z-40 bg-base-100 border-r border-base-200 transition-transform duration-300 ease-in-out shadow-xl md:shadow-none h-full w-72 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center gap-2 border-b border-base-200">
            <button
              onClick={() => {
                onNewChat();
                if (window.innerWidth < 768) onClose();
              }}
              className="flex-1 btn btn-primary justify-start gap-2 rounded-xl"
            >
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Chat
          </button>
          <button 
            onClick={onClose}
            className="md:hidden btn btn-ghost btn-square btn-sm rounded-lg"
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {sessions.length === 0 ? (
            <div className="text-center text-sm text-base-content/50 mt-10">
              No previous chats
            </div>
          ) : (
            sessions.map((session) => {
              const hasUserMessage = session.messages.some((m) => m.role === "user");
              const canDelete = hasUserMessage;

              return (
                <div
                  key={session.id}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    activeSessionId === session.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-base-200 text-base-content/80"
                  }`}
                  onClick={() => {
                    onSelect(session.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                >
                <div className="flex items-center gap-3 overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 flex-shrink-0 opacity-70"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="truncate text-sm">
                    {session.title || "New Chat"}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!canDelete) return;
                    onDelete(session.id);
                  }}
                  disabled={!canDelete}
                  className={`p-1 transition-opacity ${
                    canDelete
                      ? "opacity-0 group-hover:opacity-100 hover:text-error"
                      : "opacity-30 cursor-not-allowed"
                  }`}
                  aria-label={canDelete ? "Delete chat" : "Delete disabled for new chat"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
