"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

export default function Home() {
  const [isHoveringPortrait, setIsHoveringPortrait] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Physics for Magnetic Pull
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Show premium popup after 1.5 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const centerPointX = left + width / 2;
    const centerPointY = top + height / 2;
    
    const x = (e.clientX - centerPointX) * 0.15;
    const y = (e.clientY - centerPointY) * 0.15;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHoveringPortrait(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f0efed] relative overflow-hidden font-sans selection:bg-[#3b5bdb] selection:text-white">
      
      {/* ═══════════ MINIMAL TOAST POPUP ═══════════ */}
      <AnimatePresence>
        {showPopup && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-[#111111] border border-[#222] p-5 shadow-2xl rounded-sm flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-[#f5f5f5] font-mono text-xs uppercase tracking-widest font-bold">
                  Enter The Archive
                </h3>
                <p className="text-[#a5a5a5] text-sm leading-relaxed mt-1">
                  Explore the new spatial timeline and interactive mapping system.
                </p>
              </div>
              <button 
                onClick={() => setShowPopup(false)}
                className="text-[#666] hover:text-[#f5f5f5] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-3">
              <Link 
                href="/journal" 
                onClick={() => setShowPopup(false)}
                className="flex-1 bg-[#222] hover:bg-[#3b5bdb] text-[#f5f5f5] text-xs font-mono uppercase tracking-widest py-2 px-4 text-center transition-colors border border-[#333]"
              >
                Explore
              </Link>
              <button 
                onClick={() => setShowPopup(false)}
                className="flex-1 bg-transparent hover:bg-[#222] text-[#888] hover:text-[#f5f5f5] text-xs font-mono uppercase tracking-widest py-2 px-4 transition-colors border border-[#333]"
              >
                Not Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ SECTION 01 — HERO & PORTRAIT HOOK ═══════════ */}
      <section className="w-full min-h-screen px-6 md:px-12 pt-32 pb-20 flex flex-col justify-center relative">
        <span className="opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none font-bold tracking-tighter">01</span>
        
        <div className="flex flex-col lg:flex-row w-full gap-16 lg:gap-24 items-center justify-between z-10">
          
          <div className="flex flex-col w-full lg:w-7/12">
            <div className="flex flex-col mb-16 lg:mb-24 w-full cursor-default select-none">
              <div className="flex items-center gap-6 md:gap-10 pl-1 md:pl-4 mb-4 md:mb-2 lg:-mb-2 z-20">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  className="w-12 md:w-20 lg:w-32 h-[3px] bg-[#3b5bdb] origin-left"
                />
                <motion.h2 
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="text-5xl md:text-7xl lg:text-[7.5rem] font-serif italic text-[#1a1a1a] leading-none tracking-wide"
                >
                  Shyam
                </motion.h2>
              </div>
              
              <motion.h1 
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="relative z-10 text-[6rem] sm:text-[9.5rem] md:text-[13rem] lg:text-[16rem] font-extrabold tracking-[-0.07em] text-[#1a1a1a] leading-[0.8] uppercase ml-[-0.05em]"
              >
                SUNDER<motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 1.2, duration: 1 }}
                  className="text-[#3b5bdb]"
                >.</motion.span>
              </motion.h1>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-col gap-10 max-w-3xl"
            >
              <p className="text-2xl md:text-4xl text-[#1a1a1a] leading-snug font-medium tracking-tight">
                Designing the future of human-computer interaction, spatial computing, and digital legacy.
              </p>
              <p className="font-mono text-sm md:text-base text-[#666] leading-relaxed max-w-xl">
                Award-winning researcher and builder focusing on creating systems that augment human cognition and preserve digital memory.
              </p>
            </motion.div>
          </div>

          {/* Right Column: Portrait & Physics Pop-up */}
          <div className="w-full lg:w-5/12 flex justify-center lg:justify-end relative mt-12 lg:mt-0">
            <motion.div 
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHoveringPortrait(true)}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[450px] aspect-[2/3] flex items-center justify-center cursor-pointer group"
            >
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#1a1a1a] z-10 opacity-20 transition-opacity duration-500 group-hover:opacity-40" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#1a1a1a] z-10 opacity-20 transition-opacity duration-500 group-hover:opacity-40" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#1a1a1a] z-10 opacity-20 transition-opacity duration-500 group-hover:opacity-40" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#1a1a1a] z-10 opacity-20 transition-opacity duration-500 group-hover:opacity-40" />

              <div className="absolute inset-4 overflow-hidden bg-[#e5e5e5]">
                <img 
                  src="/shyam.jpg" 
                  alt="Sunder" 
                  className="w-full h-full object-cover grayscale transition-all duration-700 ease-in-out group-hover:grayscale-0 group-hover:scale-105" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[length:100px_100px] opacity-10 mix-blend-multiply" />
              </div>

              {/* Physics-Based Message Box */}
              <motion.div 
                style={{ x: magneticX, y: magneticY }}
                className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
              >
                <Link href="/journal" className="pointer-events-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      y: [0, -5, 0]
                    }}
                    transition={{ 
                      opacity: { duration: 0.8 },
                      scale: { duration: 0.8 },
                      y: { duration: 4, ease: "easeInOut", repeat: Infinity }
                    }}
                    className="bg-white/90 backdrop-blur-md px-6 py-4 shadow-2xl border border-white/50 flex items-center gap-4 rounded-xl relative"
                  >
                    <motion.div 
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-[#3b5bdb]"
                    />
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#999]">Interactive Archive</span>
                      <span className="font-bold text-[#1a1a1a] text-lg tracking-tight">Enter My World</span>
                    </div>
                    <motion.div
                      animate={{ x: isHoveringPortrait ? [0, 4, 0] : 0 }}
                      transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
                    >
                      <ArrowRight className="w-4 h-4 text-[#3b5bdb]" />
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </section>

      {/* ═══════════ SECTION 02 — PROJECTS ═══════════ */}
      <section className="w-full px-6 md:px-12 py-32 border-t border-[#d1d5db] relative">
        <span className="opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none font-bold tracking-tighter">02</span>
        <div className="flex justify-between items-end mb-16 md:mb-24">
          <div className="font-mono text-xs uppercase tracking-widest text-[#999]">section.projects</div>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-[#1a1a1a] uppercase">Selected Works</h2>
        </div>

        <div className="flex flex-col gap-24 w-full">
          {[
            { title: "Spatial OS", role: "Creator", year: "2026", desc: "A new paradigm for spatial computing interfaces, rethinking how humans interact with layered digital spaces." },
            { title: "Neural Engine", role: "Builder", year: "2025", desc: "Local LLM inference optimization — reducing memory bandwidth bottlenecks while preserving zero-shot reasoning." },
          ].map((project, idx) => (
            <div key={idx} className="group flex flex-col md:flex-row gap-8 md:gap-16 items-start w-full">
              <div className="w-full md:w-1/2 aspect-[16/9] bg-[#e5e5e5] border border-[#d1d5db] relative overflow-hidden">
                 <div className="absolute inset-0 bg-[#1a1a1a] opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
              </div>
              <div className="w-full md:w-1/2 flex flex-col items-start pt-4">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-mono text-xs text-[#3b5bdb] font-semibold border border-[#3b5bdb] px-3 py-1">{project.year}</span>
                  <span className="font-mono text-xs text-[#999] uppercase tracking-wider">{project.role}</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 tracking-tight group-hover:text-[#3b5bdb] transition-colors">{project.title}</h3>
                <p className="text-lg text-[#666] leading-relaxed mb-8 max-w-lg">{project.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ SECTION 03 — EXPERIENCE & EDUCATION ═══════════ */}
      <section className="w-full px-6 md:px-12 py-32 border-t border-[#d1d5db] relative bg-[#e8e7e5]">
        <span className="opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none font-bold tracking-tighter">03</span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 w-full">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#999] mb-12">section.experience</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a] uppercase mb-16">Experience</h2>
            <div className="flex flex-col gap-12">
              {[
                { role: "Senior UX Engineer", company: "Google", time: "2024 - Present" },
                { role: "Frontend Architect", company: "Vercel", time: "2021 - 2024" },
              ].map((exp, i) => (
                <div key={i} className="flex flex-col border-l-2 border-[#1a1a1a] pl-6 relative">
                  <div className="absolute w-3 h-3 bg-[#3b5bdb] -left-[7px] top-1.5" />
                  <h3 className="text-2xl font-bold text-[#1a1a1a]">{exp.role}</h3>
                  <p className="text-lg text-[#666] mt-1">{exp.company}</p>
                  <p className="font-mono text-xs text-[#999] mt-4 tracking-widest">{exp.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#999] mb-12">section.education</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a] uppercase mb-16">Education</h2>
            <div className="flex flex-col gap-12">
              {[
                { degree: "M.S. Computer Science", school: "Stanford University", time: "2019 - 2021" },
                { degree: "B.S. Software Engineering", school: "MIT", time: "2015 - 2019" },
              ].map((edu, i) => (
                <div key={i} className="flex flex-col border-l-2 border-[#1a1a1a] pl-6 relative">
                  <div className="absolute w-3 h-3 bg-[#3b5bdb] -left-[7px] top-1.5" />
                  <h3 className="text-2xl font-bold text-[#1a1a1a]">{edu.degree}</h3>
                  <p className="text-lg text-[#666] mt-1">{edu.school}</p>
                  <p className="font-mono text-xs text-[#999] mt-4 tracking-widest">{edu.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 04 — ACHIEVEMENTS ═══════════ */}
      <section className="w-full px-6 md:px-12 py-32 border-t border-[#d1d5db] relative">
        <span className="opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none font-bold tracking-tighter">04</span>
        <div className="flex justify-between items-end mb-16 md:mb-24">
          <div className="font-mono text-xs uppercase tracking-widest text-[#999]">section.achievements</div>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-[#1a1a1a] uppercase">Honors</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Awwwards Site of the Month", year: "2025" },
            { title: "Apple Design Award", year: "2024" },
            { title: "FWA of the Day", year: "2023" },
          ].map((award, i) => (
            <div key={i} className="p-10 border border-[#d1d5db] bg-white/50 hover:bg-white hover:border-[#3b5bdb] transition-colors flex flex-col justify-between aspect-square group">
              <span className="font-mono text-sm text-[#1a1a1a]">{award.year}</span>
              <h3 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] tracking-tight group-hover:text-[#3b5bdb] transition-colors">{award.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ SECTION 05 — LET'S TALK ═══════════ */}
      <section className="w-full px-6 md:px-12 py-32 border-t border-[#1a1a1a] relative flex flex-col justify-center min-h-[60vh] bg-[#1a1a1a] text-[#f0efed]">
        <div className="font-mono text-xs uppercase tracking-widest text-[#666] mb-8">section.contact</div>
        
        <h2 className="text-5xl md:text-[8rem] font-bold tracking-tighter leading-[0.85] uppercase mb-12">
          Let's Connect<span className="text-[#3b5bdb]">.</span>
        </h2>
        
        <div className="flex flex-col md:flex-row gap-16 md:gap-32 w-full">
          <p className="text-xl md:text-3xl max-w-2xl leading-snug font-medium tracking-tight text-[#ccc]">
            Always open to interesting conversations about technology, research, and building things that matter.
          </p>
          <div className="flex flex-col gap-4 font-mono text-lg md:text-xl w-full max-w-md">
            <a href="mailto:hello@sunder.dev" className="hover:text-[#3b5bdb] transition-colors flex items-center justify-between gap-8 border-b border-[#333] pb-4">
              hello@sunder.dev <span>↗</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#3b5bdb] transition-colors flex items-center justify-between gap-8 border-b border-[#333] pb-4">
              Twitter <span>↗</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#3b5bdb] transition-colors flex items-center justify-between gap-8 border-b border-[#333] pb-4">
              LinkedIn <span>↗</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
