"use client";

import type { ElectionStep, StepsRendererProps } from "@/types";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/contexts/LanguageContext";

// Fallback only: the model now returns steps as data, but an older stored
// message — or a reply that ignored the schema — still arrives as prose.
// Splitting on paragraphs works in any script; matching English words does not.
function parseSteps(text: string): ElectionStep[] {
  const numbered = text.match(/(?:^|\n)\s*\d+[.)]\s+.+/gm);
  if (numbered && numbered.length > 1) {
    return numbered.map((line, idx) => {
      const clean = line.trim().replace(/^\d+[.)]\s+/, "").replace(/\*\*/g, "");
      return {
        title: clean.length > 60 ? clean.slice(0, 60) + "…" : clean,
        description: clean,
        status: (idx === 0 ? "active" : "upcoming") as ElectionStep["status"],
      };
    });
  }

  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paragraphs.length > 1) {
    return paragraphs.slice(0, 6).map((p, idx) => {
      const firstLine = p.split("\n")[0].replace(/^#+\s*/, "");
      return {
        title: firstLine.length > 60 ? firstLine.slice(0, 60) + "…" : firstLine,
        description: p,
        status: (idx === 0 ? "active" : "upcoming") as ElectionStep["status"],
      };
    });
  }

  return [];
}

export default function StepsRenderer({ text, steps: providedSteps }: StepsRendererProps) {
  const { t } = useLanguage();
  const steps = providedSteps?.length ? providedSteps : parseSteps(text);

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
        📋 {t("steps.title")}
      </p>
      <ul className="steps steps-vertical w-full">
        {steps.map((step, idx) => (
          <li
            key={idx}
            className={`step ${step.status === "active"
                ? "step-primary"
                : step.status === "completed"
                  ? "step-success"
                  : ""
              }`}
          >
            <div className="text-start ps-3">
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
