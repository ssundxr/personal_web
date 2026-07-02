// ─── FIFA World Cup 2026 — Bracket Type Definitions ───

export type RoundId = "R32" | "R16" | "QF" | "SF" | "F";

export type MatchStatus =
  | "scheduled"
  | "live"
  | "finished_ft"
  | "finished_pens";

export interface Team {
  name: string;
  flagCode: string; // 3-letter ISO code (e.g. "CAN", "MAR")
  score?: number;
  penaltyScore?: number;
  winner?: boolean;
}

export interface Match {
  id: string;
  round: RoundId;
  kickoffUTC: string; // ISO 8601 UTC timestamp
  venue: string;
  status: MatchStatus;
  teamA: Team;
  teamB: Team;
  feedsIntoMatchId?: string; // next-round match this winner advances to
}

export const ROUND_LABELS: Record<RoundId, string> = {
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-Finals",
  SF: "Semi-Finals",
  F: "Final",
};

export const ROUND_ORDER: RoundId[] = ["R32", "R16", "QF", "SF", "F"];
