// parent-view.jsx
// Place at: p6-maths/src/parent-view.jsx
//
// Standalone parent monitoring page, accessed via:
//   https://p6-maths.vercel.app/parent?uid=A3F9B2
//
// Parent opens this URL on their own phone/laptop.
// It subscribes to the student's Supabase row and updates in real time.

import { useState, useEffect, useMemo, useRef } from "react";
import {
  subscribeToStudent,
  fetchStudent,
  supabase,
} from "./supabase-sync.js";

// ─── DESIGN TOKENS (light mode, parent-facing) ────────────────────────────────
const P = {
  bg:      "#F7F8FC",
  surface: "#FFFFFF",
  border:  "rgba(0,0,0,0.07)",
  pri:     "#1A1D2E",
  sec:     "#6B7280",
  dim:     "#E5E7EB",
  accent:  "#4F7DFF",
  green:   "#16A34A",
  amber:   "#D97706",
  red:     "#DC2626",
  purple:  "#7C3AED",
};

// ─── TOPICS ──────────────────────────────────────────────────────────────────
const TOPICS = [
  { id:"whole-numbers",  name:"Whole Numbers",    icon:"🔢", color:"#FF6B6B" },
  { id:"fractions",      name:"Fractions",        icon:"½",  color:"#FF9F43" },
  { id:"decimals",       name:"Decimals",         icon:"·",  color:"#F59E0B" },
  { id:"percentage",     name:"Percentage",       icon:"%",  color:"#16A34A" },
  { id:"ratio",          name:"Ratio",            icon:"∶",  color:"#0891B2" },
  { id:"algebra",        name:"Algebra",          icon:"x²", color:"#7C3AED" },
  { id:"speed",          name:"Speed",            icon:"⚡", color:"#DC2626" },
  { id:"area-perimeter", name:"Area & Perimeter", icon:"📐", color:"#2563EB" },
  { id:"volume",         name:"Volume",           icon:"📦", color:"#0369A1" },
  { id:"angles",         name:"Angles",           icon:"△",  color:"#65A30D" },
  { id:"average",        name:"Average",          icon:"≈",  color:"#DB2777" },
  { id:"data-analysis",  name:"Data Analysis",    icon:"📊", color:"#9333EA" },
];

const MOCK_PAPERS = [
  { id:"mock-a", label:"Paper A", difficulty:"Foundation",   color:"#16A34A" },
  { id:"mock-b", label:"Paper B", difficulty:"Intermediate", color:"#D97706" },
  { id:"mock-c", label:"Paper C", difficulty:"Intermediate", color:"#D97706" },
  { id:"mock-d", label:"Paper D", difficulty:"Advanced",     color:"#DC2626" },
  { id:"mock-e", label:"Paper E", difficulty:"Advanced",     color:"#DC2626" },
];

const LEVEL_LABELS = ["Not started","Learning","Practising","Good","Mastered"];
const LEVEL_COLORS = [P.dim, P.red, P.amber, P.amber, P.green];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function timeAgo(ts) {
  if (!ts) return "Never";
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs  < 24) return `${hrs}h ago`;
  if (days < 7)  return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-SG", { day:"numeric", month:"short" });
}

