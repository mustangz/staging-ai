"use client";

import { ROOM_TYPES } from "@/lib/styles";

interface RoomTypeSelectorProps {
  selected: string | null;
  onSelect: (roomTypeId: string) => void;
}

export default function RoomTypeSelector({
  selected,
  onSelect,
}: RoomTypeSelectorProps) {
  return (
    <div>
      <h3 className="heading-card mb-4">Typ pomieszczenia</h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {ROOM_TYPES.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelect(room.id)}
            className={`p-3 rounded-xl border text-center transition-all ${
              selected === room.id
                ? "border-violet-400 bg-violet-500/10"
                : "border-white/[0.08] bg-[#12121a] hover:border-white/[0.15]"
            }`}
          >
            <span className="text-xl block mb-1">{room.icon}</span>
            <span
              className={`text-xs font-medium ${selected === room.id ? "text-white" : "text-[#a1a1aa]"}`}
            >
              {room.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
