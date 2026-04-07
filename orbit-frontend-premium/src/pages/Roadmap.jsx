import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_CONFIG } from "../utils/api";

export default function Roadmap() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [roadmapData, setRoadmapData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [resumeRes] = await Promise.all([
        fetch(API_CONFIG.RESUME_MY_RESUMES, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (resumeRes.ok) {
        const data = await resumeRes.json();
        if (data.length > 0) {
          setResumeData(data[0]);
          setRoadmapData(data[0].roadmap || data[0]);
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const steps = roadmapData?.roadmapSteps || roadmapData?.steps || [
    { title: "React Basics", status: "completed", phase: "Phase 1 Complete" },
    { title: "Advanced State Management", status: "active", phase: "Active Protocol" },
    { title: "End-to-End Testing", status: "locked", phase: "Queue" },
    { title: "CI/CD Pipelines", status: "encrypted", phase: "Encrypted" },
  ];

  const activeStep = selectedStep !== null ? steps[selectedStep] : steps.find((s) => s.status === "active") || steps[1];
  const activeIdx = selectedStep !== null ? selectedStep : steps.findIndex((s) => s.status === "active");

  const syncPct = resumeData?.roadmapProgress ?? 80;

  return (
    <div className="min-h-screen p-10 max-w-[1600px] relative overflow-x-hidden">
      {/* Cosmic background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center mb-16 relative z-10 animate-fade-in-up">
        <div>
          <h2 className="text-4xl font-headline font-bold text-white tracking-tighter">
            Roadmap <span className="text-primary">Protocols</span>
          </h2>
          <p className="text-slate-400 font-medium mt-1">AI-synchronized trajectory for your career breakthrough.</p>
        </div>
        <div className="flex items-center gap-6">
          <button className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-slate-300 hover:text-white transition-all border border-white/5">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="flex items-center gap-4 pl-6 border-l border-white/10">
            <div className="text-right">
              <p className="text-sm font-bold text-white">{user?.name || "Operator"}</p>
              <p className="text-[9px] text-secondary font-black uppercase tracking-widest">Operator · BTech L3</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-white font-bold text-xl relative">
              {(user?.name || "O")[0].toUpperCase()}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary border-2 border-[#020617] rounded-full" />
            </div>
          </div>
        </div>
      </header>

      {/* Content Grid */}
      <div className="grid grid-cols-12 gap-10 relative z-10">

        {/* Hero text */}
        <div className="col-span-12 lg:col-span-8 animate-fade-in-up animate-delay-100">
          <h1 className="text-6xl font-black tracking-tighter text-white mb-6 leading-[0.9] glow-text">
            Your Path to <br />
            <span className="text-secondary">
              {roadmapData?.targetRole || resumeData?.targetRole || "Software Engineer"}
            </span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl font-medium">
            The AI has analyzed 450+ industry requirements to curate your specialized learning trajectory. Focus on these milestones to close the skill gap.
          </p>
        </div>

        {/* Role readiness card */}
        <div className="col-span-12 lg:col-span-4 glass p-10 rounded-[3rem] relative overflow-hidden flex flex-col justify-between animate-fade-in-up animate-delay-200">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-white font-headline">System Sync</h3>
              <span className="material-symbols-outlined text-primary">sensors</span>
            </div>
            <p className="text-xs text-slate-400 mb-8 font-medium">Target role compatibility index</p>
          </div>
          <div className="flex items-end justify-between mb-4">
            <span className="text-7xl font-bold font-headline text-white tracking-tighter">
              {syncPct}<span className="text-3xl text-secondary ml-1">%</span>
            </span>
            <span className="text-[10px] font-black text-secondary bg-secondary/10 px-4 py-1.5 rounded-full mb-3 border border-secondary/20">
              {syncPct >= 80 ? "ADVANCED" : syncPct >= 60 ? "PROGRESS" : "BUILDING"}
            </span>
          </div>
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-1000"
              style={{ width: `${syncPct}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-4 font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-xs">info</span>
            Next milestone: {steps.find((s) => s.status === "locked")?.title || "Keep going!"}
          </p>
        </div>

        {/* Roadmap Timeline */}
        <div className="col-span-12 xl:col-span-4 space-y-8 relative py-8 animate-fade-in-up animate-delay-300">
          {/* Vertical connector */}
          <div className="absolute left-10 top-0 bottom-0 w-[2px] bg-white/5 rounded-full overflow-hidden">
            <div className="h-[45%] w-full animated-connector rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && steps.map((step, idx) => {
            const done = step.status === "completed";
            const active = step.status === "active";
            const locked = step.status === "locked" || step.status === "encrypted";
            const isSelected = (selectedStep ?? activeIdx) === idx;

            return (
              <div key={idx} onClick={() => setSelectedStep(idx)}
                className={`relative flex items-center gap-8 group cursor-pointer transition-all ${locked ? "opacity-50 hover:opacity-100" : ""}`}>
                <div className={`z-10 w-12 h-12 rounded-2xl flex items-center justify-center border border-white/20 transition-all group-hover:scale-110
                  ${done ? "bg-secondary text-primary-container shadow-lg shadow-secondary/20"
                  : active ? "bg-primary text-white shadow-2xl shadow-primary/40 animate-pulse"
                  : "glass text-slate-500"}`}>
                  <span className="material-symbols-outlined" style={done ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {done ? "check" : active ? "auto_awesome" : "lock"}
                  </span>
                </div>
                <div className={`flex-1 p-5 glass rounded-2xl transition-all group-hover:bg-white/5
                  ${done ? "border-l-4 border-secondary/40" : ""}
                  ${active ? "border-l-4 border-primary shadow-2xl shadow-primary/10" : ""}
                  ${isSelected ? "bg-white/10" : ""}`}>
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 block
                    ${done ? "text-secondary" : active ? "text-primary" : "text-slate-500"}`}>
                    {step.phase || (done ? "Complete" : active ? "Active Protocol" : "Queue")}
                  </span>
                  <h4 className={`font-bold text-base ${locked ? "text-slate-300" : "text-white"}`}>
                    {step.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active module detail */}
        <div className="col-span-12 xl:col-span-8 animate-fade-in-up animate-delay-400">
          <div className="glass p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl border border-white/5">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Module Scan</span>
                </div>
                <h2 className="text-5xl font-bold text-white tracking-tight leading-none font-headline">
                  {activeStep?.title || "Advanced State Management"}
                </h2>
                <p className="text-slate-400 leading-relaxed max-w-xl text-lg font-medium">
                  {activeStep?.description || "Master the complexities of modern application state. Move beyond simple props and hooks into Redux Toolkit, React Query, and atomic state libraries."}
                </p>
              </div>
              <div className="glass bg-white/5 p-6 rounded-3xl min-w-[220px] flex flex-col items-center justify-center border border-white/10 hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-secondary text-4xl mb-3">schedule</span>
                <span className="text-3xl font-black text-white">{activeStep?.duration || "12 Hours"}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Est. Synchrony</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Resource cards */}
              {[
                { icon: "video_library", label: "Mastering Redux Toolkit", sub: "Video Core • YouTube", color: "bg-red-500/10 text-red-500" },
                { icon: "menu_book", label: "Official Documentation", sub: "Deep Dive • docs.react.com", color: "bg-blue-500/10 text-blue-500" },
              ].map((r) => (
                <a key={r.label} href="#" className="group/link glass bg-white/5 p-8 rounded-3xl transition-all hover:bg-white/10 hover:-translate-y-2 border border-white/5">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 ${r.color} rounded-2xl flex items-center justify-center group-hover/link:rotate-6 transition-transform`}>
                      <span className="material-symbols-outlined text-3xl">{r.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-white text-lg">{r.label}</h5>
                      <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-1">{r.sub}</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-600 group-hover/link:text-white transition-all">chevron_right</span>
                  </div>
                </a>
              ))}

              {/* Sandbox CTA */}
              <div className="md:col-span-2 bg-gradient-to-br from-primary via-indigo-600 to-indigo-900 p-10 rounded-[2.5rem] relative overflow-hidden hover:shadow-[0_20px_60px_rgba(99,102,241,0.4)] transition-all group/sandbox">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-white space-y-2">
                    <h4 className="text-2xl font-bold tracking-tight">Launch Interactive Sandbox</h4>
                    <p className="text-white/70 text-sm font-medium">Practice in a live, AI-monitored environment.</p>
                  </div>
                  <button className="px-10 py-4 bg-white text-primary font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 uppercase text-xs tracking-[0.2em]">
                    Start Lab
                  </button>
                </div>
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-secondary/30 rounded-full blur-[80px] opacity-50" />
              </div>
            </div>

            {/* Ask tutor */}
            <div className="mt-10 glass bg-primary/10 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer group/tutor"
              onClick={() => navigate("/chat-tutor")}>
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-primary shadow-2xl group-hover/tutor:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-xl font-bold text-white">Need help with {activeStep?.title || "this module"}?</h4>
                <p className="text-sm text-slate-400 font-medium">Orbit AI is ready to explain concepts using analogies you'll love.</p>
              </div>
              <button className="px-8 py-3 bg-secondary text-primary-container rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
                Ask Career Tutor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 flex justify-between items-center border-t border-white/5 py-12 relative z-10 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-white font-headline">Orbit Engine</span>
          <span className="text-[10px] font-medium tracking-wider text-slate-600 uppercase">© 2024 CELESTIAL CAREER ENGINE</span>
        </div>
        <div className="flex gap-10">
          {["Operations", "Privacy", "System Status"].map((l) => (
            <span key={l} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors cursor-pointer">{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}