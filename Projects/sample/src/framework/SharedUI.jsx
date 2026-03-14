// ─── SharedUI.jsx ────────────────────────────────────────────────────────────
// Tiny reusable primitives: Icon, Toast, SectionCard, Field, form inputs,
// SubmitBtn, ExpGroup, NavItem, SESSEmblem.
// Import what you need in each feature component.

import { useEffect } from "react";

/* ── SESS Logo Emblem SVG ──────────────────────────────────────────────────── */
export function SESSEmblem({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#22E5F5" />
          <stop offset="35%"  stopColor="#3B5BFF" />
          <stop offset="65%"  stopColor="#E8006A" />
          <stop offset="100%" stopColor="#F5A623" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="95" stroke="url(#sessGrad)" strokeWidth="9"  fill="none" />
      <circle cx="100" cy="100" r="78" stroke="url(#sessGrad)" strokeWidth="8"  fill="none" />
      <circle cx="100" cy="100" r="62" stroke="url(#sessGrad)" strokeWidth="7"  fill="none" />
      <circle cx="100" cy="100" r="47" stroke="url(#sessGrad)" strokeWidth="6"  fill="none" />
      <circle cx="100" cy="100" r="33" stroke="url(#sessGrad)" strokeWidth="6"  fill="none" />
      <circle cx="100" cy="100" r="20" stroke="url(#sessGrad)" strokeWidth="5"  fill="none" />
      <line x1="5" y1="100" x2="195" y2="100" stroke="url(#sessGrad)" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

/* ── SVG Icon ──────────────────────────────────────────────────────────────── */
export function Ic({ d, size = 16, className = "", style = {} }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      className={`flex-shrink-0 ${className}`}
      style={style}
    >
      {Array.isArray(d)
        ? d.map((p, i) => <path key={i} d={p} />)
        : <path d={d} />}
    </svg>
  );
}

/* ── Toast notification ────────────────────────────────────────────────────── */
export function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4200);
    return () => clearTimeout(t);
  }, [onClose]);

  const ok = type === "success";
  return (
    <div
      className="fixed bottom-6 right-4 left-4 sm:left-auto sm:max-w-sm z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold border shadow-2xl anim-toastin"
      style={{
        background:   ok ? "rgba(34,229,245,0.08)" : "rgba(232,0,106,0.08)",
        borderColor:  ok ? "rgba(34,229,245,0.30)" : "rgba(232,0,106,0.30)",
        color:        ok ? "var(--pink)"            : "var(--pink)",
      }}
    >
      <Ic d={ok ? "M20 6L9 17l-5-5" : "M18 6L6 18M6 6l12 12"} size={15} />
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        style={{ background:"none", border:"none", cursor:"pointer", color:"inherit", opacity:.6 }}
      >✕</button>
    </div>
  );
}

/* ── Section Card wrapper ──────────────────────────────────────────────────── */
export function SectionCard({ icon, iconBg, iconColor, title, sub, children }) {
  return (
    <div
      className="border rounded-2xl mb-5 overflow-hidden transition-colors duration-300"
      style={{ background:"var(--surf)", borderColor:"var(--border)" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border2)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      {/* <div
        className="flex items-center gap-3 px-5 py-4 border-b"
        style={{
          borderColor: "var(--border)",
          background: `linear-gradient(90deg,${iconBg}18 0%, transparent 100%)`,
        }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          <Ic d={icon} size={15} />
        </div>
        <div>
          <p className="font-syne text-[13.5px] font-bold" style={{ color:"var(--txt)" }}>{title}</p>
          <p className="font-mono text-[10px] mt-0.5" style={{ color:"var(--pink)" }}>{sub}</p>
        </div>
      </div> */}
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ── Field label wrapper ───────────────────────────────────────────────────── */
export function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="font-mono text-[10px] font-semibold uppercase tracking-[0.07em]"
        style={{ color:"var(--pink)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── Form input primitives ─────────────────────────────────────────────────── */
export function TInput({ name, type="text", value, onChange, placeholder, required, readOnly, computed, accept }) {
  return (
    <input
      name={name} type={type} value={value} onChange={onChange}
      placeholder={placeholder} required={required} readOnly={readOnly} accept={accept}
      className={computed ? "field-computed" : "field-input"}
    />
  );
}

export function TSelect({ name, value, onChange, required, children }) {
  return (
    <select name={name} value={value} onChange={onChange} required={required} className="field-input">
      {children}
    </select>
  );
}

export function TTextarea({ name, value, onChange, placeholder, required, rows = 3 }) {
  return (
    <textarea
      name={name} value={value} onChange={onChange}
      placeholder={placeholder} required={required} rows={rows}
      className="field-input"
    />
  );
}

export function TFile({ name, onChange }) {
  return (
    <input
      type="file" name={name} accept="image/*,.pdf,.doc,.docx"
      onChange={onChange}
      className="w-full px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-colors"
      style={{ border:"1px solid var(--border)", background:"var(--bg)", color:"var(--txt-dim)" }}
    />
  );
}

/* ── Submit button ─────────────────────────────────────────────────────────── */
export function SubmitBtn({ label, gradient, shadow, loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-4 mt-3 rounded-2xl font-syne text-[14px] font-bold tracking-wide border-none cursor-pointer transition-all duration-200 anim-grad"
      style={{
        background:  loading ? "rgba(255,255,255,0.08)" : gradient,
        color:       loading ? "rgba(255,255,255,0.3)"  : "#fff",
        boxShadow:   loading ? "none" : shadow,
        cursor:      loading ? "not-allowed" : "pointer",
        backgroundSize: "200% 200%",
      }}
    >
      {loading && (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full anim-spin" />
      )}
      {loading ? "Submitting…" : label}
    </button>
  );
}

/* ── Expense group header ──────────────────────────────────────────────────── */
export function ExpGroup({ label, badge, badgeColor, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span
          className="font-mono text-[10px] font-semibold uppercase tracking-wider"
          style={{ color:"var(--txt-dim)" }}
        >
          {label}
        </span>
        {badge && (
          <span
            className="font-mono text-[9px] px-2 py-0.5 rounded-md"
            style={{ background:`${badgeColor}18`, color:badgeColor }}
          >
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── Sidebar nav item ──────────────────────────────────────────────────────── */
export function NavItem({ icon, label, active, onClick, collapsed }) {
  return (
    <button
      onClick={onClick}
      className="nav-btn relative flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium border-none cursor-pointer transition-all duration-150 text-left"
      style={{
        background:   active ? "linear-gradient(90deg,var(--pink),var(--blue))" : "transparent",
        color:        active ? "#fff" : "var(--txt-dim)",
        justifyContent: collapsed ? "center" : "flex-start",
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "var(--txt)"; e.currentTarget.style.background = "rgba(34,229,245,0.04)"; }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "var(--txt-dim)"; e.currentTarget.style.background = "transparent"; }}}
    >
      <Ic d={icon} size={15} />
      {!collapsed && <span className="flex-1">{label}</span>}
      {collapsed  && <span className="nav-tooltip">{label}</span>}
    </button>
  );
}
