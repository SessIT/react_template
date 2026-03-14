import { useState } from "react";

// ─── Icons (inline SVG components) ───────────────────────────────────────────
const Icon = ({ d, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

const Icons = {
  dashboard:  "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  employees:  "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  attendance: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  payroll:    "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  tasks:      "M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  reports:    "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  settings:   "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
  bell:       "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  search:     "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  menu:       "M3 12h18 M3 6h18 M3 18h18",
  close:      "M18 6L6 18 M6 6l12 12",
  chevron:    "M9 18l6-6-6-6",
  trending:   "M23 6l-9.5 9.5-5-5L1 18",
  clock:      "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2",
  star:       "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  arrow:      "M5 12h14 M12 5l7 7-7 7",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const quotes = [
  "Great things are done by a series of small things brought together.",
  "The secret of getting ahead is getting started.",
  "Quality is not an act, it is a habit.",
  "Success is the sum of small efforts repeated day in and day out.",
];

const stats = [
  { label: "Tasks Completed", value: "24", sub: "+3 today", color: "#6EE7B7", icon: Icons.tasks },
  { label: "Attendance", value: "96%", sub: "This month", color: "#93C5FD", icon: Icons.attendance },
  { label: "Pending Leaves", value: "2", sub: "Awaiting approval", color: "#FCA5A5", icon: Icons.clock },
  { label: "Performance", value: "4.8", sub: "Out of 5.0", color: "#FCD34D", icon: Icons.star },
];

const recentActivity = [
  { time: "09:15 AM", action: "Checked in", status: "success" },
  { time: "10:30 AM", action: "Completed Task: UI Review", status: "success" },
  { time: "12:00 PM", action: "Lunch Break", status: "info" },
  { time: "02:00 PM", action: "Meeting: Sprint Planning", status: "info" },
  { time: "04:45 PM", action: "Submitted Report", status: "success" },
];

const tasks = [
  { title: "Update employee records", priority: "High", due: "Today", done: false },
  { title: "Review payroll summary", priority: "Medium", due: "Tomorrow", done: true },
  { title: "Prepare Q2 report", priority: "High", due: "Jun 30", done: false },
  { title: "Team standup notes", priority: "Low", due: "Today", done: true },
];

const navItems = [
  { label: "Dashboard",  icon: Icons.dashboard,  active: true },
  { label: "Employees",  icon: Icons.employees },
  { label: "Attendance", icon: Icons.attendance },
  { label: "Payroll",    icon: Icons.payroll },
  { label: "Tasks",      icon: Icons.tasks },
  { label: "Reports",    icon: Icons.reports },
  { label: "Settings",   icon: Icons.settings },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ stat }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'DM Mono', monospace" }}>
          {stat.label}
        </span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: stat.color + "18", color: stat.color }}>
          <Icon d={stat.icon} size={17} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold tracking-tight"
          style={{ color: stat.color, fontFamily: "'Syne', sans-serif" }}>
          {stat.value}
        </span>
      </div>
      <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{stat.sub}</span>
      <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full opacity-5"
        style={{ background: stat.color, transform: "translate(30%, 30%)" }} />
    </div>
  );
}

