"use client";

import { useState, useCallback } from "react";
import BeforeAfter from "./BeforeAfter";
import { INTERIOR_STYLES, ROOM_TYPES } from "@/lib/styles";

const ISSUE_OPTIONS = [
  "Zmienił układ ścian",
  "Usunął schody/wejście",
  "Drzwi w złym miejscu",
  "Okno zamienione na drzwi",
  "Meble blokują przejście",
  "Meble w złym miejscu",
  "Surowy sufit (beton, rury)",
  "Surowa podłoga (beton, wylewka)",
  "Brak lampy sufitowej",
];

interface ResultViewProps {
  beforeUrl: string;
  afterUrl: string;
  onRegenerate: () => void;
  onRefine?: (prompt: string) => void;
  roomType?: string | null;
  style?: string | null;
  isFree?: boolean;
}

function addWatermark(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(imageUrl); return; }

      ctx.drawImage(img, 0, 0);

      // Diagonal watermark pattern
      ctx.save();
      const fontSize = Math.max(24, Math.min(img.width, img.height) * 0.05);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = "WnetrzeAI.pl";
      const stepX = fontSize * 10;
      const stepY = fontSize * 5;

      ctx.translate(img.width / 2, img.height / 2);
      ctx.rotate(-Math.PI / 6);

      for (let y = -img.height; y < img.height * 2; y += stepY) {
        for (let x = -img.width; x < img.width * 2; x += stepX) {
          ctx.fillText(text, x - img.width / 2, y - img.height / 2);
        }
      }

      ctx.restore();

      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = () => resolve(imageUrl);
    img.src = imageUrl;
  });
}

