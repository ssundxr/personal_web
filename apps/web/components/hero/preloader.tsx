"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Stickers: fewer & smaller on mobile, full set on desktop
const allStickers = [
  { id: 1, top: "10%", left: "10%", rotate: -15, delay: 0.1, width: "140px", mobileWidth: "80px" },
  { id: 2, top: "15%", right: "15%", rotate: 20, delay: 0.2, width: "120px", mobileWidth: "70px" },
  { id: 3, top: "40%", left: "5%", rotate: 10, delay: 0.3, width: "160px", mobileWidth: "90px" },
  { id: 4, top: "50%", right: "10%", rotate: -25, delay: 0.4, width: "130px", mobileWidth: "75px" },
  { id: 5, bottom: "20%", left: "15%", rotate: 30, delay: 0.5, width: "150px", mobileWidth: "85px" },
  { id: 6, bottom: "25%", right: "20%", rotate: -10, delay: 0.6, width: "140px", mobileWidth: "80px" },
  { id: 7, top: "5%", left: "40%", rotate: 5, delay: 0.7, width: "110px", mobileHidden: true },
  { id: 8, bottom: "5%", right: "10%", rotate: -15, delay: 0.8, width: "135px", mobileHidden: true },
  { id: 9, top: "25%", left: "25%", rotate: 45, delay: 0.9, width: "125px", mobileHidden: true },
  { id: 10, top: "30%", right: "25%", rotate: -35, delay: 1.0, width: "145px", mobileHidden: true },
  { id: 11, bottom: "10%", left: "5%", rotate: 15, delay: 1.1, width: "115px", mobileHidden: true },
];

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, 3500);

    return () => {
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, []);

  const stickers = isMobile 
    ? allStickers.filter(s => !s.mobileHidden) 
    : allStickers;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#e60000] text-[#EBE9E1] overflow-hidden"
        >
          {/* Scattered Aesthetic Stickers */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {stickers.map((sticker) => (
              <motion.img
                key={sticker.id}
                src={`/pic${sticker.id}.png`}
                alt={`Sticker ${sticker.id}`}
                initial={{ opacity: 0, scale: 0.5, rotate: sticker.rotate - 20 }}
                animate={{ opacity: 1, scale: 1, rotate: sticker.rotate }}
                transition={{
                  delay: sticker.delay,
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                }}
                style={{
                  position: "absolute",
                  top: sticker.top,
                  left: sticker.left,
                  right: sticker.right,
                  bottom: sticker.bottom,
                  width: isMobile ? (sticker.mobileWidth || sticker.width) : sticker.width,
                  height: "auto",
                }}
                className="drop-shadow-2xl"
              />
            ))}
          </div>

          <div className="relative z-10 overflow-hidden px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-brier text-4xl sm:text-5xl tracking-tighter uppercase md:text-8xl lg:text-9xl"
            >
              SHYAM SUNDER
            </motion.h1>
          </div>

          {/* Aesthetic Minimal Loading Bar */}
          <div className="absolute bottom-12 sm:bottom-16 md:bottom-24 w-36 sm:w-48 md:w-64 h-[2px] bg-white/20 overflow-hidden rounded-full z-10">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2.5, ease: "easeInOut", delay: 0.4 }}
              className="w-full h-full bg-white rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
