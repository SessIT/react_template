import { useState, useEffect } from "react";
import img from "../assets/login-bg.jpeg";
import leftlogo from "../assets/sess_logo_white.png";
import rightlogo from "../assets/sess-logo.png";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaLinkedinIn,
  FaBlog,
} from "react-icons/fa";

// ─── SLIDES DATA ─────────────────────────────────────────
const slides = [
  {
    title: "Environmental Test Chambers",
    desc: "Precision engineered climatic simulation systems for reliability testing.",
  },
  {
    title: "Thermal & Humidity Testing",
    desc: "High-performance validation solutions for industrial environments.",
  },
  {
    title: "Industrial Innovation",
    desc: "Delivering reliable environmental testing systems across India.",
  },
];

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      width="17"
      height="17"
      fill="none"
      stroke="#9ca3af"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="17"
      height="17"
      fill="none"
      stroke="#9ca3af"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

export default function GearworksLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [textKey, setTextKey] = useState(0);

  // ── WOW.js init ──────────────────────────────────────────
  useEffect(() => {
    // Inject animate.css if not already present
    if (!document.getElementById("animate-css")) {
      const link = document.createElement("link");
      link.id = "animate-css";
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css";
      document.head.appendChild(link);
    }

    // Load WOW.js from CDN, then init
    if (!window.WOW) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js";
      script.onload = () => {
        new window.WOW({
          boxClass: "wow",
          animateClass: "animated",
          offset: 0,
          mobile: true,
          live: true,
        }).init();
      };
      document.body.appendChild(script);
    } else {
      new window.WOW({
        boxClass: "wow",
        animateClass: "animated",
        offset: 0,
        mobile: true,
        live: true,
      }).init();
    }
  }, []);

  // ── Slide ticker ─────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setTextKey((k) => k + 1);
        setVisible(true);
      }, 600);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ fontFamily: "'Arial', 'Helvetica Neue', sans-serif" }}
    >
      {/* ── Background Image ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      />

      {/* ── Overlay ── */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "rgba(13, 30, 50, 0.62)" }}
      />

      {/* ── Keyframes + mobile overrides ── */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0%);    }
          100% { transform: translateX(-100%); }
        }

        /* ─── MOBILE ONLY ( ≤ 767px ) ─────────────────────── */
        @media (max-width: 767px) {

          /* Stack layout vertically, full width, scrollable */
          .sess-content {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            padding: 24px 16px 40px !important;
            gap: 24px !important;
            min-height: 100vh;
            overflow-y: auto;
          }

          /* Left panel: full width, centered */
          .sess-left {
            max-width: 100% !important;
            width: 100% !important;
            align-items: center !important;
            text-align: center !important;
          }

          /* Logo: smaller on mobile */
          .sess-left-logo {
            width: 10rem !important;
          }

          /* Marquee: full width */
          .sess-marquee-wrap {
            width: 100% !important;
          }

          /* Slide title: smaller */
          .sess-slide-title {
            font-size: 1.2rem !important;
          }

          /* Slide desc: smaller */
          .sess-slide-desc {
            font-size: 0.85rem !important;
          }

          /* Company desc: slightly smaller */
          .sess-company-desc {
            font-size: 0.8rem !important;
          }

          /* Login card: full width with breathing room */
          .sess-card {
            width: 100% !important;
            max-width: 420px !important;
            padding: 28px 24px 22px !important;
          }
        }

        /* ─── SMALL MOBILE ( ≤ 400px ) ────────────────────── */
        @media (max-width: 400px) {
          .sess-card {
            padding: 22px 16px 18px !important;
          }
          .sess-slide-title {
            font-size: 1.05rem !important;
          }
        }
      `}</style>

      {/* ── Content ── */}
      <div className="sess-content relative z-10 flex w-full max-w-5xl mx-auto px-10 items-center justify-between gap-12">
        {/* ════════ LEFT SIDE ════════ */}
        <div
          className="sess-left flex-1 flex flex-col items-center text-center text-white select-none"
          style={{ maxWidth: 420 }}
        >
          {/* Alert Marquee */}
          <div
            className="sess-marquee-wrap"
            style={{
              width: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "6px",
              marginBottom: "20px",
              padding: "6px 0",
            }}
          >
            <div
              style={{
                display: "inline-block",
                paddingLeft: "100%",
                animation: "marquee 14s linear infinite",
                color: "#ffd166",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              ⚠ System maintenance scheduled on Sunday 10:00 PM • Please save
              your work before logging out • Contact IT support for access
              issues
            </div>
          </div>

          {/*
            WOW.js logo animation:
            - data-wow-animation: animate.css class to use
            - data-wow-duration:  how long the animation runs
            - data-wow-delay:     delay before it starts
            - data-wow-offset:    px from viewport bottom to trigger
          */}
          <img
            src={leftlogo}
            alt=""
            className="sess-left-logo mb-6 wow"
            data-wow-animation="fadeInDown"
            data-wow-duration="1s"
            data-wow-delay="0.2s"
            data-wow-offset="0"
            style={{ width: "15rem" }}
          />

          {/* Animated Slide Title */}
          <h2
            key={"title-" + textKey}
            className="sess-slide-title text-2xl font-bold mb-3"
            style={{
              color: "#00d4ff",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            {slides[current].title}
          </h2>

          {/* Animated Slide Description */}
          <p
            key={"desc-" + textKey}
            className="sess-slide-desc text-base leading-relaxed mb-6"
            style={{
              color: "#ffffff",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
              maxWidth: 360,
            }}
          >
            {slides[current].desc}
          </p>

          {/* Company Description */}
          <p
            className="sess-company-desc text-sm"
            style={{
              color: "#ffffff",
              lineHeight: 1.7,
              maxWidth: 360,
            }}
          >
            Sri Easwari Scientific Solution (SESS) is a leading Indian
            manufacturer and service provider of environmental and industrial
            testing equipment, specializing in climatic and laboratory test
            chambers.
          </p>
        </div>

        {/* ════════ RIGHT SIDE LOGIN CARD ════════ */}
        <div
          className="sess-card bg-white rounded-2xl shadow-2xl flex flex-col items-center"
          style={{ width: 360, padding: "36px 40px 28px 40px" }}
        >
          <div className="flex items-center justify-center mb-2">
            {/*
              WOW.js on right logo too — bounces in from bottom
            */}
            <img
              src={rightlogo}
              alt="SESS Logo"
              className="wow"
              data-wow-animation="fadeInUp"
              data-wow-duration="0.8s"
              data-wow-delay="0.4s"
              data-wow-offset="0"
              style={{ width: "6rem" }}
            />
          </div>

          <h2
            className="text-gray-800 font-semibold text-center mb-6"
            style={{ fontSize: "1.1rem" }}
          >
            Login In to SESS system.
          </h2>

          <div className="w-full flex flex-col gap-3">
            {/* Employee Id */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Employee Id
              </label>
              <input
                type="email"
                placeholder="name@sess.co.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 pr-9"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <button
                className="text-xs hover:underline"
                style={{ color: "#1e3a5f" }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={() => (window.location.href = "/#/home")}
              className="w-full mt-2 py-2.5 rounded text-white text-sm font-bold uppercase cursor-pointer"
              style={{
                background: "#1a3a5c",
                letterSpacing: "0.14em",
                fontSize: "0.82rem",
              }}
            >
              LOGIN IN
            </button>
          </div>

          {/* Social Media */}
          <div className="flex items-center justify-center gap-4 mt-5 text-gray-500">
            <a
              href="https://www.facebook.com/sesschennai"
              target="_blank"
              className="hover:text-blue-600 transition text-lg"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/sesschennai/"
              target="_blank"
              className="hover:text-pink-500 transition text-lg"
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com/sesschennai"
              target="_blank"
              className="hover:text-blue-400 transition text-lg"
            >
              <FaTwitter />
            </a>
            <a
              href="https://wa.me/919444427748"
              target="_blank"
              className="hover:text-green-500 transition text-lg"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://www.linkedin.com/in/sess-chennai/"
              target="_blank"
              className="hover:text-blue-700 transition text-lg"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://sesschennai.blogspot.com/"
              target="_blank"
              className="hover:text-orange-500 transition text-lg"
            >
              <FaBlog />
            </a>
          </div>

          {/* Footer */}
          <p
            className="mt-5 text-center text-gray-400"
            style={{ fontSize: "0.7rem" }}
          >
            © 2026 SESS is Proudly Powered by <br />
            <a
              href="https://www.sess.co.in/"
              // className="text-red-900"
              target="_blank"
              rel="noopener noreferrer"
              style={{color: "rgb(234 60 111)"}}
            >
              Sri Easwari Scientific Solution PVT LTD.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
