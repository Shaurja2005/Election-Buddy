"use client";

import { useState } from "react";
import { Search, Vote, CalendarDays, IdCard, ArrowRight } from "lucide-react";
import NeuCard from "@/components/ui/NeuCard";
import NeuButton from "@/components/ui/NeuButton";
import NeuInput from "@/components/ui/NeuInput";
import NeuToggle from "@/components/ui/NeuToggle";
import NeuStat from "@/components/ui/NeuStat";
import NeuProgress from "@/components/ui/NeuProgress";
import NeuTabs from "@/components/ui/NeuTabs";

// Development-only gallery for inspecting the primitives in both directions.
// Not linked from the app.
export default function UiGallery() {
  const [tab, setTab] = useState("raised");
  const [on, setOn] = useState(true);
  const [rtl, setRtl] = useState(false);

  return (
    <main
      dir={rtl ? "rtl" : "ltr"}
      className="min-h-screen bg-nm-surface p-8 text-foreground"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Neumorphic primitives</h1>
          <NeuToggle checked={rtl} onChange={setRtl} label="RTL preview" />
        </header>

        <section className="flex flex-wrap items-center gap-4">
          <NeuButton variant="primary" icon={<Vote size={16} />}>
            Primary
          </NeuButton>
          <NeuButton icon={<Search size={16} />}>Default</NeuButton>
          <NeuButton variant="ghost">Ghost</NeuButton>
          <NeuButton disabled>Disabled</NeuButton>
          <NeuButton size="sm">Small</NeuButton>
          <NeuButton size="lg" icon={<ArrowRight size={18} />}>
            Large
          </NeuButton>
        </section>

        <section className="grid gap-5 sm:grid-cols-2">
          <NeuInput label="Your full address" icon={<Search size={16} />} placeholder="12 MG Road, Bengaluru" />
          <NeuInput label="EPIC number" hint="Ten characters, printed on your voter card." placeholder="ABC1234567" />
          <NeuInput label="Field with an error" error="Enter a valid EPIC number." defaultValue="12" />
          <div className="flex items-end">
            <NeuToggle checked={on} onChange={setOn} label="Narration audio" />
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-3">
          <NeuStat label="Turnout 2024" value="65.79%" detail="Lok Sabha, all states" icon={<Vote size={18} />} />
          <NeuStat label="Polling phases" value="7" detail="19 Apr – 1 Jun 2024" icon={<CalendarDays size={18} />} />
          <NeuStat label="Electors" value="96.88 cr" detail="Registered voters" icon={<IdCard size={18} />} />
        </section>

        <section className="grid gap-5 sm:grid-cols-2">
          <NeuCard className="p-6">
            <NeuProgress label="Voter journey" value={3} max={7} />
          </NeuCard>
          <NeuCard elevation="sunken" className="p-6">
            <p className="text-sm text-foreground/70">Sunken card — a well, not a control.</p>
          </NeuCard>
        </section>

        <section className="flex flex-col gap-5">
          <NeuTabs
            label="Elevation examples"
            active={tab}
            onChange={setTab}
            items={[
              { id: "raised", label: "Raised" },
              { id: "sunken", label: "Sunken" },
              { id: "flat", label: "Flat" },
            ]}
          />
          <NeuCard
            elevation={tab as "raised" | "sunken" | "flat"}
            interactive={tab === "raised"}
            className="p-8"
          >
            <p className="text-sm">Showing the {tab} elevation.</p>
          </NeuCard>
        </section>
      </div>
    </main>
  );
}
