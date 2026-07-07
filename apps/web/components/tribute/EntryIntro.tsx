"use client";

import { motion, Variants } from "framer-motion";

export default function EntryIntro({ onStart }: { onStart: () => void }) {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.8 + custom * 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const glassPop: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* 8K Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/bg_storypage.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* No Gradient Overlay */}

      {/* Subtle Particles - simplified with CSS for performance */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" 
           style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={glassPop}
        className="relative z-20 flex flex-col items-center max-w-3xl mx-6 px-8 py-12 md:p-16 text-center bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
      >
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-10 drop-shadow-xl"
        >
          THANK YOU,<br />
          CRISTIANO RONALDO
        </motion.h1>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="space-y-6 text-lg md:text-xl text-neutral-400 font-light leading-relaxed mb-16"
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
          <p className="pt-4 text-white font-medium drop-shadow-md">Results fade.</p>
          <p className="text-white font-medium drop-shadow-md">Legends don't.</p>
          <p className="pt-4 text-neutral-300">Thank you for inspiring millions.</p>
          <p className="text-[#D4AF37] italic font-serif text-2xl drop-shadow-lg">Obrigado.</p>
        </motion.div>

        <motion.button
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 text-sm tracking-[0.2em] uppercase border border-white/30 rounded-full text-white backdrop-blur-md transition-all hover:border-white hover:bg-white hover:text-black shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
        >
          Enter Tribute
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
