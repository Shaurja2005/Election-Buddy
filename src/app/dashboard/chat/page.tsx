"use client";

import ChatWorkspace from "@/components/ChatWorkspace";

export default function DashboardChatPage() {
  // The chat keeps its own design and its own conversation sidebar; the shell
  // only gives it a height to fill. Nothing here restyles it.
  return (
    <div className="relative h-[calc(100vh-5rem)] overflow-hidden rounded-2xl">
      <ChatWorkspace />
    </div>
  );
}
