"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img
            src="/logo.png"
            alt="Ballot Buddy Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="leading-tight">
            <h1 className="text-sm font-bold text-base-content">Ballot Buddy</h1>
            <p className="text-[11px] text-base-content/50">Election Assistant</p>
          </div>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="text-xs btn btn-sm btn-ghost text-primary gap-1 font-medium px-2">
              🌐 Official Portals
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 border border-base-200 rounded-2xl w-52 text-sm mt-1">
              <li><a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer">🇮🇳 India — eci.gov.in</a></li>
              <li><a href="https://vote.gov" target="_blank" rel="noopener noreferrer">🇺🇸 USA — vote.gov</a></li>
              <li><a href="https://www.gov.uk/vote-uk-election" target="_blank" rel="noopener noreferrer">🇬🇧 UK — gov.uk</a></li>
              <li><a href="https://www.elections.ca" target="_blank" rel="noopener noreferrer">🇨🇦 Canada — elections.ca</a></li>
              <li><a href="https://www.aec.gov.au" target="_blank" rel="noopener noreferrer">🇦🇺 Australia — aec.gov.au</a></li>
              <li><a href="https://www.elections.org.za" target="_blank" rel="noopener noreferrer">🇿🇦 South Africa — IEC</a></li>
            </ul>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
