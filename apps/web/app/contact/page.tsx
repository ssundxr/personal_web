"use client";

import { motion } from "framer-motion";

export default function Contact() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    })
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16 md:py-24">
      <motion.h1 
        initial="hidden" animate="visible" variants={fadeUpVariant} custom={0}
        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 sm:mb-6"
      >
        Get in touch
      </motion.h1>
      <motion.p 
        initial="hidden" animate="visible" variants={fadeUpVariant} custom={1}
        className="text-lg sm:text-xl text-secondary mb-8 sm:mb-12"
      >
        I am always open to discussing research collaborations, design systems, and software engineering opportunities.
      </motion.p>

      <motion.form 
        initial="hidden" animate="visible" variants={fadeUpVariant} custom={2}
        className="flex flex-col gap-5 sm:gap-6"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
          <input 
            type="text" 
            id="name" 
            className="px-4 py-3 min-h-[48px] bg-surface border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-foreground placeholder:text-secondary"
            placeholder="Jane Doe"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
          <input 
            type="email" 
            id="email" 
            className="px-4 py-3 min-h-[48px] bg-surface border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-foreground placeholder:text-secondary"
            placeholder="jane@example.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
          <textarea 
            id="message" 
            rows={5}
            className="px-4 py-3 min-h-[120px] bg-surface border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none text-foreground placeholder:text-secondary"
            placeholder="How can I help you?"
          />
        </div>
        <button 
          type="button" 
          className="mt-2 sm:mt-4 px-8 py-4 min-h-[48px] bg-accent text-white font-medium rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all"
        >
          Send Message
        </button>
      </motion.form>
    </div>
  );
}