function AccBar({ pct, color, h=6 }) {
  const c = color || (pct>=80?P.green:pct>=60?P.amber:P.red);
  return (
    <div style={{ height:h, borderRadius:3, background:P.dim, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${Math.min(100,pct)}%`, background:c, borderRadius:3, transition:"width .5s" }}/>
    </div>
  );
}

// ─── ACTIVITY SPARKLINE ───────────────────────────────────────────────────────
function ActivitySparkline({ attempts }) {
  const days = Array.from({ length:14 }, (_,i) => {
    const d = new Date(); d.setDate(d.getDate()-(13-i));
    return { key:d.toDateString(), label:d.toLocaleDateString("en-SG",{day:"numeric",month:"short"}), count:0, isToday:i===13 };
  });
  Object.values(attempts||{}).forEach(topicAtts => {
    Object.values(topicAtts).forEach(a => {
      const key = new Date(a.ts||0).toDateString();
      const day = days.find(d=>d.key===key);
      if (day) day.count++;
    });
  });
  const max = Math.max(1, ...days.map(d=>d.count));
  return (
    <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:40 }}>
      {days.map((d,i) => (
        <div key={i} title={`${d.label}: ${d.count} questions`}
          style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
          <div style={{
            width:"100%", height:d.count===0?3:Math.max(6,(d.count/max)*36),
            borderRadius:2, background:d.count===0?P.dim:d.isToday?P.accent:P.green,
            transition:"height .4s",
          }}/>
          {(i===0||i===7||i===13)&&<div style={{fontSize:8,color:P.sec}}>{d.label}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── LIVE INDICATOR ──────────────────────────────────────────────────────────
function LiveBadge({ active }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
      <div style={{
        width:8, height:8, borderRadius:"50%",
        background:active?P.green:P.dim,
        boxShadow:active?`0 0 0 3px ${P.green}33`:"none",
        animation:active?"livePulse 2s infinite":"none",
      }}/>
      <span style={{ fontSize:11, color:active?P.green:P.sec, fontWeight:600 }}>
        {active?"Live":"Offline"}
      </span>
    </div>
  );
}

// ─── WEAK TOPICS ─────────────────────────────────────────────────────────────
function WeakTopics({ mastery }) {
  const weak = TOPICS.map(t=>({ topic:t, m:mastery?.[t.id] }))
    .filter(({m})=>m&&m.attempted>=5&&m.accuracy<0.65)
    .sort((a,b)=>a.m.accuracy-b.m.accuracy);

  if (!weak.length) return (
    <div style={{ background:"#ECFDF5", border:"1px solid #BBF7D0", borderRadius:12, padding:"10px 14px" }}>
      <div style={{ fontSize:13, fontWeight:700, color:P.green }}>🎉 No weak topics detected</div>
      <div style={{ fontSize:12, color:"#166534", marginTop:2 }}>All practised topics are above 65% accuracy.</div>
    </div>
  );

  return (
    <div style={{ background:"#FFF7ED", border:"1px solid #FED7AA", borderRadius:12, padding:"12px 14px" }}>
      <div style={{ fontSize:12, fontWeight:700, color:"#92400E", marginBottom:8 }}>
        ⚠️ Needs attention — {weak.length} topic{weak.length>1?"s":""}
      </div>
      {weak.map(({topic,m})=>(
        <div key={topic.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <span style={{ fontSize:16 }}>{topic.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
              <span style={{ fontSize:12, fontWeight:600, color:"#92400E" }}>{topic.name}</span>
              <span style={{ fontSize:11, color:P.red, fontWeight:700 }}>{Math.round(m.accuracy*100)}%</span>
            </div>
            <AccBar pct={Math.round(m.accuracy*100)} color={P.red} h={4}/>
          </div>
        </div>
      ))}
      <div style={{ fontSize:11, color:"#B45309", marginTop:8 }}>
        💡 Ask your child to use the AI Tutor when they get these questions wrong.
      </div>
    </div>
  );
}

// ─── PSLE COUNTDOWN ──────────────────────────────────────────────────────────
const PSLE_DATES = [
  { label:"English & MT Oral Exams",       date:new Date("2026-08-12"), icon:"🗣️", subject:"Oral",          color:"#FF9F43" },
  { label:"Oral Exams (Day 2)",            date:new Date("2026-08-13"), icon:"🗣️", subject:"Oral Day 2",    color:"#FF9F43" },
  { label:"Listening Comprehension",       date:new Date("2026-09-15"), icon:"🎧", subject:"Listening",     color:"#22A6B3" },
  { label:"English Language Papers 1 & 2",date:new Date("2026-09-24"), icon:"✏️", subject:"English",       color:"#4F7DFF" },
  { label:"Mathematics Papers 1 & 2",     date:new Date("2026-09-25"), icon:"🔢", subject:"Maths",         color:"#BE2EDD" },
  { label:"Mother Tongue Papers 1 & 2",   date:new Date("2026-09-28"), icon:"📖", subject:"Mother Tongue", color:"#6AB04C" },
  { label:"Science Papers 1 & 2",         date:new Date("2026-09-29"), icon:"🔬", subject:"Science",       color:"#EB4D4B" },
  { label:"Higher Mother Tongue",         date:new Date("2026-09-30"), icon:"📚", subject:"HMT",           color:"#F9CA24" },
  { label:"Results Release",              date:new Date("2026-11-24"), icon:"🎉", subject:"Results",       color:"#6AB04C" },
];

function getNextEvent() {
  const today = new Date(); today.setHours(0,0,0,0);
  const upcoming = PSLE_DATES.filter(e=>e.date>=today);
  if (!upcoming.length) return null;
  return { ...upcoming[0], daysLeft: Math.ceil((upcoming[0].date-today)/86400000) };
}

// ─── MAIN PARENT VIEW ─────────────────────────────────────────────────────────
export default function ParentView() {
  // Get uid from URL query param: /parent?uid=A3F9B2
  const uid = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("uid") || "";
  }, []);

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [isLive, setIsLive]           = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [tab, setTab]                 = useState("overview");
  const liveTimer = useRef(null);

  // Mark as live for 10 seconds after each real-time update
  function triggerLive() {
    setIsLive(true);
    clearTimeout(liveTimer.current);
    liveTimer.current = setTimeout(() => setIsLive(false), 10000);
  }

  useEffect(() => {
    if (!uid) { setError("No student ID in URL. Share the correct link from the student app."); setLoading(false); return; }
    if (!supabase) { setError("Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel environment variables."); setLoading(false); return; }

    // Initial fetch
    fetchStudent(uid).then(row => {
      if (row) { setStudentData(row.data); setLastUpdated(row.updated_at); }
      else setError("Student not found. Make sure they've opened the app and answered at least one question.");
      setLoading(false);
    });

    // Real-time subscription
    const unsub = subscribeToStudent(uid, (newState) => {
      setStudentData(newState);
      setLastUpdated(new Date().toISOString());
      triggerLive();
    });

    return () => { unsub(); clearTimeout(liveTimer.current); };
  }, [uid]);

  // Inject pulse animation
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `@keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.4)} }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const stats = useMemo(() => {
    if (!studentData) return null;
    const allAttempts = Object.values(studentData.attempts||{}).flatMap(t=>Object.values(t));
    const total   = allAttempts.length;
    const correct = allAttempts.filter(a=>a.correct).length;
    const accuracy = total ? Math.round(correct/total*100) : 0;
    const activeDays = new Set(allAttempts.map(a=>new Date(a.ts||0).toDateString())).size;
    const weakTopics = TOPICS.map(t=>({ topic:t, m:studentData.mastery?.[t.id] }))
      .filter(({m})=>m&&m.attempted>=5&&m.accuracy<0.65).length;
    const topicsActive = TOPICS.filter(t=>studentData.mastery?.[t.id]?.attempted>0).length;
    return { total, correct, accuracy, activeDays, weakTopics, topicsActive };
  }, [studentData]);

  const nextEvent = getNextEvent();
  const studentName = studentData?.profile?.name || "Your Child";
  const targetGrade = studentData?.profile?.targetGrade || "";

  const TABS = [
    { id:"overview", icon:"📊", label:"Overview" },
    { id:"topics",   icon:"📚", label:"Topics"   },
    { id:"papers",   icon:"📝", label:"Papers"   },
  ];

  // ── LOADING ──
  if (loading) return (
    <div style={{ minHeight:"100vh", background:P.bg, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <div style={{ fontSize:36 }}>📊</div>
      <div style={{ fontSize:14, color:P.sec }}>Loading student progress…</div>
    </div>
  );

  // ── ERROR ──
  if (error || !studentData) return (
    <div style={{ minHeight:"100vh", background:P.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <div style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:16, padding:24, maxWidth:360, textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🔗</div>
        <div style={{ fontSize:16, fontWeight:700, color:P.pri, marginBottom:8 }}>Can't load progress</div>
        <div style={{ fontSize:13, color:P.sec, lineHeight:1.7 }}>{error || "No data found for this student ID."}</div>
        <div style={{ marginTop:16, fontSize:11, color:P.sec, background:"#F7F8FC", borderRadius:8, padding:"8px 12px", fontFamily:"monospace" }}>
          Student ID: {uid || "missing"}
        </div>
      </div>
    </div>
  );

  // ── MAIN VIEW ──
  return (
    <div style={{ minHeight:"100vh", background:P.bg, maxWidth:480, margin:"0 auto", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>

      {/* Sticky header */}
      <div style={{ background:P.surface, borderBottom:`1px solid ${P.border}`, padding:"14px 16px 0", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:P.pri }}>{studentName}</div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:3 }}>
              {targetGrade&&<span style={{ fontSize:11, color:P.accent, fontWeight:700, background:`${P.accent}18`, borderRadius:8, padding:"1px 7px" }}>Target: {targetGrade}</span>}
              <span style={{ fontSize:11, color:P.sec }}>Updated {timeAgo(lastUpdated)}</span>
            </div>
          </div>
          <LiveBadge active={isLive}/>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex" }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:1, padding:"8px 0 10px", border:"none", background:"none",
              fontSize:12, fontWeight:tab===t.id?700:400,
              color:tab===t.id?P.accent:P.sec, cursor:"pointer",
              borderBottom:`2px solid ${tab===t.id?P.accent:"transparent"}`,
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px 16px 32px" }}>

        {/* PSLE full countdown */}
        {nextEvent&&(
          <div style={{ marginBottom:16 }}>
            {/* Hero — next exam */}
            <div style={{ background:`${nextEvent.color}15`, border:`1px solid ${nextEvent.color}40`, borderRadius:12, padding:"10px 14px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:10, color:nextEvent.color, fontWeight:700, letterSpacing:.8 }}>{nextEvent.icon} NEXT: {nextEvent.subject.toUpperCase()}</div>
                <div style={{ fontSize:13, fontWeight:700, color:P.pri, marginTop:2 }}>{nextEvent.label}</div>
                <div style={{ fontSize:11, color:P.sec, marginTop:1 }}>
                  {new Date(nextEvent.date).toLocaleDateString("en-SG",{weekday:"short",day:"numeric",month:"short"})}
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0, marginLeft:12 }}>
                <div style={{ fontSize:28, fontWeight:900, color:nextEvent.color, lineHeight:1 }}>{nextEvent.daysLeft}</div>
                <div style={{ fontSize:10, color:P.sec }}>day{nextEvent.daysLeft!==1?"s":""} to go</div>
              </div>
            </div>
            {/* Scrollable strip — all upcoming */}
            {(()=>{
              const today=new Date(); today.setHours(0,0,0,0);
              const remaining=PSLE_DATES.filter(e=>e.date>=today);
              if(remaining.length<=1) return null;
              return (
                <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4 }}>
                  {remaining.map((e,i)=>{
                    const days=Math.ceil((e.date-today)/86400000);
                    const isNext=i===0;
                    return (
                      <div key={e.label} style={{ flexShrink:0, background:isNext?`${e.color}18`:P.surface, border:`1px solid ${isNext?e.color:P.border}`, borderRadius:10, padding:"7px 10px", minWidth:76, textAlign:"center" }}>
                        <div style={{ fontSize:16 }}>{e.icon}</div>
                        <div style={{ fontSize:10, fontWeight:700, color:isNext?e.color:P.sec, lineHeight:1.2, marginTop:2 }}>{e.subject}</div>
                        <div style={{ fontSize:12, fontWeight:800, color:isNext?e.color:P.pri, marginTop:2 }}>{days}d</div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* OVERVIEW */}
        {tab==="overview"&&(
          <div>
            {/* Stat cards */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
              {[
                ["🎯","Questions tried",    stats.total,       P.accent ],
                ["✅","Accuracy",           `${stats.accuracy}%`, stats.accuracy>=75?P.green:stats.accuracy>=50?P.amber:P.red ],
                ["📅","Days active",        stats.activeDays,  stats.activeDays>=5?P.green:P.amber ],
                ["📚","Topics practised",   `${stats.topicsActive}/12`, P.purple ],
              ].map(([ic,l,v,c])=>(
                <div key={l} style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:14, padding:"14px 12px", borderTop:`3px solid ${c}` }}>
                  <div style={{ fontSize:20, marginBottom:4 }}>{ic}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:P.pri }}>{v}</div>
                  <div style={{ fontSize:11, color:P.sec, marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Activity chart */}
            <div style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:14, padding:"14px 16px", marginBottom:14 }}>
              <div style={{ fontSize:11, color:P.sec, fontWeight:700, letterSpacing:.8, marginBottom:10 }}>ACTIVITY — LAST 14 DAYS</div>
              <ActivitySparkline attempts={studentData.attempts}/>
            </div>

            {/* Weak topics */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:P.sec, fontWeight:700, letterSpacing:.8, marginBottom:8 }}>WEAK TOPICS</div>
              <WeakTopics mastery={studentData.mastery}/>
            </div>

            {/* Study plan from onboarding */}
            {studentData.profile?.weakTopics?.length>0&&(
              <div style={{ background:P.surface, border:`1px solid ${P.border}`, borderRadius:14, padding:"12px 14px" }}>
                <div style={{ fontSize:11, color:P.sec, fontWeight:700, letterSpacing:.8, marginBottom:8 }}>STUDENT'S FOCUS TOPICS</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {studentData.profile.weakTopics.map(tid=>{
                    const t=TOPICS.find(x=>x.id===tid);
                    return t?(
                      <span key={tid} style={{ fontSize:12, background:`${t.color}18`, color:t.color, borderRadius:8, padding:"3px 10px", fontWeight:600 }}>
                        {t.icon} {t.name}
                      </span>
                    ):null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TOPICS */}
        {tab==="topics"&&(
          <div>
            {TOPICS.map(t=>{
              const m=studentData.mastery?.[t.id];
              if(!m||!m.attempted) return (
                <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${P.border}`, opacity:.4 }}>
                  <div style={{ width:34,height:34,borderRadius:9,background:`${t.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>{t.icon}</div>
                  <div><div style={{ fontSize:13,fontWeight:600,color:P.pri }}>{t.name}</div><div style={{ fontSize:11,color:P.sec }}>Not started</div></div>
                </div>
              );
              const acc=Math.round(m.accuracy*100);
              return (
                <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${P.border}` }}>
                  <div style={{ width:34,height:34,borderRadius:9,background:`${t.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>{t.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                      <span style={{ fontSize:13,fontWeight:600,color:P.pri }}>{t.name}</span>
                      <span style={{ fontSize:12,fontWeight:700,color:acc>=80?P.green:acc>=60?P.amber:P.red }}>{acc}%</span>
                    </div>
                    <AccBar pct={acc} color={t.color}/>
                    <div style={{ display:"flex",justifyContent:"space-between",marginTop:3 }}>
                      <span style={{ fontSize:10,color:P.sec }}>{m.correct}/{m.attempted} correct</span>
                      <span style={{ fontSize:10,fontWeight:600,color:LEVEL_COLORS[m.level||0] }}>{LEVEL_LABELS[m.level||0]}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAPERS */}
        {tab==="papers"&&(
          <div>
            <div style={{ background:P.surface,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:14,fontSize:13,color:P.pri,lineHeight:1.7 }}>
              Score of <strong style={{ color:P.green }}>75%+</strong> indicates readiness for that paper's difficulty.
            </div>
            {MOCK_PAPERS.map(paper=>{
              const atts=studentData.paperAttempts?.[paper.id]||{};
              const done=Object.keys(atts).length;
              const correct=Object.values(atts).filter(a=>a.correct).length;
              const pct=done?Math.round(correct/done*100):0;
              const lastTs=done?Math.max(...Object.values(atts).map(a=>a.ts||0)):null;
              return (
                <div key={paper.id} style={{ background:P.surface,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                    <div>
                      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                        <span style={{ fontSize:13,fontWeight:700,color:P.pri }}>{paper.label}</span>
                        <span style={{ fontSize:10,fontWeight:700,color:paper.color,background:`${paper.color}18`,borderRadius:8,padding:"1px 7px" }}>{paper.difficulty}</span>
                      </div>
                      <div style={{ fontSize:11,color:P.sec,marginTop:3 }}>
                        {done?`${done}/22 attempted · ${timeAgo(lastTs)}`:"Not attempted yet"}
                      </div>
                    </div>
                    {done>0&&<div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:20,fontWeight:800,color:pct>=75?P.green:pct>=50?P.amber:P.red }}>{pct}%</div>
                      <div style={{ fontSize:10,color:P.sec }}>{correct}/{done}</div>
                    </div>}
                  </div>
                  {done>0&&<div style={{ marginTop:10 }}><AccBar pct={pct}/></div>}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop:24, padding:"12px 14px", background:P.surface, border:`1px solid ${P.border}`, borderRadius:12 }}>
          <div style={{ fontSize:11, color:P.sec, marginBottom:4, fontWeight:600 }}>STUDENT LINK ID</div>
          <div style={{ fontSize:14, fontFamily:"monospace", color:P.pri, fontWeight:700, letterSpacing:2 }}>{uid.toUpperCase()}</div>
          <div style={{ fontSize:11, color:P.sec, marginTop:4 }}>Share this URL to monitor on another device</div>
          <div style={{ fontSize:11, fontFamily:"monospace", color:P.accent, marginTop:4, wordBreak:"break-all" }}>
            {window.location.origin}/parent?uid={uid}
          </div>
        </div>
      </div>
    </div>
  );
}
