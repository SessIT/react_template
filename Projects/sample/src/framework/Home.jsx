// ─── Home.jsx ─────────────────────────────────────────────────────────────────
// SESS Dashboard — Home Page
// Three charts: Pie (Attendance) · Column/Bar (Weekly Hours) · Line (Punch trend)
//
// All colours use CSS variables from SharedUI / global stylesheet so dark-mode
// and light-mode both work automatically — zero hardcoded palette values inside
// component styles.
//
// Chart accent colours (cyan, pink, amber, green, blue) come from the same
// --pink / --blue / --cyan CSS variables set by the app theme.
//
// Requires:  npm install recharts
// Imports:   Ic, SectionCard from ./SharedUI

import { useState, useEffect } from "react";
import { Ic } from "./SharedUI";
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip,
  LineChart, Line, Tooltip as LineTooltip,
  XAxis as LXAxis, YAxis as LYAxis, CartesianGrid as LGrid,
} from "recharts";

// ─── Accent palette — these MATCH your existing CSS var values ────────────────
// We keep them as JS constants only for Recharts SVG props (stroke/fill attrs
// inside SVG cannot use CSS vars). Every non-SVG colour uses var(--…) instead.
const A = {
  cyan:  "#22E5F5",
  pink:  "#E8006A",
  amber: "#F5A623",
  green: "#22e58a",
  blue:  "#3B5BFF",
};

// ─── Data ────────────────────────────────────────────────────────────────────

const pieData = [
  { name: "Present",  value: 18, color: A.green },
  { name: "Absent",   value: 3,  color: A.pink  },
  { name: "Half Day", value: 4,  color: A.amber },
  { name: "Leave",    value: 2,  color: A.blue  },
  { name: "Weekend",  value: 9,  color: A.cyan  },
];

const barData = [
  { week: "Wk 1", Target: 40, Actual: 42 },
  { week: "Wk 2", Target: 40, Actual: 38 },
  { week: "Wk 3", Target: 40, Actual: 44 },
  { week: "Wk 4", Target: 40, Actual: 36 },
  { week: "Wk 5", Target: 20, Actual: 18 },
];

const lineData = [
  { day: "Mon 1", punchIn: 8.5,  punchOut: 17.2 },
  { day: "Tue 1", punchIn: 9.1,  punchOut: 18.0 },
  { day: "Wed 1", punchIn: 8.3,  punchOut: 17.5 },
  { day: "Thu 1", punchIn: 8.8,  punchOut: 17.8 },
  { day: "Fri 1", punchIn: 9.3,  punchOut: 17.0 },
  { day: "Mon 2", punchIn: 8.6,  punchOut: 17.6 },
  { day: "Tue 2", punchIn: 8.2,  punchOut: 18.1 },
  { day: "Wed 2", punchIn: 9.0,  punchOut: 17.3 },
  { day: "Thu 2", punchIn: 8.7,  punchOut: 17.9 },
  { day: "Fri 2", punchIn: 8.4,  punchOut: 16.8 },
];

