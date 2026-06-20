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
    <section className="relative min-h-screen w-full bg-[#0B0D0F] overflow-hidden flex flex-col justify-center pb-32">
      
      {/* Subtle Ambient Background Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[150px] mix-blend-screen opacity-40" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-16 pt-24 pb-16">
        
        {/* Left Column: Typography */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {showContent && (
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-[2px] bg-accent" />
                <span className="font-oswald uppercase tracking-widest text-sm text-secondary">
                  Engineering Intelligence
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="font-brier text-6xl md:text-8xl lg:text-[8.5rem] text-white leading-[0.85] tracking-tighter"
              >
                SHYAM <br /> SUNDER<span className="text-accent">.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg md:text-xl text-secondary max-w-lg mt-4 leading-relaxed"
              >
                AI & Machine Learning Engineer specializing in generative models, scalable RAG pipelines, and turning complex research into production-grade systems.
              </motion.p>
            </div>
          )}
        </div>

        {/* Right Column: 3D Portrait Card */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end" style={{ perspective: 1200 }}>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl cursor-default group border border-white/10"
            >
              <img
                src="/shyam.jpg"
                alt="Shyam Sunder"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Glassmorphic Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0F] via-transparent to-transparent opacity-80" />
              
              {/* Floating Status Badge */}
              <motion.div 
                style={{ transform: "translateZ(50px)" }}
                className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#D1FF1C] animate-pulse" />
                  <span className="font-mono text-xs text-white uppercase tracking-wider">Status</span>
                </div>
                <span className="font-mono text-xs text-white/90 font-medium">Active Internship</span>
              </motion.div>
            </motion.div>
          )}
        </div>

      </div>

      <SignatureMarqueeSection />
    </section>
  );
}
