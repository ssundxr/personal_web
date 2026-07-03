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

function FlagBadge({ code, flagUrl }: { code: string; flagUrl?: string }) {
  if (code === "TBD") {
    return (
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-dashed border-[var(--border-subtle)] bg-[var(--surface)]"
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
      {flagUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={flagUrl} alt={code} className="w-full h-full object-cover" />
      ) : (
        <span className="text-[9px] font-mono font-bold text-[var(--secondary)] uppercase select-none">
          {code.slice(0, 3)}
        </span>
      )}
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
        <FlagBadge code={team.flagCode} flagUrl={team.flagUrl} />
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

function MatchCard({ match, onClick }: { match: Match; onClick?: () => void }) {
  const isFinished = match.status === "finished_ft" || match.status === "finished_pens";
  const relativeLabel = getRelativeLabel(match.kickoffUTC);
  const dateDisplay = relativeLabel ?? formatKickoffIST(match.kickoffUTC);

  return (
    <div 
      onClick={onClick}
      className="group relative bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden w-full h-full cursor-pointer z-10"
    >
      {/* Dynamic Hover Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(200,160,100,0.15),transparent_70%)]" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]/50 bg-[var(--background)]/50 relative z-10">
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
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--background)]"
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
//  MATCH DETAILS SLIDE-OVER
// ═══════════════════════════════════════════════════

function MatchDetailsSlideOver({ match, onClose }: { match: Match; onClose: () => void }) {
  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-x-0 bottom-0 h-[85vh] rounded-t-3xl sm:inset-y-0 sm:right-0 sm:bottom-0 sm:left-auto sm:w-[480px] sm:h-full sm:rounded-none bg-[var(--surface)] shadow-2xl z-[10001] border-t sm:border-t-0 sm:border-l border-[var(--border-subtle)] flex flex-col overflow-y-auto"
      >
        <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between sticky top-0 bg-[var(--surface)]/90 backdrop-blur-md z-10">
          <h2 className="font-mono text-sm uppercase tracking-widest text-[var(--secondary)]">Match Details</h2>
          <button onClick={onClose} className="p-2 bg-[var(--background)] border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)]/50 rounded-full transition-colors flex items-center justify-center w-8 h-8 text-[var(--foreground)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-8">
          {/* Hero Matchup */}
          <div className="flex items-center justify-between py-6 px-4 bg-[var(--background)] rounded-2xl border border-[var(--border-subtle)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_70%)]" />
            <div className="flex flex-col items-center gap-3 z-10 w-1/3">
              <div className="w-16 h-12 bg-[var(--surface)] rounded shadow-sm border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden">
                {match.teamA.flagUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={match.teamA.flagUrl} alt={match.teamA.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-[var(--secondary)] font-bold">{match.teamA.flagCode}</span>
                )}
              </div>
              <span className="font-sans font-semibold text-center text-sm">{match.teamA.name}</span>
            </div>
            
            <div className="flex flex-col items-center z-10 w-1/3">
              <span className="font-mono text-3xl font-bold">{match.teamA.score ?? "-"} : {match.teamB.score ?? "-"}</span>
              {match.status === "scheduled" && <span className="text-[10px] uppercase tracking-wider text-[var(--accent)] mt-2">VS</span>}
            </div>

            <div className="flex flex-col items-center gap-3 z-10 w-1/3">
              <div className="w-16 h-12 bg-[var(--surface)] rounded shadow-sm border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden">
                {match.teamB.flagUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={match.teamB.flagUrl} alt={match.teamB.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-[var(--secondary)] font-bold">{match.teamB.flagCode}</span>
                )}
              </div>
              <span className="font-sans font-semibold text-center text-sm">{match.teamB.name}</span>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border-subtle)]">
              <p className="text-[10px] uppercase tracking-wider text-[var(--secondary)] mb-1">Stadium</p>
              <p className="font-sans text-sm font-medium">{match.venue}</p>
            </div>
            <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border-subtle)]">
              <p className="text-[10px] uppercase tracking-wider text-[var(--secondary)] mb-1">Date & Time</p>
              <p className="font-sans text-sm font-medium">{formatKickoffIST(match.kickoffUTC)}</p>
            </div>
          </div>

          {/* Watch Match Link (Final Only) */}
          {match.round === "F" && (
            <div className="flex flex-col gap-3">
              <Link 
                href="/watch" 
                className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Watch Live Stream
              </Link>
            </div>
          )}

          {/* Mock Lineups / Live Event Feed placeholder */}
          <div className="flex flex-col gap-3">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--secondary)] border-b border-[var(--border-subtle)] pb-2">Live Match Feed</h3>
            <div className="flex items-center gap-4 text-sm text-[var(--foreground)] opacity-70 italic py-8 justify-center">
              Awaiting official API live events...
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════════════════
//  MAIN EXPORT — BRACKET PAGE
// ═══════════════════════════════════════════════════

export default function BracketPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeRound, setActiveRound] = useState<RoundId>("R32");
  const [showPreloader, setShowPreloader] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
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
        {/* News Ticker */}
        <div className="w-full bg-[var(--accent)] text-black overflow-hidden border-b border-[var(--border-subtle)] flex items-center py-1.5 shrink-0">
          <div className="w-20 shrink-0 bg-[var(--accent)] text-black font-mono text-[10px] sm:text-xs font-bold px-4 z-10 flex items-center">
            LIVE 
            <span className="w-2 h-2 rounded-full bg-red-600 ml-2 animate-pulse" />
          </div>
          <div className="flex-1 overflow-hidden relative flex whitespace-nowrap">
            <motion.div 
              animate={{ x: ["100%", "-100%"] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="font-mono text-[10px] sm:text-xs uppercase tracking-wider"
            >
              API STREAM CONNECTED — FETCHING REAL-TIME 2026 WORLD CUP METADATA — POWERED BY FOOTBALL-DATA.ORG
            </motion.div>
          </div>
        </div>

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
              {activeMatches.map((match, i) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <MatchCard match={match} onClick={() => setSelectedMatch(match)} />
                </motion.div>
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

      {/* Slide Over Panel */}
      <AnimatePresence>
        {selectedMatch && (
          <MatchDetailsSlideOver 
            match={selectedMatch} 
            onClose={() => setSelectedMatch(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
