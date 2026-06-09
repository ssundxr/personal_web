"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, MapPin, Clock, Camera, Video, Sparkles } from "lucide-react";
import Link from "next/link";
import { JournalEntry } from "./AtlasArchive";

interface BlogPreviewCardProps {
  entry: JournalEntry | null;
  onClose: () => void;
}

export function BlogPreviewCard({ entry, onClose }: BlogPreviewCardProps) {
  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute left-12 top-1/2 -translate-y-1/2 z-30 w-[600px] max-h-[85vh] bg-[#111111]/95 backdrop-blur-xl border border-[#333] shadow-2xl flex flex-col overflow-hidden rounded-sm"
        >
          {/* Header */}
          <div className="flex justify-between items-start p-8 border-b border-[#333]">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#FFD700]">
                {entry.category} Chapter
              </span>
              <h2 className="font-heading text-4xl text-[#f5f5f5] tracking-tight leading-[1.1]">
                {entry.title}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-[#666] hover:text-[#f5f5f5] transition-colors p-2 -mr-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col gap-8">
            
            {/* Memory Statistics */}
            <div className="grid grid-cols-3 gap-4 border border-[#222] bg-[#1a1a1a]/50 p-4 rounded-sm">
              <Stat icon={<MapPin className="w-3 h-3"/>} label="Location" value={entry.location} />
              <Stat icon={<Clock className="w-3 h-3"/>} label="Visited" value={entry.date} />
              <Stat icon={<Sparkles className="w-3 h-3"/>} label="Mood" value={entry.mood} />
              <Stat icon={<Clock className="w-3 h-3"/>} label="Read Time" value={entry.readTime} />
              <Stat icon={<Camera className="w-3 h-3"/>} label="Photos" value={entry.images.length.toString()} />
              <Stat icon={<Video className="w-3 h-3"/>} label="Videos" value={entry.videos.length.toString()} />
            </div>

            {/* Intro Paragraph */}
            <p className="font-sans text-base text-[#a5a5a5] leading-relaxed font-light">
              {entry.abstract}
            </p>

            {/* 2x2 Media Grid */}
            <div className="grid grid-cols-2 gap-4">
              {entry.images.slice(0, 2).map((img, idx) => (
                <div key={idx} className="aspect-square bg-[#222] rounded-sm overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-[#333] animate-pulse" /> {/* Placeholder */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-screen" />
                  <div className="absolute inset-0 bg-[#FFD700] opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10 mix-blend-overlay" />
                </div>
              ))}
              {entry.videos.slice(0, 2).map((vid, idx) => (
                <div key={`v-${idx}`} className="aspect-square bg-[#1a1a1a] rounded-sm overflow-hidden relative group cursor-pointer flex items-center justify-center">
                  <Video className="w-8 h-8 text-[#444] group-hover:text-[#888] transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-8 border-t border-[#333] bg-[#0b0d0f]">
            <Link 
              href={`/journal/${entry.slug}`}
              className="group flex items-center justify-between w-full"
            >
              <div className="flex flex-col">
                <span className="font-heading text-2xl text-[#f5f5f5] group-hover:text-[#FFD700] transition-colors duration-500">
                  Read the Full Chapter
                </span>
                <div className="h-[1px] w-0 group-hover:w-full bg-[#FFD700] transition-all duration-700 ease-out mt-1" />
              </div>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-6 h-6 text-[#888] group-hover:text-[#FFD700] transition-colors duration-500" />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[9px] uppercase tracking-widest text-[#666] flex items-center gap-1">
        {icon} {label}
      </span>
      <span className="font-mono text-xs text-[#d1d5db] truncate" title={value}>
        {value}
      </span>
    </div>
  );
}
