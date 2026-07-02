// ─── FIFA World Cup 2026 — Bracket Data Service ───
// PLACEHOLDER DATA — replace via fetchBracketData() with a real live API before production.

import type { Match, Team } from "./fifaBracketTypes";

// ─── IST Formatter ───
// Converts an ISO 8601 UTC timestamp to a human-readable IST string.
// Example output: "Sat, 28 Jun, 5:00 PM IST"
export function formatKickoffIST(utcISO: string): string {
  const d = new Date(utcISO);
  if (isNaN(d.getTime())) return "TBD";

  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const parts = formatter.formatToParts(d);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const weekday = get("weekday");
  const day = get("day");
  const month = get("month");
  const hour = get("hour");
  const minute = get("minute");
  const dayPeriod = get("dayPeriod").toUpperCase();

  return `${weekday}, ${day} ${month}, ${hour}:${minute} ${dayPeriod} IST`;
}

// ─── Relative date label ───
export function getRelativeLabel(utcISO: string): string | null {
  const d = new Date(utcISO);
  if (isNaN(d.getTime())) return null;

  const now = new Date();
  // Convert both to IST date strings for comparison
  const fmt = (date: Date) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(date);
  const matchDate = fmt(d);
  const today = fmt(now);
  const yesterday = fmt(new Date(now.getTime() - 86_400_000));
  const tomorrow = fmt(new Date(now.getTime() + 86_400_000));

  if (matchDate === today) return "Today";
  if (matchDate === yesterday) return "Yesterday";
  if (matchDate === tomorrow) return "Tomorrow";
  return null;
}

// ─── Helper to build team objects ───
function t(
  name: string,
  code: string,
  score?: number,
  penaltyScore?: number,
  winner?: boolean
): Team {
  return { name, flagCode: code, score, penaltyScore, winner };
}

