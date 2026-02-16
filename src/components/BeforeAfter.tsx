"use client";

import { useCallback, useRef, useState } from "react";

interface BeforeAfterProps {
  beforeUrl: string;
  afterUrl: string;
}

export default function BeforeAfter({ beforeUrl, afterUrl }: BeforeAfterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(percent);
    },
    []
  );

  const handleMouseDown = useCallback(() => setIsDragging(true), []);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      updatePosition(e.touches[0].clientX);
    },
    [updatePosition]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-col-resize select-none touch-none bg-black"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Before (full, always visible underneath) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beforeUrl}
        alt="Przed stagingiem"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* After (clipped from the right by slider position) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterUrl}
        alt="Po stagingu"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
        draggable={false}
      />

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg gap-0.5">
          <svg className="w-3 h-3 text-[#0a0a0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <svg className="w-3 h-3 text-[#0a0a0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="label-before">Przed</span>
      <span
        className="label-after"
        style={{ left: "auto", right: "0.75rem" }}
      >
        Po
      </span>
    </div>
  );
}
