"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import BeforeAfter from "@/components/BeforeAfter";
import { INTERIOR_STYLES, ROOM_TYPES } from "@/lib/styles";

interface PortfolioEntry {
  id: string;
  roomType: string;
  roomName: string;
  style: string;
  styleName: string;
  beforeImage: string;
  afterImage: string;
  timestamp: string;
}

export default function PortfolioPage() {
  const [entries, setEntries] = useState<PortfolioEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<PortfolioEntry | null>(null);
  const [filterRoom, setFilterRoom] = useState<string | null>(null);
  const [filterStyle, setFilterStyle] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = entries.filter((e) => {
    if (filterRoom && e.roomType !== filterRoom) return false;
    if (filterStyle && e.style !== filterStyle) return false;
    return true;
  });

  // Unique room types and styles present in portfolio
  const usedRooms = [...new Set(entries.map((e) => e.roomType))];
  const usedStyles = [...new Set(entries.map((e) => e.style))];

  const closeModal = useCallback(() => setSelectedEntry(null), []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Wnętrze<span className="gradient-ai">AI</span>
            </span>
          </Link>
          <Link href="/staging" className="btn-primary text-sm">
            Wypróbuj staging
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="text-center mb-12">
          <h1 className="heading-section mb-4">
            <span className="gradient-text">Portfolio</span> transformacji
          </h1>
          <p className="body-large max-w-xl mx-auto">
            Najlepsze efekty virtual stagingu ocenione przez użytkowników.
          </p>
        </div>

        {/* Filters */}
        {entries.length > 0 && (
          <div className="mb-8 space-y-4">
            {/* Room type filter */}
            {usedRooms.length > 1 && (
              <div>
                <p className="text-xs text-[#71717a] mb-2">Typ pomieszczenia</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterRoom(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      !filterRoom
                        ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                        : "border-white/[0.08] text-[#a1a1aa] hover:border-white/20"
                    }`}
                  >
                    Wszystkie
                  </button>
                  {usedRooms.map((roomId) => {
                    const room = ROOM_TYPES.find((r) => r.id === roomId);
                    return (
                      <button
                        key={roomId}
                        onClick={() => setFilterRoom(filterRoom === roomId ? null : roomId)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          filterRoom === roomId
                            ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                            : "border-white/[0.08] text-[#a1a1aa] hover:border-white/20"
                        }`}
                      >
                        {room?.icon} {room?.name || roomId}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Style filter */}
            {usedStyles.length > 1 && (
              <div>
                <p className="text-xs text-[#71717a] mb-2">Styl wnętrza</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterStyle(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      !filterStyle
                        ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                        : "border-white/[0.08] text-[#a1a1aa] hover:border-white/20"
                    }`}
                  >
                    Wszystkie
                  </button>
                  {usedStyles.map((styleId) => {
                    const s = INTERIOR_STYLES.find((st) => st.id === styleId);
                    return (
                      <button
                        key={styleId}
                        onClick={() => setFilterStyle(filterStyle === styleId ? null : styleId)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          filterStyle === styleId
                            ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                            : "border-white/[0.08] text-[#a1a1aa] hover:border-white/20"
                        }`}
                      >
                        {s?.icon} {s?.name || styleId}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-[3px] border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#71717a] text-sm">Ładowanie portfolio...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && entries.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Portfolio jest puste</h3>
            <p className="text-[#71717a] text-sm mb-6">
              Wygeneruj staging i oceń wynik pozytywnie, aby dodać go do portfolio.
            </p>
            <Link href="/staging" className="btn-primary inline-flex">
              Wypróbuj staging
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}

        {/* No results after filtering */}
        {!loading && entries.length > 0 && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#71717a]">Brak wyników dla wybranych filtrów.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="group card-gradient p-0 overflow-hidden text-left transition-all hover:border-violet-500/30"
              >
                <div className="relative aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.afterImage}
                    alt={`${entry.roomName} — ${entry.styleName}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-sm font-medium text-white">{entry.roomName}</p>
                    <p className="text-xs text-white/70">{entry.styleName}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Modal with BeforeAfter slider */}
      {selectedEntry && (
        <div
          className="fixed inset-0 bg-[rgba(10,10,15,0.85)] backdrop-blur-lg z-[100] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-[#12121a] border border-white/[0.08] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-semibold">{selectedEntry.roomName}</h3>
                <p className="text-sm text-[#71717a]">{selectedEntry.styleName}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-[#71717a] hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <BeforeAfter
                beforeUrl={selectedEntry.beforeImage}
                afterUrl={selectedEntry.afterImage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
