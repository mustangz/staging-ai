"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import StyleSelector from "@/components/StyleSelector";
import RoomTypeSelector from "@/components/RoomTypeSelector";
import GenerationProgress from "@/components/GenerationProgress";
import ResultView from "@/components/ResultView";
import UpgradePrompt from "@/components/UpgradePrompt";
import { getRemainingRenders, canRender, incrementUsage, FREE_RENDER_LIMIT } from "@/lib/usage";

type Stage = "upload" | "configure" | "generating" | "result";

export default function StagingPage() {
  const [stage, setStage] = useState<Stage>("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(FREE_RENDER_LIMIT);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    setRemaining(getRemainingRenders());
  }, [stage]);

  const handleImageSelected = (file: File, url: string) => {
    setImageFile(file);
    setPreviewUrl(url);
    setStage("configure");
    setError(null);
  };

  const handleGenerate = async () => {
    if (!imageFile || !selectedStyle || !selectedRoom) return;

    if (!canRender()) {
      setShowUpgrade(true);
      return;
    }

    setStage("generating");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("style", selectedStyle);
      formData.append("roomType", selectedRoom);
      if (customPrompt.trim()) {
        formData.append("customPrompt", customPrompt.trim());
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setResultUrl(data.resultUrl);
      incrementUsage();
      setRemaining(getRemainingRenders());
      setStage("result");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Wystąpił błąd. Spróbuj ponownie."
      );
      setStage("configure");
    }
  };

  const handleRegenerate = () => {
    setResultUrl(null);
    setStage("configure");
  };

  const handleRefine = async (refinementPrompt: string) => {
    if (!resultUrl) return;

    setStage("generating");
    setError(null);

    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: resultUrl, prompt: refinementPrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Refinement failed");
      }

      setResultUrl(data.resultUrl);
      setStage("result");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Wystąpił błąd. Spróbuj ponownie."
      );
      setStage("result");
    }
  };

  const handleStartOver = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setSelectedStyle(null);
    setSelectedRoom(null);
    setResultUrl(null);
    setError(null);
    setStage("upload");
  };

  const canGenerate = imageFile && selectedStyle && selectedRoom;

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Wnętrze<span className="gradient-ai">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/portfolio" className="text-sm text-[#a1a1aa] hover:text-white transition-colors hidden sm:block">
              Portfolio
            </Link>
          {stage !== "upload" && (
            <button onClick={handleStartOver} className="btn-ghost text-sm">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nowe zdjęcie
            </button>
          )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        {/* Usage badge */}
        <div className="flex justify-center mb-6">
          <div className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${
            remaining > 0
              ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
              : "bg-red-500/10 text-red-300 border-red-500/30"
          }`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Pozostało {remaining}/{FREE_RENDER_LIMIT} renderów
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {["Zdjęcie", "Konfiguracja", "Generowanie", "Wynik"].map(
            (label, i) => {
              const stages: Stage[] = [
                "upload",
                "configure",
                "generating",
                "result",
              ];
              const currentIdx = stages.indexOf(stage);
              const isActive = i <= currentIdx;
              return (
                <div key={label} className="flex items-center gap-2">
                  {i > 0 && (
                    <div
                      className={`w-8 h-px ${isActive ? "bg-violet-400" : "bg-white/[0.08]"}`}
                    />
                  )}
                  <div
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
                      isActive
                        ? "bg-violet-500/10 text-violet-300 border border-violet-500/30"
                        : "text-[#52525b] border border-white/[0.08]"
                    }`}
                  >
                    <span>{i + 1}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Upload stage */}
        {stage === "upload" && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="heading-section mb-3">
                Wgraj zdjęcie <span className="gradient-text">pokoju</span>
              </h1>
              <p className="body-large">
                Zdjęcie pustego pomieszczenia — AI doda meble zachowując kształt
                pokoju.
              </p>
            </div>
            <ImageUpload onImageSelected={handleImageSelected} />
          </div>
        )}

        {/* Configure stage */}
        {stage === "configure" && previewUrl && (
          <div className="animate-fade-in space-y-8">
            <div className="card-gradient p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Wgrane zdjęcie"
                className="w-full max-h-[300px] object-contain rounded-lg"
              />
            </div>

            <RoomTypeSelector
              selected={selectedRoom}
              onSelect={setSelectedRoom}
            />

            <StyleSelector
              selected={selectedStyle}
              onSelect={setSelectedStyle}
            />

            {/* Custom prompt */}
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">
                Dodatkowe instrukcje (opcjonalne)
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="np. &quot;Podłoga z ciemnego drewna&quot;, &quot;Nie dodawaj dywanu&quot;, &quot;Ściana za kanapą w kolorze granatowym&quot;..."
                rows={2}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-[#d4d4d8] placeholder:text-[#52525b] outline-none focus:border-violet-500/30 resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`btn-primary w-full ${!canGenerate ? "opacity-50 cursor-not-allowed" : "animate-pulse-glow"}`}
            >
              Wygeneruj staging
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Generating stage */}
        {stage === "generating" && (
          <div className="animate-fade-in">
            <GenerationProgress />
          </div>
        )}

        {/* Result stage */}
        {stage === "result" && previewUrl && resultUrl && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="heading-section mb-2">
                <span className="gradient-text">Gotowe!</span>
              </h2>
              <p className="body-large">
                Przesuń suwak aby porównać przed i po.
              </p>
            </div>
            <ResultView
              beforeUrl={previewUrl}
              afterUrl={resultUrl}
              onRegenerate={handleRegenerate}
              onRefine={handleRefine}
              roomType={selectedRoom}
              style={selectedStyle}
            />
          </div>
        )}
      </main>

      {showUpgrade && <UpgradePrompt onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
