"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Analizowanie zdjęcia...",
  "Wykańczanie ścian, podłóg i sufitów...",
  "Montaż drzwi i oświetlenia...",
  "Dobieranie mebli i stylu...",
  "Renderowanie wizualizacji...",
  "Poprawki końcowe...",
  "Finalizowanie...",
];

export default function GenerationProgress() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 10000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        // Slow down as we approach the end
        const increment = prev < 50 ? Math.random() * 2.5 : Math.random() * 1.2;
        return prev + increment;
      });
    }, 500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 border-[3px] border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-6" />

      <p className="text-white font-medium mb-2">{STEPS[step]}</p>
      <p className="text-sm text-[#71717a] mb-6">
        To może zająć do 90 sekund
      </p>

      <div className="max-w-xs mx-auto">
        <div className="h-1.5 bg-[#1a1a25] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 95)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
