"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

export function JournalView({ journalEntries }: { journalEntries: any[] }) {
  const containerRef = useRef(null);
  const router = useRouter();
  const [isEnteringAtlas, setIsEnteringAtlas] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Spring physics for the river drawing
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 25,
    restDelta: 0.001
  });

  const handleEnterAtlas = () => {
    setIsEnteringAtlas(true);
    setTimeout(() => {
      router.push('/journal/atlas');
    }, 1800);
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] flex flex-col justify-center px-6 md:px-12 max-w-5xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] mb-6 block">Living Archive</span>
          <h1 className="font-heading text-6xl md:text-8xl leading-[0.9] tracking-tight text-[var(--foreground)] mb-8">
            The Shape of<br/>Memory.
          </h1>
          <p className="font-sans text-lg md:text-xl text-[var(--secondary)] font-light leading-relaxed max-w-xl">
            A continuous curation of travel, research, photography, and personal reflections woven into a singular journey.
          </p>
        </motion.div>
      </section>

      {/* Living River Timeline */}
      <section ref={containerRef} className="relative w-full py-32 px-6 md:px-12 z-10 bg-[var(--surface)]/30 backdrop-blur-sm border-y border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16 relative">
          
          <div className="lg:w-1/3 sticky top-32 h-fit">
            <h2 className="font-heading text-4xl text-[var(--foreground)] mb-4">The River of Time</h2>
            <p className="font-sans text-[var(--secondary)] leading-relaxed">
              Trace the evolution of ideas and locations. The timeline acts as a spine for the archive.
            </p>
          </div>

          <div className="lg:w-2/3 relative flex justify-center py-24">
            
            {/* The SVG River Path */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20">
              <svg width="200" height="800" viewBox="0 0 200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 0 C 150 200, 50 400, 100 600 C 150 700, 100 800, 100 800" stroke="var(--border-subtle)" strokeWidth="2" strokeDasharray="4 8" />
                <motion.path 
                  d="M100 0 C 150 200, 50 400, 100 600 C 150 700, 100 800, 100 800" 
                  stroke="var(--accent)" 
                  strokeWidth="3"
                  style={{ pathLength }}
                />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col gap-32 w-full max-w-md">
              {journalEntries.length === 0 && (
                <div className="text-[var(--secondary)] italic text-sm">
                  No published journals found.
                </div>
              )}
              {journalEntries.map((event, idx) => (
                <motion.div 
                  key={event._id || idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className={`flex flex-col gap-2 ${idx % 2 === 0 ? 'items-end text-right pr-16' : 'items-start text-left pl-16 self-end'}`}
                >
                  <span className="font-mono text-xs text-[var(--secondary)]">{event.year || new Date(event.date).getFullYear() || ''}</span>
                  <Link href={`/journal/${event.slug}`} className="group flex flex-col gap-1">
                    <h3 className="font-heading text-2xl text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{event.title}</h3>
                    <span className="font-sans text-sm text-[var(--secondary)] uppercase tracking-wider">{event.type || 'Journal'}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Atlas Entry Portal */}
      <section className="relative w-full min-h-[50vh] flex flex-col items-center justify-center py-32 px-6">
        <div 
          className="flex flex-col items-center gap-8 cursor-pointer group" 
          onClick={handleEnterAtlas}
        >
          {/* Curved Typography Approximation via SVG */}
          <div className="relative w-[600px] h-[150px] flex justify-center items-center">
            
            {/* Friendly Pointer Popup */}
            <motion.div 
              initial={{ opacity: 0, y: -10, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.8, duration: 1, type: "spring", bounce: 0.5 }}
              viewport={{ once: true }}
              className="absolute -top-4 left-[60%] flex flex-col items-center gap-1 pointer-events-none z-10 group-hover:-translate-y-2 transition-transform duration-700"
            >
              <div className="bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#333] px-5 py-2.5 rounded-full shadow-2xl">
                <span className="font-sans text-[13px] italic text-[#f5f5f5] font-light">Click here to enter my journey ✨</span>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#888] -ml-16 mt-1 rotate-12">
                <path d="M19 5C19 5 11 12 5 18M5 18L12 18M5 18L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>

            <svg width="600" height="150" viewBox="0 0 600 150" className="absolute inset-0 overflow-visible">
              <path id="curve" d="M 50,120 Q 300,20 550,120" fill="transparent" stroke="transparent" />
              <text className="font-serif italic text-6xl md:text-7xl fill-[var(--foreground)] tracking-wide font-light" style={{ transition: 'all 1s ease' }}>
                <textPath href="#curve" startOffset="50%" textAnchor="middle" className="group-hover:fill-[var(--accent)] transition-colors duration-1000">
                  Enter The Atlas
                </textPath>
              </text>
            </svg>
            <motion.div 
              className="absolute bottom-4 w-24 h-[1px] bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all duration-1000"
              animate={{ scaleX: [0, 1] }}
              transition={{ duration: 1 }}
            />
          </div>

          <div className="flex flex-col items-center text-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-y-4 group-hover:translate-y-0">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">
              Every place leaves a story.
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
              Every story leaves a mark.
            </span>
          </div>
        </div>
      </section>

      {/* Atlas Loading Transition */}
      <AnimatePresence>
        {isEnteringAtlas && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[var(--background)] flex flex-col items-center justify-center gap-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-full border border-[var(--border-subtle)] flex items-center justify-center relative"
            >
              <div className="absolute inset-0 border border-[var(--accent)] rounded-full animate-ping opacity-20" />
              <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
            </motion.div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--secondary)]">
              Locating Memory...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
