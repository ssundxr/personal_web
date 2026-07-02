"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import Preloader from "../components/hero/preloader";
import HeroSection from "../components/hero/hero-section";
import { ContactForm } from "../components/ui/ContactForm";

export default function Home() {
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
      <section id="projects" className="w-full px-5 sm:px-6 md:px-12 py-20 md:py-32 border-t border-border-subtle relative scroll-m-20">
        <span className="opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none font-bold tracking-tighter transition-colors duration-[1200ms]">02</span>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          custom={0}
          className="flex flex-col items-start gap-3 mb-12 md:flex-row md:justify-between md:items-end md:mb-24"
        >
          <div className="font-mono text-xs uppercase tracking-widest text-secondary">section.projects</div>
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight text-foreground uppercase">Works</h2>
        </motion.div>

        <div className="flex flex-col gap-16 md:gap-24 w-full">
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
              className="group flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-16 items-start w-full"
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
              <div className="w-full md:w-1/2 flex flex-col items-start pt-2 sm:pt-4">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <span className="font-mono text-xs text-accent font-semibold border border-accent px-2.5 sm:px-3 py-1 transition-colors duration-[1200ms]">{project.year}</span>
                  <span className="font-mono text-[10px] sm:text-xs text-secondary uppercase tracking-wider">{project.role}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight group-hover:text-accent transition-colors duration-500">{project.title}</h3>
                <p className="text-base sm:text-lg text-secondary leading-relaxed mb-6 sm:mb-8 max-w-lg">{project.desc}</p>
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
      <section id="experience" className="w-full px-5 sm:px-6 md:px-12 py-20 md:py-32 border-t border-border-subtle relative bg-surface transition-colors duration-[1200ms] scroll-m-20">
        <span className="opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none font-bold tracking-tighter">03</span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUpVariant} className="font-mono text-xs uppercase tracking-widest text-secondary mb-8 md:mb-12">section.experience</motion.div>
            <motion.h2 variants={fadeUpVariant} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase mb-10 md:mb-16">Experience</motion.h2>
            <div className="flex flex-col gap-8 md:gap-12">
              {[
                { role: "AI Engineer Intern", company: "Enarin Business Solutions", time: "Mar 2026 - May 2026" },
                { role: "Machine Learning Intern", company: "Enarin Business Solutions", time: "Dec 2025 - Feb 2026" },
                { role: "Undergraduate AI Researcher", company: "Alliance University", time: "Aug 2025 - Jan 2026" },
              ].map((exp, i) => (
                <motion.div key={i} variants={fadeUpVariant} className="flex flex-col border-l-2 border-border-subtle pl-5 sm:pl-6 relative hover:border-accent transition-colors duration-500 group">
                  <div className="absolute w-3 h-3 bg-accent -left-[7px] top-1.5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-500">{exp.role}</h3>
                  <p className="text-base sm:text-lg text-secondary mt-1">{exp.company}</p>
                  <p className="font-mono text-xs text-secondary opacity-60 mt-3 sm:mt-4 tracking-widest">{exp.time}</p>
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
            <motion.div variants={fadeUpVariant} className="font-mono text-xs uppercase tracking-widest text-secondary mb-8 md:mb-12">section.education</motion.div>
            <motion.h2 variants={fadeUpVariant} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase mb-10 md:mb-16">Education</motion.h2>
            <div className="flex flex-col gap-8 md:gap-12">
              {[
                { degree: "B.Tech, CSE - AI & ML", school: "Alliance University", time: "2023 - 2027", meta: "CGPA: 8.45/10" },
              ].map((edu, i) => (
                <motion.div key={i} variants={fadeUpVariant} className="flex flex-col border-l-2 border-border-subtle pl-5 sm:pl-6 relative hover:border-accent transition-colors duration-500 group">
                  <div className="absolute w-3 h-3 bg-accent -left-[7px] top-1.5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-500">{edu.degree}</h3>
                  <p className="text-base sm:text-lg text-secondary mt-1">{edu.school}</p>
                  {edu.meta && <p className="font-mono text-xs text-accent mt-2">{edu.meta}</p>}
                  <p className="font-mono text-xs text-secondary opacity-60 mt-3 sm:mt-4 tracking-widest">{edu.time}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ SECTION 04 — ACHIEVEMENTS ═══════════ */}
      <section className="w-full px-5 sm:px-6 md:px-12 py-20 md:py-32 border-t border-border-subtle relative bg-background transition-colors duration-[1200ms]">
        <span className="opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none font-bold tracking-tighter">04</span>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="flex flex-col items-start gap-3 mb-12 md:flex-row md:justify-between md:items-end md:mb-24"
        >
          <div className="font-mono text-xs uppercase tracking-widest text-secondary">section.achievements</div>
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight text-foreground uppercase">Honors</h2>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
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
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight group-hover:text-accent transition-colors duration-500">{award.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed mt-6 sm:mt-8 relative z-10 group-hover:text-foreground transition-colors duration-500">{award.desc}</p>
              </>
            );

            const className = "group relative p-6 sm:p-8 md:p-10 border border-border-subtle bg-surface hover:border-accent/50 transition-all duration-700 flex flex-col justify-between aspect-[4/3] sm:aspect-square overflow-hidden cursor-pointer rounded-xl shadow-lg hover:shadow-accent/20";

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

      {/* ═══════════ SECTION 05 — RECOMMENDATIONS ═══════════ */}
      <section className="w-full px-5 sm:px-6 md:px-12 py-20 md:py-32 border-t border-border-subtle relative bg-surface transition-colors duration-[1200ms]">
        <span className="opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none font-bold tracking-tighter">05</span>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="flex flex-col items-start gap-3 mb-12 md:flex-row md:justify-between md:items-end md:mb-24"
        >
          <div className="font-mono text-xs uppercase tracking-widest text-secondary">section.recommendations</div>
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight text-foreground uppercase">Words</h2>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
        >
          {[
            { 
              name: "Akhil S", 
              role: "Full Stack Developer", 
              text: "I had the pleasure of working with Shyam Sunder during his AI Engineer Internship at seekATS. Shyam consistently demonstrated strong expertise in AI, Machine Learning, and Python while building impactful solutions that improved recruitment workflows. His ability to combine deep technical knowledge with a research-driven mindset, ownership, and rapid execution set him apart. Shyam is a highly motivated professional with excellent problem-solving skills and a strong work ethic, and I'm confident he will make valuable contributions to any Data Science or AI team.", 
              imagePath: "/recommendations/akhil.jpg",
              recommenderLink: "https://www.linkedin.com/in/-akhil-s/",
              sourceLink: "https://www.linkedin.com/in/sundxrr/"
            },
          ].map((rec, i) => (
            <motion.div 
              key={i} 
              variants={fadeUpVariant}
              whileHover={{ y: -5 }}
              className="group relative p-6 sm:p-8 md:p-10 border border-border-subtle bg-background hover:border-accent/50 transition-all duration-700 flex flex-col justify-between rounded-xl shadow-lg hover:shadow-accent/20 overflow-hidden"
            >
              <div className="absolute opacity-10 group-hover:opacity-20 transition-opacity duration-500 top-4 left-4 sm:left-6 text-6xl sm:text-8xl text-accent font-serif leading-none pointer-events-none">"</div>
              <a href={rec.sourceLink} target="_blank" rel="noopener noreferrer" className="absolute top-4 sm:top-6 right-4 sm:right-6 opacity-40 hover:opacity-100 transition-opacity hover:text-accent">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <p className="text-base sm:text-lg text-secondary leading-relaxed mb-8 sm:mb-10 relative z-10 pt-4 group-hover:text-foreground transition-colors duration-500 italic">"{rec.text}"</p>
              
              <div className="flex items-center gap-3 sm:gap-4 relative z-10 mt-auto pt-4 sm:pt-6 border-t border-border-subtle/50">
                <a href={rec.recommenderLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 sm:gap-4 group/author">
                  {rec.imagePath ? (
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-border-subtle shrink-0">
                      <Image src={rec.imagePath} alt={rec.name} fill className="object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-secondary font-bold shrink-0">
                      {rec.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 sm:gap-1">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight group-hover/author:text-accent transition-colors duration-500">{rec.name}</h3>
                    <span className="font-mono text-[10px] sm:text-xs text-secondary opacity-80">{rec.role}</span>
                  </div>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════ SECTION 06 — LET'S TALK ═══════════ */}
      <section id="contact" className="w-full px-5 sm:px-6 md:px-12 py-20 md:py-32 border-t border-border-subtle relative flex flex-col justify-center min-h-[50vh] md:min-h-[60vh] bg-background text-foreground transition-colors duration-[1200ms] scroll-m-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          custom={0}
          className="font-mono text-xs uppercase tracking-widest text-secondary mb-6 sm:mb-8"
        >
          section.contact
        </motion.div>
        
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          custom={1}
          className="text-3xl sm:text-5xl md:text-7xl lg:text-[8rem] font-bold tracking-tighter leading-[0.85] uppercase mb-8 sm:mb-12"
        >
          Let's Connect<span className="text-accent">.</span>
        </motion.h2>
        
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-24 w-full">
          <div className="flex flex-col gap-10 lg:w-1/2">
            <motion.p 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              custom={2}
              className="text-lg sm:text-xl md:text-3xl max-w-2xl leading-snug font-medium tracking-tight text-secondary"
            >
              Always open to interesting conversations about technology, research, and building things that matter.
            </motion.p>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col gap-4 font-mono text-base sm:text-lg w-full max-w-md"
            >
              <motion.a variants={fadeUpVariant} href="mailto:shyamsundxr@gmail.com" className="group flex items-center justify-between gap-4 sm:gap-8 border-b border-border-subtle pb-4 hover:border-accent transition-colors duration-500 text-foreground">
                <span className="group-hover:text-accent transition-colors duration-500 truncate">shyamsundxr@gmail.com</span> 
                <motion.span whileHover={{ rotate: 45 }} className="group-hover:text-accent transition-colors duration-500 shrink-0">↗</motion.span>
              </motion.a>
              <motion.a variants={fadeUpVariant} href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 sm:gap-8 border-b border-border-subtle pb-4 hover:border-accent transition-colors duration-500 text-foreground">
                <span className="group-hover:text-accent transition-colors duration-500">Twitter</span> 
                <motion.span whileHover={{ rotate: 45 }} className="group-hover:text-accent transition-colors duration-500 shrink-0">↗</motion.span>
              </motion.a>
              <motion.a variants={fadeUpVariant} href="https://linkedin.com/in/sundxrr" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 sm:gap-8 border-b border-border-subtle pb-4 hover:border-accent transition-colors duration-500 text-foreground">
                <span className="group-hover:text-accent transition-colors duration-500">LinkedIn</span> 
                <motion.span whileHover={{ rotate: 45 }} className="group-hover:text-accent transition-colors duration-500 shrink-0">↗</motion.span>
              </motion.a>
            </motion.div>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            custom={3}
            className="lg:w-1/2"
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

    </div>

      {/* ═══════════ FIFA WORLD CUP 2026 BRACKET LINK ═══════════ */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ delay: 4.2, type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-[60]"
        >
          <Link
            href="/bracket"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[var(--surface)]/90 backdrop-blur-xl border border-[var(--border-subtle)] shadow-lg hover:shadow-xl transition-shadow group"
            aria-label="Open FIFA World Cup 2026 Bracket"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 overflow-hidden">
              <img src="/WC.jpeg" alt="World Cup" className="w-full h-full object-cover" />
            </div>
            <span className="text-[13px] font-semibold text-[var(--foreground)] tracking-tight hidden sm:inline">
              World Cup Bracket
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
              Live
            </span>
          </Link>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