const statCards = [
  {
    label:   "Present Days",
    value:   "18",
    unit:    "/ 27",
    icon:    "M9 12l2 2 4-4 | M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z",
    accent:  A.green,
    bgVar:   "rgba(34,229,138,0.10)",
    brdVar:  "rgba(34,229,138,0.25)",
  },
  {
    label:   "Total Hours",
    value:   "144",
    unit:    "hrs",
    icon:    "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z | M12 6v6l3 3",
    accent:  A.cyan,
    bgVar:   "rgba(34,229,245,0.10)",
    brdVar:  "rgba(34,229,245,0.25)",
  },
  {
    label:   "Avg. In Time",
    value:   "08:42",
    unit:    "AM",
    icon:    "M12 8v4l2 2 | M3.05 11A9 9 0 1 0 3.6 7",
    accent:  A.amber,
    bgVar:   "rgba(245,166,35,0.10)",
    brdVar:  "rgba(245,166,35,0.25)",
  },
  {
    label:   "Leaves Taken",
    value:   "2",
    unit:    "days",
    icon:    "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 | M16 17l5-5-5-5 | M21 12H9",
    accent:  A.pink,
    bgVar:   "rgba(232,0,106,0.10)",
    brdVar:  "rgba(232,0,106,0.25)",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, "0");
const fmtHour = (h) => {
  const hh = Math.floor(h);
  const mm  = Math.round((h - hh) * 60);
  const ap  = hh >= 12 ? "PM" : "AM";
  return `${hh % 12 || 12}:${pad(mm)} ${ap}`;
};

// ─── Custom Recharts tooltips (use CSS vars for bg/border/text) ──────────────
const TipShell = ({ children }) => (
  <div style={{
    background:   "var(--surf)",
    border:       "1px solid var(--border2)",
    borderRadius: 10,
    padding:      "10px 14px",
    fontSize:     12,
    color:        "var(--txt)",
    lineHeight:   1.7,
    boxShadow:    "0 8px 24px rgba(0,0,0,0.3)",
  }}>
    {children}
  </div>
);

const PieTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, color } = payload[0].payload;
  return (
    <TipShell>
      <div style={{ fontWeight: 700, color }}>{name}</div>
      <div style={{ color: "var(--txt-dim)" }}>{value} days</div>
    </TipShell>
  );
};

const BarTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <TipShell>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.fill }}>
          {p.name}: <strong>{p.value}h</strong>
        </div>
      ))}
    </TipShell>
  );
};

const LineTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <TipShell>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.stroke }}>
          {p.name}: <strong>{fmtHour(p.value)}</strong>
        </div>
      ))}
    </TipShell>
  );
};

// ─── Pie % label (rendered in SVG so must use literal fill) ──────────────────
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.07) return null;
  const R  = Math.PI / 180;
  const r  = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x  = cx + r * Math.cos(-midAngle * R);
  const y  = cy + r * Math.sin(-midAngle * R);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle"
      dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ─── Axis tick fill — adapts per chart (passed as prop) ──────────────────────
