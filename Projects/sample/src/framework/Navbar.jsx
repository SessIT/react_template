// ─── Navbar.jsx ──────────────────────────────────────────────────────────────
// Top header bar with: hamburger (mobile), title/greeting, date chip,
// dark/light toggle, notification bell + dropdown, user profile chip + dropdown.
// Props:
//   name          string   – employee full name
//   designation   string   – employee role
//   greeting      string   – "Good morning / afternoon / evening"
//   darkMode      bool
//   setDarkMode   fn
//   setSidebarOpen fn      – opens mobile drawer

import { useState, useEffect, useRef } from "react";
import { Ic } from "./SharedUI";

/* ── Notification mock data ───────────────────────────────────────────────── */
const NOTIFICATIONS = [
  {
    id: 1,
    msg: "Morning report for today is pending",
    time: "9:00 AM",
    dot: "var(--pink)",
  },
  {
    id: 2,
    msg: "Punch In recorded successfully",
    time: "8:45 AM",
    dot: "var(--blue)",
  },
  {
    id: 3,
    msg: "Expense approval from manager",
    time: "Yesterday",
    dot: "var(--amber)",
  },
];

/* ── Profile dropdown menu item ───────────────────────────────────────────── */
function ProfileMenuItem({ icon, label, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[13px] cursor-pointer border-none transition-colors text-left"
      style={{
        background: "transparent",
        color: danger ? "var(--pink)" : "var(--txt-dim)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = danger
          ? "rgba(232,0,106,0.08)"
          : "rgba(34,229,245,0.06)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Ic d={icon} size={14} />
      <span>{label}</span>
    </button>
  );
}

/* ── Navbar ───────────────────────────────────────────────────────────────── */
export default function Navbar({
  name,
  designation,
  greeting,
  darkMode,
  setDarkMode,
  setSidebarOpen,
  collapsed,
  setCollapsed,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const dateDisplay = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-[100] flex items-center gap-3 px-4 sm:px-6 py-3"
      style={{
        background: "var(--surf)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
        minHeight: 58,
      }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer border transition-colors"
        style={{
          background: "transparent",
          borderColor: "var(--border)",
          color: "var(--txt-dim)",
        }}
      >
        <Ic d="M3 12h18 M3 6h18 M3 18h18" size={17} />
      </button>

      {/* Desktop sidebar collapse */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl border cursor-pointer transition-colors"
        style={{
          background: "var(--surf2)",
          borderColor: "var(--border)",
          color: "var(--txt-dim)",
          marginLeft: "-25px",
          borderRadius: "0px"
        }}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <Ic d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} size={16} />
      </button>

      {/* Title + greeting */}
      <div className="flex-1 min-w-0">
        <h1
          className="font-syne text-[16px] sm:text-[17px] font-bold truncate"
          style={{ color: "var(--txt)" }}
        >
          {greeting}, {name.split(" ")[0]}!
        </h1>
        <p
          className="font-mono text-[10px] mt-0.5 hidden sm:block"
          style={{ color: "var(--pink)" }}
        >
          "Believe you can and you’re halfway there."
        </p>
      </div>

      {/* ── Right actions ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Date chip */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border"
          style={{ background: "var(--surf2)", borderColor: "var(--border)" }}
        >
          <Ic
            d="M8 2v4 M16 2v4 M3 10h18 M3 6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            size={12}
            style={{ color: "var(--pink)" }}
          />
          <span
            className="font-mono text-[11px]"
            style={{ color: "var(--txt-dim)" }}
          >
            {dateDisplay}
          </span>
        </div>

        {/* Dark / Light toggle */}
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="flex items-center justify-center w-9 h-9 rounded-xl border cursor-pointer transition-colors"
          style={{
            background: "var(--surf2)",
            borderColor: "var(--border)",
            color: "var(--txt-dim)",
          }}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <Ic
            d={
              darkMode
                ? "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                : "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            }
            size={15}
          />
        </button>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen((o) => !o);
              setProfileOpen(false);
            }}
            className="flex items-center justify-center w-9 h-9 rounded-xl border cursor-pointer transition-colors relative"
            style={{
              background: "var(--surf2)",
              borderColor: "var(--border)",
              color: "var(--txt-dim)",
            }}
          >
            <Ic
              d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0"
              size={15}
            />
            {/* Unread dot */}
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full anim-pulse"
              style={{
                background: "var(--pink)",
                border: "2px solid var(--surf)",
              }}
            />
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-2xl border shadow-2xl z-[500] anim-dropin overflow-hidden"
              style={{
                background: "var(--surf)",
                borderColor: "var(--border2)",
                top: "100%",
              }}
            >
              <div
                className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: "var(--border)" }}
              >
                <p
                  className="font-syne text-[13px] font-bold"
                  style={{ color: "var(--txt)" }}
                >
                  Notifications
                </p>
                <span
                  className="font-mono text-[10px] px-2 py-0.5 rounded-md"
                  style={{
                    background: "rgba(232,0,106,0.1)",
                    color: "var(--pink)",
                  }}
                >
                  3 new
                </span>
              </div>

              {NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
                  style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(34,229,245,0.04)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: n.dot }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[12.5px] leading-snug"
                      style={{ color: "var(--txt)" }}
                    >
                      {n.msg}
                    </p>
                    <p
                      className="font-mono text-[10px] mt-0.5"
                      style={{ color: "var(--txt-muted)" }}
                    >
                      {n.time}
                    </p>
                  </div>
                </div>
              ))}

              <div className="px-4 py-2.5 text-center">
                <button
                  className="font-mono text-[11px] cursor-pointer border-none bg-transparent"
                  style={{ color: "var(--pink)" }}
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User profile chip */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border cursor-pointer transition-colors"
            style={{
              background: "var(--surf2)",
              borderColor: "var(--border2)",
            }}
          >
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-syne font-bold text-xs text-white"
              style={{
                background: "linear-gradient(135deg,var(--pink),var(--blue))",
              }}
            >
              {initials}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p
                className="font-syne text-[12px] font-bold leading-none"
                style={{ color: "var(--txt)" }}
              >
                {name}
              </p>
              <p
                className="font-mono text-[9.5px] mt-0.5"
                style={{ color: "var(--pink)" }}
              >
                {designation}
              </p>
            </div>
            <Ic
              d="M6 9l6 6 6-6"
              size={12}
              style={{ color: "var(--txt-muted)" }}
            />
          </button>

          {/* Profile dropdown */}
          {profileOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-2xl border shadow-2xl z-[500] anim-dropin overflow-hidden"
              style={{
                background: "var(--surf)",
                borderColor: "var(--border2)",
                top: "100%",
              }}
            >
              {/* Mini profile header */}
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-syne font-bold text-sm text-white"
                    style={{
                      background:
                        "linear-gradient(135deg,var(--pink),var(--blue))",
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p
                      className="font-syne text-[13px] font-bold"
                      style={{ color: "var(--txt)" }}
                    >
                      {name}
                    </p>
                    <p
                      className="font-mono text-[10px]"
                      style={{ color: "var(--pink)" }}
                    >
                      {designation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <ProfileMenuItem
                  icon="M12 12a4 4 0 100-8 4 4 0 000 8z M4 20c0-4 3.6-7 8-7s8 3 8 7"
                  label="My Profile"
                  onClick={() => setProfileOpen(false)}
                />
                <ProfileMenuItem
                  icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  label="Accounts & Settings"
                  onClick={() => setProfileOpen(false)}
                />
                <ProfileMenuItem
                  icon="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  label="Help & Support"
                  onClick={() => setProfileOpen(false)}
                />
                <div
                  className="my-1"
                  style={{ borderTop: "1px solid var(--border)" }}
                />
                <ProfileMenuItem
                  icon="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                  label="Logout"
                  danger
                  onClick={() => {
                    window.location.href = '/';
                    setProfileOpen(false); /* handle logout */
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
