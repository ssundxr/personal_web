"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    })
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground relative overflow-hidden font-sans selection:bg-accent selection:text-white transition-colors duration-[1200ms]">
      
      {/* ═══════════ SECTION 01 — HERO & PORTRAIT HOOK ═══════════ */}
      <section className="w-full min-h-screen px-6 md:px-12 pt-32 pb-20 flex flex-col justify-center relative">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.02 }}
          transition={{ duration: 2 }}
          className="text-[20vw] absolute right-0 top-10 pointer-events-none font-bold tracking-tighter"
        >
          01
        </motion.span>
        
        <div className="flex flex-col lg:flex-row w-full gap-16 lg:gap-24 items-center justify-between z-10">
          
          <div className="flex flex-col w-full lg:w-7/12">
            <div className="flex flex-col mb-16 lg:mb-24 w-full cursor-default select-none">
              <div className="flex items-center gap-6 md:gap-10 pl-1 md:pl-4 mb-4 md:mb-2 lg:-mb-2 z-20">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  className="w-12 md:w-20 lg:w-32 h-[3px] bg-accent origin-left"
                />
                <motion.h2 
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUpVariant}
                  className="text-5xl md:text-7xl lg:text-[7.5rem] font-serif italic text-foreground leading-none tracking-wide"
                >
                  Shyam
                </motion.h2>
              </div>
              
              <motion.h1 
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeUpVariant}
                className="relative z-10 text-[6rem] sm:text-[9.5rem] md:text-[13rem] lg:text-[16rem] font-extrabold tracking-[-0.07em] text-foreground leading-[0.8] uppercase ml-[-0.05em]"
              >
                SUNDER<motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 1.2, duration: 1 }}
                  className="text-accent"
                >.</motion.span>
              </motion.h1>
            </div>
            
            <motion.div 
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="flex flex-col gap-10 max-w-3xl"
            >
              <p className="text-2xl md:text-4xl text-foreground leading-snug font-medium tracking-tight">
                Designing the future of human-computer interaction, spatial computing, and digital legacy.
              </p>
              <p className="font-mono text-sm md:text-base text-secondary leading-relaxed max-w-xl">
                Award-winning researcher and builder focusing on creating systems that augment human cognition and preserve digital memory.
              </p>
            </motion.div>
          </div>

          {/* Right Column: Portrait */}
          <div className="w-full lg:w-5/12 flex justify-center lg:justify-end relative mt-12 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
              className="relative w-full max-w-[450px] aspect-[2/3] flex items-center justify-center cursor-pointer group"
            >
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-foreground z-10 opacity-20 transition-opacity duration-500 group-hover:opacity-40" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-foreground z-10 opacity-20 transition-opacity duration-500 group-hover:opacity-40" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-foreground z-10 opacity-20 transition-opacity duration-500 group-hover:opacity-40" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-foreground z-10 opacity-20 transition-opacity duration-500 group-hover:opacity-40" />

              <div className="absolute inset-4 overflow-hidden bg-surface">
                <img 
                  src="/shyam.jpg" 
                  alt="Sunder" 
                  className="w-full h-full object-cover grayscale transition-all duration-700 ease-in-out group-hover:grayscale-0 group-hover:scale-105" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[length:100px_100px] opacity-10 mix-blend-multiply dark:mix-blend-screen" />
              </div>

            </motion.div>
          </div>

        </div>
      </section>

      {/* ═══════════ SECTION 02 — PROJECTS ═══════════ */}
      <section id="projects" className="w-full px-6 md:px-12 py-32 border-t border-border-subtle relative scroll-m-20">
        <span className="opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none font-bold tracking-tighter transition-colors duration-[1200ms]">02</span>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          custom={0}
          className="flex justify-between items-end mb-16 md:mb-24"
        >
          <div className="font-mono text-xs uppercase tracking-widest text-secondary">section.projects</div>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground uppercase">Selected Works</h2>
        </motion.div>

        <div className="flex flex-col gap-24 w-full">
          {[
            { title: "Spatial OS", role: "Creator", year: "2026", desc: "A new paradigm for spatial computing interfaces, rethinking how humans interact with layered digital spaces." },
            { title: "Neural Engine", role: "Builder", year: "2025", desc: "Local LLM inference optimization — reducing memory bandwidth bottlenecks while preserving zero-shot reasoning." },
          ].map((project, idx) => (
            <motion.div 
              key={idx} 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              custom={idx}
              className="group flex flex-col md:flex-row gap-8 md:gap-16 items-start w-full"
            >
              <div className="w-full md:w-1/2 aspect-[16/9] bg-surface border border-border-subtle relative overflow-hidden transition-colors duration-[1200ms]">
                 <div className="absolute inset-0 bg-foreground opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
              </div>
              <div className="w-full md:w-1/2 flex flex-col items-start pt-4">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-mono text-xs text-accent font-semibold border border-accent px-3 py-1 transition-colors duration-[1200ms]">{project.year}</span>
                  <span className="font-mono text-xs text-secondary uppercase tracking-wider">{project.role}</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight group-hover:text-accent transition-colors duration-500">{project.title}</h3>
                <p className="text-lg text-secondary leading-relaxed mb-8 max-w-lg">{project.desc}</p>
                <motion.button 
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-foreground hover:text-accent transition-colors"
                >
                  View Case Study <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ SECTION 03 — EXPERIENCE & EDUCATION ═══════════ */}
      <section id="experience" className="w-full px-6 md:px-12 py-32 border-t border-border-subtle relative bg-surface transition-colors duration-[1200ms] scroll-m-20">
        <span className="opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none font-bold tracking-tighter">03</span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUpVariant} className="font-mono text-xs uppercase tracking-widest text-secondary mb-12">section.experience</motion.div>
            <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase mb-16">Experience</motion.h2>
            <div className="flex flex-col gap-12">
              {[
                { role: "Senior UX Engineer", company: "Google", time: "2024 - Present" },
                { role: "Frontend Architect", company: "Vercel", time: "2021 - 2024" },
              ].map((exp, i) => (
                <motion.div key={i} variants={fadeUpVariant} className="flex flex-col border-l-2 border-border-subtle pl-6 relative hover:border-accent transition-colors duration-500 group">
                  <div className="absolute w-3 h-3 bg-accent -left-[7px] top-1.5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-500">{exp.role}</h3>
                  <p className="text-lg text-secondary mt-1">{exp.company}</p>
                  <p className="font-mono text-xs text-secondary opacity-60 mt-4 tracking-widest">{exp.time}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUpVariant} className="font-mono text-xs uppercase tracking-widest text-secondary mb-12">section.education</motion.div>
            <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase mb-16">Education</motion.h2>
            <div className="flex flex-col gap-12">
              {[
                { degree: "M.S. Computer Science", school: "Stanford University", time: "2019 - 2021" },
                { degree: "B.S. Software Engineering", school: "MIT", time: "2015 - 2019" },
              ].map((edu, i) => (
                <motion.div key={i} variants={fadeUpVariant} className="flex flex-col border-l-2 border-border-subtle pl-6 relative hover:border-accent transition-colors duration-500 group">
                  <div className="absolute w-3 h-3 bg-accent -left-[7px] top-1.5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-500">{edu.degree}</h3>
                  <p className="text-lg text-secondary mt-1">{edu.school}</p>
                  <p className="font-mono text-xs text-secondary opacity-60 mt-4 tracking-widest">{edu.time}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ SECTION 04 — ACHIEVEMENTS ═══════════ */}
      <section className="w-full px-6 md:px-12 py-32 border-t border-border-subtle relative bg-background transition-colors duration-[1200ms]">
        <span className="opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none font-bold tracking-tighter">04</span>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="flex justify-between items-end mb-16 md:mb-24"
        >
          <div className="font-mono text-xs uppercase tracking-widest text-secondary">section.achievements</div>
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground uppercase">Honors</h2>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[
            { title: "Awwwards Site of the Month", year: "2025" },
            { title: "Apple Design Award", year: "2024" },
            { title: "FWA of the Day", year: "2023" },
          ].map((award, i) => (
            <motion.div 
              key={i} 
              variants={fadeUpVariant}
              className="p-10 border border-border-subtle bg-surface hover:border-accent transition-colors duration-500 flex flex-col justify-between aspect-square group"
            >
              <span className="font-mono text-sm text-secondary">{award.year}</span>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight group-hover:text-accent transition-colors duration-500">{award.title}</h3>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════ SECTION 05 — LET'S TALK ═══════════ */}
      <section id="contact" className="w-full px-6 md:px-12 py-32 border-t border-border-subtle relative flex flex-col justify-center min-h-[60vh] bg-surface text-foreground transition-colors duration-[1200ms] scroll-m-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          custom={0}
          className="font-mono text-xs uppercase tracking-widest text-secondary mb-8"
        >
          section.contact
        </motion.div>
        
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          custom={1}
          className="text-5xl md:text-[8rem] font-bold tracking-tighter leading-[0.85] uppercase mb-12"
        >
          Let's Connect<span className="text-accent">.</span>
        </motion.h2>
        
        <div className="flex flex-col md:flex-row gap-16 md:gap-32 w-full">
          <motion.p 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            custom={2}
            className="text-xl md:text-3xl max-w-2xl leading-snug font-medium tracking-tight text-secondary"
          >
            Always open to interesting conversations about technology, research, and building things that matter.
          </motion.p>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col gap-4 font-mono text-lg md:text-xl w-full max-w-md"
          >
            <motion.a variants={fadeUpVariant} href="mailto:hello@sunder.dev" className="group flex items-center justify-between gap-8 border-b border-border-subtle pb-4 hover:border-accent transition-colors duration-500 text-foreground">
              <span className="group-hover:text-accent transition-colors duration-500">hello@sunder.dev</span> 
              <motion.span whileHover={{ rotate: 45 }} className="group-hover:text-accent transition-colors duration-500">↗</motion.span>
            </motion.a>
            <motion.a variants={fadeUpVariant} href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-8 border-b border-border-subtle pb-4 hover:border-accent transition-colors duration-500 text-foreground">
              <span className="group-hover:text-accent transition-colors duration-500">Twitter</span> 
              <motion.span whileHover={{ rotate: 45 }} className="group-hover:text-accent transition-colors duration-500">↗</motion.span>
            </motion.a>
            <motion.a variants={fadeUpVariant} href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-8 border-b border-border-subtle pb-4 hover:border-accent transition-colors duration-500 text-foreground">
              <span className="group-hover:text-accent transition-colors duration-500">LinkedIn</span> 
              <motion.span whileHover={{ rotate: 45 }} className="group-hover:text-accent transition-colors duration-500">↗</motion.span>
            </motion.a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