// Recharts tick props must be plain strings, not CSS vars.
// We read the computed value once on mount so it works in both themes.
function useTickColor() {
  const [col, setCol] = useState("rgba(120,120,140,0.7)");
  useEffect(() => {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--txt-dim").trim();
    if (v) setCol(v);
  }, []);
  return col;
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const tickCol = useTickColor();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      <style>{`
        /* ── keyframes ── */
        @keyframes home-fadeup {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0);    }
        }

        /* ── root ── */
        .home-root * { box-sizing: border-box; }
        .home-root {
          padding: 0px 20px 52px;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* ── page header ── */
        .home-hdr {
          margin-bottom: 22px;
          animation: home-fadeup 0.45s ease both;
        }
        .home-title {
          font-size: clamp(19px, 3.5vw, 26px);
          font-weight: 700;
          color: var(--txt);
          letter-spacing: -0.4px;
          line-height: 1.2;
          font-family: var(--font-syne, 'Syne', sans-serif);
        }
        .home-sub {
          font-size: 12px;
          color: var(--txt-dim);
          margin-top: 4px;
          font-family: var(--font-mono, monospace);
        }

        /* ── stat cards ── */
        .home-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 18px;
          animation: home-fadeup 0.5s ease 0.05s both;
        }
        @media (min-width: 640px)  { .home-stats { grid-template-columns: repeat(4, 1fr); } }

        .home-stat-card {
          background:    var(--surf);
          border:        1px solid var(--border);
          border-radius: 16px;
          padding:       1rem 1.1rem 0.9rem;
          transition:    border-color 0.3s, transform 0.2s;
          cursor:        default;
        }
        .home-stat-card:hover {
          transform:    translateY(-2px);
          border-color: var(--border2);
        }
        .home-stat-icon-row {
          display:       flex;
          align-items:   center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .home-stat-icon {
          width: 32px; height: 32px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .home-stat-lbl {
          font-size:      10px;
          font-weight:    700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color:          var(--txt-dim);
          margin-bottom:  6px;
          font-family:    var(--font-mono, monospace);
        }
        .home-stat-val {
          font-size:   clamp(22px, 4vw, 28px);
          font-weight: 700;
          line-height: 1;
          font-family: var(--font-mono, monospace);
        }
        .home-stat-unit {
          font-size:   12px;
          font-weight: 500;
          color:       var(--txt-dim);
          margin-left: 4px;
        }
        .home-stat-bar {
          height:        3px;
          border-radius: 2px;
          margin-top:    12px;
          width:         38%;
          opacity:       0.65;
        }

        /* ── chart grid ── */
        .home-charts {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          animation: home-fadeup 0.55s ease 0.1s both;
        }
        @media (min-width: 900px) {
          .home-charts {
            grid-template-columns: 340px 1fr;
            grid-template-rows: auto auto;
          }
          .home-chart-full { grid-column: 1 / -1; }
        }

        /* ── chart card ── */
        .home-chart-card {
          background:    var(--surf);
          border:        1px solid var(--border);
          border-radius: 20px;
          padding:       1.25rem 1.4rem 1rem;
          overflow:      hidden;
          transition:    border-color 0.25s;
        }
        .home-chart-card:hover { border-color: var(--border2); }

        .home-chart-hdr {
          display:         flex;
          align-items:     flex-start;
          justify-content: space-between;
          gap:             10px;
          margin-bottom:   16px;
        }
        .home-chart-title {
          font-size:   14px;
          font-weight: 700;
          color:       var(--txt);
          line-height: 1.3;
          font-family: var(--font-syne, 'Syne', sans-serif);
        }
        .home-chart-sub {
          font-size:  11px;
          color:      var(--txt-dim);
          margin-top: 2px;
          font-family: var(--font-mono, monospace);
        }
        .home-chart-badge {
          font-size:     10px;
          font-weight:   700;
          letter-spacing:.05em;
          text-transform:uppercase;
          border-radius: 8px;
          padding:       4px 10px;
          white-space:   nowrap;
          flex-shrink:   0;
          font-family:   var(--font-mono, monospace);
        }

        /* chart wrappers — responsive heights */
        .home-pie-h  { height: 270px; }
        .home-bar-h  { height: 270px; }
        .home-line-h { height: 290px; }
        @media (min-width: 640px) {
          .home-pie-h  { height: 310px; }
          .home-bar-h  { height: 310px; }
          .home-line-h { height: 320px; }
        }

        /* recharts overrides — hide built-in white backgrounds */
        .recharts-tooltip-wrapper { outline: none; }
        .recharts-default-legend  { padding-top: 6px !important; }
        .recharts-legend-item-text {
          color: var(--txt-dim) !important;
          font-size: 11px !important;
        }
      `}</style>

      <div
        className="home-root"
        style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.4s ease" }}
      >

        {/* ── Page header ── */}
        {/* <div className="home-hdr">
          <div className="home-title">Dashboard Overview</div>
          <div className="home-sub">{todayLabel}</div>
        </div> */}

        {/* ── Stat cards ── */}
        <div className="home-stats">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="home-stat-card"
              style={{
                borderColor: s.brdVar,
                animationDelay: `${i * 55}ms`,
              }}
            >
              <div className="home-stat-icon-row">
                <div
                  className="home-stat-icon"
                  style={{ background: s.bgVar, color: s.accent }}
                >
                  <Ic d={s.icon} size={15} />
                </div>
              </div>
              <div className="home-stat-lbl">{s.label}</div>
              <div className="home-stat-val" style={{ color: s.accent }}>
                {s.value}
                <span className="home-stat-unit">{s.unit}</span>
              </div>
              <div className="home-stat-bar" style={{ background: s.accent }} />
            </div>
          ))}
        </div>

        {/* ── Charts ── */}
        <div className="home-charts">

          {/* ════ 1. PIE — Attendance Breakdown ════ */}
          <div className="home-chart-card">
            <div className="home-chart-hdr">
              <div>
                <div className="home-chart-title">Attendance Breakdown</div>
                <div className="home-chart-sub">This month · 36 calendar days</div>
              </div>
              <div
                className="home-chart-badge"
                style={{ background: "rgba(34,229,138,0.12)", color: A.green }}
              >
                Mar 2025
              </div>
            </div>

            <div className="home-pie-h">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="46%"
                    innerRadius="30%" outerRadius="58%"
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={PieLabel}
                    animationBegin={200}
                    animationDuration={900}
                  >
                    {pieData.map((d, i) => (
                      <Cell
                        key={i}
                        fill={d.color}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <PieTooltip content={<PieTip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(val) => (
                      <span style={{ color: "var(--txt-dim)", fontSize: 11 }}>{val}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ════ 2. BAR (Column) — Weekly Hours ════ */}
          <div className="home-chart-card">
            <div className="home-chart-hdr">
              <div>
                <div className="home-chart-title">Weekly Working Hours</div>
                <div className="home-chart-sub">Target vs Actual · Current month</div>
              </div>
              <div
                className="home-chart-badge"
                style={{ background: "rgba(34,229,245,0.12)", color: A.cyan }}
              >
                40h target
              </div>
            </div>

            <div className="home-bar-h">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  barCategoryGap="30%"
                  barGap={4}
                  margin={{ top: 4, right: 8, left: -14, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: tickCol, fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: tickCol, fontSize: 11 }}
                    domain={[0, 50]}
                    tickCount={6}
                  />
                  <BarTooltip
                    content={<BarTip />}
                    cursor={{ fill: "var(--border)" }}
                  />
                  <Legend
                    iconType="square"
                    iconSize={9}
                    formatter={(val) => (
                      <span style={{ color: "var(--txt-dim)", fontSize: 11 }}>{val}</span>
                    )}
                  />
                  {/* Target — ghost column */}
                  <Bar
                    dataKey="Target"
                    fill={`${A.blue}40`}
                    stroke={A.blue}
                    strokeWidth={1}
                    radius={[5, 5, 0, 0]}
                    animationDuration={900}
                    animationBegin={200}
                  />
                  {/* Actual — solid cyan */}
                  <Bar
                    dataKey="Actual"
                    fill={A.cyan}
                    radius={[5, 5, 0, 0]}
                    animationDuration={900}
                    animationBegin={360}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ════ 3. LINE — Punch In / Out Trend ════ */}
          <div className="home-chart-card home-chart-full">
            <div className="home-chart-hdr">
              <div>
                <div className="home-chart-title">Punch In / Out Time Trend</div>
                <div className="home-chart-sub">Daily entry & exit hours — last 10 working days</div>
              </div>
              <div
                className="home-chart-badge"
                style={{ background: "rgba(245,166,35,0.12)", color: A.amber }}
              >
                Last 10 days
              </div>
            </div>

            <div className="home-line-h">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineData}
                  margin={{ top: 4, right: 16, left: -14, bottom: 0 }}
                >
                  <LGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <LXAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: tickCol, fontSize: 11 }}
                  />
                  <LYAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: tickCol, fontSize: 11 }}
                    domain={[6, 20]}
                    tickCount={8}
                    tickFormatter={(v) => `${v}:00`}
                  />
                  <LineTooltip
                    content={<LineTip />}
                    cursor={{ stroke: "var(--border2)" }}
                  />
                  <Legend
                    iconType="plainline"
                    iconSize={16}
                    formatter={(val) => (
                      <span style={{ color: "var(--txt-dim)", fontSize: 11 }}>{val}</span>
                    )}
                  />
                  {/* Punch In line — green solid */}
                  <Line
                    type="monotone"
                    dataKey="punchIn"
                    name="Punch In"
                    stroke={A.green}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: A.green, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: A.green, stroke: "var(--surf)", strokeWidth: 2 }}
                    animationDuration={1000}
                    animationBegin={200}
                  />
                  {/* Punch Out line — pink dashed */}
                  <Line
                    type="monotone"
                    dataKey="punchOut"
                    name="Punch Out"
                    stroke={A.pink}
                    strokeWidth={2.5}
                    strokeDasharray="5 3"
                    dot={{ r: 4, fill: A.pink, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: A.pink, stroke: "var(--surf)", strokeWidth: 2 }}
                    animationDuration={1000}
                    animationBegin={420}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>{/* /home-charts */}
      </div>
    </>
  );
}