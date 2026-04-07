import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API_CONFIG from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(API_CONFIG.AUTH_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        login(data.user);
        setTimeout(() => navigate(from, { replace: true }), 300);
      } else {
        setError(data.message || "Invalid credentials. Check your email and password.");
      }
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center overflow-hidden relative"
      style={{ background: "radial-gradient(circle at top left, #222e52 0%, #0b193c 100%)" }}
    >
      {/* ── Cosmic background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Space image overlay */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZlSeN4rYhfBlDTVWnSDfLMcDhcOitgC-eL_pehKtM0cLhOmMAbZINSW3VeRWyuwLqNqtVnq8oHC6OYSx_bb8YWzSevCk4khARkeda-34R7zE_ZoKF2niqhPaoOgoLnPaiQ1o1ews6RXvvPjB1juYMpWJ2kKEqwzaJHbeNum4aVPNwzNYcHKv6123n5hTpxaJHBQSLSdyTObGaqyexOerlyWcJlZdXCMLWIDpRIWu527S9OweeBGyFDTyJ6U3daduJyu497kNQASo"
          alt="Cosmic backdrop"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20"
        />
        {/* Glow blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]"
          style={{ background: "rgba(104,250,221,0.12)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full blur-[100px]"
          style={{ background: "rgba(34,46,82,0.4)" }} />
        {/* Star particles */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.4,
              animation: `star-blink ${3 + Math.random() * 5}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <main className="relative z-10 w-full max-w-6xl px-6 flex items-center justify-center lg:justify-between gap-12 py-16">

        {/* Left branding — hidden on mobile */}
        <div className="hidden lg:flex flex-col max-w-md animate-fade-in-up">
          <div className="mb-10">
            <span className="font-headline font-black text-4xl tracking-tighter text-white">Orbit.</span>
          </div>
          <h1 className="font-headline font-extrabold text-5xl leading-tight text-white mb-6">
            Navigate the{" "}
            <span style={{ color: "#5ffbd6" }}>Next Frontier</span>{" "}
            of Your Career.
          </h1>
          <p className="text-lg leading-relaxed mb-10 font-medium" style={{ color: "#8a96c0" }}>
            The most advanced career navigation engine for the next generation of engineers and creators. Your journey into the celestial professional landscape starts here.
          </p>
          <div className="flex items-center gap-4" style={{ color: "#8a96c0" }}>
            <div className="flex -space-x-3">
              {[
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBmOsr3z1Dr1V-enjZlwkLe4bX5huWLrYcmqLHaCoALigLAw7vxNIbBIi9XGc64mnpA328YLh6gzxtE7hKqKFNynq6fiw-uLNVDkaUHgKXDC8le0qqfSOgcgwjTM3FhS19IKxyLDbRS4k_VzKLK_BP0C5DWUtaiukzAsKSIAwDs7YDCfHuM8kRnl2fw1Teyj6yyhspXbNgY4Z3RKHdio34xqDl4xSqranQXUSdQfX4R14Hw8VvdsrF4v-z111BY3T3oxI2QUcSFuEg",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuD8TpTACGMf9RnKJhRJ1Ax5CZ6wx6G_OdtGA4pP6V3hNJp5HIINDAvfCEDfl-RLaKk-CE3IdF3PZD7CHjyQTKYzv0crIQLLpDJHF20P1cfhM7Jdx5YAi3nztinidKKYSWckryLs4rp7VYYDncIGGgt9A5_Ef2l9FTNSMjEYD08ymbjyT2s9LKqx3so9uzYSoBm15KN4wVPv90tPzNWBvyq2v-WC5ME0h1J8PEf9PovJq6SBufbr-jvAzHJtqA6VHnv0lWXs9uZbK08",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAh-0gKpQfLl9a0G60iImiR09TrqHlGQuEHaiBH8kwJKQl7mIe5fg4EdkYw4V1gSNZfPMZ0ad-r5PnJvGr0PcXYW9NuFS3Nasta6vVSb8-cPxCT3fM7uD_-iAtHL3hbvSALRR4YxKQyiYHYW7CYPqK3Pa77ZK0aUILcOVl45Cu8lkb5HpCdQ1hPMFKXFcFSZYFHuOWRzOlgmVcIymOxO5c-DqHIMVQlTriN8DitE2VEqj8IugtFmLXoQLIdSEMFzBG7d2ZUO0ipWIU",
              ].map((src, i) => (
                <img key={i} src={src} alt="User"
                  className="w-10 h-10 rounded-full border-2"
                  style={{ borderColor: "#0b193c" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ))}
            </div>
            <span className="text-sm font-medium tracking-wide">Joined by 10,000+ navigators</span>
          </div>
        </div>

        {/* Right: Login Card */}
        <div className="w-full max-w-md animate-fade-in-up animate-delay-200">
          <div
            className="border rounded-[2.5rem] p-8 md:p-12 shadow-[0px_40px_100px_rgba(0,0,0,0.3)]"
            style={{
              background: "rgba(34,46,82,0.4)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            {/* Mobile logo */}
            <div className="lg:hidden mb-6 flex justify-center">
              <span className="font-headline font-black text-3xl tracking-tighter text-white">Orbit.</span>
            </div>

            <div className="mb-10">
              <h2 className="font-headline font-bold text-3xl text-white mb-2">Welcome Back</h2>
              <p className="font-medium" style={{ color: "#8a96c0" }}>Please enter your credentials to continue.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl border text-sm font-medium"
                  style={{ background: "rgba(186,26,26,0.15)", borderColor: "rgba(186,26,26,0.3)", color: "#fca5a5" }}>
                  <span className="material-symbols-outlined text-xl">error_outline</span>
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold tracking-wide px-1" style={{ color: "#8a96c0" }} htmlFor="login-email">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#8a96c0" }}>mail</span>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@university.edu"
                    className="w-full rounded-2xl py-4 pl-12 pr-4 text-white transition-all outline-none font-body"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={(e) => { e.target.style.boxShadow = "0 0 15px rgba(104,250,221,0.3)"; e.target.style.borderColor = "#5ffbd6"; }}
                    onBlur={(e) => { e.target.style.boxShadow = ""; e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-sm font-semibold tracking-wide" style={{ color: "#8a96c0" }} htmlFor="login-password">
                    Password
                  </label>
                  <a href="#" className="text-xs font-bold hover:text-white transition-colors" style={{ color: "#5ffbd6" }}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#8a96c0" }}>lock</span>
                  <input
                    id="login-password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-2xl py-4 pl-12 pr-12 text-white transition-all outline-none font-body"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={(e) => { e.target.style.boxShadow = "0 0 15px rgba(104,250,221,0.3)"; e.target.style.borderColor = "#5ffbd6"; }}
                    onBlur={(e) => { e.target.style.boxShadow = ""; e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-white transition-colors"
                    style={{ color: "#8a96c0" }}>
                    <span className="material-symbols-outlined">{showPw ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-3 px-1">
                <input id="remember" type="checkbox"
                  className="w-5 h-5 rounded cursor-pointer"
                  style={{ accentColor: "#5ffbd6" }} />
                <label htmlFor="remember" className="text-sm font-medium cursor-pointer select-none" style={{ color: "#8a96c0" }}>
                  Stay logged in for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-headline font-bold py-4 rounded-2xl text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #006b5c, #222e52)",
                  boxShadow: "0 10px 30px -10px rgba(104,250,221,0.2)",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Connecting...
                  </span>
                ) : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }} />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 rounded-full text-xs font-bold uppercase tracking-widest"
                  style={{ background: "#121c40", color: "#8a96c0" }}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social logins */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 rounded-2xl py-3.5 transition-all group border hover:scale-[1.02] active:scale-95"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.63 14.93 1 12 1 7.48 1 3.61 3.61 1.83 7.43l3.75 2.91C6.46 7.42 8.99 5.04 12 5.04z" fill="#EA4335"/>
                  <path d="M23.49 12.27c0-.83-.07-1.63-.2-2.39H12v4.51h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.43-4.94 3.43-8.57z" fill="#4285F4"/>
                  <path d="M5.58 14.91c-.24-.72-.38-1.49-.38-2.28 0-.79.14-1.56.38-2.28L1.83 7.43C1.04 9.1 0.59 10.97 0.59 12.91s.45 3.81 1.24 5.48l3.75-2.91z" fill="#FBBC05"/>
                  <path d="M12 23c3.24 0 5.96-1.07 7.95-2.91l-3.7-2.87c-1.09.73-2.48 1.16-4.25 1.16-3.01 0-5.54-2.38-6.42-5.32l-3.75 2.91C3.61 19.39 7.48 23 12 23z" fill="#34A853"/>
                </svg>
                <span className="text-sm font-semibold text-white">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 rounded-2xl py-3.5 transition-all group border hover:scale-[1.02] active:scale-95"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>
                <svg className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                <span className="text-sm font-semibold text-white">GitHub</span>
              </button>
            </div>

            {/* Signup link */}
            <div className="mt-10 text-center">
              <p className="text-sm font-medium" style={{ color: "#8a96c0" }}>
                Don't have an account?{" "}
                <Link to="/signup"
                  className="font-bold hover:underline underline-offset-4 ml-1 transition-colors"
                  style={{ color: "#5ffbd6" }}>
                  Launch your profile
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-8 left-0 w-full z-10 px-8 flex flex-col md:flex-row justify-between items-center gap-4"
        style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, color: "rgba(138,150,192,0.6)" }}>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Charter</a>
          <a href="#" className="hover:text-white transition-colors">Navigation Terms</a>
        </div>
        <div>
          <span>Orbit Engine v2.4.0 © 2024 Celestial Systems</span>
        </div>
      </footer>
    </div>
  );
}
