"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Lock, Tv, Code, User, Users } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShakaPlayer } from "../../components/ui/ShakaPlayer";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Step = 'password' | 'name' | 'pending' | 'granted' | 'rejected';

export default function WatchPage() {
  const [step, setStep] = useState<Step>('password');
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  
  const [showSecretId, setShowSecretId] = useState(false);
  const [secretId, setSecretId] = useState("");

  const [viewerCount, setViewerCount] = useState(0);
  const [playerMode, setPlayerMode] = useState<"embedded" | "shaka">("embedded");

  const [config, setConfig] = useState<any>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);

  // Handle password submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "FifA@)@^") {
      setStep('name');
      setError(null);
    } else {
      setError("Incorrect password.");
      setPassword("");
    }
  };

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretId === "ashwinfejl102@gmail.com") {
      setName("Ashwin/Friend");
      setStep('granted');
      setError(null);
    } else {
      setError("Invalid Secret ID.");
    }
  };

  // Handle name submission
  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a valid name.");
      return;
    }
    setError(null);
    
    // Insert request into Supabase
    const { data, error: insertError } = await supabase
      .from('stream_access_requests')
      .insert([{ name: name.trim(), status: 'pending' }])
      .select()
      .single();

    if (insertError) {
      console.error("Failed to request access", insertError);
      setError(insertError.message || "Failed to connect to the server.");
      return;
    }

    if (data) {
      setRequestId(data.id);
      setStep('pending');
    }
  };

  // Subscribe to approval status if in pending state
  useEffect(() => {
    if (step === 'pending' && requestId) {
      const channel = supabase
        .channel(`request_${requestId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'stream_access_requests', filter: `id=eq.${requestId}` },
          (payload) => {
            const newStatus = payload.new.status;
            if (newStatus === 'approved') {
              setStep('granted');
            } else if (newStatus === 'rejected') {
              setStep('rejected');
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [step, requestId]);

  // Handle Presence for Viewer Count once granted
  useEffect(() => {
    if (step === 'granted') {
      const room = supabase.channel('watch_room');
      
      room
        .on('presence', { event: 'sync' }, () => {
          const state = room.presenceState();
          // Count total unique connections in the room
          let count = 0;
          for (const key in state) {
            count += state[key]?.length || 0;
          }
          setViewerCount(count);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await room.track({ 
              user: name || 'Anonymous', 
              online_at: new Date().toISOString() 
            });
          }
        });

      return () => {
        room.untrack();
        supabase.removeChannel(room);
      };
    }
  }, [step, name]);

  // Fetch dynamic stream config from Sanity once granted
  useEffect(() => {
    if (step === 'granted' && !config) {
      setIsLoadingConfig(true);
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
      const query = encodeURIComponent('*[_type == "liveStreamConfig"][0]');
      
      if (!projectId) {
        setIsLoadingConfig(false);
        return;
      }

      fetch(`https://${projectId}.api.sanity.io/v2023-05-03/data/query/${dataset}?query=${query}`)
        .then(res => res.json())
        .then(async data => {
          // Use Sanity CMS config, with the working mpd26wc44 link as the ultimate fallback
          const rawIframeUrl = data?.result?.iframeUrl || "https://mpd26wc44.blogspot.com/p/matchday01.html?m=1";
          const shakaStreamUrl = data?.result?.shakaStreamUrl || "https://qp-pldt-live-bpk-ucd-prod.akamaized.net/bpk-tv/fifa_ppv1/default/index.mpd";
          const shakaKeyId = data?.result?.shakaKeyId || "2c338a117d434ce4bbe3569231af90f1";
          const shakaKeyVal = data?.result?.shakaKeyVal || "a9633d901ee8a3f4f58ac314b5c5f4fb";

          // Pass the raw URL through our auto-extractor API to strip away Blogspot junk
          try {
            const parserRes = await fetch(`/api/parse-stream?url=${encodeURIComponent(rawIframeUrl)}`);
            const parserData = await parserRes.json();
            let finalIframeUrl = parserData.cleanUrl || rawIframeUrl;
            
            // Auto-convert standard YouTube URLs to Embed URLs
            if (finalIframeUrl.includes("youtube.com/watch?v=")) {
              const urlObj = new URL(finalIframeUrl);
              const videoId = urlObj.searchParams.get("v");
              if (videoId) finalIframeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            } else if (finalIframeUrl.includes("youtu.be/")) {
              const videoId = finalIframeUrl.split("youtu.be/")[1]?.split("?")[0];
              if (videoId) finalIframeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            }

            const isYouTube = finalIframeUrl.includes("youtube.com/embed");
            
            // If the extractor found native MPD+Keys on the page, use them and auto-switch to Native Player!
            if (parserData.shakaStreamUrl && parserData.shakaKeyId) {
              setPlayerMode("shaka");
            }
            
            setConfig({
              iframeUrl: finalIframeUrl,
              isYouTube,
              shakaStreamUrl: parserData.shakaStreamUrl || shakaStreamUrl,
              shakaKeyId: parserData.shakaKeyId || shakaKeyId,
              shakaKeyVal: parserData.shakaKeyVal || shakaKeyVal
            });
          } catch (e) {
            console.error("Auto-extractor failed, using raw URL", e);
            let fallbackUrl = rawIframeUrl;
            // Auto-convert standard YouTube URLs to Embed URLs
            if (fallbackUrl.includes("youtube.com/watch?v=")) {
              const urlObj = new URL(fallbackUrl);
              const videoId = urlObj.searchParams.get("v");
              if (videoId) fallbackUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            } else if (fallbackUrl.includes("youtu.be/")) {
              const videoId = fallbackUrl.split("youtu.be/")[1]?.split("?")[0];
              if (videoId) fallbackUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            }

            setConfig({
              iframeUrl: fallbackUrl,
              isYouTube: fallbackUrl.includes("youtube.com/embed"),
              shakaStreamUrl,
              shakaKeyId,
              shakaKeyVal
            });
          }
        })
        .catch(err => console.error("Error fetching stream config:", err))
        .finally(() => setIsLoadingConfig(false));
    }
  }, [step, config]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col pt-24 px-4 sm:px-8 pb-12 items-center">
      
      {/* Header */}
      <div className="w-full max-w-5xl mb-8 flex items-center justify-between">
        <Link 
          href="/bracket" 
          className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--border-subtle)]/50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[var(--foreground)]" />
        </Link>
        
        <div className="flex items-center gap-4">
          {step === 'granted' && (
            <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-full">
              <Users className="w-4 h-4 text-[var(--secondary)]" />
              <span className="font-mono text-xs font-bold">{viewerCount}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <h1 className="font-mono text-sm uppercase tracking-widest text-[var(--secondary)]">Live Broadcast</h1>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'password' && (
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md mt-16"
          >
            <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border-subtle)] shadow-2xl flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--background)] border border-[var(--border-subtle)] flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-[var(--secondary)]" />
              </div>
              <h2 className="font-heading text-2xl font-bold mb-2">Restricted Access</h2>
              <p className="text-[var(--secondary)] text-sm text-center mb-8">
                This stream is encrypted. Please enter the client access password to continue.
              </p>

              <form onSubmit={handlePasswordSubmit} className="w-full flex flex-col gap-4">
                <div>
                  <input 
                    type="password"
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    className={`w-full bg-[var(--background)] border ${error ? 'border-red-500' : 'border-[var(--border-subtle)]'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors`}
                  />
                  {error && <span className="text-red-500 text-xs mt-2 block pl-1">{error}</span>}
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[var(--foreground)] text-[var(--background)] rounded-xl py-3 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  Verify Access
                </button>
              </form>

              <div className="w-full mt-6">
                <button 
                  onClick={() => setShowSecretId(!showSecretId)}
                  className="text-[var(--secondary)] text-sm font-medium hover:text-[var(--foreground)] transition-colors underline underline-offset-4 leading-relaxed"
                >
                  yo u ashwin fejl or his homie? ask bro for the secret ID and drop it here fr 💀
                </button>
                
                <AnimatePresence>
                  {showSecretId && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      onSubmit={handleSecretSubmit} 
                      className="w-full flex flex-col gap-3 overflow-hidden"
                    >
                      <input 
                        type="text"
                        placeholder="Enter Secret ID..."
                        value={secretId}
                        onChange={(e) => {
                          setSecretId(e.target.value);
                          setError(null);
                        }}
                        className={`w-full bg-[var(--background)] border ${error && secretId ? 'border-red-500' : 'border-[var(--border-subtle)]'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors`}
                      />
                      <button 
                        type="submit"
                        className="w-full bg-[var(--accent)] text-white rounded-xl py-3 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                      >
                        Bypass
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}

        {step === 'name' && (
          <motion.div 
            key="name"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md mt-16"
          >
            <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border-subtle)] shadow-2xl flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--background)] border border-[var(--border-subtle)] flex items-center justify-center mb-6">
                <User className="w-6 h-6 text-[var(--secondary)]" />
              </div>
              <h2 className="font-heading text-2xl font-bold mb-2">Identify Yourself</h2>
              <p className="text-[var(--secondary)] text-sm text-center mb-8">
                Please provide your name to request access to the broadcast. The administrator must approve your request.
              </p>

              <form onSubmit={handleNameSubmit} className="w-full flex flex-col gap-4">
                <div>
                  <input 
                    type="text"
                    placeholder="Enter your name..."
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError(null);
                    }}
                    className={`w-full bg-[var(--background)] border ${error ? 'border-red-500' : 'border-[var(--border-subtle)]'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors`}
                  />
                  {error && <span className="text-red-500 text-xs mt-2 block pl-1">{error}</span>}
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[var(--foreground)] text-[var(--background)] rounded-xl py-3 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  Send Request
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'pending' && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md mt-16"
          >
            <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border-subtle)] shadow-2xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--background)] border border-[var(--border-subtle)] flex items-center justify-center mb-6 relative overflow-hidden">
                <div className="absolute inset-0 border-t-2 border-[var(--foreground)] rounded-2xl animate-spin opacity-50" />
                <Lock className="w-6 h-6 text-[var(--secondary)]" />
              </div>
              <h2 className="font-heading text-2xl font-bold mb-2">Request Pending</h2>
              <p className="text-[var(--secondary)] text-sm mb-4">
                Waiting for the administrator to approve your access request.
              </p>
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] animate-pulse">
                Do not close this page...
              </span>
            </div>
          </motion.div>
        )}

        {step === 'rejected' && (
          <motion.div
            key="rejected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mt-16"
          >
            <div className="bg-[var(--surface)] p-8 rounded-3xl border border-red-500/30 shadow-2xl flex flex-col items-center text-center">
              <h2 className="font-heading text-2xl font-bold mb-2 text-red-500">Access Denied</h2>
              <p className="text-[var(--secondary)] text-sm">
                Your request to view the broadcast has been rejected by the administrator.
              </p>
            </div>
          </motion.div>
        )}

        {step === 'granted' && (isLoadingConfig || !config) && (
          <motion.div
            key="loading-config"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-5xl flex items-center justify-center py-20"
          >
            <span className="font-mono text-[var(--secondary)] uppercase tracking-widest animate-pulse text-sm">
              Connecting to broadcast relay...
            </span>
          </motion.div>
        )}

        {step === 'granted' && config && (
          <motion.div
            key="player"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl flex flex-col gap-6"
          >
            {/* Player Toggle Controls */}
            <div className="flex items-center justify-between p-2 bg-[var(--surface)] rounded-xl border border-[var(--border-subtle)]">
              <button
                onClick={() => setPlayerMode("embedded")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-mono tracking-widest uppercase transition-colors ${playerMode === "embedded" ? "bg-[var(--background)] shadow-sm text-[var(--foreground)] border border-[var(--border-subtle)]" : "text-[var(--secondary)] hover:text-[var(--foreground)]"}`}
              >
                <Tv className="w-4 h-4" />
                UI Mask Mode
              </button>
              <button
                onClick={() => setPlayerMode("shaka")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-mono tracking-widest uppercase transition-colors ${playerMode === "shaka" ? "bg-[var(--background)] shadow-sm text-[var(--foreground)] border border-[var(--border-subtle)]" : "text-[var(--secondary)] hover:text-[var(--foreground)]"}`}
              >
                <Code className="w-4 h-4" />
                Native DRM Mode
              </button>
            </div>

            {/* Players */}
            <div className="w-full">
              {playerMode === "embedded" ? (
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-[var(--border-subtle)]">
                  {/* Iframe */}
                  <iframe 
                    src={config.iframeUrl} 
                    allow="encrypted-media; autoplay; fullscreen; picture-in-picture"
                    className="w-full h-full"
                    scrolling="no"
                  />
                  
                  {!config.isYouTube && (
                    <>
                      {/* Mask for Follow Us Button */}
                      <div className="absolute top-0 left-0 w-[150px] h-[60px] bg-black z-20 pointer-events-none" />
                      {/* Mask for Watermark */}
                      <div 
                        className="absolute bottom-[55px] left-1/2 -translate-x-1/2 w-[250px] h-[50px] z-20 pointer-events-none"
                        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)" }}
                      />
                    </>
                  )}
                </div>
              ) : (
                <ShakaPlayer 
                  streamUrl={config.shakaStreamUrl}
                  keyId={config.shakaKeyId}
                  keyVal={config.shakaKeyVal}
                />
              )}
            </div>
            
            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border-subtle)] flex flex-col sm:flex-row gap-4 text-xs font-mono text-[var(--secondary)]">
              <span className="uppercase text-[var(--accent)] shrink-0">System Notice:</span>
              <p>
                {playerMode === "embedded" 
                  ? "Currently using iframe UI masking to bypass CORS restrictions. Video controls are restricted." 
                  : "Currently decrypting the DASH stream directly using Shaka Player. If playback fails, switch back to Mask Mode."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

