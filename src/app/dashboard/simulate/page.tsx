"use client";

import { useState } from "react";
import { Vote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import NeuCard from "@/components/ui/NeuCard";
import NeuButton from "@/components/ui/NeuButton";
import SimulationStage from "@/components/evm/SimulationStage";

export default function SimulatePage() {
  const { t } = useLanguage();
  const [started, setStarted] = useState(false);

  if (started) return <SimulationStage />;

  return (
    <div className="mx-auto w-full max-w-3xl py-2">
      <NeuCard className="p-8 sm:p-10">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {t("evm.title")}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground/70">
          {t("evm.intro")}
        </p>
        <NeuButton
          variant="primary"
          size="lg"
          className="mt-7"
          icon={<Vote size={18} />}
          onClick={() => setStarted(true)}
        >
          {t("evm.start")}
        </NeuButton>
      </NeuCard>
    </div>
  );
}
