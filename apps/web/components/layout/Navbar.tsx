"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  // Mobile menu animation variants
  const menuOverlayVariants = {
    closed: { 
      opacity: 0,
      transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] }
    },
    open: { 
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    },
  };

  const menuLinkVariants = {
    closed: { opacity: 0, y: 30 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.15 + i * 0.08,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  const menuFooterVariants = {
    closed: { opacity: 0 },
    open: { 
      opacity: 1, 
      transition: { delay: 0.5, duration: 0.6 } 
    },
  };

  return (
    <>
      <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[94%] sm:w-[90%] md:w-[70%] max-w-4xl z-50 transition-colors duration-[1200ms]">
        <div className="relative flex items-center justify-between h-14 px-4 sm:px-6 rounded-full bg-[var(--surface)]/70 backdrop-blur-md border border-[var(--border-subtle)] shadow-sm">
          
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
            
            {/* Orb Hover Tooltip — Desktop only */}
            <AnimatePresence>
              {orbHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute top-12 left-0 w-64 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] shadow-xl backdrop-blur-xl hidden md:block"
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

          {/* Navigation Links — Desktop */}
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
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors duration-300 p-1.5 hidden md:block"
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
            
            {/* Mobile Hamburger / Close */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors duration-300 relative z-[60]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-5 h-5 relative flex flex-col items-center justify-center">
                <motion.span
                  animate={mobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -3.5 }}
                  transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute w-5 h-[1.5px] bg-current rounded-full origin-center"
                />
                <motion.span
                  animate={mobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-5 h-[1.5px] bg-current rounded-full"
                />
                <motion.span
                  animate={mobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 3.5 }}
                  transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute w-5 h-[1.5px] bg-current rounded-full origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════ FULL-SCREEN MOBILE MENU ═══════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={menuOverlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-[55] md:hidden bg-[var(--background)] flex flex-col"
          >
            {/* Menu Content */}
            <div className="flex flex-col justify-between flex-1 px-8 pt-28 pb-12">
              
              {/* Navigation Links */}
              <nav className="flex flex-col gap-2">
                {links.map((link, i) => {
                  const isActive = pathname === link.path;
                  return (
                    <motion.div
                      key={link.name}
                      custom={i}
                      variants={menuLinkVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <Link
                        href={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block py-4 text-4xl sm:text-5xl font-bold tracking-tight transition-colors duration-300 ${
                          isActive 
                            ? "text-[var(--accent)]" 
                            : "text-[var(--foreground)] active:text-[var(--accent)]"
                        }`}
                      >
                        <span className="flex items-center gap-4">
                          <span className="font-mono text-xs text-[var(--secondary)] opacity-50 w-6">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {link.name}
                        </span>
                      </Link>
                      {i < links.length - 1 && (
                        <div className="h-[1px] bg-[var(--border-subtle)]" />
                      )}
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom Section: Theme Toggle + Status */}
              <motion.div
                variants={menuFooterVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex flex-col gap-8"
              >
                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors py-3 self-start"
                  aria-label="Toggle Theme"
                >
                  {mounted && (
                    theme === "dark" ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        Light Mode
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        Dark Mode
                      </>
                    )
                  )}
                </button>

                {/* Subtle Status Bar */}
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-[var(--secondary)] opacity-60">
                  <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-[#D1FF1C] animate-pulse" />
                  <span>Available for opportunities</span>
                </div>

                {/* Keyboard shortcut hint */}
                <div className="font-mono text-[10px] text-[var(--secondary)] opacity-40 tracking-wider">
                  Press <kbd className="px-1.5 py-0.5 bg-[var(--surface)] border border-[var(--border-subtle)] rounded text-[9px]">⌘K</kbd> to search
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
