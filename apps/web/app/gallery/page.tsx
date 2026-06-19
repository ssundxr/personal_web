"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const photos = Array.from({ length: 12 }, (_, i) => `pic${i + 1}`);

function GalleryImage({ baseName }: { baseName: string }) {
  const extensions = [".jpg", ".png", ".jpeg"];
  const [extIndex, setExtIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (extIndex < extensions.length - 1) {
      setExtIndex(extIndex + 1);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className="w-full aspect-[4/5] bg-surface border border-border-subtle flex flex-col items-center justify-center relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
         <span className="font-mono text-xs text-secondary tracking-widest uppercase z-10">{baseName}</span>
         <span className="font-mono text-[10px] text-secondary opacity-50 mt-2 z-10">Placeholder</span>
      </div>
    );
  }

  const currentSrc = `/gallery/${baseName}${extensions[extIndex]}`;

  return (
    <div className="w-full h-full relative overflow-hidden group bg-surface">
      <Image
        src={currentSrc}
        alt={baseName}
        fill
        onError={handleError}
        className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.02]"
        unoptimized
      />
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-700 pointer-events-none" />
    </div>
  );
}

export default function GalleryPage() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    })
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white transition-colors duration-[1200ms] flex flex-col items-center">
      
      <div className="w-full max-w-screen-2xl px-6 md:px-12 pt-32 pb-20 flex flex-col relative z-10">
        
        <motion.div initial="hidden" animate="visible" variants={fadeUpVariant} custom={0}>
          <Link href="/" className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-secondary hover:text-foreground mb-16 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Index
          </Link>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          custom={1}
          className="flex flex-col gap-6 mb-24"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-secondary">section.gallery</span>
          <h1 className="text-[12vw] md:text-8xl font-extrabold tracking-tighter uppercase leading-[0.85]">
            Visual <br/><span className="text-accent">Memoirs.</span>
          </h1>
          <p className="text-xl md:text-2xl text-secondary max-w-2xl mt-4 leading-relaxed tracking-tight">
            A curated collection of moments, aesthetics, and spatial captures. 
          </p>
        </motion.div>

        {/* Masonry-style CSS Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 pb-32">
          {photos.map((baseName, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: (idx % 3) * 0.1 }}
              className="break-inside-avoid relative"
            >
              <GalleryImage baseName={baseName} />
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
