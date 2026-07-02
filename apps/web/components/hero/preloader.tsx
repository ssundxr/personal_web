"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, animate, useMotionValue } from "framer-motion";

const SoccerBall = () => (
  <motion.svg
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-foreground"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 7.5l3.5 2.5-1.5 4h-4L8.5 10z" />
    <path d="M12 7.5V2" />
    <path d="M15.5 10l4.5-1.5" />
    <path d="M8.5 10L4 8.5" />
    <path d="M14 14l2.5 5.5" />
    <path d="M10 14L7.5 19.5" />
  </motion.svg>
);

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const counterRef = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const controls = animate(0, 100, {
      duration: 2.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        count.set(latest);
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(latest).toString();
        }
      },
      onComplete: () => {
        setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = "";
        }, 300);
      },
    });

    return () => {
      controls.stop();
      document.body.style.overflow = "";
    };
  }, [count]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
        >
          <motion.div
            exit={{ y: -40, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="flex flex-col items-center z-10 gap-8"
          >
            
            <SoccerBall />
            
            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-2xl sm:text-3xl md:text-4xl tracking-tight font-medium text-foreground uppercase"
            >
              Shyam Sunder
            </motion.h1>

            {/* Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-baseline gap-1 bg-surface px-4 py-2 rounded-full border border-border-subtle"
            >
              <span
                ref={counterRef}
                className="font-mono text-sm tracking-widest tabular-nums text-foreground"
              >
                0
              </span>
              <span className="font-mono text-xs text-secondary">
                %
              </span>
            </motion.div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
