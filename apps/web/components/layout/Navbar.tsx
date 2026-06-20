"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";

const links: { name: string, path: string }[] = [
  { name: "Projects", path: "/#projects" },
  { name: "Experience", path: "/#experience" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/#contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [orbHovered, setOrbHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[70%] max-w-4xl z-50 transition-colors duration-[1200ms]">
      <div className="relative flex items-center justify-between h-14 px-6 rounded-full bg-transparent">
        
        {/* Profile Orb */}
        <div 
          className="relative flex items-center"
          onMouseEnter={() => setOrbHovered(true)}
          onMouseLeave={() => setOrbHovered(false)}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--border-subtle)] cursor-pointer group">
            {/* We assume a placeholder or real image path. Will just use a div with gradient if no image */}
            <div className="w-full h-full bg-gradient-to-tr from-[var(--accent)] to-[var(--secondary)] animate-pulse" />
          </div>
          
          {/* Orb Hover Tooltip */}
          <AnimatePresence>
            {orbHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute top-12 left-0 w-64 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] shadow-xl backdrop-blur-xl"
              >
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-[var(--secondary)]">Currently Building:</span>
                    <div className="text-[var(--foreground)] mt-0.5">AI Systems</div>
                  </div>
                  <div>
                    <span className="text-[var(--secondary)]">Currently Reading:</span>
                    <div className="text-[var(--foreground)] mt-0.5">It Starts With Us</div>
                  </div>
                  <div>
                    <span className="text-[var(--secondary)]">Current City:</span>
                    <div className="text-[var(--foreground)] mt-0.5">Bangalore</div>
                  </div>
                  <div>
                    <span className="text-[var(--secondary)]">Current Focus:</span>
                    <div className="text-[var(--foreground)] mt-0.5">Fulltime Job</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-sans text-sm tracking-wide text-[var(--secondary)]">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`transition-colors duration-300 relative group ${isActive ? "text-[var(--foreground)]" : "hover:text-[var(--foreground)]"}`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[var(--accent)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle & Mobile Menu Trigger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors duration-300"
            aria-label="Toggle Theme"
          >
            {mounted && (
              theme === "dark" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )
            )}
          </button>
          
          <button className="md:hidden p-1 text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
