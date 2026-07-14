import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side stream proxy.
 * Routes CDN requests through our own server so we can set proper
 * Referer / Origin headers that Akamai and other CDNs expect.
 */
export async function GET(req: NextRequest) {
  const targetUrl = req.nextUrl.searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Safety: prevent recursive proxy calls
  if (targetUrl.includes("/api/stream-proxy")) {
    return NextResponse.json({ error: "Recursive proxy detected" }, { status: 400 });
  }

  // Reject localhost URLs — these are bad relative resolutions
  if (targetUrl.includes("localhost")) {
    return NextResponse.json({ error: "Cannot proxy localhost URLs" }, { status: 400 });
  }

  try {
    const parsedUrl = new URL(targetUrl);

    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": parsedUrl.origin + "/",
      "Origin": parsedUrl.origin,
    };

    const response = await fetch(targetUrl, {
      headers,
      // @ts-ignore — Next.js extended fetch options
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Proxy upstream error ${response.status} for ${targetUrl}:`, body.substring(0, 300));
      return new NextResponse(`Upstream returned ${response.status}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";

    // For manifest files, just pass through — the client-side response filter
    // handles URL resolution by rewriting response.uri to the real CDN URL.
    if (
      contentType.includes("dash+xml") ||
      contentType.includes("xml") ||
      targetUrl.endsWith(".mpd")
    ) {
      const text = await response.text();
      return new NextResponse(text, {
        status: 200,
        headers: {
          "Content-Type": "application/dash+xml",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        },
      });
    }

    // For segments, stream through
    const body = response.body;
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    console.error("Stream proxy error:", err);
    return NextResponse.json(
      { error: "Proxy fetch failed", details: err.message },
      { status: 502 }
    );
  }
}
