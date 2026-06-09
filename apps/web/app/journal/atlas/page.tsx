"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AtlasArchive, JournalEntry } from "../../../components/AtlasArchive";
import { AtlasGlobe } from "../../../components/AtlasGlobe";
import { BlogPreviewCard } from "../../../components/BlogPreviewCard";

// Mock Data enriched with Coordinates, Media, and Mood
const MOCK_ENTRIES: JournalEntry[] = [
  { 
    id: "spatial-spark", 
    slug: "spatial-spark", 
    title: "The Spatial Spark: When Interfaces Disappear", 
    date: "Jan 12, 2022", 
    abstract: "An exploration into how we can move past screen-bound interaction into true spatial computing.", 
    readTime: "5 min read", 
    location: "San Francisco, USA", 
    category: "Thoughts",
    coordinates: [-122.4194, 37.7749],
    images: ["img1", "img2"],
    videos: [],
    mood: "Visionary"
  },
  { 
    id: "neural-engine", 
    slug: "neural-engine", 
    title: "Building the Neural Engine", 
    date: "Mar 04, 2024", 
    abstract: "Technical teardown of optimizing local LLMs to preserve zero-shot reasoning on consumer hardware.", 
    readTime: "12 min read", 
    location: "New York, USA", 
    category: "Current Affairs",
    coordinates: [-74.0060, 40.7128],
    images: ["img1"],
    videos: ["vid1"],
    mood: "Focused"
  },
  { 
    id: "atlas-reveal", 
    slug: "atlas-reveal", 
    title: "The Atlas Reveal", 
    date: "Nov 15, 2025", 
    abstract: "Why we need to preserve human memory spatially, and how Atlas accomplishes this.", 
    readTime: "8 min read", 
    location: "Paris, France", 
    category: "Travel",
    coordinates: [2.3522, 48.8566],
    images: ["img1", "img2", "img3"],
    videos: ["vid1"],
    mood: "Inspired"
  },
  { 
    id: "synthesis", 
    slug: "synthesis", 
    title: "Synthesis & The Future", 
    date: "May 22, 2026", 
    abstract: "Looking forward at the intersection of AI, spatial UX, and digital legacy.", 
    readTime: "6 min read", 
    location: "Tokyo, Japan", 
    category: "Reflections",
    coordinates: [139.6917, 35.6895],
    images: ["img1"],
    videos: [],
    mood: "Reflective"
  },
  {
    id: "bangalore",
    slug: "bangalore-reflections",
    title: "Building While Everyone Sleeps",
    date: "Jun 09, 2026",
    abstract: "Late night reflections from the tech hub of India.",
    readTime: "4 min read",
    location: "Bangalore, India",
    category: "Photography",
    coordinates: [77.5946, 12.9716],
    images: ["img1", "img2"],
    videos: [],
    mood: "Hustle"
  }
];

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AtlasContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const handleSelectEntry = (id: string) => {
    setSelectedEntryId(id);
  };

  const handleClosePreview = () => {
    setSelectedEntryId(null);
  };

  const displayedEntries = category 
    ? MOCK_ENTRIES.filter(e => e.category.toLowerCase() === category.toLowerCase())
    : MOCK_ENTRIES;

  const selectedEntry = MOCK_ENTRIES.find(e => e.id === selectedEntryId) || null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="w-full h-screen flex overflow-hidden fixed inset-0 z-50 bg-[#0b0d0f]"
    >
      {/* 40% Left Panel - Archive List */}
      <div className="w-[40%] h-full relative z-20 shadow-[20px_0_50px_-20px_rgba(0,0,0,0.5)]">
        <AtlasArchive 
          entries={displayedEntries}
          selectedEntryId={selectedEntryId}
          onSelectEntry={handleSelectEntry}
        />
      </div>

      {/* 60% Right Panel - Interactive Globe */}
      <div className="w-[60%] h-full relative z-10">
        <AtlasGlobe 
          entries={displayedEntries}
          selectedEntryId={selectedEntryId}
          onSelectEntry={handleSelectEntry}
        />
      </div>

      {/* Floating Museum Exhibit Panel */}
      <BlogPreviewCard 
        entry={selectedEntry} 
        onClose={handleClosePreview} 
      />
    </motion.div>
  );
}

export default function AtlasPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-[#0b0d0f]" />}>
      <AtlasContent />
    </Suspense>
  );
}
