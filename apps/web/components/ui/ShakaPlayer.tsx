"use client";

import { useEffect, useRef, useState } from "react";

// Need to import Shaka dynamically or via script tag to avoid SSR issues
// For React/Next.js, it's often easiest to just load the library script if not bundled.
// Or we can assume shaka-player is installed? 
// Let's use a script tag injector or just import if installed.
// Since we don't want to mess with npm install if we don't have to, let's load it dynamically.

export function ShakaPlayer({ streamUrl, keyId, keyVal }: { streamUrl: string, keyId: string, keyVal: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Shaka Player scripts dynamically
    const loadShaka = async () => {
      if ((window as any).shaka) {
        setIsLoaded(true);
        return;
      }

      const script1 = document.createElement("script");
      script1.src = "https://cdn.jsdelivr.net/npm/shaka-player@4.16.2/dist/shaka-player.ui.min.js";
      script1.async = true;

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/shaka-player@4.16.2/dist/controls.min.css";
      
      document.head.appendChild(link);
      document.head.appendChild(script1);

      script1.onload = () => setIsLoaded(true);
    };

    loadShaka();
  }, []);

  useEffect(() => {
    if (!isLoaded || !(window as any).shaka || !videoRef.current || !containerRef.current) return;

    const shaka = (window as any).shaka;
    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      setError("Browser not supported!");
      return;
    }

    const player = new shaka.Player();
    
    // Attach player to video element
    player.attach(videoRef.current).then(() => {
      const ui = new shaka.ui.Overlay(player, containerRef.current, videoRef.current);
      ui.configure({
        controlPanelElements: [
          'play_pause', 'mute', 'volume', 'time_and_duration', 'spacer', 'picture_in_picture', 'quality', 'fullscreen'
        ],
      });

      const playerConfig: any = {
        streaming: {
          lowLatencyMode: true,
          jumpLargeGaps: true
        }
      };

      if (keyId && keyVal) {
        playerConfig.drm = {
          clearKeys: {
            [keyId]: keyVal
          }
        };
      }

      player.configure(playerConfig);

      player.load(streamUrl).then(() => {
        console.log("Shaka stream loaded successfully.");
        videoRef.current?.play().catch(() => console.log("Autoplay blocked"));
      }).catch((e: any) => {
        console.error("Shaka load error:", e);
        setError("Error loading DRM stream. It may be blocked or expired.");
      });
    });

    return () => {
      player.destroy();
    };
  }, [isLoaded, streamUrl, keyId, keyVal]);

  return (
    <div className="w-full aspect-video bg-black relative shadow-2xl rounded-xl overflow-hidden border border-[var(--border-subtle)]">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 text-red-500 font-mono text-sm px-8 text-center">
          {error}
        </div>
      )}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-40 text-[var(--secondary)] font-mono animate-pulse">
          Initializing DRM Player...
        </div>
      )}
      <div ref={containerRef} className="absolute inset-0 flex items-center justify-center">
        <video ref={videoRef} className="w-full h-full object-contain" autoPlay playsInline />
      </div>
    </div>
  );
}
