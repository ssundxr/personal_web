"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function NowPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-[1200ms] flex flex-col items-center">
      
      {/* Main Content — no duplicate nav, using the global Navbar */}
      <main className="w-full max-w-3xl px-5 sm:px-6 md:px-12 py-8 sm:py-12 md:py-16 flex flex-col gap-12 sm:gap-16">
        
        {/* Updated timestamp */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--secondary)]">Updated: Oct 2026</span>
        </div>

        <header className="flex flex-col gap-4 sm:gap-6">
          <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl tracking-tight leading-[0.9]">
            Now.
          </h1>
          <p className="font-sans text-lg sm:text-xl text-[var(--secondary)] leading-relaxed max-w-xl font-light">
            A real-time snapshot of my life. What I'm focused on, reading, building, and thinking about right now.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 border-t border-[var(--border-subtle)] pt-8 sm:pt-12">
          
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-3 sm:gap-4"
          >
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent)]">Current Focus</h2>
            <p className="font-sans text-base sm:text-lg text-[var(--foreground)] leading-relaxed">
              Scaling the Neural Engine. Optimizing local LLMs to preserve zero-shot reasoning on consumer hardware.
            </p>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-3 sm:gap-4"
          >
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent)]">Current Location</h2>
            <p className="font-sans text-base sm:text-lg text-[var(--foreground)] leading-relaxed flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--secondary)] shrink-0" /> Bangalore, India
            </p>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-3 sm:gap-4"
          >
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent)]">Current Projects</h2>
            <ul className="flex flex-col gap-2 font-sans text-base sm:text-lg text-[var(--foreground)]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" /> 
                The Living Archive
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" /> 
                SeekATS Refactoring
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-subtle)] shrink-0" /> 
                Spatial Spark (On Hold)
              </li>
            </ul>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-3 sm:gap-4"
          >
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent)]">Current Books</h2>
            <div className="flex flex-col gap-2 sm:gap-3 font-sans text-base sm:text-lg text-[var(--foreground)]">
              <p>
                <span className="italic">"Atomic Habits"</span> by James Clear
              </p>
              <p>
                <span className="italic">"The Design of Everyday Things"</span> by Don Norman
              </p>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-3 sm:gap-4 md:col-span-2"
          >
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent)]">Current Thoughts & Challenges</h2>
            <p className="font-sans text-base sm:text-lg text-[var(--foreground)] leading-relaxed">
              Balancing deep engineering work with human-centered design. The hardest part isn't writing the code, it's making the code feel invisible so the story can breathe. I'm exploring how to make digital interfaces feel more like physical spaces—museums, journals, galleries.
            </p>
          </motion.section>

        </div>
      </main>
    </div>
  );
}
