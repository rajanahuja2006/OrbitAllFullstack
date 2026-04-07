import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_CONFIG } from "../utils/api";

const DEFAULT_JOBS = [
  { title: "Backend Engineer", icon: "terminal", match: 94, desc: "Design and implement server-side logic for high-scale applications.", skills: ["Node.js", "PostgreSQL"], verified: ["Docker"], color: "text-primary bg-primary/10 border-primary/20", matchColor: "bg-secondary/10 text-secondary border-secondary/20" },
  { title: "Cloud Architect", icon: "cloud_done", match: 88, desc: "Architecting resilient, scalable cloud infrastructure and pipelines.", skills: ["AWS Lambda", "Terraform"], verified: ["Kubernetes"], color: "text-secondary bg-secondary/10 border-secondary/20", matchColor: "bg-secondary text-primary-container", featured: true },
  { title: "QA Automation", icon: "precision_manufacturing", match: 72, desc: "Build robust automated testing frameworks for enterprise product quality.", skills: ["Python", "Jenkins"], verified: ["Selenium"], color: "text-primary bg-primary/10 border-primary/20", matchColor: "bg-slate-800 text-slate-400 border-white/5" },
  { title: "DevSecOps Lead", icon: "security", match: 45, desc: "Integrate advanced security protocols into high-frequency CI/CD pipelines.", skills: [], gap: ["Azure Security", "Penetration Testing"], color: "text-red-400 bg-red-500/10 border-red-500/20", matchColor: "bg-red-500/10 text-red-400 border-red-500/20" },
  { title: "Full Stack Dev", icon: "layers", match: 91, desc: "Manage end-to-end development of feature-rich, user-centric web products.", skills: ["GraphQL"], verified: ["React.js", "Express"], color: "text-primary bg-primary/10 border-primary/20", matchColor: "bg-secondary/10 text-secondary border-secondary/20" },
  { title: "AI Training Eng", icon: "neurology", match: 82, desc: "Optimization and fine-tuning of Large Language Models for production.", skills: ["PyTorch", "Fine-tuning"], verified: ["Python"], color: "text-primary bg-primary/10 border-primary/20", matchColor: "bg-secondary/10 text-secondary border-secondary/20", hot: true },
];

