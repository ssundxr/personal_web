"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [showToast, setShowToast] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Show toast after a small delay
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 1500);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f0efed] relative overflow-hidden">

      {/* Dynamic Pop-up Toast */}
      <div 
        className={`fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[700px] max-w-full transition-all duration-1000 ease-out transform ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-[#1a1a1a] text-[#f0efed] p-4 md:p-6 shadow-2xl border border-[#333] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse block"></span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#999]">New Update</span>
            </div>
            <p className="font-mono text-sm md:text-sm leading-relaxed text-[#d1d5db]">
              Check out the journal of Shyam and his latest writings. No tracking, just pure thoughts.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link 
              href="/journal" 
              className="font-mono text-xs text-[#3b5bdb] border border-[#3b5bdb] px-4 py-2 hover:bg-[#3b5bdb] hover:text-white transition-colors"
            >
              explore journal
            </Link>
            <button 
              onClick={(e) => { e.preventDefault(); setShowToast(false); }}
              className="font-mono text-xs text-[#999] border border-[#444] px-4 py-2 hover:bg-[#333] hover:text-white transition-colors"
            >
              dismiss
            </button>
          </div>

        </div>
      </div>

      {/* Animation Styles for Editorial Lockup */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUpFade {
          0% { transform: translateY(60px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleRight {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
      `}} />

      <section className="w-full min-h-[90vh] px-6 md:px-12 pt-32 pb-20 flex flex-col justify-center relative">
        <span className="section-number opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none">01</span>
        
        <div className="flex flex-col lg:flex-row w-full gap-16 lg:gap-24 items-center justify-between">
          
          {/* Left Column: Typography */}
          <div className="flex flex-col w-full lg:w-7/12 z-10">
            
            {/* THE EDITORIAL LOCKUP */}
            <div className="flex flex-col mb-16 lg:mb-24 w-full cursor-default select-none">
              
              <div className="flex items-center gap-6 md:gap-10 pl-1 md:pl-4 mb-4 md:mb-2 lg:-mb-2 z-20">
                <div 
                  className="w-12 md:w-20 lg:w-32 h-[3px] bg-[#3b5bdb] origin-left"
                  style={{ animation: 'scaleRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both' }}
                ></div>
                <h2 
                  className="text-5xl md:text-7xl lg:text-[7.5rem] font-serif italic text-[#1a1a1a] leading-none tracking-wide"
                  style={{ animation: 'slideUpFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}
                >
                  Shyam
                </h2>
              </div>
              
              <h1 
                className="relative z-10 text-[6rem] sm:text-[9.5rem] md:text-[13rem] lg:text-[16rem] font-extrabold tracking-[-0.07em] text-[#1a1a1a] leading-[0.8] uppercase ml-[-0.05em]"
                style={{ animation: 'slideUpFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }}
              >
                SUNDER<span className="text-[#3b5bdb]">.</span>
              </h1>
              
            </div>
            
            <div className="flex flex-col gap-10 max-w-3xl">
              <p className="text-2xl md:text-4xl text-[#1a1a1a] leading-snug font-medium tracking-tight">
                Designing the future of human-computer interaction, spatial computing, and digital legacy.
              </p>
              
              <p className="font-mono text-sm md:text-base text-[#666] leading-relaxed max-w-xl">
                Award-winning researcher and builder focusing on creating systems that augment human cognition and preserve digital memory.
              </p>
              
              {/* Aesthetic Quick Links — Spaced Efficiently */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10 pt-10 border-t border-[#d1d5db] w-full max-w-2xl mt-4">
                
                <Link href="/journal/map" className="group flex flex-col gap-3 hover:text-[#1a1a1a] transition-colors text-[#666]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#999] group-hover:text-[#3b5bdb] transition-colors">01 — Atlas</span>
                  <span className="text-xl md:text-2xl font-semibold tracking-tight flex items-center justify-between border-b border-transparent group-hover:border-[#1a1a1a] pb-2 transition-all">
                    Captured Movements <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">↗</span>
                  </span>
                </Link>

                <Link href="/journal/timeline" className="group flex flex-col gap-3 hover:text-[#1a1a1a] transition-colors text-[#666]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#999] group-hover:text-[#3b5bdb] transition-colors">02 — Chronology</span>
                  <span className="text-xl md:text-2xl font-semibold tracking-tight flex items-center justify-between border-b border-transparent group-hover:border-[#1a1a1a] pb-2 transition-all">
                    Journey Timeline <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">↗</span>
                  </span>
                </Link>

                <Link href="/journal/now" className="group flex flex-col gap-3 hover:text-[#1a1a1a] transition-colors text-[#666]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#999] group-hover:text-[#3b5bdb] transition-colors">03 — Presence</span>
                  <span className="text-xl md:text-2xl font-semibold tracking-tight flex items-center justify-between border-b border-transparent group-hover:border-[#1a1a1a] pb-2 transition-all">
                    Current Chapter <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">↗</span>
                  </span>
                </Link>

                <Link href="/journal/research" className="group flex flex-col gap-3 hover:text-[#1a1a1a] transition-colors text-[#666]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#999] group-hover:text-[#3b5bdb] transition-colors">04 — Archive</span>
                  <span className="text-xl md:text-2xl font-semibold tracking-tight flex items-center justify-between border-b border-transparent group-hover:border-[#1a1a1a] pb-2 transition-all">
                    Research Log <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">↗</span>
                  </span>
                </Link>

              </div>
            </div>
          </div>

          {/* Right Column: Editorial Portrait Placeholder */}
          <div className="w-full lg:w-5/12 flex justify-end relative mt-12 lg:mt-0">
            <div className="w-full max-w-[450px] aspect-[2/3] relative flex flex-col items-center justify-center">
              
              {/* Decorative corner marks for a premium studio feel */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#1a1a1a] z-10 opacity-20"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#1a1a1a] z-10 opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#1a1a1a] z-10 opacity-20"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#1a1a1a] z-10 opacity-20"></div>

              {/* The User's Image */}
              <img 
                src="/shyam.jpg" 
                alt="Sunder" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out cursor-pointer" 
              />
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════ SECTION 02 — SELECTED WORKS ═══════════ */}
      <section className="w-full px-6 md:px-12 py-32 border-t border-[#d1d5db] relative">
        <span className="section-number opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none">02</span>
        <div className="flex justify-between items-end mb-16 md:mb-24">
          <div className="section-label m-0">section.works</div>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-[#1a1a1a] uppercase">Selected Works</h2>
        </div>

        <div className="flex flex-col gap-12 md:gap-32 w-full">
          {[
            { slug: "spatial-os", title: "Spatial OS", role: "Creator & Researcher", year: "2026", desc: "A new paradigm for spatial computing interfaces, rethinking how humans interact with layered digital spaces.", img: "bg-[#e5e5e5]" },
            { slug: "neural-engine", title: "Neural Engine", role: "Builder", year: "2025", desc: "Local LLM inference optimization — reducing memory bandwidth bottlenecks while preserving zero-shot reasoning.", img: "bg-[#ddd]" },
            { slug: "atlas", title: "Atlas Map", role: "Creator & Developer", year: "2025", desc: "Global journey visualization system plotting life experiences across coordinates and time.", img: "bg-[#d1d5db]" },
          ].map((project, idx) => (
            <div key={project.slug} className="group flex flex-col md:flex-row gap-8 md:gap-16 items-center w-full">
              <div className={`w-full md:w-3/5 aspect-[16/9] ${project.img} border border-[#d1d5db] overflow-hidden relative`}>
                <div className="absolute inset-0 bg-[#1a1a1a] opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[#999] opacity-50">Project Visual</div>
              </div>
              <div className="w-full md:w-2/5 flex flex-col items-start">
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-mono text-xs md:text-sm text-[#3b5bdb] font-semibold border border-[#3b5bdb] px-2 py-1">{project.year}</span>
                  <span className="font-mono text-xs md:text-sm text-[#999] uppercase tracking-wider">{project.role}</span>
                </div>
                <h3 className="text-4xl md:text-6xl font-bold text-[#1a1a1a] mb-6 group-hover:underline tracking-tight">{project.title}</h3>
                <p className="text-lg md:text-xl text-[#666] leading-relaxed mb-8 max-w-lg">{project.desc}</p>
                <Link href={`/journal/projects/${project.slug}`} className="font-mono text-sm md:text-base text-[#1a1a1a] border-b border-[#1a1a1a] pb-1 hover:text-[#3b5bdb] hover:border-[#3b5bdb] transition-colors">
                  View case study →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ SECTION 03 — LET'S TALK ═══════════ */}
      <section className="w-full px-6 md:px-12 py-32 border-t border-[#d1d5db] relative flex flex-col justify-center min-h-[60vh]">
        <span className="section-number opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none">03</span>
        <div className="section-label mb-8">section.contact</div>
        
        <h2 className="text-5xl md:text-[8rem] font-bold tracking-tighter text-[#1a1a1a] leading-[0.85] uppercase mb-12">
          Let's Build.
        </h2>
        
        <div className="flex flex-col md:flex-row gap-16 md:gap-32 w-full">
          <p className="text-xl md:text-3xl text-[#1a1a1a] max-w-2xl leading-snug font-medium tracking-tight">
            Always open to interesting conversations about technology, research, and building things that matter.
          </p>
          <div className="flex flex-col gap-4 font-mono text-lg md:text-xl text-[#1a1a1a]">
            <a href="mailto:hello@sunder.dev" className="hover:text-[#3b5bdb] hover:underline underline-offset-8 transition-colors flex items-center justify-between gap-8 border-b border-[#d1d5db] pb-4">
              hello@sunder.dev <span>↗</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#3b5bdb] hover:underline underline-offset-8 transition-colors flex items-center justify-between gap-8 border-b border-[#d1d5db] pb-4">
              Twitter <span>↗</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#3b5bdb] hover:underline underline-offset-8 transition-colors flex items-center justify-between gap-8 border-b border-[#d1d5db] pb-4">
              LinkedIn <span>↗</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
