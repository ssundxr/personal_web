import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // 1. Fetch the target URL (e.g. the Blogspot page)
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();

    // 2. Extract the iframe src
    // Look for <iframe ... id="streamFrame" ... src="URL" ...> or vice-versa
    
    // Pattern 1: id comes before src
    const regex1 = /<iframe[^>]*\bid=["']streamFrame["'][^>]*\bsrc=["']([^"']+)["']/i;
    // Pattern 2: src comes before id
    const regex2 = /<iframe[^>]*\bsrc=["']([^"']+)["'][^>]*\bid=["']streamFrame["']/i;
    
    let cleanUrl = null;
    let shakaStreamUrl = null;
    let shakaKeyId = null;
    let shakaKeyVal = null;
    
    // Look for direct MPD and ClearKey variables embedded in the page script
    // e.g. var url = "....mpd"; var ck_keyid = "..."; var ck_key = "...";
    const mpdMatch = html.match(/["'](https?:\/\/[^"']+\.mpd)["']/i);
    if (mpdMatch && mpdMatch[1]) {
      shakaStreamUrl = mpdMatch[1];
    }
    const keyIdMatch = html.match(/(?:ck_keyid|keyid|keyId)\s*=\s*["']([a-fA-F0-9]{32})["']/i);
    if (keyIdMatch && keyIdMatch[1]) {
      shakaKeyId = keyIdMatch[1];
    }
    const keyValMatch = html.match(/(?:ck_key|key|keyVal)\s*=\s*["']([a-fA-F0-9]{32})["']/i);
    if (keyValMatch && keyValMatch[1]) {
      shakaKeyVal = keyValMatch[1];
    }

    const match1 = html.match(regex1);
    if (match1 && match1[1]) {
      cleanUrl = match1[1];
    } else {
      const match2 = html.match(regex2);
      if (match2 && match2[1]) {
        cleanUrl = match2[1];
      }
    }

    // 3. Fallback: If no streamFrame ID is found, just grab the first iframe that points to github.io or contains 'mpd'
    // since the target player is usually hosted on github pages.
    if (!cleanUrl) {
      const fallbackRegex = /<iframe[^>]*\bsrc=["']([^"']*(?:github\.io|mpd)[^"']*)["']/i;
      const fallbackMatch = html.match(fallbackRegex);
      if (fallbackMatch && fallbackMatch[1]) {
        cleanUrl = fallbackMatch[1];
      }
    }

    if (!cleanUrl && !shakaStreamUrl) {
      // If we couldn't extract anything, just return the original URL so the player doesn't completely break
      return NextResponse.json({ cleanUrl: targetUrl });
    }

    // Return the cleanly extracted URL and any native player config found
    return NextResponse.json({ 
      cleanUrl: cleanUrl || targetUrl,
      shakaStreamUrl,
      shakaKeyId,
      shakaKeyVal
    });

  } catch (error: any) {
    console.error('Error in parse-stream API:', error);
    // On failure, fallback to returning the original URL
    return NextResponse.json({ cleanUrl: targetUrl });
  }
}
