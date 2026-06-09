"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const compassLinks = [
  { name: "Projects", category: "Projects" },
  { name: "Travel", category: "Travel" },
  { name: "Thoughts", category: "Thoughts" },
  { name: "Reflections", category: "Reflections" },
  { name: "Current Affairs", category: "Current Affairs" },
  { name: "Photography", category: "Photography" },
];

function CompassContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden xl:flex items-center gap-6 font-mono text-[11px] uppercase tracking-widest text-[var(--secondary)] bg-[var(--surface)]/90 backdrop-blur-md px-8 py-4 rounded-full border border-[var(--border-subtle)] shadow-2xl">
      <Link href="/journal" className="flex items-center gap-2 text-[var(--foreground)] font-bold pr-6 border-r border-[var(--border-subtle)] hover:text-[var(--accent)] transition-colors">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
        Journey
      </Link>
      
      <div className="flex items-center gap-6">
        {compassLinks.map((link) => {
          // It's active if the current URL has ?category=X, or if we are at a specific route (fallback)
          const isActive = currentCategory === link.category;
          return (
            <Link
              key={link.name}
              href={`/journal/atlas?category=${encodeURIComponent(link.category)}`}
              className={`relative transition-colors duration-300 hover:text-[var(--foreground)] ${isActive ? "text-[var(--foreground)]" : ""}`}
            >
              {isActive && (
                <motion.span
                  layoutId="compass-active"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {link.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function JourneyCompass() {
  return (
    <Suspense fallback={<nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden xl:flex items-center px-8 py-4 rounded-full bg-[var(--surface)]/90 backdrop-blur-md" />}>
      <CompassContent />
    </Suspense>
  );
}
