import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — WnetrzeAI",
  description: "Porady, trendy i case studies z virtual stagingu dla agentów nieruchomości.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Wnętrze<span className="gradient-ai">AI</span></span>
          </Link>
          <Link href="/staging" className="btn-primary text-sm !px-4 !py-2">
            Wypróbuj staging
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 badge badge-accent mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Wkrótce
          </div>
          <h1 className="heading-section mb-4">
            Blog <span className="gradient-text">WnetrzeAI</span>
          </h1>
          <p className="body-large max-w-lg mx-auto mb-8">
            Porady, trendy i case studies z virtual stagingu. Pracujemy nad pierwszymi artykułami — wróć wkrótce!
          </p>
          <Link href="/" className="btn-secondary inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Wróć na stronę główną
          </Link>
        </div>
      </main>
    </div>
  );
}
