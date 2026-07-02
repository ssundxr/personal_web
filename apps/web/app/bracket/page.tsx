"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, Maximize, Minimize } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Match, RoundId } from "../../lib/fifaBracketTypes";
import { ROUND_LABELS, ROUND_ORDER } from "../../lib/fifaBracketTypes";
import {
  fetchBracketData,
  formatKickoffIST,
  getRelativeLabel,
} from "../../lib/fifaBracketService";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════

const POLL_INTERVAL_MS = 75_000; // 75 seconds

// ═══════════════════════════════════════════════════
//  STATUS PILL
// ═══════════════════════════════════════════════════

function StatusPill({ match }: { match: Match }) {
  if (match.status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-red-500/15 text-red-500 border border-red-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        Live
      </span>
    );
  }
  if (match.status === "finished_ft") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-widest bg-[var(--border-subtle)] text-[var(--secondary)]">
        FT
      </span>
    );
  }
  if (match.status === "finished_pens") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-widest bg-[var(--border-subtle)] text-[var(--secondary)]">
        FT (P)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-widest text-[var(--secondary)] border border-[var(--border-subtle)]">
      {formatKickoffIST(match.kickoffUTC).split(",").slice(-1)[0]?.trim() ?? "TBD"}
    </span>
  );
}

// ═══════════════════════════════════════════════════
//  FLAG BADGE
// ═══════════════════════════════════════════════════