// ─── Placeholder match data ───
// Accurate as of tournament Round of 16 stage.
const PLACEHOLDER_MATCHES: Match[] = [
  // ═══════════ ROUND OF 32 (completed) ═══════════
  {
    id: "R32-1",
    round: "R32",
    kickoffUTC: "2026-06-28T11:30:00Z",
    venue: "MetLife Stadium, NJ",
    status: "finished_ft",
    teamA: t("South Africa", "ZAF", 0),
    teamB: t("Canada", "CAN", 1, undefined, true),
    feedsIntoMatchId: "R16-1",
  },
  {
    id: "R32-2",
    round: "R32",
    kickoffUTC: "2026-06-28T15:30:00Z",
    venue: "Mercedes-Benz Stadium, ATL",
    status: "finished_pens",
    teamA: t("Netherlands", "NLD", 1, 2),
    teamB: t("Morocco", "MAR", 1, 3, true),
    feedsIntoMatchId: "R16-1",
  },
  {
    id: "R32-3",
    round: "R32",
    kickoffUTC: "2026-06-29T11:30:00Z",
    venue: "AT&T Stadium, DAL",
    status: "finished_pens",
    teamA: t("Germany", "DEU", 1, 3),
    teamB: t("Paraguay", "PRY", 1, 4, true),
    feedsIntoMatchId: "R16-2",
  },
  {
    id: "R32-4",
    round: "R32",
    kickoffUTC: "2026-06-29T15:30:00Z",
    venue: "Hard Rock Stadium, MIA",
    status: "finished_ft",
    teamA: t("France", "FRA", 3, undefined, true),
    teamB: t("Sweden", "SWE", 0),
    feedsIntoMatchId: "R16-2",
  },
  {
    id: "R32-5",
    round: "R32",
    kickoffUTC: "2026-06-30T11:30:00Z",
    venue: "NRG Stadium, HOU",
    status: "finished_ft",
    teamA: t("Belgium", "BEL", 3, undefined, true),
    teamB: t("Senegal", "SEN", 2),
    feedsIntoMatchId: "R16-3",
  },
  {
    id: "R32-6",
    round: "R32",
    kickoffUTC: "2026-06-30T15:30:00Z",
    venue: "Lincoln Financial Field, PHI",
    status: "finished_ft",
    teamA: t("USA", "USA", 2, undefined, true),
    teamB: t("Bosnia and Herzegovina", "BIH", 0),
    feedsIntoMatchId: "R16-3",
  },
  {
    id: "R32-7",
    round: "R32",
    kickoffUTC: "2026-07-01T11:30:00Z",
    venue: "Levi's Stadium, SF",
    status: "finished_ft",
    teamA: t("Portugal", "PRT", 2, undefined, true),
    teamB: t("Croatia", "HRV", 1),
    feedsIntoMatchId: "R16-4",
  },
  {
    id: "R32-8",
    round: "R32",
    kickoffUTC: "2026-07-01T15:30:00Z",
    venue: "Lumen Field, SEA",
    status: "finished_ft",
    teamA: t("Spain", "ESP", 3, undefined, true),
    teamB: t("Austria", "AUT", 0),
    feedsIntoMatchId: "R16-4",
  },
  {
    id: "R32-9",
    round: "R32",
    kickoffUTC: "2026-07-01T19:30:00Z",
    venue: "SoFi Stadium, LA",
    status: "finished_ft",
    teamA: t("Argentina", "ARG", 2, undefined, true),
    teamB: t("Australia", "AUS", 0),
    feedsIntoMatchId: "R16-5",
  },
  {
    id: "R32-10",
    round: "R32",
    kickoffUTC: "2026-07-01T23:30:00Z",
    venue: "BC Place, VAN",
    status: "finished_ft",
    teamA: t("Japan", "JPN", 1, undefined, true),
    teamB: t("Nigeria", "NGA", 0),
    feedsIntoMatchId: "R16-5",
  },
  {
    id: "R32-11",
    round: "R32",
    kickoffUTC: "2026-07-02T11:30:00Z",
    venue: "Gillette Stadium, BOS",
    status: "finished_ft",
    teamA: t("England", "ENG", 2, undefined, true),
    teamB: t("Ivory Coast", "CIV", 0),
    feedsIntoMatchId: "R16-6",
  },
  {
    id: "R32-12",
    round: "R32",
    kickoffUTC: "2026-07-02T15:30:00Z",
    venue: "Arrowhead Stadium, KC",
    status: "finished_ft",
    teamA: t("Colombia", "COL", 1, undefined, true),
    teamB: t("Denmark", "DNK", 0),
    feedsIntoMatchId: "R16-6",
  },
  {
    id: "R32-13",
    round: "R32",
    kickoffUTC: "2026-07-02T19:30:00Z",
    venue: "BMO Field, TOR",
    status: "scheduled",
    teamA: t("Mexico", "MEX"),
    teamB: t("Ecuador", "ECU"),
    feedsIntoMatchId: "R16-7",
  },
  {
    id: "R32-14",
    round: "R32",
    kickoffUTC: "2026-07-02T23:30:00Z",
    venue: "Estadio Azteca, MEX",
    status: "scheduled",
    teamA: t("Italy", "ITA"),
    teamB: t("Chile", "CHL"),
    feedsIntoMatchId: "R16-7",
  },
  {
    id: "R32-15",
    round: "R32",
    kickoffUTC: "2026-07-03T11:30:00Z",
    venue: "Estadio Akron, GUA",
    status: "scheduled",
    teamA: t("Brazil", "BRA"),
    teamB: t("Wales", "WAL"),
    feedsIntoMatchId: "R16-8",
  },
  {
    id: "R32-16",
    round: "R32",
    kickoffUTC: "2026-07-03T15:30:00Z",
    venue: "Estadio BBVA, MON",
    status: "scheduled",
    teamA: t("Uruguay", "URY"),
    teamB: t("Peru", "PER"),
    feedsIntoMatchId: "R16-8",
  },

  // ═══════════ ROUND OF 16 ═══════════
  {
    id: "R16-1",
    round: "R16",
    kickoffUTC: "2026-07-04T14:30:00Z",
    venue: "MetLife Stadium, NJ",
    status: "scheduled",
    teamA: t("Canada", "CAN"),
    teamB: t("Morocco", "MAR"),
    feedsIntoMatchId: "QF-1",
  },
  {
    id: "R16-2",
    round: "R16",
    kickoffUTC: "2026-07-05T14:30:00Z",
    venue: "AT&T Stadium, DAL",
    status: "scheduled",
    teamA: t("Paraguay", "PRY"),
    teamB: t("France", "FRA"),
    feedsIntoMatchId: "QF-1",
  },
  {
    id: "R16-3",
    round: "R16",
    kickoffUTC: "2026-07-06T14:30:00Z",
    venue: "NRG Stadium, HOU",
    status: "scheduled",
    teamA: t("USA", "USA"),
    teamB: t("Belgium", "BEL"),
    feedsIntoMatchId: "QF-2",
  },
  {
    id: "R16-4",
    round: "R16",
    kickoffUTC: "2026-07-06T19:30:00Z",
    venue: "Levi's Stadium, SF",
    status: "scheduled",
    teamA: t("Portugal", "PRT"),
    teamB: t("Spain", "ESP"),
    feedsIntoMatchId: "QF-2",
  },
  {
    id: "R16-5",
    round: "R16",
    kickoffUTC: "2026-07-07T14:30:00Z",
    venue: "Mercedes-Benz Stadium, ATL",
    status: "scheduled",
    teamA: t("Argentina", "ARG"),
    teamB: t("Japan", "JPN"),
    feedsIntoMatchId: "QF-3",
  },
  {
    id: "R16-6",
    round: "R16",
    kickoffUTC: "2026-07-07T19:30:00Z",
    venue: "Hard Rock Stadium, MIA",
    status: "scheduled",
    teamA: t("England", "ENG"),
    teamB: t("Colombia", "COL"),
    feedsIntoMatchId: "QF-3",
  },
  {
    id: "R16-7",
    round: "R16",
    kickoffUTC: "2026-07-08T14:30:00Z",
    venue: "Lincoln Financial Field, PHI",
    status: "scheduled",
    teamA: t("TBD", "TBD"),
    teamB: t("TBD", "TBD"),
    feedsIntoMatchId: "QF-4",
  },
  {
    id: "R16-8",
    round: "R16",
    kickoffUTC: "2026-07-08T19:30:00Z",
    venue: "Lumen Field, SEA",
    status: "scheduled",
    teamA: t("TBD", "TBD"),
    teamB: t("TBD", "TBD"),
    feedsIntoMatchId: "QF-4",
  },

  // ═══════════ QUARTER-FINALS ═══════════
  {
    id: "QF-1",
    round: "QF",
    kickoffUTC: "2026-07-10T14:30:00Z",
    venue: "SoFi Stadium, LA",
    status: "scheduled",
    teamA: t("TBD", "TBD"),
    teamB: t("TBD", "TBD"),
    feedsIntoMatchId: "SF-1",
  },
  {
    id: "QF-2",
    round: "QF",
    kickoffUTC: "2026-07-10T19:30:00Z",
    venue: "Gillette Stadium, BOS",
    status: "scheduled",
    teamA: t("TBD", "TBD"),
    teamB: t("TBD", "TBD"),
    feedsIntoMatchId: "SF-1",
  },
  {
    id: "QF-3",
    round: "QF",
    kickoffUTC: "2026-07-11T14:30:00Z",
    venue: "AT&T Stadium, DAL",
    status: "scheduled",
    teamA: t("TBD", "TBD"),
    teamB: t("TBD", "TBD"),
    feedsIntoMatchId: "SF-2",
  },
  {
    id: "QF-4",
    round: "QF",
    kickoffUTC: "2026-07-11T19:30:00Z",
    venue: "Arrowhead Stadium, KC",
    status: "scheduled",
    teamA: t("TBD", "TBD"),
    teamB: t("TBD", "TBD"),
    feedsIntoMatchId: "SF-2",
  },

  // ═══════════ SEMI-FINALS ═══════════
  {
    id: "SF-1",
    round: "SF",
    kickoffUTC: "2026-07-14T23:30:00Z",
    venue: "MetLife Stadium, NJ",
    status: "scheduled",
    teamA: t("TBD", "TBD"),
    teamB: t("TBD", "TBD"),
    feedsIntoMatchId: "F-1",
  },
  {
    id: "SF-2",
    round: "SF",
    kickoffUTC: "2026-07-15T23:30:00Z",
    venue: "Hard Rock Stadium, MIA",
    status: "scheduled",
    teamA: t("TBD", "TBD"),
    teamB: t("TBD", "TBD"),
    feedsIntoMatchId: "F-1",
  },

  // ═══════════ FINAL ═══════════
  {
    id: "F-1",
    round: "F",
    kickoffUTC: "2026-07-19T19:00:00Z",
    venue: "MetLife Stadium, New York/New Jersey",
    status: "scheduled",
    teamA: t("TBD", "TBD"),
    teamB: t("TBD", "TBD"),
  },
];

// ─── Data Fetcher ───
// Single swap-point: replace the body of this function with a real API call.
// The rest of the UI only calls this function and expects Match[] back.
export async function fetchBracketData(): Promise<Match[]> {
  // TODO: Replace with actual API fetch, e.g.:
  // const res = await fetch("https://your-api.com/bracket");
  // const raw = await res.json();
  // return parseBracketResponse(raw);

  // For now, return the static placeholder data.
  return PLACEHOLDER_MATCHES;
}
