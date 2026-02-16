"use client";

import BeforeAfter from "./BeforeAfter";

interface ResultViewProps {
  beforeUrl: string;
  afterUrl: string;
  onRegenerate: () => void;
}

export default function ResultView({
  beforeUrl,
  afterUrl,
  onRegenerate,
}: ResultViewProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(afterUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wnetrzeai-staging-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(afterUrl, "_blank");
    }
  };

  return (
    <div>
      <BeforeAfter beforeUrl={beforeUrl} afterUrl={afterUrl} />

      <div className="flex gap-4 mt-6">
        <button onClick={handleDownload} className="btn-primary flex-1">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Pobierz wynik
        </button>
        <button onClick={onRegenerate} className="btn-secondary">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Ponów
        </button>
      </div>
    </div>
  );
}
