"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
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
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground relative font-sans selection:bg-accent selection:text-white transition-colors duration-[1200ms]">

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
                <div className="overflow-hidden">
                  <motion.h2 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl lg:text-[7.5rem] font-serif italic text-foreground leading-none tracking-wide"
                  >
                    Shyam
                  </motion.h2>
                </div>
              </div>
              
              <motion.h1 
                className="relative z-10 text-[14vw] sm:text-[9.5rem] md:text-[13rem] lg:text-[16rem] font-extrabold tracking-[-0.07em] text-foreground leading-[0.8] uppercase ml-[-0.05em] flex overflow-hidden"
              >
                {"SUNDER".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: "100%", rotateZ: 5 }}
                    animate={{ y: 0, rotateZ: 0 }}
                    transition={{ delay: 0.7 + index * 0.05, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.span 
                  initial={{ opacity: 0, scale: 0 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 0.7 + 6 * 0.05 + 0.2, duration: 0.8, type: "spring", bounce: 0.5 }} 
                  className="text-accent origin-bottom"
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
                Final-year B.Tech student specializing in AI & ML, building production LLM applications and NLP systems.
              </p>
              <p className="font-mono text-sm md:text-base text-secondary leading-relaxed max-w-xl">
                Published researcher in Scientific Reports with expertise in Generative AI, RAG pipelines, deep learning, and cloud deployment on Azure and AWS.
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

              <motion.div className="absolute inset-4 overflow-hidden bg-surface" style={{ y: portraitY }}>
                <Image 
                  src="/shyam.jpg" 
                  alt="Sunder" 
                  fill
                  className="object-cover grayscale transition-all duration-700 ease-in-out group-hover:grayscale-0 group-hover:scale-105" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[length:100px_100px] opacity-10 mix-blend-multiply dark:mix-blend-screen" />
              </motion.div>

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
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground uppercase">Works</h2>
        </motion.div>

        <div className="flex flex-col gap-24 w-full">
          {[
            { 
              title: "CodeRAG", 
              role: "Full-Stack AI Engineer", 
              year: "2026", 
              desc: "AI-powered VS Code extension providing repository-aware developer assistance using RAG, Azure OpenAI, and FAISS for semantic retrieval with sub-second response times.",
              imagePath: "/projects/coderag/cover.png",
              link: "https://marketplace.visualstudio.com/items?itemName=ssundxr.coderag-extension"
            },
            { 
              title: "Recruitment Intelligence System", 
              role: "Machine Learning Intern", 
              year: "2025", 
              desc: "Explainable recruitment system for automated candidate evaluation, semantic scoring, and candidate-job matching leveraging OpenAI Codex.",
              isLocked: true
            },
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
              <div className="w-full md:w-1/2 aspect-[16/9] bg-surface border border-border-subtle relative overflow-hidden transition-colors duration-[1200ms] flex items-center justify-center">
                 {project.isLocked ? (
                   <div className="flex flex-col items-center gap-4 text-secondary opacity-60">
                     <Lock className="w-8 h-8" />
                     <span className="font-mono text-xs uppercase tracking-widest">Confidential / NDA</span>
                   </div>
                 ) : (
                   project.imagePath && <Image src={project.imagePath} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                 )}
                 <div className="absolute inset-0 bg-foreground opacity-0 group-hover:opacity-5 transition-opacity duration-700 pointer-events-none" />
              </div>
              <div className="w-full md:w-1/2 flex flex-col items-start pt-4">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-mono text-xs text-accent font-semibold border border-accent px-3 py-1 transition-colors duration-[1200ms]">{project.year}</span>
                  <span className="font-mono text-xs text-secondary uppercase tracking-wider">{project.role}</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight group-hover:text-accent transition-colors duration-500">{project.title}</h3>
                <p className="text-lg text-secondary leading-relaxed mb-8 max-w-lg">{project.desc}</p>
                {project.isLocked ? (
                  <button className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-secondary cursor-not-allowed opacity-50">
                    <Lock className="w-4 h-4" /> Case Study Locked
                  </button>
                ) : project.link ? (
                  <motion.a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-foreground hover:text-accent transition-colors cursor-pointer"
                  >
                    View Project <ArrowRight className="w-4 h-4" />
                  </motion.a>
                ) : (
                  <motion.button 
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-foreground hover:text-accent transition-colors"
                  >
                    View Case Study <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
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
                { role: "AI Engineer Intern", company: "Enarin Business Solutions", time: "Mar 2026 - May 2026" },
                { role: "Machine Learning Intern", company: "Enarin Business Solutions", time: "Dec 2025 - Feb 2026" },
                { role: "Undergraduate AI Researcher", company: "Alliance University", time: "Aug 2025 - Jan 2026" },
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
                { degree: "B.Tech, CSE - AI & ML", school: "Alliance University", time: "2023 - 2027", meta: "CGPA: 8.45/10" },
              ].map((edu, i) => (
                <motion.div key={i} variants={fadeUpVariant} className="flex flex-col border-l-2 border-border-subtle pl-6 relative hover:border-accent transition-colors duration-500 group">
                  <div className="absolute w-3 h-3 bg-accent -left-[7px] top-1.5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-500">{edu.degree}</h3>
                  <p className="text-lg text-secondary mt-1">{edu.school}</p>
                  {edu.meta && <p className="font-mono text-xs text-accent mt-2">{edu.meta}</p>}
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
            { 
              title: "Published in Scientific Reports", 
              year: "2026", 
              desc: "A Manta Ray-Bayesian Optimization Approach for Hyperparameter-Tuned CNNs in Lung Cancer Classification.", 
              imagePath: "/honors/publication/cover.jpg",
              link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13168308/"
            },
            { 
              title: "3rd Place Microsoft Hackathon", 
              year: "2025", 
              desc: "Awarded 3rd place for innovative AI integration.", 
              imagePath: "/honors/hackathon/cover.jpg" 
            },
          ].map((award, i) => {
            const content = (
              <>
                {award.imagePath && (
                  <Image 
                    src={award.imagePath} 
                    alt={award.title} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent opacity-90" />
                
                <div className="flex flex-col gap-2 relative z-10">
                  <span className="font-mono text-sm text-secondary group-hover:text-foreground transition-colors duration-500">{award.year}</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight group-hover:text-accent transition-colors duration-500">{award.title}</h3>
                </div>
                <p className="text-sm text-secondary leading-relaxed mt-8 relative z-10 group-hover:text-foreground transition-colors duration-500">{award.desc}</p>
              </>
            );

            const className = "group relative p-10 border border-border-subtle bg-surface hover:border-accent transition-colors duration-500 flex flex-col justify-between aspect-square overflow-hidden cursor-pointer";

            return award.link ? (
              <motion.a 
                href={award.link}
                target="_blank"
                rel="noopener noreferrer"
                key={i} 
                variants={fadeUpVariant}
                className={className}
              >
                {content}
              </motion.a>
            ) : (
              <motion.div 
                key={i} 
                variants={fadeUpVariant}
                className={className}
              >
                {content}
              </motion.div>
            );
          })}
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
          className="text-4xl md:text-[8rem] font-bold tracking-tighter leading-[0.85] uppercase mb-12"
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
            <motion.a variants={fadeUpVariant} href="mailto:shyamsundxr@gmail.com" className="group flex items-center justify-between gap-8 border-b border-border-subtle pb-4 hover:border-accent transition-colors duration-500 text-foreground">
              <span className="group-hover:text-accent transition-colors duration-500">shyamsundxr@gmail.com</span> 
              <motion.span whileHover={{ rotate: 45 }} className="group-hover:text-accent transition-colors duration-500">↗</motion.span>
            </motion.a>
            <motion.a variants={fadeUpVariant} href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-8 border-b border-border-subtle pb-4 hover:border-accent transition-colors duration-500 text-foreground">
              <span className="group-hover:text-accent transition-colors duration-500">Twitter</span> 
              <motion.span whileHover={{ rotate: 45 }} className="group-hover:text-accent transition-colors duration-500">↗</motion.span>
            </motion.a>
            <motion.a variants={fadeUpVariant} href="https://linkedin.com/in/sundxrr" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-8 border-b border-border-subtle pb-4 hover:border-accent transition-colors duration-500 text-foreground">
              <span className="group-hover:text-accent transition-colors duration-500">LinkedIn</span> 
              <motion.span whileHover={{ rotate: 45 }} className="group-hover:text-accent transition-colors duration-500">↗</motion.span>
            </motion.a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