function SidebarItem({ item, collapsed, onClick, active }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative"
      style={{
        background: active ? "rgba(110,231,183,0.12)" : "transparent",
        color: active ? "#6EE7B7" : "rgba(255,255,255,0.5)",
        border: active ? "1px solid rgba(110,231,183,0.2)" : "1px solid transparent",
      }}>
      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full" style={{ background: "#6EE7B7" }} />}
      <span className="flex-shrink-0"><Icon d={item.icon} size={18} /></span>
      {!collapsed && (
        <span className="text-sm font-medium whitespace-nowrap transition-all"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {item.label}
        </span>
      )}
      {collapsed && (
        <span className="absolute left-14 z-50 px-2 py-1 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity"
          style={{ background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
          {item.label}
        </span>
      )}
    </button>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [taskList, setTaskList] = useState(tasks);
  const [quoteIdx] = useState(Math.floor(Math.random() * quotes.length));

  const toggleTask = (i) => setTaskList(prev =>
    prev.map((t, idx) => idx === i ? { ...t, done: !t.done } : t)
  );

  const priorityColor = { High: "#FCA5A5", Medium: "#FCD34D", Low: "#93C5FD" };
  const statusColor   = { success: "#6EE7B7", info: "#93C5FD" };

  return (
    <div className="flex h-screen w-full overflow-hidden"
      style={{ background: "#0d1117", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
      `}</style>

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside className="flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out"
        style={{
          width: collapsed ? "72px" : "240px",
          background: "rgba(255,255,255,0.03)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 mb-2">
          <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #6EE7B7, #3B82F6)", color: "#0d1117", fontFamily: "'Syne', sans-serif" }}>
            EX
          </div>
          {!collapsed && (
            <span className="text-white font-bold text-base tracking-tight whitespace-nowrap"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              EmpexOS
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1 px-3 flex-1 overflow-y-auto">
          {navItems.map(item => (
            <SidebarItem key={item.label} item={item}
              collapsed={collapsed}
              active={activeNav === item.label}
              onClick={() => setActiveNav(item.label)} />
          ))}
        </nav>

        {/* Toggle Button */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <button onClick={() => setCollapsed(p => !p)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>
            <Icon d={collapsed ? Icons.chevron : Icons.menu} size={16}
              className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
            {!collapsed && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px" }}>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* ── Navbar ────────────────────────────────────────────── */}
        <header className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>

          {/* Left: Welcome + Quote */}
          <div className="flex flex-col gap-0.5">
            <span className="text-white font-semibold text-base"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              Good Morning, Alex 👋
            </span>
            <span className="text-xs italic"
              style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", maxWidth: "420px" }}>
              "{quotes[quoteIdx]}"
            </span>
          </div>

          {/* Right: Search + Bell + Profile */}
          <div className="flex items-center gap-3">

            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Icon d={Icons.search} size={14} className="opacity-40" style={{ color: "#fff" }} />
              <input placeholder="Search..." className="bg-transparent outline-none text-sm w-32"
                style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }} />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)" }}>
                <Icon d={Icons.bell} size={17} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ background: "#6EE7B7", boxShadow: "0 0 6px #6EE7B7" }} />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-72 rounded-2xl p-3 z-50 fade-in"
                  style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <p className="text-xs font-semibold mb-3 tracking-widest uppercase"
                    style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>Notifications</p>
                  {["Payslip for June is ready", "Leave approved by manager", "New task assigned to you"].map((n, i) => (
                    <div key={i} className="flex gap-3 items-start py-2.5 border-b"
                      style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#6EE7B7" }} />
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{n}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #6EE7B7, #3B82F6)", color: "#0d1117", fontFamily: "'Syne', sans-serif" }}>
                  AJ
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>Alex Johnson</span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace" }}>UI Developer</span>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-52 rounded-2xl p-2 z-50 fade-in"
                  style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {["My Profile", "Account Settings", "Help & Support", "Sign Out"].map((item, i) => (
                    <button key={i}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/5"
                      style={{ color: i === 3 ? "#FCA5A5" : "rgba(255,255,255,0.65)" }}>
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page Body ─────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">

            {/* Page Title */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Syne', sans-serif" }}>Dashboard</h1>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>
                  Tuesday, 11 June 2026
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
                style={{ background: "rgba(110,231,183,0.1)", border: "1px solid rgba(110,231,183,0.2)", color: "#6EE7B7" }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#6EE7B7" }} />
                Active — Checked In
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {stats.map((s, i) => <StatCard key={i} stat={s} />)}
            </div>

            {/* Lower Grid: Activity + Tasks */}
            <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>

              {/* Today's Activity */}
              <div className="rounded-2xl p-5 flex flex-col gap-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Today's Activity</span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace" }}>June 11</span>
                </div>
                <div className="flex flex-col gap-3">
                  {recentActivity.map((a, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: statusColor[a.status] }} />
                      <span className="text-xs flex-shrink-0"
                        style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", width: "68px" }}>
                        {a.time}
                      </span>
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{a.action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* My Tasks */}
              <div className="rounded-2xl p-5 flex flex-col gap-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>My Tasks</span>
                  <span className="text-xs px-2 py-1 rounded-lg"
                    style={{ background: "rgba(147,197,253,0.1)", color: "#93C5FD", fontFamily: "'DM Mono', monospace" }}>
                    {taskList.filter(t => !t.done).length} pending
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {taskList.map((task, i) => (
                    <div key={i}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
                      style={{ background: task.done ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)" }}>
                      <button onClick={() => toggleTask(i)}
                        className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border transition-all"
                        style={{
                          background: task.done ? "#6EE7B7" : "transparent",
                          borderColor: task.done ? "#6EE7B7" : "rgba(255,255,255,0.2)",
                        }}>
                        {task.done && (
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="#0d1117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <span className="flex-1 text-sm"
                        style={{ color: task.done ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.75)",
                          textDecoration: task.done ? "line-through" : "none" }}>
                        {task.title}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md flex-shrink-0"
                        style={{
                          background: priorityColor[task.priority] + "18",
                          color: priorityColor[task.priority],
                          fontFamily: "'DM Mono', monospace",
                        }}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-sm font-semibold text-white block mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}>Quick Actions</span>
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: "Apply Leave",    color: "#FCA5A5" },
                  { label: "View Payslip",   color: "#FCD34D" },
                  { label: "My Attendance",  color: "#93C5FD" },
                  { label: "Submit Report",  color: "#6EE7B7" },
                ].map((a, i) => (
                  <button key={i}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                    style={{
                      background: a.color + "12",
                      border: `1px solid ${a.color}30`,
                      color: a.color,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                    {a.label}
                    <Icon d={Icons.arrow} size={14} />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}