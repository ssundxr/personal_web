import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.FOOTBALL_DATA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    // Attempt to fetch 2026 World Cup Matches
    // WC is the competition code for World Cup. 
    // If the 2026 season is not available, it might fallback to 2022. 
    // In our frontend service, we'll check the returned data and use it only if it's 2026.
    const res = await fetch("https://api.football-data.org/v4/competitions/WC/matches?season=2026", {
      headers: {
        "X-Auth-Token": apiKey,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Football API Error:", error);
    return NextResponse.json({ error: "Failed to fetch live data" }, { status: 500 });
  }
}
