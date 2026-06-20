"use client";

import { motion } from "framer-motion";

export default function SignatureMarqueeSection() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 flex w-full flex-col overflow-hidden pointer-events-none select-none bg-background/50 backdrop-blur-md border-t border-border-subtle py-4">
      <div className="flex w-full overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          }}
          className="flex whitespace-nowrap items-center"
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center">
              <h2 className="font-brier text-[#D1FF1C] px-4 text-2xl md:text-4xl leading-none tracking-tight">
                ENGINEERING INTELLIGENCE
              </h2>
              <span className="text-white/30 px-4 text-2xl md:text-4xl">•</span>
              <h2 className="font-oswald text-white px-4 text-xl md:text-3xl font-bold leading-none tracking-tighter uppercase">
                FROM RESEARCH TO PRODUCTION
              </h2>
              <span className="text-white/30 px-4 text-2xl md:text-4xl">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
