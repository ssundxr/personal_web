"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Check, X, ShieldAlert, LogIn, Users, Clock, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Request = {
  id: string;
  name: string;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('stream_access_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (data) setRequests(data);
    if (error) console.error("Error fetching requests:", error);
  };

  useEffect(() => {
    if (session) {
      fetchRequests();
      
      // Subscribe to new requests
      const channel = supabase
        .channel('admin_requests')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'stream_access_requests' },
          () => fetchRequests()
        )
        .subscribe();
        
      // Track presence for admin dashboard
      const room = supabase.channel('watch_room');
      room.on('presence', { event: 'sync' }, () => {
        const state = room.presenceState();
        let count = 0;
        for (const key in state) {
          count += state[key].length;
        }
        setViewerCount(count);
      }).subscribe();

      return () => {
        supabase.removeChannel(channel);
        supabase.removeChannel(room);
      };
    }
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Login failed: " + error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { data, error } = await supabase
      .from('stream_access_requests')
      .update({ status })
      .eq('id', id)
      .select();
      
    if (error) {
      alert("Failed to update: " + error.message);
    } else if (data && data.length === 0) {
      alert("Access Denied: Your account does not have admin privileges. Please set role='admin' in the profiles table for your user.");
    } else {
      // Optimistically remove from UI
      setRequests(prev => prev.filter(req => req.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <span className="font-mono text-sm uppercase tracking-widest text-[var(--secondary)] animate-pulse">
          Authenticating...
        </span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4">
        <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border-subtle)] shadow-2xl flex flex-col items-center w-full max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-[var(--background)] border border-[var(--border-subtle)] flex items-center justify-center mb-6">
            <ShieldAlert className="w-6 h-6 text-[var(--secondary)]" />
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">Admin Gateway</h2>
          <p className="text-[var(--secondary)] text-sm text-center mb-8">
            Authenticate to manage broadcast access.
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <input 
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--background)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors"
            />
            <input 
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--background)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors"
            />
            <button 
              type="submit"
              className="w-full bg-[var(--foreground)] text-[var(--background)] rounded-xl py-3 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col pt-24 px-4 sm:px-8 pb-12 items-center">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-[var(--surface)] p-4 sm:p-6 rounded-2xl border border-[var(--border-subtle)]">
          <div className="flex items-center gap-4">
            <Link 
              href="/watch"
              className="w-10 h-10 rounded-xl bg-[var(--background)] border border-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--border-subtle)] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-heading text-xl font-bold">Access Control</h1>
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--secondary)]">
                Broadcast Admin
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-[var(--background)] px-4 py-2 rounded-lg border border-[var(--border-subtle)]">
              <Users className="w-4 h-4 text-green-500" />
              <span className="font-mono text-sm font-bold">{viewerCount} <span className="text-[var(--secondary)] font-normal text-xs ml-1">Live</span></span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="font-mono text-xs uppercase tracking-widest text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="flex flex-col gap-4">
          <h2 className="font-mono text-sm uppercase tracking-widest text-[var(--secondary)] pl-2">
            Pending Approvals ({requests.length})
          </h2>
          
          <AnimatePresence>
            {requests.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[var(--surface)] p-12 rounded-2xl border border-[var(--border-subtle)] flex flex-col items-center justify-center text-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--background)] flex items-center justify-center opacity-50">
                  <ShieldAlert className="w-5 h-5 text-[var(--secondary)]" />
                </div>
                <p className="text-[var(--secondary)] font-mono text-sm uppercase tracking-widest">
                  Queue is empty
                </p>
              </motion.div>
            ) : (
              requests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[var(--surface)] p-4 sm:p-6 rounded-2xl border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-heading text-lg font-bold">{req.name}</span>
                    <div className="flex items-center gap-2 font-mono text-xs text-[var(--secondary)] uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      {new Date(req.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateStatus(req.id, 'rejected')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors font-mono text-xs uppercase tracking-widest font-bold"
                    >
                      <X className="w-4 h-4" /> Deny
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, 'approved')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity font-mono text-xs uppercase tracking-widest font-bold"
                    >
                      <Check className="w-4 h-4" /> Grant
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
