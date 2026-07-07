"use client";

import { motion } from "framer-motion";

export default function EntryIntro({ onStart }: { onStart: () => void }) {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 1.2, ease: "easeOut" },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white overflow-hidden"
    >
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, transparent 20%, #fff 90%)" }} />
      
      {/* Subtle Particles - simplified with CSS for performance */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

      <div className="relative z-20 flex flex-col items-center max-w-3xl px-6 text-center">
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-10"
        >
          THANK YOU,<br />
          CRISTIANO RONALDO
        </motion.h1>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="space-y-6 text-lg md:text-xl text-neutral-600 font-light leading-relaxed mb-16"
        >
          <p>
            When I first built this portfolio,<br />
            Portugal had just reached the Round of 16.
          </p>
          <p>Today the journey has ended.</p>
          <p>
            Maybe this was the final World Cup chapter<br />
            of the greatest footballer many of us have ever witnessed.
          </p>
          <p className="pt-4 text-black font-medium">Results fade.</p>
          <p className="text-black font-medium">Legends don't.</p>
          <p className="pt-4">Thank you for inspiring millions.</p>
          <p className="text-[#D4AF37] italic">Obrigado.</p>
        </motion.div>

        <motion.button
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onClick={onStart}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.05)" }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 text-sm tracking-[0.2em] uppercase border border-neutral-300 rounded-full text-black backdrop-blur-md transition-colors hover:border-neutral-500"
        >
          Enter Tribute
        </motion.button>
      </div>
    </motion.div>
  );
}
