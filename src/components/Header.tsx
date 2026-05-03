"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  return (
    <header className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          aria-label="Ballot Buddy Home"
        >
          <Image
            src="/logo.png"
            alt="Ballot Buddy Logo"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="leading-tight">
            <h1 className="text-sm font-bold text-base-content">Ballot Buddy</h1>
            <p className="text-[11px] text-base-content/50">Election Assistant</p>
          </div>
        </Link>

        {/* Right actions */}
        <nav aria-label="Official election portals" className="flex items-center gap-3">
          
          {/* Auth Button */}
          {!loading && (
            user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-base-200 transition-transform hover:scale-105">
                  <div className="w-7 h-7 rounded-full">
                    <Image src={user.photoURL || "/logo.png"} alt="Profile" width={28} height={28} className="object-cover" />
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-xl w-52 border border-base-200">
                  <li className="menu-title px-4 py-2">
                    <span className="text-xs font-semibold opacity-70">Signed in as</span>
                    <span className="text-sm font-bold truncate text-base-content">{user.displayName || "Voter"}</span>
                  </li>
                  <li><button onClick={logout} className="text-error hover:bg-error/10 mt-1 font-medium">Sign Out</button></li>
                </ul>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle} 
                className="btn btn-sm btn-outline btn-primary rounded-full px-4 text-[11px] uppercase tracking-wider font-bold"
              >
                Sign In
              </button>
            )
          )}

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-label="View official election portals"
              className="text-xs btn btn-sm btn-ghost text-primary gap-1 font-medium px-2"
            >
              🌐 Official Portals
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 opacity-60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              role="menu"
              aria-label="Country election portals"
              className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 border border-base-200 rounded-2xl w-52 text-sm mt-1"
            >
              <li role="none"><a role="menuitem" href="https://eci.gov.in" target="_blank" rel="noopener noreferrer">🇮🇳 India — eci.gov.in</a></li>
              <li role="none"><a role="menuitem" href="https://vote.gov" target="_blank" rel="noopener noreferrer">🇺🇸 USA — vote.gov</a></li>
              <li role="none"><a role="menuitem" href="https://www.gov.uk/vote-uk-election" target="_blank" rel="noopener noreferrer">🇬🇧 UK — gov.uk</a></li>
              <li role="none"><a role="menuitem" href="https://www.elections.ca" target="_blank" rel="noopener noreferrer">🇨🇦 Canada — elections.ca</a></li>
              <li role="none"><a role="menuitem" href="https://www.aec.gov.au" target="_blank" rel="noopener noreferrer">🇦🇺 Australia — aec.gov.au</a></li>
              <li role="none"><a role="menuitem" href="https://www.elections.org.za" target="_blank" rel="noopener noreferrer">🇿🇦 South Africa — IEC</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
