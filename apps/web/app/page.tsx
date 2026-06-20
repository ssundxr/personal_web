"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { useRef } from "react";
import Preloader from "../components/hero/preloader";
import HeroSection from "../components/hero/hero-section";
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
    <>
      <Preloader />
      <div className="flex flex-col w-full min-h-screen bg-background text-foreground relative font-sans selection:bg-accent selection:text-white transition-colors duration-[1200ms]">

        <HeroSection />

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
              whileHover={{ y: -10 }}
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              custom={idx}
              className="group flex flex-col md:flex-row gap-8 md:gap-16 items-start w-full"
            >
              <div className="w-full md:w-1/2 aspect-[16/9] bg-surface border border-border-subtle relative overflow-hidden transition-all duration-700 flex items-center justify-center rounded-xl shadow-lg group-hover:shadow-accent/20 group-hover:border-accent/50">
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

            const className = "group relative p-10 border border-border-subtle bg-surface hover:border-accent/50 transition-all duration-700 flex flex-col justify-between aspect-square overflow-hidden cursor-pointer rounded-xl shadow-lg hover:shadow-accent/20";

            return award.link ? (
              <motion.a 
                href={award.link}
                target="_blank"
                rel="noopener noreferrer"
                key={i} 
                variants={fadeUpVariant}
                whileHover={{ y: -10 }}
                className={className}
              >
                {content}
              </motion.a>
            ) : (
              <motion.div 
                key={i} 
                variants={fadeUpVariant}
                whileHover={{ y: -10 }}
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
    </>
  );
}
