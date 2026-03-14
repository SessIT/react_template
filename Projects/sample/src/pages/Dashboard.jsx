// ─── Dashboard.jsx ───────────────────────────────────────────────────────────
// Root page — composes Sidebar, Navbar, MorningReport, EveningReport, Attendance.
// All shared state (activeTab, darkMode, loading, attendance) lives here and
// flows down as props.  API calls / mock handlers are also here.
//
// Component tree:
//   Dashboard
//   ├── GlobalStyles        (CSS variables + animations injected once)
//   ├── Toast               (portal-style notification)
//   ├── Sidebar             (desktop + mobile drawer)
//   └── main
//       ├── Navbar
//       └── <content>
//           ├── MorningReport
//           ├── EveningReport
//           └── Attendance

import { useState } from "react";

import GlobalStyles  from "../framework/GlobalStyles";
import { Toast }     from "../framework/SharedUI";
import Sidebar       from "../framework/Sidebar";
import Navbar        from "../framework/Navbar";
import MorningReport from "../framework/MorningReport";
import EveningReport from "../framework/EveningReport";
import Attendance    from "../framework/Attendance";
import Home from "../framework/Home";
import Overview from "../framework/Overview";

/* ── Mock session (replace with real auth context / API) ─────────────────── */
const SESSION = {
  employee_id:   1,
  employee_name: "SESS IT",
  designation:   "Software Engineer",
};

/* ══════════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  /* ── UI state ─────────────────────────────────────────────────────────── */
  const [activeTab,   setActiveTab]   = useState("dashboard");
  const [collapsed,   setCollapsed]   = useState(false);   // desktop sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);   // mobile drawer
  const [darkMode,    setDarkMode]    = useState(true);
  const [toast,       setToast]       = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [attendanceRecord, setAttendance] = useState(null);

  /* ── Derived values ───────────────────────────────────────────────────── */
  const today    = new Date().toISOString().split("T")[0];
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const showToast = (message, type = "success") => setToast({ message, type });

  /* ── API handlers (swap comments for real axios/fetch calls) ─────────── */

  const handleMorningSubmit = async (_type, _fd, _form) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200)); // mock delay
      // await axios.post('/api/reports/morning', _fd);
      showToast("Morning Report submitted successfully!", "success");
    } catch {
      showToast("Failed to submit Morning Report.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEveningSubmit = async (_type, _fd, _form) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      // await axios.post('/api/reports/evening', _fd);
      showToast("Evening Report submitted successfully!", "success");
    } catch {
      showToast("Failed to submit Evening Report.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePunchIn = async (coords) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 900));
      // await axios.post('/api/attendance/punch-in', coords);
      const time = new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
      setAttendance(prev => ({ ...prev, punch_in: time }));
      showToast(`Punch In recorded at ${time}!`, "success");
    } catch {
      showToast("Punch In failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePunchOut = async (coords) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 900));
      // await axios.post('/api/attendance/punch-out', coords);
      const time = new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
      setAttendance(prev => ({ ...prev, punch_out: time, total_hours: "8.00" }));
      showToast(`Punch Out recorded at ${time}!`, "success");
    } catch {
      showToast("Punch Out failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <>
      {/* Inject CSS variables, keyframes, shared classes once */}
      <GlobalStyles />

      {/* Apply light class to root wrapper when darkMode is off */}
      <div className={darkMode ? "light" : ""} style={{ minHeight:"100vh", background:"var(--bg)" }}>

        {/* Toast notification (portal-style, fixed position) */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-[200] lg:hidden"
            style={{ background:"rgba(0,0,0,0.65)", backdropFilter:"blur(4px)" }}
          />
        )}

        {/* ── Page layout ─────────────────────────────────────────────── */}
        <div className="flex min-h-screen">

          {/* LEFT PANEL: Sidebar (handles both desktop + mobile internally) */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* MAIN COLUMN */}
          <div className="flex flex-col flex-1 min-w-0">

            {/* TOP BAR: Navbar */}
            <Navbar
              name={SESSION.employee_name}
              designation={SESSION.designation}
              greeting={greeting}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setSidebarOpen={setSidebarOpen}
              setCollapsed={setCollapsed}
            />

            {/* CONTENT AREA */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
              {activeTab === "dashboard" && (
                <Home 
                employeeName={SESSION.employee_name}
                  today={today}
                  loading={loading}
                />
              )}
              {activeTab === "overview" && (
                <Overview
                  employeeName={SESSION.employee_name}
                  today={today}
                  loading={loading}
                />
              )}
              {activeTab === "morning" && (
                <MorningReport
                  employeeName={SESSION.employee_name}
                  today={today}
                  onSubmit={handleMorningSubmit}
                  loading={loading}
                />
              )}

              {activeTab === "evening" && (
                <EveningReport
                  employeeName={SESSION.employee_name}
                  today={today}
                  onSubmit={handleEveningSubmit}
                  loading={loading}
                />
              )}

              {activeTab === "attendance" && (
                <Attendance
                  attendanceRecord={attendanceRecord}
                  onPunchIn={handlePunchIn}
                  onPunchOut={handlePunchOut}
                  loading={loading}
                />
              )}
            </main>

          </div>
        </div>
      </div>
    </>
  );
}
