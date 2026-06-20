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
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="absolute left-1/2 -top-4 md:-top-8 -translate-x-1/2 font-brier text-2xl md:text-4xl"
            >
              s
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-brier text-6xl tracking-tighter uppercase md:text-8xl lg:text-9xl"
            >
              SHYAM
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute bottom-12 font-oswald text-sm font-bold tracking-widest uppercase md:text-base"
          >
            LOAD PORTFOLIO
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
