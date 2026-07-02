"use client";

import { motion } from "framer-motion";

export default function SignatureMarqueeSection() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 flex w-full flex-col overflow-hidden pointer-events-none select-none bg-background/50 backdrop-blur-md border-t border-border-subtle py-3 sm:py-4">
      <div className="flex w-full overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          }}
          className="flex whitespace-nowrap items-center will-change-transform"
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center">
              <h2 className="font-heading font-bold px-3 sm:px-4 text-lg sm:text-2xl md:text-4xl leading-none tracking-tight uppercase" style={{ color: "var(--marquee-accent)" }}>
                AI ENGINEER
              </h2>
              <span className="text-foreground/30 px-3 sm:px-4 text-lg sm:text-2xl md:text-4xl">•</span>
              <h2 className="font-sans font-bold text-foreground px-3 sm:px-4 text-base sm:text-xl md:text-3xl leading-none tracking-tight uppercase">
                UNDERGRAD RESEARCHER
              </h2>
              <span className="text-foreground/30 px-3 sm:px-4 text-lg sm:text-2xl md:text-4xl">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
