"use client";

import { INTERIOR_STYLES } from "@/lib/styles";

interface StyleSelectorProps {
  selected: string | null;
  onSelect: (styleId: string) => void;
}

export default function StyleSelector({
  selected,
  onSelect,
}: StyleSelectorProps) {
  return (
    <div>
      <h3 className="heading-card mb-4">Wybierz styl wnętrza</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {INTERIOR_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={`p-4 rounded-xl border text-center transition-all ${
              selected === style.id
                ? "border-violet-400 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                : "border-white/[0.08] bg-[#12121a] hover:border-white/[0.15] hover:bg-[#1a1a25]"
            }`}
          >
            <span className="text-2xl block mb-2">{style.icon}</span>
            <span
              className={`text-sm font-medium ${selected === style.id ? "text-white" : "text-[#a1a1aa]"}`}
            >
              {style.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
