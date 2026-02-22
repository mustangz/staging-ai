"use client";

import { FREE_RENDER_LIMIT } from "@/lib/usage";

interface UpgradePromptProps {
  onClose: () => void;
}

export default function UpgradePrompt({ onClose }: UpgradePromptProps) {
  return (
    <div className="fixed inset-0 bg-[rgba(10,10,15,0.8)] backdrop-blur-lg z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-bg-secondary border border-border rounded-2xl p-8 w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
        <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Limit renderów wyczerpany</h3>
        <p className="text-sm text-text-secondary mb-6">
          Wykorzystałeś {FREE_RENDER_LIMIT} darmowych renderów w tym miesiącu. Limit odnowi się 1. dnia następnego miesiąca.
        </p>
        <div className="space-y-3">
          <a
            href="/#pricing"
            className="btn-primary w-full inline-flex items-center justify-center gap-2"
          >
            Zobacz plany
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <button onClick={onClose} className="btn-ghost w-full text-sm">
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
