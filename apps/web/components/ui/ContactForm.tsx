"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// ==========================================
// 🔴 CONFIGURED FOR: Website Contact Submissions
// ==========================================
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfUlhhdNv6TWkr0ghndRixpd_S-c-ca-fSdzck59Ls2Trj0SQ/formResponse";
const ENTRY_ID_NAME = "entry.309298557";
const ENTRY_ID_EMAIL = "entry.1999213503";
const ENTRY_ID_MESSAGE = "entry.202793601";
// ==========================================

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    })
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append(ENTRY_ID_NAME, formData.name);
    submitData.append(ENTRY_ID_EMAIL, formData.email);
    submitData.append(ENTRY_ID_MESSAGE, formData.message);

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        mode: "no-cors",
        body: submitData,
      });
      
      setIsSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Form submission failed", error);
      alert("Failed to send message. Please try emailing me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form 
            key="form"
            onSubmit={handleSubmit}
            initial="hidden" 
            animate="visible" 
            exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
            variants={fadeUpVariant} 
            custom={0}
            className="flex flex-col gap-5 sm:gap-6 w-full"
          >
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-3 min-h-[48px] bg-surface border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-foreground placeholder:text-secondary disabled:opacity-50"
                  placeholder="android messi"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="px-4 py-3 min-h-[48px] bg-surface border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-foreground placeholder:text-secondary disabled:opacity-50"
                  placeholder="cristianoronaldo@gmail.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
              <textarea 
                id="message" 
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="px-4 py-3 min-h-[120px] bg-surface border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none text-foreground placeholder:text-secondary disabled:opacity-50"
                placeholder="How can I help you?"
                disabled={isSubmitting}
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="mt-2 px-8 py-4 min-h-[48px] bg-foreground text-background font-medium rounded-xl hover:bg-foreground/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3 overflow-hidden relative group"
            >
              {isSubmitting ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex items-center gap-2"
                >
                  <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  <span>Transmitting...</span>
                </motion.div>
              ) : (
                <>
                  <span className="relative z-10 font-mono uppercase tracking-widest text-sm">Send Transmission</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4 bg-surface border border-border-subtle rounded-2xl w-full"
          >
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground mb-3">
              Message Received
            </h3>
            <p className="text-secondary max-w-sm mb-8 text-sm">
              Thank you for reaching out. I'll review your transmission and get back to you shortly.
            </p>
            <button 
              onClick={() => setIsSuccess(false)}
              className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-foreground transition-colors"
            >
              Send another message →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
