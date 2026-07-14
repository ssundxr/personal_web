"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ShakaPlayerProps {
  streamUrl: string;
  keyId?: string | null;
  keyVal?: string | null;
  useProxy?: boolean;
}

export function ShakaPlayer({ streamUrl, keyId, keyVal, useProxy = true }: ShakaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Initializing DRM Player...");

  useEffect(() => {
    // Load Shaka Player scripts dynamically
    const loadShaka = async () => {
      if ((window as any).shaka) {
        setIsLoaded(true);
        return;
      }

      const script1 = document.createElement("script");
      script1.src = "https://cdn.jsdelivr.net/npm/shaka-player@5.2.1/dist/shaka-player.ui.min.js";
      script1.async = true;

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/shaka-player@5.2.1/dist/controls.min.css";
      
      document.head.appendChild(link);
      document.head.appendChild(script1);

      script1.onload = () => {
        console.log("Shaka Player script loaded.");
        setIsLoaded(true);
      };
      script1.onerror = () => {
        console.error("Failed to load Shaka Player script.");
        setError("Failed to load video player engine.");
      };
    };

    loadShaka();
  }, []);

  const initPlayer = useCallback(async (useDrm: boolean) => {
    if (!(window as any).shaka || !videoRef.current || !containerRef.current) return;

    const shaka = (window as any).shaka;
    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      setError("Browser not supported!");
      return;
    }

    // Clean up old player
    if (playerRef.current) {
      await playerRef.current.destroy();
      playerRef.current = null;
    }

    const player = new shaka.Player();
    playerRef.current = player;

    try {
      await player.attach(videoRef.current);
    } catch (attachErr: any) {
      console.error("Shaka attach error:", attachErr);
      setError("Failed to initialize video player.");
      return;
    }

    const ui = new shaka.ui.Overlay(player, containerRef.current, videoRef.current);
    ui.configure({
      controlPanelElements: [
        'play_pause', 'mute', 'volume', 'time_and_duration', 'spacer', 'picture_in_picture', 'quality', 'fullscreen'
      ],
    });

    const playerConfig: any = {
      streaming: {
        lowLatencyMode: true,
        bufferingGoal: 10,
        rebufferingGoal: 2,
        inaccurateManifestTolerance: 0,
        retryParameters: {
          maxAttempts: 5,
          baseDelay: 1000,
          backoffFactor: 2,
        }
      },
      manifest: {
        dash: {
          ignoreMinBufferTime: true
        },
        retryParameters: {
          maxAttempts: 5,
          baseDelay: 1000,
          backoffFactor: 2,
        }
      },
      drm: {
        retryParameters: {
          maxAttempts: 5,
          baseDelay: 1000,
          backoffFactor: 2,
        }
      }
    };

    if (useDrm && keyId && keyVal) {
      playerConfig.drm = {
        ...playerConfig.drm,
        clearKeys: {
          [keyId]: keyVal
        }
      };
      setStatus("Decrypting with ClearKey DRM...");
    } else {
      setStatus("Loading stream (no DRM)...");
    }

    player.configure(playerConfig);

    // Listen for errors
    player.addEventListener('error', (event: any) => {
      const d = event.detail;
      console.error("Shaka player error event — code:", d?.code, "category:", d?.category, "severity:", d?.severity, "data:", d?.data, "message:", d?.message);
    });

    if (useProxy) {
      // Network request filter — route external URLs through our server-side proxy
      const cdnBaseUrl = streamUrl.substring(0, streamUrl.lastIndexOf("/") + 1);
      
      player.getNetworkingEngine().registerRequestFilter(
        (type: number, request: any) => {
          if (request.uris && request.uris.length > 0) {
            request.uris = request.uris.map((uri: string) => {
              if (uri.startsWith("data:")) return uri;

              // Unwrap any nested proxy URLs to get the real CDN URL
              let realUrl = uri;
              let safety = 0;
              while (realUrl.includes("/api/stream-proxy") && safety < 20) {
                safety++;
                try {
                  const u = new URL(realUrl, window.location.origin);
                  const inner = u.searchParams.get("url");
                  if (inner && inner !== realUrl) {
                    realUrl = inner;
                  } else {
                    break;
                  }
                } catch {
                  break;
                }
              }

              // If it's already an absolute CDN URL, proxy it
              if (realUrl.startsWith("http://") || realUrl.startsWith("https://")) {
                if (!realUrl.includes("localhost")) {
                  return `/api/stream-proxy?url=${encodeURIComponent(realUrl)}`;
                }
              }

              // Handle localhost URLs — these are segments that Shaka resolved
              // against the proxy URL path instead of the CDN. Ignore them and
              // let the response filter fix resolution (see below).
              if (uri.includes("localhost") || uri.startsWith("/api/dash") || uri.startsWith("/dash")) {
                return uri;
              }

              return uri;
            });
          }
          return Promise.resolve();
        }
      );

      // Response filter — tell Shaka the REAL CDN URL for the manifest response.
      player.getNetworkingEngine().registerResponseFilter(
        (type: number, response: any) => {
          if (response.uri && response.uri.includes("/api/stream-proxy")) {
            try {
              const u = new URL(response.uri, window.location.origin);
              const realUrl = u.searchParams.get("url");
              if (realUrl) {
                response.uri = realUrl;
              }
            } catch {}
          }
          return Promise.resolve();
        }
      );
    }

    // Load stream
    const loadUrl = useProxy ? `/api/stream-proxy?url=${encodeURIComponent(streamUrl)}` : streamUrl;
    console.log(`Loading stream (DRM: ${useDrm}, Proxy: ${useProxy}):`, loadUrl);

    try {
      await player.load(loadUrl);
      console.log(`Shaka stream loaded successfully ${useProxy ? 'via proxy' : 'directly'}.`);
      setError(null);
      setStatus("");
      videoRef.current?.play().catch(() => console.log("Autoplay blocked"));
    } catch (e: any) {
      console.error("Shaka load error:", e.code, e.category, e.data);

      // If DRM failed, try again without DRM
      if (useDrm && (e.code === 4032 || e.code === 4001 || e.category === 4)) {
        console.log("ClearKey DRM failed, retrying without DRM...");
        setStatus("ClearKey failed. Retrying without DRM...");
        await player.destroy();
        playerRef.current = null;
        // Small delay then retry without DRM
        setTimeout(() => initPlayer(false), 500);
        return;
      }

      // Show the actual error
      let errorMsg = `Stream Error (Code: ${e.code || 'unknown'})`;
      if (e.code === 1001) {
        errorMsg = "Network error — the stream server blocked the request. The stream may have expired or be geo-blocked.";
      } else if (e.code === 3016 || e.code === 3014) {
        errorMsg = "Content parsing error — the stream format is not supported.";
      } else if (e.code === 4012 || e.code === 4032 || e.category === 4) {
        errorMsg = "This stream uses Widevine DRM (industrial encryption). ClearKey cannot decrypt it. Use UI Mask Mode instead.";
      }
      setError(errorMsg);
    }
  }, [streamUrl, keyId, keyVal]);

  useEffect(() => {
    if (!isLoaded) return;
    
    // Start with DRM if keys are provided, otherwise without
    const useDrm = !!(keyId && keyVal);
    initPlayer(useDrm);

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isLoaded, streamUrl, keyId, keyVal, initPlayer]);

  return (
    <div className="w-full aspect-video bg-black relative shadow-2xl rounded-xl overflow-hidden border border-[var(--border-subtle)]">
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50 px-8 text-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          </div>
          <span className="text-red-400 font-mono text-sm leading-relaxed max-w-md">{error}</span>
          <span className="text-[var(--secondary)] text-xs font-mono opacity-70">↑ Switch to UI Mask Mode above for a working fallback</span>
        </div>
      )}
      {status && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-40 gap-3">
          <div className="w-8 h-8 border-2 border-[var(--secondary)] border-t-[var(--foreground)] rounded-full animate-spin" />
          <span className="text-[var(--secondary)] font-mono text-sm">{status}</span>
        </div>
      )}
      <div ref={containerRef} className="absolute inset-0 flex items-center justify-center">
        <video ref={videoRef} className="w-full h-full object-contain" autoPlay playsInline />
      </div>
    </div>
  );
}