function FlagBadge({ code }: { code: string }) {
  if (code === "TBD") {
    return (
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-[var(--border-subtle)] bg-[var(--surface)]"
        aria-hidden="true"
      >
        <svg
          width="12"
          height="14"
          viewBox="0 0 12 14"
          fill="none"
          className="text-[var(--secondary)] opacity-40"
        >
          <path
            d="M6 1L11 4V10L6 13L1 10V4L6 1Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-[var(--border-subtle)] bg-[var(--surface)] overflow-hidden relative"
      aria-hidden="true"
    >
      {/* Real flags could go here using `code`. For now, we use a sleek placeholder */}
      <span className="text-[9px] font-mono font-bold text-[var(--secondary)] uppercase select-none">
        {code.slice(0, 3)}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  TEAM ROW
// ═══════════════════════════════════════════════════

function TeamRow({ team, isFinished }: { team: Match["teamA"]; isFinished: boolean }) {
  const isWinner = team.winner === true;
  const isDimmed = isFinished && !isWinner && team.score !== undefined;

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
        isWinner ? "bg-[var(--accent)]/[0.04]" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <FlagBadge code={team.flagCode} />
        <span
          className={`text-[14px] truncate transition-colors ${
            isDimmed
              ? "text-[var(--secondary)] opacity-60 font-normal"
              : isWinner
              ? "text-[var(--foreground)] font-bold"
              : "text-[var(--foreground)] font-medium"
          }`}
        >
          {team.name}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {team.score !== undefined && (
          <span
            className={`text-[16px] tabular-nums ${
              isDimmed
                ? "text-[var(--secondary)] opacity-60 font-normal"
                : isWinner
                ? "text-[var(--foreground)] font-bold"
                : "text-[var(--foreground)] font-medium"
            }`}
          >
            {team.score}
            {team.penaltyScore !== undefined && (
              <span className="text-[12px] text-[var(--secondary)] ml-1">
                ({team.penaltyScore})
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  MATCH CARD
// ═══════════════════════════════════════════════════

function MatchCard({ match }: { match: Match }) {
  const isFinished = match.status === "finished_ft" || match.status === "finished_pens";
  const relativeLabel = getRelativeLabel(match.kickoffUTC);
  const dateDisplay = relativeLabel ?? formatKickoffIST(match.kickoffUTC);

  return (
    <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]/50 bg-[var(--background)]/50">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-mono font-semibold text-[var(--secondary)] uppercase tracking-wider truncate">
            {dateDisplay}
          </span>
          <span className="text-[10px] font-mono text-[var(--secondary)] opacity-60 truncate mt-0.5">
            {match.venue}
          </span>
        </div>
        <StatusPill match={match} />
      </div>

      {/* Teams */}
      <div className="flex flex-col py-2 px-1 gap-1 flex-1 justify-center">
        <TeamRow team={match.teamA} isFinished={isFinished} />
        <TeamRow team={match.teamB} isFinished={isFinished} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  BRACKET PRELOADER
// ═══════════════════════════════════════════════════

function BracketPreloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 4000; // 4 seconds
    const interval = 20; // update every 20ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, (currentStep / steps) * 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 200); // small delay after hitting 100%
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Easing function for smoother number tick
  const displayProgress = Math.floor(
    progress === 100 ? 100 : 100 * (1 - Math.pow(1 - progress / 100, 3))
  );

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="absolute inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--background)]"
    >
      <div className="relative flex flex-col items-center">
        {/* Logo Container */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-32 h-32 sm:w-48 sm:h-48 relative mb-8"
        >
          <Image 
            src="/WC.jpeg" 
            alt="FIFA World Cup 2026 Logo" 
            fill 
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>

        {/* Loading Bar & Counter */}
        <div className="flex flex-col items-center gap-3 w-48 sm:w-64">
          <div className="h-[2px] w-full bg-[var(--border-subtle)] overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-[var(--foreground)]"
              style={{ width: `${progress}%` }}
              layout
            />
          </div>
          <div className="flex w-full justify-between items-center text-[var(--secondary)] font-mono text-[10px] sm:text-xs uppercase tracking-widest">
            <span>Loading Data</span>
            <span className="text-[var(--foreground)] font-bold">{displayProgress}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════
//  MAIN EXPORT — BRACKET PAGE
// ═══════════════════════════════════════════════════

export default function BracketPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeRound, setActiveRound] = useState<RoundId>("R32");
  const [showPreloader, setShowPreloader] = useState(true);
  
  const pageRef = useRef<HTMLDivElement>(null);

  // Initial data fetch
  useEffect(() => {
    fetchBracketData().then((data) => {
      setMatches(data);
      setLastUpdated(new Date());
    });
  }, []);

  // Poll for live data
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await fetchBracketData();
      setMatches(data);
      setLastUpdated(new Date());
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // "Seconds ago" ticker
  useEffect(() => {
    if (!lastUpdated) return;
    const tick = () => setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    tick();
    const interval = setInterval(tick, 10_000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Handle Fullscreen tracking
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      pageRef.current?.requestFullscreen().catch((err) => console.warn(err));
    } else {
      document.exitFullscreen();
    }
  };

  const activeMatches = matches.filter((m) => m.round === activeRound);

  return (
    <div 
      ref={pageRef}
      className={`dark flex flex-col w-full relative ${
        isFullscreen 
          ? "h-screen bg-[var(--background)] fixed inset-0 z-[9999]" 
          : "min-h-[85vh] border-y md:border border-[var(--border-subtle)] rounded-none md:rounded-3xl overflow-hidden bg-[var(--background)] mt-0 md:mt-8 mb-16"
      }`}
    >
      {/* Preloader */}
      <AnimatePresence>
        {showPreloader && (
          <BracketPreloader onComplete={() => setShowPreloader(false)} />
        )}
      </AnimatePresence>

      {/* Main Bracket Content (Only fades in when loader is done) */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: showPreloader ? 0 : 1 }} 
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col h-full w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--surface)] z-10 sticky top-0">
        <div className="flex items-center gap-4 sm:gap-6">
          {!isFullscreen && (
            <Link 
              href="/"
              className="w-10 h-10 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--border-subtle)]/50 transition-colors shrink-0"
              aria-label="Back to home"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--foreground)]" />
            </Link>
          )}
          
          <div className="w-10 h-10 sm:w-12 sm:h-12 relative shrink-0 flex items-center justify-center">
            <Image 
              src="/WC.jpeg" 
              alt="FIFA World Cup 2026 Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-base sm:text-xl font-heading font-bold tracking-tight text-[var(--foreground)]">
              FIFA World Cup 2026
            </h1>
            <span className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-widest text-[var(--secondary)]">
              Scores & Fixtures
            </span>
          </div>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] transition-colors group"
        >
          {isFullscreen ? (
            <>
              <Minimize className="w-4 h-4 text-[var(--foreground)]" />
              <span className="text-[12px] font-semibold tracking-wide hidden sm:inline">Exit Fullscreen</span>
            </>
          ) : (
            <>
              <Maximize className="w-4 h-4 text-[var(--foreground)]" />
              <span className="text-[12px] font-semibold tracking-wide hidden sm:inline">Fullscreen</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="w-full border-b border-[var(--border-subtle)] bg-[var(--background)] sticky top-[72px] sm:top-[80px] z-10 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2 min-w-max">
          {ROUND_ORDER.map((roundId) => {
            const isActive = activeRound === roundId;
            return (
              <button
                key={roundId}
                onClick={() => setActiveRound(roundId)}
                className={`relative px-4 py-2.5 rounded-lg text-[13px] font-mono font-medium tracking-wide uppercase transition-colors ${
                  isActive ? "text-[var(--foreground)]" : "text-[var(--secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeRoundTab"
                    className="absolute inset-0 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg shadow-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{ROUND_LABELS[roundId]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area (Grid) */}
      <div className="flex-1 overflow-y-auto bg-[var(--background)] p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {matches.length > 0 ? (
            <motion.div
              key={activeRound}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6"
            >
              {activeMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
              {activeMatches.length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-[var(--secondary)]">
                  <span className="text-sm font-mono uppercase tracking-widest">No fixtures available yet</span>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="w-full h-40 flex items-center justify-center">
              <span className="text-[12px] font-mono text-[var(--secondary)] uppercase tracking-widest animate-pulse">
                Loading fixtures...
              </span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Legend */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-[var(--border-subtle)] shrink-0 bg-[var(--surface)] z-10 text-[9px] sm:text-[10px] font-mono text-[var(--secondary)] uppercase tracking-widest">
        <span>All times shown in IST</span>
        {lastUpdated && (
          <span>
            Updated{" "}
            {secondsAgo < 10
              ? "just now"
              : secondsAgo < 60
              ? `${secondsAgo}s ago`
              : `${Math.floor(secondsAgo / 60)}m ago`}
          </span>
        )}
      </div>
      </motion.div>
    </div>
  );
}
