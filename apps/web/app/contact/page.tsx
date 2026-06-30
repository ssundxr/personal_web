"use client";

import { motion } from "framer-motion";
import { ContactForm } from "../../components/ui/ContactForm";

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
    <div className="w-full max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16 md:py-24 overflow-hidden min-h-[80vh] flex flex-col justify-center">
      <motion.h1 
        initial="hidden" animate="visible" variants={fadeUpVariant} custom={0}
        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 sm:mb-6"
      >
        Get in touch
      </motion.h1>
      <motion.p 
        initial="hidden" animate="visible" variants={fadeUpVariant} custom={1}
        className="text-lg sm:text-xl text-secondary mb-8 sm:mb-12 max-w-2xl"
      >
        I am always open to discussing research collaborations, design systems, and software engineering opportunities.
      </motion.p>

      <motion.div
        initial="hidden" animate="visible" variants={fadeUpVariant} custom={2}
      >
        <ContactForm />
      </motion.div>
    </div>
  );
}
