"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share, Camera, MessageCircle, Link2, Image, X, Check } from "lucide-react";
import { usePathname } from "next/navigation";

export function ShareMenu({ 
  title, 
  location, 
  category, 
  readTime, 
  image, 
  slug 
}: { 
  title: string, 
  location: string, 
  category: string, 
  readTime: string, 
  image: string,
  slug: string
}) {
  const [scrollDepth, setScrollDepth] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyFile, setStoryFile] = useState<File | null>(null);
  
  const baseUrl = "https://sunder.dev";
  const postUrl = `${baseUrl}/journal/atlas?category=${encodeURIComponent(category)}&post=${slug}&ref=share`;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPx = window.scrollY;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollDepth(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pre-fetch the story image when the share menu is opened to ensure 
  // navigator.share is called synchronously after a user click.
  useEffect(() => {
    if (isOpen && !storyFile && !isGenerating) {
      setIsGenerating(true);
      const storyUrl = `/api/story?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}&readTime=${encodeURIComponent(readTime)}&image=${encodeURIComponent(image)}&slug=${slug}`;
      
      fetch(storyUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `sunder-journal-${slug}-story.png`, { type: "image/png" });
          setStoryFile(file);
          setIsGenerating(false);
        })
        .catch(err => {
          console.error("Failed to pre-fetch story asset:", err);
          setIsGenerating(false);
        });
    }
  }, [isOpen, storyFile, isGenerating, title, category, location, readTime, image, slug]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(postUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleWhatsAppShare = () => {
    const text = `Sunder Journal\n\n${title}\n📍 ${location} | ⏱ ${readTime}\n\nRead Chapter →\n${postUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleNativeStoryShare = async (platform: 'instagram' | 'snapchat') => {
    if (!storyFile) return;
    try {
      if (navigator.canShare && navigator.canShare({ files: [storyFile] })) {
        await navigator.share({
          files: [storyFile],
          title: title,
          text: `Read this chapter on Sunder Journal.`,
        });
      } else {
        // Fallback for desktop/unsupported: Download the image and show instructions
        const downloadUrl = URL.createObjectURL(storyFile);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = storyFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
        alert(`Story asset downloaded! Open ${platform === 'instagram' ? 'Instagram' : 'Snapchat'} and post it as a Story.`);
      }
    } catch (e) {
      console.error("Error sharing story:", e);
    }
  };

  // Determine button state based on scroll depth
  let buttonContent = null;
  if (scrollDepth < 25) {
    buttonContent = <Share className="w-5 h-5" />;
  } else if (scrollDepth >= 25 && scrollDepth < 75) {
    buttonContent = (
      <>
        <Share className="w-4 h-4" />
        <span className="ml-2 font-mono text-[10px] uppercase tracking-widest">Share Chapter</span>
      </>
    );
  } else {
    buttonContent = (
      <>
        <Share className="w-4 h-4" />
        <span className="ml-2 font-mono text-[10px] uppercase tracking-widest">Enjoying this? Share it.</span>
      </>
    );
  }

  return (
    <>
      {/* Sticky Button */}
      <motion.button
        layout
        onClick={() => setIsOpen(true)}
        className="fixed top-8 right-8 z-40 bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--foreground)] px-4 py-3 rounded-full shadow-2xl flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-colors duration-500 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={scrollDepth < 25 ? "icon" : scrollDepth < 75 ? "expanded" : "prompt"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center"
          >
            {buttonContent}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Share Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-[var(--surface)] border border-[var(--border-subtle)] p-8 rounded-xl shadow-2xl flex flex-col gap-8"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2 mt-4">
                <h3 className="font-heading text-3xl text-[var(--foreground)]">Share Chapter</h3>
                <p className="font-sans text-sm text-[var(--secondary)]">Generate a premium story card or copy the link.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleNativeStoryShare('instagram')}
                  disabled={isGenerating || !storyFile}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-[#111] hover:bg-[#1a1a1a] border border-[#333] transition-colors disabled:opacity-50"
                >
                  <Camera className="w-6 h-6 text-pink-500" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#f5f5f5]">
                    {isGenerating ? "Generating..." : "IG Story"}
                  </span>
                </button>
                
                <button 
                  onClick={() => handleNativeStoryShare('snapchat')}
                  disabled={isGenerating || !storyFile}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-[#111] hover:bg-[#1a1a1a] border border-[#333] transition-colors disabled:opacity-50"
                >
                  <Image className="w-6 h-6 text-yellow-400" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#f5f5f5]">
                    {isGenerating ? "Generating..." : "Snapchat"}
                  </span>
                </button>

                <button 
                  onClick={handleWhatsAppShare}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-[#111] hover:bg-[#1a1a1a] border border-[#333] transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-green-500" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#f5f5f5]">WhatsApp</span>
                </button>

                <button 
                  onClick={handleCopyLink}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 border border-[var(--accent)]/30 transition-colors"
                >
                  {isCopied ? <Check className="w-6 h-6 text-[var(--accent)]" /> : <Link2 className="w-6 h-6 text-[var(--accent)]" />}
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
                    {isCopied ? "Copied" : "Copy Link"}
                  </span>
                </button>
              </div>

              {/* Custom Toast Message for Copy */}
              <AnimatePresence>
                {isCopied && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-16 left-0 right-0 bg-[#f5f5f5] text-[#111] p-4 rounded-lg shadow-xl text-center"
                  >
                    <p className="font-sans text-sm font-medium">Link copied. Ready to share a chapter from Sunder Journal.</p>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
