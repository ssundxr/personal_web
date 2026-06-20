"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, 3500);

    return () => {
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#e60000] text-white"
        >
          <div className="relative overflow-hidden px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-brier text-5xl tracking-tighter uppercase md:text-8xl lg:text-9xl"
            >
              SHYAM SUNDER
            </motion.h1>
          </div>

          {/* Aesthetic Minimal Loading Bar */}
          <div className="absolute bottom-16 md:bottom-24 w-48 md:w-64 h-[2px] bg-white/20 overflow-hidden rounded-full">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2.5, ease: "easeInOut", delay: 0.4 }}
              className="w-full h-full bg-white rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
