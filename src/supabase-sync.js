// supabase-sync.js
// Place at: p6-maths/src/supabase-sync.js
//
// Handles real-time sync between student app and parent dashboard.
// Import this into p6-prep-maths.jsx and call the hooks.

import { createClient } from "@supabase/supabase-js";

// ─── CLIENT ───────────────────────────────────────────────────────────────────
// Keys come from Vercel environment variables (set in Vercel dashboard)
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || "";
const SUPABASE_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

const TABLE = "student_progress";

// ─── GET UID ──────────────────────────────────────────────────────────────────
// Each student has a random uid stored in localStorage.
// This is the key that links their device to Supabase.
export function getUid() {
  let uid = localStorage.getItem("p6prep_uid");
  if (!uid) {
    uid = Math.random().toString(36).slice(2, 10);
    localStorage.setItem("p6prep_uid", uid);
  }
  return uid;
}

// ─── PUSH PROGRESS ────────────────────────────────────────────────────────────
// Call this after every state change to sync to Supabase.
// Uses upsert so first push creates the row, subsequent pushes update it.
export async function pushProgress(state) {
  if (!supabase) return; // Supabase not configured — silent no-op

  const uid  = getUid();
  const name = state.profile?.name || localStorage.getItem("p6prep_name") || "Student";

  const { error } = await supabase
    .from(TABLE)
    .upsert({
      uid,
      name,
      data: state,
    }, { onConflict: "uid" });

  if (error) console.warn("Supabase push failed:", error.message);
}

// ─── PULL PROGRESS ────────────────────────────────────────────────────────────
// Call on app mount to restore state from Supabase
// (overrides localStorage if Supabase has newer data)
export async function pullProgress() {
  if (!supabase) return null;

  const uid = getUid();
  const { data, error } = await supabase
    .from(TABLE)
    .select("data, updated_at")
    .eq("uid", uid)
    .single();

  if (error || !data) return null;

  // Compare timestamps: use whichever is newer
  const localTs  = parseInt(localStorage.getItem("p6prep_last_sync") || "0");
  const remoteTs = new Date(data.updated_at).getTime();

  if (remoteTs > localTs) {
    localStorage.setItem("p6prep_last_sync", String(remoteTs));
    return data.data; // Use remote state
  }
  return null; // Local is newer, keep it
}

// ─── SUBSCRIBE (PARENT DASHBOARD) ─────────────────────────────────────────────
// Parent dashboard calls this with the student's uid to get real-time updates.
// Calls onUpdate(newState) whenever the student's row changes in Supabase.
//
// Returns an unsubscribe function — call it when the parent dashboard unmounts.
//
// Usage:
//   const unsub = subscribeToStudent(uid, (state) => setStudentState(state));
//   // later: unsub();
export function subscribeToStudent(uid, onUpdate) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`student-${uid}`)
    .on(
      "postgres_changes",
      {
        event: "*",         // INSERT, UPDATE, DELETE
        schema: "public",
        table: TABLE,
        filter: `uid=eq.${uid}`,
      },
      (payload) => {
        if (payload.new?.data) {
          onUpdate(payload.new.data);
        }
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

// ─── FETCH ALL STUDENTS (ANALYTICS / PARENT OVERVIEW) ─────────────────────────
// Fetches all student rows for the analytics dashboard.
// Returns array of { uid, name, data, updated_at }
export async function fetchAllStudents() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select("uid, name, data, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    console.warn("fetchAllStudents failed:", error.message);
    return [];
  }
  return data || [];
}

// ─── FETCH SINGLE STUDENT ─────────────────────────────────────────────────────
// Parent uses this to look up a specific student by uid.
export async function fetchStudent(uid) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .select("uid, name, data, updated_at")
    .eq("uid", uid)
    .single();

  if (error) return null;
  return data;
}

// ─── REACT HOOKS ──────────────────────────────────────────────────────────────
// Import these hooks into your components for easy usage.

import { useState, useEffect, useRef } from "react";

// useSupabaseSync — add to the student App component
// Pushes state to Supabase whenever it changes (debounced to avoid hammering DB)
export function useSupabaseSync(state) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!supabase) return;

    // Debounce: wait 2 seconds after last change before pushing
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      pushProgress(state);
    }, 2000);

    return () => clearTimeout(timerRef.current);
  }, [state]);
}

// useStudentRealtime — add to the parent dashboard
// Subscribes to a student's real-time updates
export function useStudentRealtime(uid) {
  const [studentState, setStudentState] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [lastSeen, setLastSeen]         = useState(null);

  useEffect(() => {
    if (!uid || !supabase) { setLoading(false); return; }

    // Initial fetch
    fetchStudent(uid).then(row => {
      if (row) {
        setStudentState(row.data);
        setLastSeen(row.updated_at);
      }
      setLoading(false);
    });

    // Real-time subscription
    const unsub = subscribeToStudent(uid, (newState) => {
      setStudentState(newState);
      setLastSeen(new Date().toISOString());
    });

    return unsub;
  }, [uid]);

  return { studentState, loading, lastSeen };
}

// useAllStudents — for the analytics dashboard
// Fetches all students on mount + re-fetches every 30 seconds
export function useAllStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);

  async function load() {
    setLoading(true);
    const data = await fetchAllStudents();
    setStudents(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return { students, loading, reload: load };
}
