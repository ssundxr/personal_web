"use client";

import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";

export type JournalEntry = {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  date: string;
  readTime: string;
  location: string;
  category: "Travel" | "Thoughts" | "Current Affairs" | "Reflections" | "Photography";
  coordinates: [number, number]; // [longitude, latitude]
  images: string[];
  videos: string[];
  mood: string;
};

interface AtlasArchiveProps {
  entries: JournalEntry[];
  selectedEntryId: string | null;
  onSelectEntry: (id: string) => void;
}

export function AtlasArchive({ entries, selectedEntryId, onSelectEntry }: AtlasArchiveProps) {
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar px-8 py-12 bg-[var(--background)]/90 backdrop-blur-sm border-r border-[var(--border-subtle)] relative z-10">
      <div className="mb-16">
        <h1 className="font-heading text-4xl tracking-tight text-[var(--foreground)] mb-2">The Archive</h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--secondary)]">
          {entries.length} Memories Indexed
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {entries.map((entry) => {
          const isSelected = selectedEntryId === entry.id;

          return (
            <motion.button
              key={entry.id}
              onClick={() => onSelectEntry(entry.id)}
              className={`group flex flex-col items-start p-6 rounded-sm transition-all duration-500 relative overflow-hidden ${
                isSelected ? "bg-[var(--surface)]/50" : "hover:bg-[var(--surface)]/30"
              }`}
            >
              {/* Active Indicator Line */}
              <motion.div 
                className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent)]"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: isSelected ? 1 : 0, scaleY: isSelected ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />

              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest w-full mb-3">
                <span className={`${isSelected ? "text-[var(--accent)]" : "text-[var(--secondary)] group-hover:text-[var(--foreground)]"} transition-colors`}>
                  {entry.category}
                </span>
                <span className="text-[var(--border-subtle)]">•</span>
                <span className="text-[var(--secondary)] flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {entry.location}
                </span>
              </div>

              <h2 className={`font-heading text-2xl text-left leading-tight mb-2 transition-all duration-500 ${
                isSelected ? "text-[var(--accent)]" : "text-[var(--foreground)] group-hover:text-[var(--accent)]"
              }`}>
                {entry.title}
              </h2>

              <p className="font-sans text-sm text-[var(--secondary)] text-left leading-relaxed font-light line-clamp-2">
                {entry.abstract}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
