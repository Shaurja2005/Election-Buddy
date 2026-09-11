"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { GAME_DOCS, VALID_DOC_COUNT } from "@/lib/game/data";
import { SceneBanner, useToast } from "./GameShell";

export default function StageDocuments({
  onDone,
  play,
}: {
  onDone: () => void;
  play: (s: "paper" | "beep") => void;
}) {
  const { t } = useLanguage();
  const { showToast, toastNode } = useToast();
  const [found, setFound] = useState<string[]>([]);
  const [shaking, setShaking] = useState<string | null>(null);

  const pick = (id: string, valid: boolean) => {
    if (found.includes(id)) return;

    if (!valid) {
      play("paper");
      setShaking(id);
      setTimeout(() => setShaking(null), 420);
      showToast({ text: t(`game.doc.${id}.reject`), ok: false });
      return;
    }

    play("paper");
    const next = [...found, id];
    setFound(next);
    showToast({ text: t(`game.doc.${id}.name`), ok: true });
    if (next.length === VALID_DOC_COUNT) setTimeout(onDone, 900);
  };

  return (
    <div className="absolute inset-0">
      <Image
        src="/game/img/messy_desk.webp"
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 900px"
        className="object-cover"
        priority
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[#1a1206]/25" />

      <SceneBanner>
        {t("game.doc.prompt", { found: String(found.length), total: String(VALID_DOC_COUNT) })}
      </SceneBanner>

      {GAME_DOCS.map((doc) => {
        const isFound = found.includes(doc.id);
        return (
          <button
            key={doc.id}
            type="button"
            onClick={() => pick(doc.id, doc.valid)}
            aria-label={t(`game.doc.${doc.id}.name`)}
            aria-pressed={isFound}
            className={`absolute z-10 origin-center rounded-md outline-none transition duration-300 focus-visible:ring-4 focus-visible:ring-white ${
              isFound
                ? "scale-90 opacity-40 grayscale"
                : "cursor-pointer hover:z-20 hover:scale-110 hover:drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
            } ${shaking === doc.id ? "game-shake" : ""}`}
            style={{
              insetInlineStart: `${doc.x}%`,
              top: `${doc.y}%`,
              inlineSize: `${doc.w}%`,
              rotate: `${doc.rotate}deg`,
            }}
          >
            <Image
              src={`/game/img/${doc.img}.webp`}
              alt=""
              width={300}
              height={200}
              className="h-auto w-full rounded-md shadow-lg"
            />
            {isFound && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2f7a4a] text-white shadow-lg">
                  <Check size={15} strokeWidth={3} aria-hidden="true" />
                </span>
              </span>
            )}
          </button>
        );
      })}

      {/* Collected strip: progress you can see without counting the desk. */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-1.5 bg-gradient-to-t from-black/65 to-transparent px-3 pb-2 pt-6">
        {GAME_DOCS.filter((d) => d.valid).map((d) => (
          <span
            key={d.id}
            title={t(`game.doc.${d.id}.name`)}
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
              found.includes(d.id) ? "bg-[#5fd08a]" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {toastNode}
    </div>
  );
}
