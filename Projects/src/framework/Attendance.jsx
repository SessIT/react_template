// ─── Attendance.jsx ────────────────────────────────────────────────────────────
// Two-panel Attendance UI
//   LEFT  — Live clock · GPS · Punch In/Out cards · Today's session history
//   RIGHT — Monthly calendar with per-day attendance status dots
//           Click any day to see that day's sessions in a slide-up detail pane
//
// Desktop: side-by-side  |  Mobile: stacked (calendar below punch panel)
//
// Props:
//   sessions        array  – today's sessions [{ punch_in, punch_out }]
//   monthHistory    object – { "YYYY-MM-DD": [{ punch_in, punch_out }], … }
//   onPunchIn       fn(coords)
//   onPunchOut      fn(coords)
//   loading         bool

import { useState, useEffect } from "react";

/* ─── Icon ────────────────────────────────────────────────────────────────── */
function Ic({ d, size = 20, color = "currentColor", sw = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display:"block", flexShrink:0 }}
    >
      {d.split(" | ").map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const pad = (n) => String(n).padStart(2, "0");
const fmtHMS = (date) => {
  if (!date) return "—";
  const d = date instanceof Date ? date : new Date(date);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
const fmtDur = (ms, full = false) => {
  if (!ms || ms <= 0) return "—";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return full ? `${h}h ${pad(m)}m ${pad(sec)}s` : `${h}h ${pad(m)}m`;
  if (m > 0) return `${pad(m)}m ${pad(sec)}s`;
  return `${pad(sec)}s`;
};
const ymd = (d) => {
  const dt = d instanceof Date ? d : new Date(d);
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
};
const todayStr = () =>
  new Date().toLocaleDateString("en-IN", {
    weekday:"short", day:"numeric", month:"short", year:"numeric",
  });

// Build a mock month history for demo (seeded realistic data)
function buildDemoHistory(year, month) {
  const out = {};
  const today = new Date();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d);
    if (dt > today) continue;
    const dow = dt.getDay();
    // skip weekends with 85% probability
    if (dow === 0 || dow === 6) { if (Math.random() > 0.15) continue; }
    // skip a few weekdays randomly (leaves, etc.)
    if (Math.random() < 0.08) continue;
    const key = ymd(dt);
    const inH = 8 + Math.floor(Math.random() * 2);
    const inM = Math.floor(Math.random() * 30);
    const outH = inH + 8 + Math.floor(Math.random() * 2);
    const outM = Math.floor(Math.random() * 60);
    const t1 = new Date(year, month, d, inH, inM, 0);
    const t2 = new Date(year, month, d, Math.min(outH, 19), outM, 0);
    out[key] = [{ punch_in: t1, punch_out: t2 }];
    // Occasionally add a second session (lunch break)
    if (Math.random() < 0.2) {
      const t3 = new Date(year, month, d, 13, 0, 0);
      const t4 = new Date(year, month, d, 13, 30, 0);
      out[key].push({ punch_in: t3, punch_out: t4 });
    }
  }
  return out;
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Attendance({
  sessions: initSessions = [],
  monthHistory: initMonthHistory,
  onPunchIn,
  onPunchOut,
  loading = false,
}) {
  const [now,     setNow]     = useState(new Date());
  const [mounted, setMounted] = useState(false);

  /* today's punch sessions */
  const [sessions, setSessions] = useState(() =>
    (initSessions || []).map((s, i) => ({
      id: i,
      punch_in:  s.punch_in  ? new Date(s.punch_in)  : null,
      punch_out: s.punch_out ? new Date(s.punch_out) : null,
    }))
  );

  /* month history map { "YYYY-MM-DD": [{punch_in, punch_out}] } */
  const today = new Date();
  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [monthHistory] = useState(() =>
    initMonthHistory || buildDemoHistory(today.getFullYear(), today.getMonth())
  );

  /* selected day detail pane */
  const [selectedDay, setSelectedDay] = useState(null); // "YYYY-MM-DD" | null

  /* GPS */
  const [gpsStatus, setGpsStatus] = useState("acquiring");
  const [gpsText,   setGpsText]   = useState("Acquiring location…");
  const [coords,    setCoords]    = useState({ lat:"", lng:"" });

  /* ripple */
  const [ripple, setRipple] = useState(null);

  /* mount */
  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t); }, []);

  /* clock */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* GPS */
  useEffect(() => {
    if (!navigator.geolocation) { setGpsStatus("denied"); setGpsText("Not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords: c }) => {
        setCoords({ lat: c.latitude, lng: c.longitude });
        setGpsStatus("located");
        setGpsText(`${c.latitude.toFixed(4)}, ${c.longitude.toFixed(4)}`);
      },
      () => { setGpsStatus("denied"); setGpsText("Access denied"); }
    );
  }, []);

  /* ── derived ── */
  const last        = sessions[sessions.length - 1] ?? null;
  const isActive    = !!last && !last.punch_out;
  const canPunchIn  = !isActive;
  const canPunchOut = isActive;
  const lastPunchIn  = last?.punch_in  ?? null;
  const lastPunchOut = last?.punch_out ?? null;
  const latestMs = isActive ? now - lastPunchIn
    : lastPunchOut && lastPunchIn ? lastPunchOut - lastPunchIn : null;
  const completedMs = sessions.reduce((a, s) =>
    s.punch_in && s.punch_out ? a + (s.punch_out - s.punch_in) : a, 0);
  const totalMs = completedMs + (isActive ? now - lastPunchIn : 0);
  const statusLabel = isActive ? "Shift in progress"
    : sessions.length > 0 ? `${sessions.length} session${sessions.length > 1 ? "s" : ""} today`
    : "Not punched in";

  /* ── punch handlers ── */
  const fireRipple = (t) => { setRipple(t); setTimeout(() => setRipple(null), 700); };
  const handlePunchIn = () => {
    if (!canPunchIn || loading) return;
    const t = new Date();
    setSessions(p => [...p, { id: p.length, punch_in: t, punch_out: null }]);
    fireRipple("in");
    onPunchIn?.(coords);
  };
  const handlePunchOut = () => {
    if (!canPunchOut || loading) return;
    const t = new Date();
    setSessions(p => p.map((s, i) => i === p.length - 1 ? { ...s, punch_out: t } : s));
    fireRipple("out");
    onPunchOut?.(coords);
  };

  /* ── calendar helpers ── */
  const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const MONTHS = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];

  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth     = new Date(calYear, calMonth + 1, 0).getDate();
  const todayKey        = ymd(today);

  function dayStatus(key) {
    const d = new Date(key + "T00:00:00");
    if (d > today) return "future";
    const dow = d.getDay();
    if (dow === 0 || dow === 6) {
      return monthHistory[key] ? "weekend-present" : "weekend";
    }
    if (monthHistory[key]) {
      const sessions = monthHistory[key];
      const totalMs  = sessions.reduce((a, s) =>
        s.punch_in && s.punch_out ? a + (new Date(s.punch_out) - new Date(s.punch_in)) : a, 0);
      if (totalMs >= 8 * 3600 * 1000) return "full";
      if (totalMs > 0) return "half";
      return "present";
    }
    return "absent";
  }

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    const nt = new Date(calYear, calMonth + 1, 1);
    if (nt > today) return;
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
    setSelectedDay(null);
  }
  const canGoNext = new Date(calYear, calMonth + 1, 1) <= today;

  /* selected day detail */
  const selectedSessions = selectedDay
    ? (monthHistory[selectedDay] || (selectedDay === todayKey ? sessions : []))
    : [];
  const selectedDayObj = selectedDay ? new Date(selectedDay + "T00:00:00") : null;

  /* month stats */
  const allKeys = Object.keys(monthHistory).filter(k => k.startsWith(`${calYear}-${pad(calMonth + 1)}`));
  const presentDays = allKeys.filter(k => monthHistory[k]?.length > 0).length;
  const totalMonthMs = allKeys.reduce((a, k) =>
    a + (monthHistory[k] || []).reduce((b, s) =>
      s.punch_in && s.punch_out ? b + (new Date(s.punch_out) - new Date(s.punch_in)) : b, 0), 0);
  const totalMonthHrs = (totalMonthMs / 3600000).toFixed(1);

  /* ═════════════════════════════ RENDER ═══════════════════════════════════ */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@500;700&display=swap');

        @keyframes att-pg  { 0%,100%{box-shadow:0 0 0 0 rgba(34,229,138,.55)} 60%{box-shadow:0 0 0 9px rgba(34,229,138,0)} }
        @keyframes att-pp  { 0%,100%{box-shadow:0 0 0 0 rgba(232,0,106,.55)}  60%{box-shadow:0 0 0 9px rgba(232,0,106,0)}  }
        @keyframes att-blk { 0%,49%{opacity:1} 50%,100%{opacity:.2} }
        @keyframes att-rpl { from{transform:scale(0);opacity:.55} to{transform:scale(5);opacity:0} }
        @keyframes att-row { from{opacity:0;transform:translateX(-5px)} to{opacity:1;transform:translateX(0)} }
        @keyframes att-up  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes att-sl  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .att * { box-sizing:border-box; }
        .att {
          font-family:'DM Sans','Segoe UI',sans-serif;
          padding:0 0 2.5rem;
        }

        /* ── layout wrapper ── */
        .att-layout {
          display:grid;
          grid-template-columns:1fr;
          gap:16px;
          align-items:start;
        }
        @media(min-width:900px){
          .att-layout { grid-template-columns:1fr 380px; gap:20px; }
        }
        @media(min-width:1200px){
          .att-layout { grid-template-columns:1fr 420px; }
        }

        /* ══════════════ LEFT PANEL ══════════════ */

        /* clock */
        .att-clock {
          background:var(--surf,#0f1117);
          border:1px solid var(--border,rgba(255,255,255,.09));
          border-radius:22px;
          padding:1.3rem 1.5rem;
          margin-bottom:12px;
          display:flex;
          align-items:center;
          justify-content:space-between;
        }
        .att-clock-time {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(28px,8vw,44px);
          font-weight:700;
          letter-spacing:-2px;
          color:var(--txt,#f0f0f0);
          line-height:1;
        }
        .att-sep { animation:att-blk 1s step-start infinite; }
        .att-clock-date { font-size:13px; color:var(--txt-dim,rgba(255,255,255,.4)); margin-top:5px; }
        .att-dot { width:11px;height:11px;border-radius:50%;flex-shrink:0;transition:background .4s,box-shadow .4s; }
        .att-dot.g { background:#22e58a;animation:att-pg 2s ease-out infinite; }
        .att-dot.d { background:#444; }
        .att-dot.p { background:var(--pink,#e8006a); }

        /* pill */
        .att-pill {
          display:inline-flex;align-items:center;gap:7px;
          border-radius:100px;padding:5px 13px;
          font-size:11px;font-weight:700;letter-spacing:.05em;
          margin-bottom:12px;
        }
        .att-pill .pd { width:6px;height:6px;border-radius:50%;background:currentColor; }
        .att-pill.g { background:rgba(34,229,138,.12);border:1px solid rgba(34,229,138,.35);color:#22e58a; }
        .att-pill.d { background:var(--surf,#0f1117);border:1px solid var(--border,rgba(255,255,255,.08));color:var(--txt-dim,rgba(255,255,255,.35)); }
        .att-pill.p { background:rgba(232,0,106,.1);border:1px solid rgba(232,0,106,.3);color:var(--pink,#e8006a); }

        /* tiles */
        .att-tiles { display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px; }
        .att-tile {
          background:var(--surf,#0f1117);border-radius:16px;
          padding:.9rem 1rem;
          border:1px solid var(--border,rgba(255,255,255,.08));
          transition:border-color .4s;
        }
        .att-tile.g { border-color:rgba(34,229,138,.28); }
        .att-tile.p { border-color:rgba(232,0,106,.28); }
        .att-tile.a { border-color:rgba(250,170,50,.28); }
        .att-tl {
          font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
          color:var(--txt-dim,rgba(255,255,255,.35));
          margin-bottom:6px;display:flex;align-items:center;gap:4px;
        }
        .att-tv {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(12px,3.5vw,16px);font-weight:700;line-height:1.2;
          color:var(--txt-dim,rgba(255,255,255,.28));
          transition:color .4s;word-break:break-all;
        }
        .att-tv.g { color:#22e58a; }
        .att-tv.p { color:var(--pink,#e8006a); }
        .att-tv.a { color:#faaa32; }

        /* gps */
        .att-gps {
          display:flex;align-items:center;gap:8px;
          background:var(--surf,#0f1117);
          border:1px solid var(--border,rgba(255,255,255,.08));
          border-radius:12px;padding:.5rem 1rem;
          margin-bottom:14px;font-size:11px;
          transition:border-color .4s,color .4s;
        }
        .att-gps.located { border-color:rgba(34,229,138,.25);color:#22e58a; }
        .att-gps.denied  { border-color:rgba(232,0,106,.2);color:var(--pink,#e8006a); }
        .att-gps.acquiring { color:var(--txt-dim,rgba(255,255,255,.35)); }
        .att-gps-lock { margin-left:auto;font-size:10px;opacity:.55; }

        /* punch row */
        .att-punch-row { display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px; }
        @media(min-width:640px){ .att-punch-row { gap:14px; } }

        /* punch card */
        .att-pc {
          border-radius:22px;padding:1.5rem 1rem 1.4rem;
          display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;
          position:relative;overflow:hidden;
          border:1.5px solid var(--border,rgba(255,255,255,.08));
          background:var(--surf,#0f1117);
          transition:background .3s,border-color .3s,opacity .25s,transform .15s;
          -webkit-tap-highlight-color:transparent;user-select:none;
        }
        .att-pc:active { transform:scale(.97); }
        .att-pc.pi-on  { background:rgba(34,229,138,.07);border-color:rgba(34,229,138,.5);cursor:pointer; }
        .att-pc.pi-off { background:rgba(34,229,138,.03);border-color:rgba(34,229,138,.18);opacity:.6;cursor:default; }
        .att-pc.po-on  { background:rgba(232,0,106,.07);border-color:rgba(232,0,106,.5);cursor:pointer; }
        .att-pc.po-off { background:rgba(232,0,106,.03);border-color:rgba(232,0,106,.18);opacity:.6;cursor:default; }
        .att-pc.po-locked { opacity:.35;cursor:not-allowed; }

        .att-icw {
          width:50px;height:50px;border-radius:15px;
          display:flex;align-items:center;justify-content:center;
          transition:background .3s;
        }
        .pi-on  .att-icw,.pi-off .att-icw { background:rgba(34,229,138,.15); }
        .po-on  .att-icw,.po-off .att-icw  { background:rgba(232,0,106,.15); }
        .po-locked .att-icw                { background:rgba(255,255,255,.05); }
        .pi-on .att-icw { animation:att-pg 2s ease-out infinite; }
        .po-on .att-icw { animation:att-pp 2s ease-out infinite; }

        .att-ptitle { font-size:15px;font-weight:700;line-height:1; }
        .pi-on  .att-ptitle,.pi-off .att-ptitle { color:#22e58a; }
        .po-on  .att-ptitle,.po-off .att-ptitle  { color:var(--pink,#e8006a); }
        .po-locked .att-ptitle { color:rgba(255,255,255,.25); }

        .att-psub { font-size:11px;color:var(--txt-dim,rgba(255,255,255,.38));line-height:1.5;max-width:130px; }
        .att-pbadge {
          font-family:'JetBrains Mono',monospace;
          font-size:12px;font-weight:700;border-radius:8px;padding:4px 10px;
        }
        .pi-on  .att-pbadge,.pi-off .att-pbadge { background:rgba(34,229,138,.15);color:#22e58a; }
        .po-on  .att-pbadge,.po-off .att-pbadge  { background:rgba(232,0,106,.15);color:var(--pink,#e8006a); }
        .att-pcta {
          font-size:11px;font-weight:700;letter-spacing:.06em;
          border-radius:100px;padding:5px 14px;border:1px solid currentColor;margin-top:2px;
        }
        .pi-on .att-pcta { color:#22e58a;background:rgba(34,229,138,.1); }
        .po-on .att-pcta { color:var(--pink,#e8006a);background:rgba(232,0,106,.1); }
        .att-ripple {
          position:absolute;width:60px;height:60px;border-radius:50%;
          pointer-events:none;left:50%;top:50%;margin-left:-30px;margin-top:-30px;
          transform:scale(0);opacity:0;animation:att-rpl .65s ease-out forwards;
        }

        /* history */
        .att-hist {
          background:var(--surf,#0f1117);
          border:1px solid var(--border,rgba(255,255,255,.08));
          border-radius:18px;overflow:hidden;
        }
        .att-hist-hdr {
          display:flex;align-items:center;justify-content:space-between;
          padding:.85rem 1.1rem;
          border-bottom:1px solid var(--border,rgba(255,255,255,.06));
        }
        .att-hist-title { font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--txt-dim,rgba(255,255,255,.4)); }
        .att-tbadge {
          font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;
          color:#faaa32;background:rgba(250,170,50,.12);
          border:1px solid rgba(250,170,50,.25);border-radius:8px;padding:3px 10px;
        }
        .att-hist-row {
          display:grid;grid-template-columns:26px 1fr 1fr 1fr;
          align-items:center;gap:8px;padding:.7rem 1.1rem;
          border-bottom:1px solid var(--border,rgba(255,255,255,.04));
          animation:att-row .3s ease both;
        }
        .att-hist-row:last-child { border-bottom:none; }
        .att-hist-num {
          width:22px;height:22px;border-radius:7px;background:rgba(255,255,255,.06);
          display:flex;align-items:center;justify-content:center;
          font-size:10px;font-weight:700;color:var(--txt-dim,rgba(255,255,255,.38));
        }
        .att-hl { font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--txt-dim,rgba(255,255,255,.28));margin-bottom:2px; }
        .att-hv { font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700; }
        .cv-g { color:#22e58a; }
        .cv-p { color:var(--pink,#e8006a); }
        .cv-a { color:#faaa32; }
        .cv-d { color:var(--txt-dim,rgba(255,255,255,.28)); }
        .att-empty { padding:1.5rem;text-align:center;font-size:12px;color:var(--txt-dim,rgba(255,255,255,.28)); }

        /* ══════════════ RIGHT PANEL — CALENDAR ══════════════ */
        .att-cal-panel {
          position:sticky;
          top:16px;
        }
        .att-cal-card {
          background:var(--surf,#0f1117);
          border:1px solid var(--border,rgba(255,255,255,.09));
          border-radius:22px;
          overflow:hidden;
        }

        /* cal header */
        .att-cal-hdr {
          display:flex;align-items:center;justify-content:space-between;
          padding:1.1rem 1.3rem .9rem;
          border-bottom:1px solid var(--border,rgba(255,255,255,.07));
        }
        .att-cal-nav {
          width:32px;height:32px;border-radius:10px;
          background:rgba(255,255,255,.05);
          border:1px solid var(--border,rgba(255,255,255,.08));
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;transition:background .2s;
          -webkit-tap-highlight-color:transparent;
        }
        .att-cal-nav:hover { background:rgba(255,255,255,.1); }
        .att-cal-nav.disabled { opacity:.3;cursor:default;pointer-events:none; }
        .att-cal-month-label {
          font-size:15px;font-weight:700;
          color:var(--txt,#f0f0f0);letter-spacing:-.2px;
        }

        /* month stats strip */
        .att-cal-stats {
          display:grid;grid-template-columns:repeat(3,1fr);
          border-bottom:1px solid var(--border,rgba(255,255,255,.07));
        }
        .att-cal-stat {
          padding:.7rem .5rem;text-align:center;
          border-right:1px solid var(--border,rgba(255,255,255,.07));
        }
        .att-cal-stat:last-child { border-right:none; }
        .att-cal-stat-val {
          font-family:'JetBrains Mono',monospace;
          font-size:16px;font-weight:700;color:var(--txt,#f0f0f0);
          line-height:1;margin-bottom:4px;
        }
        .att-cal-stat-lbl { font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--txt-dim,rgba(255,255,255,.35)); }

        /* day-of-week header */
        .att-cal-dow {
          display:grid;grid-template-columns:repeat(7,1fr);
          padding:.6rem 1rem .4rem;
          border-bottom:1px solid var(--border,rgba(255,255,255,.05));
        }
        .att-cal-dow-cell {
          text-align:center;font-size:10px;font-weight:700;letter-spacing:.05em;
          color:var(--txt-dim,rgba(255,255,255,.3));
        }
        .att-cal-dow-cell.we { color:rgba(232,0,106,.5); }

        /* grid */
        .att-cal-grid {
          display:grid;grid-template-columns:repeat(7,1fr);
          gap:3px;
          padding:.6rem .9rem .9rem;
        }
        .att-cal-cell {
          aspect-ratio:1;
          display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          border-radius:10px;
          cursor:pointer;
          position:relative;
          transition:background .2s;
          -webkit-tap-highlight-color:transparent;
          border:1px solid transparent;
        }
        .att-cal-cell:hover:not(.empty):not(.future) { background:rgba(255,255,255,.06); }
        .att-cal-cell.empty { cursor:default; }
        .att-cal-cell.future { cursor:default;opacity:.25; }
        .att-cal-cell.today {
          border-color:rgba(34,145,245,.45);
          background:rgba(34,145,245,.08);
        }
        .att-cal-cell.selected {
          border-color:rgba(250,170,50,.6);
          background:rgba(250,170,50,.1);
        }
        .att-cal-day {
          font-size:12px;font-weight:600;
          color:var(--txt,#f0f0f0);line-height:1;
          margin-bottom:3px;
        }
        .att-cal-cell.future .att-cal-day { color:var(--txt-dim,rgba(255,255,255,.25)); }
        .att-cal-cell.weekend .att-cal-day { color:rgba(255,255,255,.35); }
        .att-cal-cell.today .att-cal-day { color:#3a91f5;font-weight:700; }
        .att-cal-cell.selected .att-cal-day { color:#faaa32;font-weight:700; }

        /* status dot */
        .att-cal-dot {
          width:5px;height:5px;border-radius:50%;
          transition:background .3s;
        }
        .dot-full    { background:#22e58a; }
        .dot-half    { background:#faaa32; }
        .dot-present { background:rgba(34,229,138,.5); }
        .dot-absent  { background:rgba(232,0,106,.6); }
        .dot-weekend-present { background:rgba(34,229,138,.4); }
        .dot-none    { background:transparent; }

        /* legend */
        .att-cal-legend {
          display:flex;align-items:center;flex-wrap:wrap;gap:10px;
          padding:.7rem 1.1rem .9rem;
          border-top:1px solid var(--border,rgba(255,255,255,.06));
        }
        .att-leg-item { display:flex;align-items:center;gap:5px;font-size:10px;color:var(--txt-dim,rgba(255,255,255,.4)); }
        .att-leg-dot { width:7px;height:7px;border-radius:50%; }

        /* ── day detail slide-up pane ── */
        .att-day-detail {
          background:var(--surf,#0f1117);
          border:1px solid var(--border,rgba(255,255,255,.09));
          border-radius:18px;
          margin-top:12px;
          overflow:hidden;
          animation:att-sl .3s ease both;
        }
        .att-dd-hdr {
          display:flex;align-items:center;justify-content:space-between;
          padding:.85rem 1.1rem;
          border-bottom:1px solid var(--border,rgba(255,255,255,.07));
        }
        .att-dd-title { font-size:13px;font-weight:700;color:var(--txt,#f0f0f0); }
        .att-dd-close {
          width:28px;height:28px;border-radius:8px;
          background:rgba(255,255,255,.07);
          border:none;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          color:var(--txt-dim,rgba(255,255,255,.5));
          transition:background .2s;
        }
        .att-dd-close:hover { background:rgba(255,255,255,.12); }
        .att-dd-row {
          display:grid;grid-template-columns:26px 1fr 1fr 1fr;
          align-items:center;gap:8px;padding:.65rem 1.1rem;
          border-bottom:1px solid var(--border,rgba(255,255,255,.04));
          animation:att-row .3s ease both;
        }
        .att-dd-row:last-child { border-bottom:none; }
        .att-dd-total {
          display:flex;align-items:center;justify-content:space-between;
          padding:.7rem 1.1rem;
          border-top:1px solid var(--border,rgba(255,255,255,.07));
          font-size:12px;font-weight:600;
          color:var(--txt-dim,rgba(255,255,255,.4));
        }

        /* responsive */
        @media(max-width:360px){
          .att-clock-time { font-size:26px; }
          .att-pc         { padding:1.1rem .7rem; }
          .att-hist-row   { grid-template-columns:22px 1fr 1fr 1fr;gap:5px; }
          .att-hv         { font-size:11px; }
          .att-cal-grid   { gap:2px;padding:.5rem .6rem .7rem; }
          .att-cal-day    { font-size:10px; }
        }
        @media(min-width:640px) and (max-width:899px){
          .att-punch-row { gap:14px; }
          .att-pc        { padding:1.8rem 1.4rem; }
        }
      `}</style>

      <div
        className="att"
        style={{
          opacity:   mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(14px)",
          transition:"opacity .45s ease,transform .45s ease",
        }}
      >
        <div className="att-layout">

          {/* ════════════ LEFT — PUNCH PANEL ════════════ */}
          <div>

            {/* clock */}
            <div className="att-clock">
              <div>
                <div className="att-clock-time">
                  {pad(now.getHours())}<span className="att-sep">:</span>
                  {pad(now.getMinutes())}<span className="att-sep">:</span>
                  {pad(now.getSeconds())}
                </div>
                <div className="att-clock-date">{todayStr()}</div>
              </div>
              <div className={`att-dot ${isActive ? "g" : sessions.length ? "p" : "d"}`} />
            </div>

            {/* status pill */}
            <div className={`att-pill ${isActive ? "g" : sessions.length ? "p" : "d"}`}>
              <span className="pd" />
              {statusLabel}
            </div>

            {/* tiles */}
            <div className="att-tiles">
              <div className={`att-tile ${lastPunchIn ? "g" : ""}`}>
                <div className="att-tl"><Ic d="M12 8v4l2 2 | M3.1 10a9 9 0 1 0 .8-3.5" size={10} color="currentColor" />Last Punch In</div>
                <div className={`att-tv ${lastPunchIn ? "g" : ""}`}>{lastPunchIn ? fmtHMS(lastPunchIn) : "—"}</div>
              </div>
              <div className={`att-tile ${lastPunchOut ? "p" : ""}`}>
                <div className="att-tl"><Ic d="M9 21H5a2 2 0 0 1-2-2V5 | M16 17l5-5-5-5 | M21 12H9" size={10} color="currentColor" />Last Punch Out</div>
                <div className={`att-tv ${lastPunchOut ? "p" : ""}`}>{lastPunchOut ? fmtHMS(lastPunchOut) : isActive ? "Active…" : "—"}</div>
              </div>
              <div className={`att-tile ${latestMs ? (isActive ? "g" : "a") : ""}`}>
                <div className="att-tl"><Ic d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z | M12 6v6l3 3" size={10} color="currentColor" />{isActive ? "Running" : "Session Hrs"}</div>
                <div className={`att-tv ${latestMs ? (isActive ? "g" : "a") : ""}`}>{latestMs ? fmtDur(latestMs, true) : "—"}</div>
              </div>
              <div className={`att-tile ${totalMs > 0 ? "a" : ""}`}>
                <div className="att-tl"><Ic d="M22 12h-4l-3 9L9 3l-3 9H2" size={10} color="currentColor" />Total Today</div>
                <div className={`att-tv ${totalMs > 0 ? "a" : ""}`}>{totalMs > 0 ? fmtDur(totalMs) : "—"}</div>
              </div>
            </div>

            {/* GPS strip */}
            <div className={`att-gps ${gpsStatus}`}>
              <Ic d={gpsStatus === "located"
                ? "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z | M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
                : "M1 6l5 5 | M6 6l-5 5"} size={12} color="currentColor" />
              <span>{gpsText}</span>
              {gpsStatus === "located" && <span className="att-gps-lock">GPS locked</span>}
            </div>

            {/* punch cards */}
            <div className="att-punch-row">
              {/* Punch In */}
              <div
                className={`att-pc ${canPunchIn ? "pi-on" : "pi-off"}`}
                onClick={canPunchIn && !loading ? handlePunchIn : undefined}
                role="button" aria-label="Punch In" aria-disabled={!canPunchIn}
              >
                {ripple === "in" && <span className="att-ripple" style={{ background:"rgba(34,229,138,.35)" }} />}
                <div className="att-icw">
                  <Ic d="M12 8v4l2.5 2.5 | M3.05 11A9 9 0 1 0 3.6 7" size={26} color="#22e58a" sw={2} />
                </div>
                <div className="att-ptitle">Punch In</div>
                {!canPunchIn && lastPunchIn ? (
                  <><div className="att-pbadge">{fmtHMS(lastPunchIn)}</div><div className="att-psub">Shift started</div></>
                ) : (
                  <><div className="att-psub">Tap to start your shift</div>{canPunchIn && <div className="att-pcta">Tap to punch in</div>}</>
                )}
              </div>

              {/* Punch Out */}
              <div
                className={`att-pc ${canPunchOut ? "po-on" : lastPunchOut ? "po-off" : "po-locked"}`}
                onClick={canPunchOut && !loading ? handlePunchOut : undefined}
                role="button" aria-label="Punch Out" aria-disabled={!canPunchOut}
              >
                {ripple === "out" && <span className="att-ripple" style={{ background:"rgba(232,0,106,.35)" }} />}
                <div className="att-icw">
                  <Ic d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 | M16 17l5-5-5-5 | M21 12H9" size={26}
                    color={canPunchOut ? "var(--pink,#e8006a)" : "rgba(255,255,255,.2)"} sw={2} />
                </div>
                <div className="att-ptitle">Punch Out</div>
                {lastPunchOut && !canPunchOut ? (
                  <><div className="att-pbadge">{fmtHMS(lastPunchOut)}</div><div className="att-psub">Shift ended</div></>
                ) : canPunchOut ? (
                  <><div className="att-psub">Tap to end your shift</div><div className="att-pcta">Tap to punch out</div></>
                ) : (
                  <div className="att-psub">Punch in first to unlock</div>
                )}
              </div>
            </div>

            {/* session history */}
            <div className="att-hist">
              <div className="att-hist-hdr">
                <span className="att-hist-title">Today's Sessions</span>
                {totalMs > 0 && <span className="att-tbadge">Total {fmtDur(totalMs)}</span>}
              </div>
              {sessions.length === 0 ? (
                <div className="att-empty">No sessions recorded yet</div>
              ) : (
                [...sessions].reverse().map((s, i) => {
                  const dur     = s.punch_in && s.punch_out ? s.punch_out - s.punch_in : null;
                  const running = s.punch_in && !s.punch_out;
                  return (
                    <div key={s.id} className="att-hist-row" style={{ animationDelay:`${i * 45}ms` }}>
                      <div className="att-hist-num">{sessions.length - i}</div>
                      <div><div className="att-hl">In</div><div className={`att-hv ${s.punch_in ? "cv-g" : "cv-d"}`}>{s.punch_in ? fmtHMS(s.punch_in) : "—"}</div></div>
                      <div><div className="att-hl">Out</div><div className={`att-hv ${s.punch_out ? "cv-p" : running ? "cv-g" : "cv-d"}`}>{s.punch_out ? fmtHMS(s.punch_out) : running ? "Active" : "—"}</div></div>
                      <div><div className="att-hl">Duration</div><div className={`att-hv ${dur ? "cv-a" : running ? "cv-g" : "cv-d"}`}>{dur ? fmtDur(dur) : running ? fmtDur(now - s.punch_in) : "—"}</div></div>
                    </div>
                  );
                })
              )}
            </div>

          </div>{/* end left */}

          {/* ════════════ RIGHT — CALENDAR ════════════ */}
          <div className="att-cal-panel">
            <div className="att-cal-card">

              {/* month nav */}
              <div className="att-cal-hdr">
                <button className="att-cal-nav" onClick={prevMonth} aria-label="Previous month">
                  <Ic d="M15 18l-6-6 6-6" size={16} color="var(--txt-dim,rgba(255,255,255,.6))" />
                </button>
                <span className="att-cal-month-label">{MONTHS[calMonth]} {calYear}</span>
                <button className={`att-cal-nav ${!canGoNext ? "disabled" : ""}`} onClick={nextMonth} aria-label="Next month">
                  <Ic d="M9 18l6-6-6-6" size={16} color="var(--txt-dim,rgba(255,255,255,.6))" />
                </button>
              </div>

              {/* month stats */}
              <div className="att-cal-stats">
                <div className="att-cal-stat">
                  <div className="att-cal-stat-val" style={{ color:"#22e58a" }}>{presentDays}</div>
                  <div className="att-cal-stat-lbl">Present</div>
                </div>
                <div className="att-cal-stat">
                  <div className="att-cal-stat-val" style={{ color:"var(--pink,#e8006a)" }}>
                    {(() => {
                      let absent = 0;
                      for (let d = 1; d <= daysInMonth; d++) {
                        const dt = new Date(calYear, calMonth, d);
                        if (dt > today) continue;
                        const dow = dt.getDay();
                        if (dow === 0 || dow === 6) continue;
                        const k = ymd(dt);
                        if (!monthHistory[k]) absent++;
                      }
                      return absent;
                    })()}
                  </div>
                  <div className="att-cal-stat-lbl">Absent</div>
                </div>
                <div className="att-cal-stat">
                  <div className="att-cal-stat-val" style={{ color:"#faaa32" }}>{totalMonthHrs}h</div>
                  <div className="att-cal-stat-lbl">Total Hrs</div>
                </div>
              </div>

              {/* day-of-week header */}
              <div className="att-cal-dow">
                {DAYS.map((d, i) => (
                  <div key={d} className={`att-cal-dow-cell ${i === 0 || i === 6 ? "we" : ""}`}>{d}</div>
                ))}
              </div>

              {/* calendar grid */}
              <div className="att-cal-grid">
                {/* empty cells for first week */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`e${i}`} className="att-cal-cell empty" />
                ))}

                {/* day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const key    = `${calYear}-${pad(calMonth + 1)}-${pad(dayNum)}`;
                  const status = dayStatus(key);
                  const isToday    = key === todayKey;
                  const isSelected = key === selectedDay;
                  const isFuture   = status === "future";
                  const isWeekend  = status === "weekend" || status === "weekend-present";

                  let dotClass = "dot-none";
                  if (status === "full")            dotClass = "dot-full";
                  else if (status === "half")       dotClass = "dot-half";
                  else if (status === "present")    dotClass = "dot-present";
                  else if (status === "absent")     dotClass = "dot-absent";
                  else if (status === "weekend-present") dotClass = "dot-weekend-present";

                  let cellClass = "att-cal-cell";
                  if (isFuture)    cellClass += " future";
                  else if (isToday)    cellClass += " today";
                  if (isSelected)  cellClass += " selected";
                  if (isWeekend && !isToday && !isSelected) cellClass += " weekend";

                  return (
                    <div
                      key={key}
                      className={cellClass}
                      onClick={() => !isFuture ? setSelectedDay(isSelected ? null : key) : undefined}
                      title={isFuture ? "" : key}
                    >
                      <div className="att-cal-day">{dayNum}</div>
                      <div className={`att-cal-dot ${dotClass}`} />
                    </div>
                  );
                })}
              </div>

              {/* legend */}
              <div className="att-cal-legend">
                {[
                  { dot:"#22e58a",    label:"Full day (8h+)" },
                  { dot:"#faaa32",    label:"Partial" },
                  { dot:"rgba(232,0,106,.6)", label:"Absent" },
                ].map(({ dot, label }) => (
                  <div key={label} className="att-leg-item">
                    <div className="att-leg-dot" style={{ background: dot }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* ── day detail pane ── */}
            {selectedDay && (
              <div className="att-day-detail">
                <div className="att-dd-hdr">
                  <span className="att-dd-title">
                    {selectedDayObj?.toLocaleDateString("en-IN", {
                      weekday:"short", day:"numeric", month:"short", year:"numeric",
                    })}
                  </span>
                  <button className="att-dd-close" onClick={() => setSelectedDay(null)} aria-label="Close">
                    <Ic d="M18 6L6 18 | M6 6l12 12" size={14} color="currentColor" sw={2} />
                  </button>
                </div>

                {selectedSessions.length === 0 ? (
                  <div className="att-empty">No attendance recorded</div>
                ) : (
                  <>
                    {selectedSessions.map((s, i) => {
                      const pi = s.punch_in  instanceof Date ? s.punch_in  : new Date(s.punch_in);
                      const po = s.punch_out instanceof Date ? s.punch_out : s.punch_out ? new Date(s.punch_out) : null;
                      const dur = pi && po ? po - pi : null;
                      return (
                        <div key={i} className="att-dd-row" style={{ animationDelay:`${i * 40}ms` }}>
                          <div className="att-hist-num">{i + 1}</div>
                          <div><div className="att-hl">In</div><div className="att-hv cv-g">{fmtHMS(pi)}</div></div>
                          <div><div className="att-hl">Out</div><div className={`att-hv ${po ? "cv-p" : "cv-g"}`}>{po ? fmtHMS(po) : "Active"}</div></div>
                          <div><div className="att-hl">Duration</div><div className={`att-hv ${dur ? "cv-a" : "cv-g"}`}>{dur ? fmtDur(dur) : "—"}</div></div>
                        </div>
                      );
                    })}
                    {/* total row */}
                    {(() => {
                      const t = selectedSessions.reduce((a, s) => {
                        const pi = s.punch_in  instanceof Date ? s.punch_in  : new Date(s.punch_in);
                        const po = s.punch_out instanceof Date ? s.punch_out : s.punch_out ? new Date(s.punch_out) : null;
                        return (pi && po) ? a + (po - pi) : a;
                      }, 0);
                      return t > 0 ? (
                        <div className="att-dd-total">
                          <span>Total for the day</span>
                          <span className="att-tbadge">{fmtDur(t)}</span>
                        </div>
                      ) : null;
                    })()}
                  </>
                )}
              </div>
            )}

          </div>{/* end right */}

        </div>{/* end layout */}
      </div>
    </>
  );
}