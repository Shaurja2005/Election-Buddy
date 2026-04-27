import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-4 py-12 gap-8 text-center min-h-[calc(100vh-3.5rem)]">
      {/* ── Hero ── */}
      <section className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-1.5 bg-primary/15 text-primary-foreground rounded-full px-4 py-1.5 text-sm font-medium shadow-sm">
          <span>🏛️</span>
          <span className="text-base-content/80">Powered by Google Civic API &amp; Gemini AI</span>
        </div>
        
        <h2 className="text-5xl md:text-6xl font-extrabold text-base-content leading-tight tracking-tight">
          Your Vote,{" "}
          <span className="text-primary drop-shadow-sm">Simplified.</span>
        </h2>
        
        <p className="text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
          Personalized, step-by-step election guidance — from registration to the ballot box.
          Free, accurate, and always non-partisan.
        </p>

        <div className="pt-6">
          <Link 
            href="/chat" 
            className="btn btn-primary btn-lg rounded-full px-8 text-lg font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
          >
            Get Started 🚀
          </Link>
        </div>
      </section>

      {/* ── Feature Cards (Optional bottom visuals) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        <div className="card-themed p-6 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">📝</div>
          <h3 className="font-bold text-base-content">Registration Guides</h3>
          <p className="text-sm text-base-content/60">Step-by-step instructions customized for your state.</p>
        </div>
        <div className="card-themed p-6 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">📍</div>
          <h3 className="font-bold text-base-content">Polling Locations</h3>
          <p className="text-sm text-base-content/60">Find exactly where you need to go to cast your vote.</p>
        </div>
        <div className="card-themed p-6 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">⚖️</div>
          <h3 className="font-bold text-base-content">Non-Partisan</h3>
          <p className="text-sm text-base-content/60">Neutral, unbiased facts pulled straight from official sources.</p>
        </div>
      </div>
    </main>
  );
}
