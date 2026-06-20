"use client";

import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import InteractivePortrait from "./interactive-portrait";
import SignatureMarqueeSection from "./signature-marquee-section";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const portraitScale = useTransform(smoothProgress, [0, 0.4], [1, 0.45]);
  
  // Marquee text fades in at start, fades out at end
  const textOpacity = useTransform(smoothProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  
  // Exit transformations for both layers
  const exitY = useTransform(smoothProgress, [0.85, 1], ["0%", "-100%"]);
  const exitOpacity = useTransform(smoothProgress, [0.9, 1], [1, 0]);

  const [showPortrait, setShowPortrait] = useState(false);

  useEffect(() => {
    // Delay matches Preloader animation + a bit to ensure smooth transition
    const timer = setTimeout(() => {
      setShowPortrait(true);
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-[#1a1f1a]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-background">
        
        {/* Layer 1: Background Marquee Text */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ 
            opacity: textOpacity,
            y: exitY
          }}
        >
          <SignatureMarqueeSection />
        </motion.div>

        {/* Layer 2: Foreground Portrait */}
        <motion.div
          className="absolute inset-0 z-10 origin-center"
          style={{
            scale: portraitScale,
            y: exitY,
            opacity: exitOpacity
          }}
        >
          {showPortrait && <InteractivePortrait />}
        </motion.div>
        
      </div>
    </section>
  );
}
