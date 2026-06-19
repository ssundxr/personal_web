"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from "framer-motion";

export function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const counterRef = useRef<HTMLSpanElement>(null);
  
  // Keep motion value strictly for the progress bar width
  const count = useMotionValue(0);

  useEffect(() => {
    // Ultra-smooth 2.5 second interpolation
    const controls = animate(0, 100, {
      duration: 2.5,
      ease: [0.16, 1, 0.3, 1], // Cinematic kinetic easing
      onUpdate: (latest) => {
        count.set(latest);
        // Direct DOM mutation prevents SSR/hydration child errors
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(latest).toString();
        }
      },
      onComplete: () => {
        setTimeout(() => setIsVisible(false), 200);
      }
    });

    return () => controls.stop();
  }, [count]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-foreground text-background"
        >
          {/* Subtle noise/texture for premium realism */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />

          {/* Central Typography Array */}
          <motion.div
            exit={{ y: -50, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="flex flex-col items-center z-10"
          >
            <div className="flex items-start">
              <span ref={counterRef} className="text-[20vw] md:text-[18rem] font-bold tracking-tighter leading-none">
                0
              </span>
              <span className="text-2xl md:text-6xl font-mono mt-4 md:mt-8 opacity-40">%</span>
            </div>
          </motion.div>

          {/* Minimalist Progress Line */}
          <div className="absolute bottom-0 left-0 w-full h-[4px] bg-background/10">
            <motion.div 
              className="h-full bg-accent origin-left"
              style={{ scaleX: useTransform(count, [0, 100], [0, 1]) }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