export default function Jobs() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All Roles");

  const filters = ["All Roles", "Internship", "Entry-level", "Mid-senior", "FinTech", "EdTech", "Web3"];

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_CONFIG.RESUME_MY_RESUMES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setResumeData(data[0]);
          // Use API jobs if available, otherwise default
          const apiJobs = data[0].jobMatches || data[0].jobs || [];
          setJobs(apiJobs.length > 0 ? apiJobs : DEFAULT_JOBS);
        } else {
          setJobs(DEFAULT_JOBS);
        }
      } else {
        setJobs(DEFAULT_JOBS);
      }
    } catch {
      setJobs(DEFAULT_JOBS);
    } finally {
      setLoading(false);
    }
  };

  // Normalize jobs from API or defaults
  const normalizedJobs = jobs.map((j, i) => {
    if (j.title && j.icon) return j; // already in Stitch format
    const def = DEFAULT_JOBS[i % DEFAULT_JOBS.length];
    return {
      ...def,
      title: j.title || j.role || def.title,
      match: j.matchScore || j.match || def.match,
      desc: j.description || j.desc || def.desc,
    };
  });

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Top nav bar */}
      <header className="glass-nav sticky top-0 z-50">
        <nav className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-400 flex items-center justify-center shadow-lg glow-accent">
                <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-headline">Orbit</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <button className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>
            <div className="w-10 h-10 rounded-xl bg-primary-container border border-white/10 flex items-center justify-center text-white font-bold">
              {(user?.name || "O")[0].toUpperCase()}
            </div>
          </div>
        </nav>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="hidden md:flex fixed left-0 top-[73px] h-[calc(100vh-73px)] w-72 flex-col py-8 px-4 z-40"
          style={{ background: "rgba(3,7,18,0.8)", backdropFilter: "blur(20px)", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="px-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
              </div>
              <div>
                <p className="text-lg font-bold text-white font-headline">Navigator</p>
                <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">BTech Career Engine</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-2">
            {[
              { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
              { name: "Resume Analyzer", path: "/resume-analyzer", icon: "description" },
              { name: "Roadmap", path: "/roadmap", icon: "map" },
              { name: "Career Tutor", path: "/chat-tutor", icon: "psychology" },
              { name: "Job Roles", path: "/jobs", icon: "work", active: true },
            ].map((item) => (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={`w-full px-6 py-4 flex items-center gap-4 text-sm font-semibold rounded-2xl transition-all hover:text-white text-left
                  ${item.active ? "bg-primary/20 text-white border border-white/10 shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)]" : "text-slate-400 hover:bg-white/5 hover:translate-x-2"}`}>
                <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl relative overflow-hidden group border border-white/5">
              <div className="relative z-10">
                <p className="text-white font-bold text-sm mb-1">Upgrade Orbit</p>
                <p className="text-slate-400 text-[11px] mb-4 font-medium">Unlock premium AI tutoring</p>
                <button onClick={() => navigate("/pricing")}
                  className="w-full bg-white text-primary py-3 rounded-xl text-xs font-black hover:scale-[1.02] transition-all">GET PREMIUM</button>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <span className="material-symbols-outlined text-8xl text-white">grade</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 md:ml-72 p-10">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 animate-fade-in-up">
              <div className="max-w-2xl">
                <span className="text-secondary font-black tracking-[0.4em] text-[10px] uppercase mb-4 block">PERSONALIZED PATHWAYS</span>
                <h1 className="font-headline font-bold text-5xl text-white tracking-tighter leading-[1.1] mb-6">
                  Job Role <br /><span className="text-primary">Recommendations</span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-lg font-medium opacity-80">
                  Based on your recent skill assessments and resume analysis, we've mapped out these high-growth roles where you're already leading the curve.
                </p>
              </div>
              <div className="flex gap-4">
                <button className="glass text-slate-300 px-6 py-3 rounded-2xl text-sm font-bold hover:text-white transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">tune</span> Filter
                </button>
                <button onClick={fetchData} className="bg-primary text-white px-8 py-3 rounded-2xl text-sm font-black tracking-wide shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase">
                  Refresh Profile
                </button>
              </div>
            </header>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3 mb-12 animate-fade-in-up animate-delay-100">
              {filters.map((f) => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${activeFilter === f ? "bg-primary text-white" : "glass text-slate-400 hover:text-white"}`}>
                  {f}
                </button>
              ))}
            </div>

            {/* Job Cards Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {normalizedJobs.map((job, i) => (
                  <div key={i}
                    className={`animate-fade-in-up glass-card p-10 rounded-3xl flex flex-col group transition-all duration-500 hover:-translate-y-2
                      ${job.featured ? "border-2 border-secondary/20 hover:shadow-[0_0_40px_-15px_rgba(16,185,129,0.3)]" : "hover:border-primary/30"}`}
                    style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex justify-between items-start mb-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${job.color} group-hover:scale-110 transition-transform duration-500`}>
                        <span className="material-symbols-outlined text-3xl">{job.icon}</span>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${job.matchColor}`}>
                        {job.featured && <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>}
                        {job.match}% Match
                      </div>
                    </div>

                    <h3 className="font-headline font-bold text-2xl text-white mb-3">{job.title}</h3>
                    <p className="text-sm text-slate-400 mb-10 leading-relaxed font-medium">{job.desc}</p>

                    <div className="space-y-4 mb-10">
                      <p className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-500">
                        {job.gap ? "SKILL GAP ANALYSIS" : "KEY SKILLS NEEDED"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.verified?.map((s) => (
                          <span key={s} className="bg-secondary/10 border border-secondary/20 px-4 py-1.5 rounded-xl text-[10px] font-black text-secondary flex items-center gap-1.5 uppercase">
                            <span className="material-symbols-outlined text-[14px]">verified</span>{s}
                          </span>
                        ))}
                        {job.skills?.map((s) => (
                          <span key={s} className="bg-white/5 border border-white/5 px-4 py-1.5 rounded-xl text-[10px] font-bold text-slate-300">{s}</span>
                        ))}
                        {job.gap?.map((s) => (
                          <span key={s} className="bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-xl text-[10px] font-black text-red-400 flex items-center gap-1.5 uppercase">
                            <span className="material-symbols-outlined text-[14px]">error</span>{s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                      {job.hot && <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Hot Trend</span>}
                      {job.featured && <span className="text-[10px] font-black text-secondary uppercase tracking-widest">6 New Jobs Found</span>}
                      {job.gap && <span className="text-[10px] text-red-400 font-black uppercase tracking-widest italic">GAP IDENTIFIED</span>}
                      {!job.hot && !job.featured && !job.gap && <div />}
                      <button onClick={() => navigate("/roadmap")}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                          ${job.gap ? "bg-red-500/20 text-white hover:bg-red-500 border border-red-500/30"
                          : job.featured ? "bg-white text-primary hover:scale-105"
                          : "bg-primary/20 text-white hover:bg-primary border border-primary/30"}`}>
                        {job.gap ? "Start Prep" : job.featured ? "Learn More" : "View Roadmap"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Career Trajectory section */}
            {resumeData && (
              <section className="mt-20 glass p-12 rounded-[3rem] relative overflow-hidden animate-fade-in-up animate-delay-500">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="font-headline font-bold text-4xl text-white mb-6">
                      Your Career <br /><span className="text-primary">Trajectory</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 opacity-90 leading-relaxed font-medium">
                      {resumeData.skills?.length
                        ? `You have ${resumeData.skills.length} verified skills. Focus on cloud and system design to reach the next tier.`
                        : "You are currently in the top 5% of applicants. Focus on Distributed Systems to reach the next tier."}
                    </p>
                    <div className="w-full">
                      <div className="flex justify-between mb-3">
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">INDUSTRY READINESS</span>
                        <span className="text-[10px] font-black text-secondary">{resumeData.atsScore || 88}%</span>
                      </div>
                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                          style={{ width: `${resumeData.atsScore || 88}%` }} />
                      </div>
                    </div>
                  </div>
                  {/* Market demand mini chart */}
                  <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 shadow-2xl">
                    <h4 className="text-white font-bold text-base mb-8 flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary">trending_up</span>
                      Market Demand Index
                    </h4>
                    <div className="flex items-end gap-3 h-40">
                      {[60, 45, 80, 30, 95, 55, 90].map((h, i) => (
                        <div key={i} className={`w-full rounded-xl transition-all hover:opacity-80`}
                          style={{
                            height: `${h}%`,
                            background: h === 95 || h === 90 ? "rgba(16,185,129,1)" : `rgba(16,185,129,${h / 150})`,
                            boxShadow: (h === 95 || h === 90) ? "0 0 20px rgba(16,185,129,0.3)" : "none"
                          }} />
                      ))}
                    </div>
                    <div className="flex justify-between mt-6 text-[9px] text-slate-500 font-black uppercase tracking-widest">
                      {["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"].map((m) => <span key={m}>{m}</span>)}
                    </div>
                  </div>
                </div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-32 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 py-16 animate-fade-in-up px-10">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-400 flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-base" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            </div>
            <span className="text-xl font-bold text-white font-headline tracking-tight">Orbit Engine</span>
          </div>
          <p className="text-[10px] font-medium tracking-wider text-slate-600 uppercase">© 2024 CELESTIAL CAREER ENGINE</p>
        </div>
        <div className="flex gap-10">
          {["Operations", "Support", "Privacy Policy", "Protocol"].map((l) => (
            <span key={l} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors cursor-pointer">{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}