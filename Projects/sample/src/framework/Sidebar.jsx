// ─── Sidebar.jsx ─────────────────────────────────────────────────────────────
// Left panel with SESS emblem, collapsible nav, Pay/Settings links, Logout btn.
// Props:
//   activeTab        string   – currently selected tab id
//   setActiveTab     fn       – change active tab
//   collapsed        bool     – desktop collapsed state
//   setCollapsed     fn       – toggle collapse
//   sidebarOpen      bool     – mobile drawer open
//   setSidebarOpen   fn       – toggle mobile drawer
//   isMobile         bool     – renders mobile variant

import { SESSEmblem, Ic, NavItem } from "./SharedUI";
import logo from "../assets/sess-logo.png";
import name from "../assets/comname.jpeg"

const TABS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  },
  {
    id: "overview",
    label: "Overview",
    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  },
  {
    id: "morning",
    label: "Morning Report",
    icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z",
  },
  {
    id: "evening",
    label: "Evening Report",
    icon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2 M9 12l2 2 4-4",
  },
];

/* ── Inner content (shared between desktop + mobile) ──────────────────────── */
function SidebarContent({ activeTab, setActiveTab, collapsed, setCollapsed, setSidebarOpen, isMobile }) {
  const isCollapsed = collapsed && !isMobile;

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div
        className="flex items-center px-4 py-4 border-b"
        style={{ borderColor:"var(--border)", minHeight:64 }}
      >
        

        {/* Brand text – hidden when collapsed on desktop */}
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <img src={name} alt="" />
          </div>
        )}

        {/* Emblem – always visible */}
        <div className="flex-shrink-0 flex items-center justify-center" style={{ width:36, height:36 }}>
          {/* <SESSEmblem size={34} /> */}
          <img src={logo} alt="" />
        </div>

        {/* Desktop collapse toggle */}
        {/* {!isMobile && (
          <button
            onClick={() => setCollapsed(c => !c)}
            className="flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer border-none transition-colors"
            style={{ background:"rgba(34,229,245,0.07)", color:"var(--txt-dim)", flexShrink:0, marginLeft: isCollapsed ? "auto" : "8px" }}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Ic d={isCollapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} size={14} />
          </button>
        )} */}

        {/* Mobile close btn */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-2 cursor-pointer border-none"
            style={{ background:"none", color:"var(--txt-dim)" }}
          >
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        )}
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5 overflow-y-auto no-scrollbar">
        {!isCollapsed && (
          <p className="font-mono text-[9px] px-2 pb-2 pt-1 uppercase tracking-widest" style={{ color:"var(--pink)"}}>
            Reports
          </p>
        )}

        {TABS.map(t => (
          <NavItem
            key={t.id}
            icon={t.icon}
            label={t.label}
            active={activeTab === t.id}
            collapsed={isCollapsed}
            onClick={() => handleNavClick(t.id)}
          />
        ))}

        {/* Divider */}
        <div className="my-2" style={{ borderTop:"1px solid var(--border)" }} />

        {!isCollapsed && (
          <p className="font-mono text-[9px] px-2 pb-2 pt-1 uppercase tracking-widest" style={{ color:"var(--pink)" }}>
            More
          </p>
        )}

        {/* Pay */}
        <NavItem
          icon="M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
          label="Pay"
          active={false}
          collapsed={isCollapsed}
          onClick={() => {}}
        />

        {/* Settings */}
        <NavItem
          icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          label="Settings"
          active={false}
          collapsed={isCollapsed}
          onClick={() => {}}
        />
      </nav>

      {/* ── Logout ──────────────────────────────────────────────── */}
      <div className="px-2 py-3 border-t" style={{ borderColor:"var(--border)" }}>
        <button
          className="nav-btn relative flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium border-none cursor-pointer transition-all duration-150"
          style={{
            background:     "rgba(232,0,106,0.07)",
            color:          "var(--pink)",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(232,0,106,0.14)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(232,0,106,0.07)"}
          onClick={() => { window.location.href = '/';/* handle logout */ }}
        >
          <Ic d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" size={15} />
          {!isCollapsed && <span>Logout</span>}
          {isCollapsed  && <span className="nav-tooltip">Logout</span>}
        </button>
      </div>
    </div>
  );
}

/* ── Public Sidebar component ──────────────────────────────────────────────── */
export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto overflow-x-hidden transition-all duration-300 no-scrollbar"
        style={{
          width:       collapsed ? 64 : 220,
          background:  "var(--surf)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <SidebarContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setSidebarOpen={setSidebarOpen}
          isMobile={false}
        />
      </aside>

      {/* Mobile drawer */}
      <aside
        className="fixed top-0 left-0 h-full z-[300] overflow-y-auto flex flex-col lg:hidden transition-transform duration-300 ease-in-out"
        style={{
          width:       240,
          background:  "var(--surf)",
          borderRight: "1px solid var(--border)",
          transform:   sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <SidebarContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setSidebarOpen={setSidebarOpen}
          isMobile={true}
        />
      </aside>
    </>
  );
}
