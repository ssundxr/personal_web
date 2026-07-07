"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function VideoEnding({ onFinish }: { onFinish: () => void }) {
  const [showButton, setShowButton] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Failsafe: if video doesn't end naturally, show button after 2 minutes
    const timer = setTimeout(() => setShowButton(true), 120000);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => {
    setShowButton(true);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden"
    >
      <video
        ref={videoRef}
        src="/tribute.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${showButton ? "opacity-30" : "opacity-100"}`}
      />

      {/* Bottom Gradient for text readability */}
      {!showButton && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" 
        />
      )}

      {/* Skip Button */}
      {!showButton && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1 }}
          onClick={onFinish}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 text-white/50 hover:text-white text-xs md:text-sm tracking-[0.2em] uppercase font-light transition-colors underline-offset-4 hover:underline"
        >
          Skip & Enter Portfolio
        </motion.button>
      )}

      {/* Sound Toggle */}
      {!showButton && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          onClick={toggleMute}
          className="absolute bottom-8 right-8 z-30 p-3 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10 hover:bg-black/50 transition-colors"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </motion.button>
      )}

      {/* Final Button */}
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm"
        >
          <button
            onClick={onFinish}
            className="px-12 py-5 text-sm tracking-[0.2em] uppercase border border-neutral-400 rounded-full text-black bg-white/80 backdrop-blur-md transition-all hover:bg-black hover:text-white"
          >
            Enter My Portfolio
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
