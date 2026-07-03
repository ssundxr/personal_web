"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function PortugalFlag({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.667}
      viewBox="0 0 3 2"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect width="1" height="2" fill="#006600" />
      <rect x="1" width="2" height="2" fill="#FF0000" />
      <ellipse cx="1" cy="1" rx="0.32" ry="0.45" fill="#FFD700" />
      <ellipse cx="1" cy="1" rx="0.22" ry="0.32" fill="#003399" />
      <circle cx="0.84" cy="0.84" r="0.055" fill="#FFF" />
      <circle cx="1.16" cy="0.84" r="0.055" fill="#FFF" />
      <circle cx="0.84" cy="1.16" r="0.055" fill="#FFF" />
      <circle cx="1.16" cy="1.16" r="0.055" fill="#FFF" />
      <circle cx="1" cy="1" r="0.055" fill="#FFF" />
    </svg>
  );
}

export function CR7Modal() {
  const [visible, setVisible] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = useCallback(() => setVisible(false), []);

  const download = useCallback(() => {
    const a = document.createElement("a");
    a.href = "/cr7.mpeg";
    a.download = "cr7-ringtone.mpeg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(true);
    setTimeout(dismiss, 1500);
  }, [dismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cr7-container"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={dismiss}
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              background: "rgba(0,0,0,0.4)",
            }}
          />

          {/* Popup */}
          <motion.div
            role="dialog"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "relative",
              width: "min(88vw, 360px)",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* CR7 bg image */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url(/cr7.jpeg)",
                backgroundSize: "cover",
                backgroundPosition: "center top",
              }}
            />
            {/* Glass overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(8,8,12,0.8)",
                backdropFilter: "blur(2px)",
              }}
            />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 2, padding: "1.75rem 1.5rem", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Close */}
              <button
                onClick={dismiss}
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.35)",
                  padding: 0,
                  lineHeight: 1,
                  fontSize: "18px",
                }}
              >
                ✕
              </button>

              {/* Flag + tag */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <PortugalFlag />
                <span
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  CR7 Ringtone
                </span>
              </div>

              {/* Copy */}
              <p
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "#fff",
                  lineHeight: 1.5,
                  margin: "0 0 1.5rem",
                }}
              >
                since you came here, grab the free CR7 ringtone.
                Portugal made the Round of 16... a small tribute to the man himself. no cap.
              </p>

              {/* Button */}
              <motion.button
                onClick={download}
                disabled={downloaded}
                whileHover={{ scale: downloaded ? 1 : 1.015 }}
                whileTap={{ scale: downloaded ? 1 : 0.97 }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.45rem",
                  padding: "0.75rem",
                  border: "none",
                  cursor: downloaded ? "default" : "pointer",
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  background: downloaded
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(255,255,255,0.92)",
                  color: downloaded ? "rgb(74,222,128)" : "#0a0a0a",
                  transition: "all 0.3s ease",
                }}
              >
                {downloaded ? "✓ Downloaded" : "⬇ Download Ringtone"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
