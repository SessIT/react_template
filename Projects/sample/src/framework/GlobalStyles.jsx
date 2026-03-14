// ─── GlobalStyles.jsx ────────────────────────────────────────────────────────
// CSS variables (logo-derived palette), animations, shared input classes.
// Import once at the top of Dashboard.jsx.

export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&display=swap');

      *, *::before, *::after { box-sizing: border-box; }

      /* ── LOGO-DERIVED PALETTE ─────────────────────────────────────
         Cyan  : #22E5F5   Blue : #3B5BFF
         Pink  : #E8006A   Amber: #F5A623
         Exact hues from the SESS emblem concentric rings.
      ─────────────────────────────────────────────────────────────── */
      :root {
        --pink:      #22E5F5;
        --pink-dk:   #00C4D8;
        --blue:      #3B5BFF;
        --blue-dk:   #2040E8;
        --pink:      #E8006A;
        --pink-dk:   rgb(212, 0, 140);
        --amber:     #F5A623;
        --amber-dk:  #E09010;

        /* Dark-mode surfaces */
        --bg:        #060810;
        --surf:      #0C1018;
        --surf2:     #111622;
        --border:    rgba(212,0,140,0.14);
        --border2:   rgba(212,0,140,0.25);
        --txt:       #E8EDF8;
        --txt-dim:   rgba(232,237,248,0.45);
        --txt-muted: rgba(232,237,248,0.22);
      }

      /* Light-mode overrides */
      .light {
        --bg:        #F0F4FF;
        --surf:      #FFFFFF;
        --surf2:     #E8EDF8;
        --border:    rgba(59,91,255,0.15);
        --border2:   rgba(59,91,255,0.30);
        --txt:       #0C1018;
        --txt-dim:   rgba(12,16,24,0.55);
        --txt-muted: rgba(12,16,24,0.30);
      }

      body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--txt); }
      .font-syne { font-family: 'Syne', sans-serif !important; }
      .font-mono { font-family: 'DM Mono', monospace !important; }

      /* Scrollbars */
      ::-webkit-scrollbar { width: 3px; height: 3px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(34,229,245,0.18); border-radius: 4px; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      /* Keyframes */
      @keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      @keyframes toastIn   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
      @keyframes spinMe    { to{transform:rotate(360deg)} }
      @keyframes pulseGlow { 0%,100%{opacity:1} 50%{opacity:.3} }
      @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      @keyframes dropIn    { from{opacity:0;transform:translateY(-8px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }

      .anim-fadeup  { animation: fadeUp   0.32s ease both; }
      .anim-toastin { animation: toastIn  0.32s ease both; }
      .anim-spin    { animation: spinMe   1s linear infinite; }
      .anim-pulse   { animation: pulseGlow 2s infinite; }
      .anim-grad    { background-size:200% 200%; animation: gradShift 7s ease infinite; }
      .anim-dropin  { animation: dropIn   0.22s ease both; }

      /* File input button */
      input[type="file"]::-webkit-file-upload-button {
        background: rgba(34,229,245,0.08);
        border: 1px solid rgba(34,229,245,0.25);
        color: var(--pink);
        padding: 5px 12px;
        border-radius: 7px;
        font-family: 'DM Sans', sans-serif;
        font-size: 12px;
        cursor: pointer;
        margin-right: 10px;
      }

      /* Shared input classes */
      .field-input {
        width: 100%;
        padding: 11px 14px;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: var(--bg);
        color: var(--txt);
        font-size: 13.5px;
        font-family: 'DM Sans', sans-serif;
        outline: none;
        transition: border-color .18s, box-shadow .18s;
      }
      .field-input:focus {
        border-color: var(--pink);
        box-shadow: 0 0 0 3px rgba(34,229,245,0.10);
      }
      .field-input:disabled, .field-input[readonly] { opacity:.45; cursor:not-allowed; }
      .field-input::placeholder { color: var(--txt-muted); }
      .field-input option { background: var(--surf); color: var(--txt); }

      .field-computed {
        width: 100%;
        padding: 11px 14px;
        border-radius: 10px;
        border: 1px solid rgba(245,166,35,0.30);
        background: rgba(245,166,35,0.06);
        color: var(--amber);
        font-size: 13.5px;
        font-family: 'DM Mono', monospace;
        font-weight: 500;
        outline: none;
        cursor: not-allowed;
      }
      textarea.field-input { resize: vertical; min-height: 88px; }

      /* Sidebar transitions */
      .sidebar-collapsed { width: 64px !important; }

      /* Nav tooltip (shown in collapsed mode) */
      .nav-tooltip {
        position: absolute;
        left: calc(100% + 10px);
        top: 50%;
        transform: translateY(-50%);
        background: var(--surf2);
        border: 1px solid var(--border2);
        color: var(--txt);
        font-size: 12px;
        font-family: 'DM Sans', sans-serif;
        padding: 5px 10px;
        border-radius: 8px;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity .15s;
        z-index: 999;
      }
      .nav-btn:hover .nav-tooltip { opacity: 1; }
    `}</style>
  );
}
