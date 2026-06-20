"use client";

import { motion } from "framer-motion";

export default function SignatureMarqueeSection() {
  return (
    <div className="absolute inset-0 z-0 flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none">
      <div className="flex w-full flex-col gap-4 py-10 md:gap-8">
        {/* Top Row */}
        <div className="flex w-full overflow-hidden">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            }}
            className="flex whitespace-nowrap"
          >
            {[...Array(4)].map((_, i) => (
              <h2
                key={i}
                className="font-brier text-[#D1FF1C] px-4 text-[12vw] leading-[0.9] tracking-tight md:text-[8vw]"
              >
                ENGINEERING INTELLIGENCE ENGINEERING INTELLIGENCE ENGINEERING INTELLIGENCE ENGINEERING INTELLIGENCE
              </h2>
            ))}
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="flex w-full overflow-hidden">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            }}
            className="flex whitespace-nowrap"
          >
            {[...Array(4)].map((_, i) => (
              <h2
                key={i}
                className="font-oswald text-white px-4 text-[12vw] font-bold leading-[0.9] tracking-tighter uppercase md:text-[8vw]"
              >
                FROM RESEARCH TO PRODUCTION FROM RESEARCH TO PRODUCTION FROM RESEARCH TO PRODUCTION FROM RESEARCH TO PRODUCTION
              </h2>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
