"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import SignatureMarqueeSection from "./signature-marquee-section";

export default function HeroSection() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2800); // sync with preloader exit
    return () => clearTimeout(timer);
  }, []);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col justify-center pb-32 transition-colors duration-[1200ms] -mt-24">
      
      {/* Subtle Ambient Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 dark:bg-accent/5 blur-[120px] mix-blend-screen opacity-50 transition-opacity duration-1000" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 dark:bg-blue-900/5 blur-[150px] mix-blend-screen opacity-40 transition-opacity duration-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center pt-32 pb-16">
        
        {/* Left Column: Clean Typography */}
        <div className="w-full flex flex-col justify-center order-2 lg:order-1">
          {showContent && (
            <div className="flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-[2px] bg-accent" />
                <span className="font-oswald uppercase tracking-widest text-sm text-secondary">
                  AI-Engineer
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading text-6xl md:text-8xl lg:text-[7rem] text-foreground leading-[0.9] tracking-tight"
              >
                SHYAM <br /> SUNDER<span className="text-accent">.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg md:text-xl text-secondary max-w-md leading-relaxed font-sans mt-2"
              >
                AI & Machine Learning Engineer specializing in generative models, scalable RAG pipelines, and turning complex research into production-grade systems.
              </motion.p>
            </div>
          )}
        </div>

        {/* Right Column: 3D Portrait Image (No Overlap) */}
        <div className="w-full flex justify-center lg:justify-end order-1 lg:order-2" style={{ perspective: 1200 }}>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[400px] md:max-w-[480px] lg:max-w-[500px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl cursor-default group border border-foreground/5 dark:border-white/5 bg-surface"
            >
              <img
                src="/shyam.jpg"
                alt="Shyam Sunder"
                className="absolute inset-0 w-full h-full object-cover object-[center_top] transition-transform duration-[1500ms] group-hover:scale-105"
              />
              
              {/* Subtle Inner Vignette for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80 transition-colors duration-[1200ms]" />
              
              {/* Floating Status Badge within the image frame */}
              <motion.div 
                style={{ transform: "translateZ(60px)" }}
                className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-background/60 backdrop-blur-md border border-foreground/10 flex flex-row items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 dark:bg-[#D1FF1C] animate-pulse shadow-[0_0_10px_rgba(49,255,28,0.5)]" />
                  <span className="font-mono text-xs text-foreground/80 uppercase tracking-wider">Status</span>
                </div>
                <div className="w-[1px] h-4 bg-foreground/20 hidden sm:block" />
                <span className="font-mono text-xs text-foreground font-medium">Active Internship</span>
              </motion.div>
            </motion.div>
          )}
        </div>

      </div>

      <div className="absolute bottom-0 w-full z-40">
        <SignatureMarqueeSection />
      </div>
    </section>
  );
}
