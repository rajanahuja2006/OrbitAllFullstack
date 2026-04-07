export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        headline: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#6366f1",
        secondary: "#10b981",
        background: "#020617",
        surface: "#020617",
        "surface-container": "#0f172a",
        "surface-variant": "#1e293b",
        "surface-bright": "#1e293b",
        "on-surface": "#f8fafc",
        "on-surface-variant": "#94a3b8",
        "primary-container": "#1e1b4b",
        "on-primary-container": "#a5b4fc",
        "secondary-container": "#68fadd",
        "outline": "#475569",
        "outline-variant": "#334155",
        error: "#ef4444",
        "error-container": "#450a0a",
        // legacy brand colors kept
        brand: {
          50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd",
          400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9",
          800: "#5b21b6", 900: "#4c1d95",
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2.5rem",
        full: "9999px",
      },
      boxShadow: {
        soft: "0 18px 40px rgba(0,0,0,0.35)",
        glow: "0 0 45px rgba(99,102,241,0.35)",
        "glow-sm": "0 0 20px rgba(99,102,241,0.25)",
        "glow-green": "0 0 20px rgba(16,185,129,0.35)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(99,102,241,0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(99,102,241,0.6)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(16,185,129,0.4)" },
          "50%": { boxShadow: "0 0 20px 10px rgba(16,185,129,0.1)" },
        },
        lineFlow: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 40px" },
        },
        starBlink: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.6" },
        },
        scoreFill: {
          "0%": { strokeDashoffset: "552.9" },
          "100%": { strokeDashoffset: "154.8" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0px,0px) scale(1)" },
          "33%": { transform: "translate(30px,-20px) scale(1.1)" },
          "66%": { transform: "translate(-20px,20px) scale(0.9)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        glow: "glow 4s ease-in-out infinite alternate",
        "pulse-glow": "pulseGlow 2s infinite ease-in-out",
        "line-flow": "lineFlow 2s linear infinite",
        "star-blink": "starBlink 4s infinite ease-in-out",
        "score-fill": "scoreFill 2s ease-out forwards",
        blob: "blob 10s infinite",
        "slide-in-right": "slideInRight 0.6s cubic-bezier(0.23,1,0.32,1) both",
      },
    },
  },
  plugins: [],
};
