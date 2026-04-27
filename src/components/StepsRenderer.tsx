"use client";

import type { ElectionStep } from "@/types";
import ReactMarkdown from "react-markdown";

interface StepsRendererProps {
  text: string;
}

// Parse numbered steps from AI response text
function parseSteps(text: string): ElectionStep[] {
  const steps: ElectionStep[] = [];

  // Match "1. Title\nDescription" or "Step 1: Title"
  const numbered = text.match(/(?:^|\n)\d+[\.\)]\s+.+/gm);
  if (numbered && numbered.length > 1) {
    numbered.forEach((line, idx) => {
      const clean = line.replace(/^\n/, "").replace(/^\d+[\.\)]\s+/, "").trim();
      // Remove markdown bolding completely from the title snippet
      let cleanTitle = clean.replace(/\*\*/g, "");
      steps.push({
        title: cleanTitle.length > 60 ? cleanTitle.slice(0, 60) + "…" : cleanTitle,
        description: clean,
        status: idx === 0 ? "active" : "upcoming",
      });
    });
    return steps;
  }

  // Fall back: split by blank lines and treat each paragraph as a step
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paragraphs.length > 1) {
    return paragraphs.slice(0, 6).map((p, idx) => ({
      title:
        p.split("\n")[0].replace(/^#+\s*/, "").slice(0, 60) +
        (p.split("\n")[0].length > 60 ? "…" : ""),
      description: p,
      status: (idx === 0 ? "active" : "upcoming") as ElectionStep["status"],
    }));
  }

  return [];
}

export default function StepsRenderer({ text }: StepsRendererProps) {
  const steps = parseSteps(text);

  if (steps.length === 0) {
    return (
      <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-sm opacity-70 mb-4 font-medium uppercase tracking-wide">
        📋 Step-by-Step Guide
      </p>
      <ul className="steps steps-vertical w-full">
        {steps.map((step, idx) => (
          <li
            key={idx}
            className={`step ${
              step.status === "active"
                ? "step-primary"
                : step.status === "completed"
                ? "step-success"
                : ""
            }`}
          >
            <div className="text-left pl-3">
              <div className="font-semibold text-base prose prose-sm prose-invert max-w-none">
                {step.title}
              </div>
              {step.description !== step.title && (
                <div className="text-sm opacity-90 mt-1 whitespace-pre-wrap prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{step.description}</ReactMarkdown>
                </div>
              )}
              {step.deadline && (
                <span className="badge badge-warning badge-sm mt-1">
                  ⏰ {step.deadline}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
