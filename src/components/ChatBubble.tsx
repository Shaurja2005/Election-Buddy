"use client";

import type { ChatMessage, ChatBubbleProps } from "@/types";
import Image from "next/image";
import dynamic from "next/dynamic";
import StepsRenderer from "./StepsRenderer";
import LinksRenderer from "./LinksRenderer";
import PollingLocations from "./PollingLocations";

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  loading: () => <span className="opacity-50">...</span>,
});

// Typing indicator bubble
export function TypingBubble() {
  return (
    <div className="flex items-end gap-2.5">
      <Image
        src="/logo.png"
        alt=""
        aria-hidden="true"
        width={32}
        height={32}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-transparent dark:border-white/80"
      />
      <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-gray-700 text-gray-100 border border-gray-600 shadow-sm">
        <span className="loading loading-dots loading-sm text-gray-300" />
      </div>
    </div>
  );
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  const renderAssistantContent = () => {
    const { responseType, structuredData, content } = message;

    if (responseType === "steps") {
      return (
        <div className="space-y-3">
          <StepsRenderer text={content} />
          {structuredData?.links && structuredData.links.length > 0 && (
            <LinksRenderer links={structuredData.links} title="📎 Helpful Links" />
          )}
        </div>
      );
    }

    if (responseType === "links") {
      return (
        <div className="space-y-3">
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          {structuredData?.links && structuredData.links.length > 0 && (
            <LinksRenderer links={structuredData.links} />
          )}
        </div>
      );
    }

    if (responseType === "location") {
      return (
        <div className="space-y-3">
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          {structuredData?.pollingLocations && structuredData.pollingLocations.length > 0 && (
            <PollingLocations locations={structuredData.pollingLocations} />
          )}
          {structuredData?.links && structuredData.links.length > 0 && (
            <LinksRenderer links={structuredData.links} title="📎 More Resources" />
          )}
        </div>
      );
    }

    // Default: markdown text
    return (
      <div className="space-y-3">
        <div className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {structuredData?.links && structuredData.links.length > 0 && (
          <LinksRenderer links={structuredData.links} title="📎 Resources" />
        )}
      </div>
    );
  };

  if (isUser) {
    return (
      <div
        role="article"
        aria-label="Your message"
        className="flex items-end justify-end gap-2.5 chat-bubble-animate"
      >
        <div className="flex flex-col items-end gap-1 max-w-[80%]">
          <div className="px-4 py-2.5 rounded-2xl rounded-br-sm bg-primary text-primary-content text-sm leading-relaxed">
            {message.content}
          </div>
          <span className="text-[11px] text-base-content/40 pr-1" suppressHydrationWarning>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        {/* User avatar */}
        <div aria-hidden="true" className="w-8 h-8 rounded-full bg-base-300 flex-shrink-0 flex items-center justify-center text-base leading-none select-none border border-transparent dark:border-white/80">
          👤
        </div>
      </div>
    );
  }

  return (
    <div
      role="article"
      aria-label="Ballot Buddy response"
      className="flex items-end gap-2.5 chat-bubble-animate"
    >
      {/* Bot avatar */}
      <Image
        src="/logo.png"
        alt=""
        aria-hidden="true"
        width={32}
        height={32}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-transparent dark:border-white/80"
      />
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-gray-700 text-gray-100 border border-gray-600 shadow-sm text-sm leading-relaxed">
          {renderAssistantContent()}
        </div>
        <span className="text-[11px] text-base-content/40 pl-1" suppressHydrationWarning>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
