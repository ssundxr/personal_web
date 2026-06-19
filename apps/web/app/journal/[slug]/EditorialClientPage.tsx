"use client";

import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShareMenu } from "../../../components/ShareMenu";
import { PortableText } from '@portabletext/react';

const components = {
  types: {
    videoBlock: ({ value }: any) => {
      // Basic fallback renderer for now
      return (
        <div className="w-full aspect-video bg-zinc-900 rounded-lg overflow-hidden my-8 flex items-center justify-center">
          <a href={value.videoUrl} target="_blank" rel="noreferrer" className="text-zinc-400 underline">Play Video</a>
        </div>
      )
    }
  }
}

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
          className="font-sans text-lg md:text-xl text-[var(--secondary)] font-light leading-[2.2] space-y-8 portable-text-container"
        >
          {article.content ? (
            <PortableText value={article.content} components={components} />
          ) : (
            <p>No content provided for this journal.</p>
          )}
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