export default function ResultView({
  beforeUrl,
  afterUrl,
  onRegenerate,
  onRefine,
  roomType,
  style,
  isFree = true,
}: ResultViewProps) {
  const [feedbackState, setFeedbackState] = useState<
    "idle" | "good-comment" | "bad-details" | "sent"
  >("idle");
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [commentText, setCommentText] = useState("");
  const [refinePrompt, setRefinePrompt] = useState("");

  const handleDownload = useCallback(async () => {
    try {
      let downloadUrl = afterUrl;
      if (isFree) {
        downloadUrl = await addWatermark(afterUrl);
      }
      const response = await fetch(downloadUrl);
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
  }, [afterUrl, isFree]);

  const sendFeedback = async (
    rating: "good" | "bad",
    issues: string[] = [],
    comment: string = ""
  ) => {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, issues, comment: comment || undefined, roomType, style }),
      });
    } catch {
      // Feedback is non-critical, silently fail
    }
    setFeedbackState("sent");
  };

  const handleThumbsUp = () => {
    setFeedbackState("good-comment");
  };

  const handleThumbsDown = () => {
    setFeedbackState("bad-details");
  };

  const toggleIssue = (issue: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

  const saveToPortfolio = async () => {
    try {
      const room = ROOM_TYPES.find((r) => r.id === roomType);
      const styleObj = INTERIOR_STYLES.find((s) => s.id === style);
      await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beforeUrl: beforeUrl,
          afterUrl: afterUrl,
          roomType: roomType || "unknown",
          roomName: room?.name || roomType || "Pokój",
          style: style || "unknown",
          styleName: styleObj?.name || style || "Styl",
        }),
      });
    } catch {
      // Portfolio save is non-critical
    }
  };

  const handleSubmitGood = () => {
    sendFeedback("good", [], commentText.trim());
    saveToPortfolio();
  };

  const handleSubmitIssues = () => {
    sendFeedback("bad", selectedIssues, commentText.trim());
  };

  return (
    <div>
      {/* Before/After with watermark overlay for free tier */}
      <div className="relative">
        <BeforeAfter beforeUrl={beforeUrl} afterUrl={afterUrl} />
        {isFree && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden rounded-xl" aria-hidden="true">
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "rotate(-25deg)" }}>
              <span className="text-white/[0.12] text-4xl sm:text-5xl font-bold whitespace-nowrap select-none">
                WnetrzeAI.pl
              </span>
            </div>
          </div>
        )}
      </div>

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
          Pobierz wynik{isFree ? " (z watermarkiem)" : ""}
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

      {/* Refinement section */}
      {onRefine && (
        <div className="mt-6 border border-white/[0.08] rounded-xl p-4">
          <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
            Poprawki do wyniku
          </label>
          <div className="flex gap-2">
            <textarea
              value={refinePrompt}
              onChange={(e) => setRefinePrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && refinePrompt.trim()) {
                  e.preventDefault();
                  onRefine(refinePrompt.trim());
                  setRefinePrompt("");
                }
              }}
              placeholder="np. &quot;Usuń dywan&quot;, &quot;Przesuń kanapę pod ścianę&quot;, &quot;Zmień kolor ścian na szary&quot;... (Enter wysyła)"
              rows={2}
              className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-[#d4d4d8] placeholder:text-[#52525b] outline-none focus:border-violet-500/30 resize-none"
            />
            <button
              onClick={() => {
                if (refinePrompt.trim()) {
                  onRefine(refinePrompt.trim());
                  setRefinePrompt("");
                }
              }}
              disabled={!refinePrompt.trim()}
              className="btn-primary px-4 self-end disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Popraw
            </button>
          </div>
        </div>
      )}

      {/* Feedback section */}
      <div className="mt-8 border-t border-white/[0.08] pt-6">
        {feedbackState === "idle" && (
          <div className="text-center">
            <p className="text-sm text-[#a1a1aa] mb-3">
              Jak oceniasz wynik?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleThumbsUp}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.08] hover:border-emerald-500/40 hover:bg-emerald-500/10 text-[#a1a1aa] hover:text-emerald-400 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zm-9 11H3a2 2 0 01-2-2v-7a2 2 0 012-2h2"
                  />
                </svg>
                Dobrze
              </button>
              <button
                onClick={handleThumbsDown}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.08] hover:border-red-500/40 hover:bg-red-500/10 text-[#a1a1aa] hover:text-red-400 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zm9-13h2a2 2 0 012 2v7a2 2 0 01-2 2h-2"
                  />
                </svg>
                Źle
              </button>
            </div>
          </div>
        )}

        {feedbackState === "good-comment" && (
          <div className="animate-fade-in">
            <p className="text-sm text-[#a1a1aa] mb-3 text-center">
              Super! Chcesz dodać komentarz?
            </p>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmitGood(); } }}
              placeholder="Co się szczególnie udało, co można poprawić... (opcjonalne, Enter wysyła)"
              rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-[#d4d4d8] placeholder:text-[#52525b] outline-none focus:border-violet-500/30 resize-none mb-4"
            />
            <button
              onClick={handleSubmitGood}
              className="btn-primary w-full"
            >
              Wyślij opinię
            </button>
          </div>
        )}

        {feedbackState === "bad-details" && (
          <div className="animate-fade-in">
            <p className="text-sm text-[#a1a1aa] mb-3 text-center">
              Co poszło nie tak?
            </p>
            <div className="space-y-2 mb-4">
              {ISSUE_OPTIONS.map((issue) => (
                <label
                  key={issue}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-white/[0.08] hover:border-violet-500/30 cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={selectedIssues.includes(issue)}
                    onChange={() => toggleIssue(issue)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/50"
                  />
                  <span className="text-sm text-[#d4d4d8]">{issue}</span>
                </label>
              ))}
            </div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && (selectedIssues.length > 0 || commentText.trim())) {
                  e.preventDefault(); handleSubmitIssues();
                }
              }}
              placeholder="Opisz dokładniej co poszło nie tak... (Enter wysyła)"
              rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-[#d4d4d8] placeholder:text-[#52525b] outline-none focus:border-violet-500/30 resize-none mb-4"
            />
            <button
              onClick={handleSubmitIssues}
              disabled={selectedIssues.length === 0 && !commentText.trim()}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Wyślij opinię
            </button>
          </div>
        )}

        {feedbackState === "sent" && (
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Dziękujemy za opinię!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
