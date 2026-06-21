"use client";

import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import SignatureMarqueeSection from "./signature-marquee-section";

export default function HeroSection() {
  const [showContent, setShowContent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2800); // sync with preloader exit
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

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
    <section 
      ref={containerRef} 
      className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col items-center justify-center transition-colors duration-[1200ms] -mt-24 pt-24" 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
    >
      
      {/* Ambient Glow tied to mouse */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <motion.div 
          style={{ x: mouseXSpring, y: mouseYSpring }} 
          className="w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full bg-accent/10 dark:bg-accent/5 blur-[100px] md:blur-[150px] mix-blend-screen opacity-50 transition-opacity duration-1000"
        />
      </div>

      {/* Cinematic Image Pillar */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none pt-12 md:pt-24 pb-32">
        {showContent && (
          <motion.div
            initial={{ scale: 1.1, opacity: 0, filter: "blur(20px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ y: yImage, rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-[60vh] md:h-[75vh] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 dark:border-white/5"
          >
            <img 
              src="/shyam.jpg" 
              alt="Shyam Sunder" 
              className="absolute inset-0 w-full h-full object-cover object-[center_top]" 
            />
            {/* Inner Vignette / Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </motion.div>
        )}
      </div>

      {/* Massive Blended Typography */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center pointer-events-none mix-blend-difference text-[#fff] px-4">
        {showContent && (
          <motion.div 
            style={{ y: yText }}
            className="flex flex-col items-center"
          >
            <div className="overflow-hidden flex justify-center w-full">
               <motion.span
                 initial={{ y: "110%", rotate: 2 }}
                 animate={{ y: "0%", rotate: 0 }}
                 transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                 className="font-heading font-bold text-[18vw] leading-[0.8] tracking-tighter text-center uppercase"
               >
                 SHYAM
               </motion.span>
            </div>
            <div className="overflow-hidden flex justify-center w-full mt-[-2vw] md:mt-[-4vw]">
               <motion.span
                 initial={{ y: "110%", rotate: 2 }}
                 animate={{ y: "0%", rotate: 0 }}
                 transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                 className="font-heading font-bold text-[18vw] leading-[0.8] tracking-tighter text-center uppercase flex items-baseline"
               >
                 SUNDER<span className="text-accent mix-blend-normal opacity-90 text-[18vw]">.</span>
               </motion.span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Elements (Badges, subtitle) */}
      <div className="absolute inset-0 z-30 container mx-auto px-6 md:px-12 pointer-events-none flex flex-col justify-between py-32 md:py-40">
         {/* Top Left Badge */}
         <div className="self-start md:mt-10">
           {showContent && (
             <motion.div
               initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
               animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
               transition={{ duration: 1, delay: 0.8 }}
               className="flex items-center gap-4 backdrop-blur-md bg-foreground/5 p-3 pr-6 rounded-full border border-foreground/10 pointer-events-auto shadow-xl"
             >
               <div className="w-8 h-[2px] bg-accent" />
               <span className="font-oswald uppercase tracking-widest text-xs md:text-sm text-foreground/90">
                 AI-Engineer
               </span>
             </motion.div>
           )}
         </div>
         
         {/* Bottom Split (Description and Status) */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full mt-auto mb-16 md:mb-8 gap-6 md:gap-0">
            {showContent && (
              <motion.p 
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 1 }}
                className="text-foreground/80 max-w-sm text-sm md:text-base pointer-events-auto backdrop-blur-xl bg-background/40 p-6 rounded-2xl border border-foreground/10 shadow-2xl leading-relaxed font-sans"
              >
                AI & Machine Learning Engineer specializing in generative models, scalable RAG pipelines, and turning complex research into production-grade systems.
              </motion.p>
            )}

            {showContent && (
              <motion.div 
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 1.1 }}
                className="pointer-events-auto backdrop-blur-xl bg-background/40 p-4 rounded-xl border border-foreground/10 shadow-2xl flex items-center gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 dark:bg-[#D1FF1C] animate-pulse shadow-[0_0_10px_rgba(49,255,28,0.5)]" />
                  <span className="font-mono text-xs text-foreground/70 uppercase tracking-wider">Status</span>
                </div>
                <div className="w-[1px] h-4 bg-foreground/20" />
                <span className="font-mono text-xs text-foreground font-medium">Active Internship</span>
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
