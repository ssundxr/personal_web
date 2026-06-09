"use client";

import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShareMenu } from "../../../components/ShareMenu";

export default function EditorialClientPage({ 
  article, 
  slug, 
  isSharedLink 
}: { 
  article: any, 
  slug: string, 
  isSharedLink: boolean 
}) {
  return (
    <div className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)] selection:text-white pb-32">
      
      {/* Anticipation Screen for Shared Links */}
      <AnimatePresence>
        {isSharedLink && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#0b0d0f] flex flex-col items-center justify-center text-center p-8"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="flex flex-col items-center gap-12 max-w-2xl"
            >
              <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-[#FFD700]/50" />
              
              <div className="flex flex-col gap-6">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#a5a5a5]">Sunder Journal</span>
                <h1 className="font-heading text-5xl md:text-7xl text-[#f5f5f5] leading-[1.1]">{article.title}</h1>
                <p className="font-sans text-xl text-[#888] font-light italic">{article.subtitle}</p>
              </div>

              <Link 
                href={`/journal/${slug}`}
                className="mt-8 border border-[#333] hover:border-[#FFD700] text-[#a5a5a5] hover:text-[#FFD700] transition-colors px-8 py-4 rounded-sm font-mono text-xs uppercase tracking-widest flex items-center gap-4 group"
              >
                [ Read Chapter ] <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShareMenu 
        title={article.title} 
        location={article.location} 
        category={article.category} 
        readTime={article.readTime} 
        image={article.image} 
        slug={slug} 
      />

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full p-8 z-50 mix-blend-difference flex justify-between items-center pointer-events-none">
        <Link 
          href="/journal/atlas" 
          className="pointer-events-auto flex items-center gap-3 group text-[#e5e5e5] hover:text-[#FFD700] transition-colors"
        >
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#FFD700] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.2em]">Return to Atlas</span>
        </Link>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a5a5a5]">
          {article.category}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto pt-48 px-6 md:px-12">
        
        {/* Editorial Header */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-24 flex flex-col items-center text-center"
        >
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-[var(--secondary)] mb-8">
            <span>{article.date}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {article.location}</span>
          </div>
          
          <h1 className="font-heading text-6xl md:text-8xl leading-[0.95] tracking-tight mb-8 max-w-3xl">
            {article.title}
          </h1>
          
          <p className="font-sans text-xl md:text-2xl text-[var(--secondary)] font-light leading-relaxed max-w-2xl italic">
            {article.subtitle}
          </p>
        </motion.header>

        {/* Divider */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent mb-24"
        />

        {/* Editorial Content Layout */}
        <motion.article 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="font-sans text-lg md:text-xl text-[var(--secondary)] font-light leading-[2.2] space-y-12"
        >
          
          {/* Drop Cap Paragraph */}
          <p className="relative">
            <span className="float-left text-8xl font-heading leading-[0.8] pr-4 pt-2 text-[var(--foreground)]">W</span>
            hen we first think about digital interaction, we think about flat screens. For decades, our entire access to the sum of human knowledge has been funneled through 2D glass rectangles. We scroll, we tap, we swipe—but we do not inhabit. The paradigm of computing has always been a window that we look *into*, rather than a room that we step *inside*. But what happens when the frame disappears? When computing becomes ambient and spatial?
          </p>

          <p>
            During the early days of development, the breakthrough wasn't algorithmic—it was philosophical. We realized that memory is intrinsically spatial. You rarely remember a piece of information in a vacuum; you remember *where* you were when you learned it. You remember the quality of the light, the sound of the street outside, the physical weight of the moment.
          </p>

          {/* Left Floating Image */}
          <figure className="float-left w-full md:w-[50%] md:-ml-32 md:mr-12 mb-8 mt-4 relative group">
            <div className="overflow-hidden rounded-sm aspect-[3/4]">
              <img 
                src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2670&auto=format&fit=crop" 
                alt="San Francisco fog" 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
              />
            </div>
            <figcaption className="font-mono text-[9px] uppercase tracking-widest text-[var(--border-subtle)] mt-3 text-right">
              01. The fog over the bay.
            </figcaption>
          </figure>

          <p>
            This led to the creation of the system we now use to map human experiences back onto the physical world. By anchoring digital journals to physical coordinates, the reading experience transformed from passive consumption to an exploratory journey. The cognitive load of navigating a flat list is replaced by the intuitive understanding of geography.
          </p>

          <p>
            Think about how a museum works. A museum does not hand you a spreadsheet of historical facts. It guides you through physical space, using architecture, lighting, and placement to give context to artifacts. An exhibit panel emerges gracefully beside a sculpture. You walk around it. You experience it.
          </p>

          {/* Blockquote */}
          <blockquote className="border-l-2 border-[var(--accent)] pl-8 my-16 py-4 font-heading text-4xl text-[var(--foreground)] leading-snug italic">
            "The future of the web isn't pages. It's places. We must build tools that respect the spatial nature of human cognition."
          </blockquote>

          <p>
            As we move forward, the tools we build must respect this spatial nature. We are entering an era where the digital and physical will seamlessly overlap. The Atlas is just a glimpse—a small experiment in treating our personal history with the reverence of a physical archive.
          </p>

          {/* Wide Landscape Image */}
          <figure className="w-full md:w-[120%] md:-ml-[10%] my-24 relative group">
            <div className="overflow-hidden rounded-sm aspect-[21/9]">
              <img 
                src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop" 
                alt="Parisian architecture" 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
              />
            </div>
            <figcaption className="font-mono text-[9px] uppercase tracking-widest text-[var(--border-subtle)] mt-3 text-center">
              02. A physical anchor for a digital memory.
            </figcaption>
          </figure>

          <p>
            When you build software that feels like an artifact, users treat it differently. They don't just "use" it; they curate it. They tend to it. It becomes less like a utility and more like a garden.
          </p>

        </motion.article>

        {/* Footer */}
        <footer className="mt-48 pt-12 border-t border-[var(--border-subtle)] flex justify-between items-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--secondary)]">
            End of Chapter
          </span>
          <Link 
            href="/journal/atlas"
            className="font-mono text-[10px] uppercase tracking-widest text-[var(--foreground)] hover:text-[var(--accent)] transition-colors flex items-center gap-2"
          >
            Close Archive <ArrowLeft className="w-3 h-3 rotate-180" />
          </Link>
        </footer>

      </main>
    </div>
  );
}
