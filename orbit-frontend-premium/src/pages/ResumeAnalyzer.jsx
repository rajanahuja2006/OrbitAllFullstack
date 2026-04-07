import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_CONFIG } from "../utils/api";

export default function ResumeAnalyzer() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [resumeData, setResumeData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => { fetchResumeData(); }, []);

  const fetchResumeData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_CONFIG.RESUME_MY_RESUMES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setResumeData(data[0]);
      }
    } catch (e) { console.error(e); }
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
      setUploadMessage("❌ Please upload a PDF file only");
      setTimeout(() => setUploadMessage(""), 4000);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadMessage("❌ File size must be less than 10MB");
      setTimeout(() => setUploadMessage(""), 4000);
      return;
    }
    setUploading(true);
    setUploadProgress(15);
    setUploadMessage("Uploading...");
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const token = localStorage.getItem("token");
      setUploadProgress(40);
      const res = await fetch(API_CONFIG.RESUME_UPLOAD, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      setUploadProgress(80);
      const data = await res.json();
      if (res.ok) {
        setUploadProgress(100);
        setResumeData(data);
        setUploadMessage("✅ Analysis complete!");
        setTimeout(() => setUploadMessage(""), 3000);
      } else {
        setUploadMessage(`❌ ${data.message || "Upload failed"}`);
        setTimeout(() => setUploadMessage(""), 4000);
      }
    } catch (err) {
      setUploadMessage(`❌ ${err.message || "Connection error"}`);
      setTimeout(() => setUploadMessage(""), 4000);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const ats = resumeData?.atsScore ?? 0;
  // SVG circle path: r=88, circumference = 2π*88 ≈ 552.9
  const circ = 552.9;
  const offset = circ - (ats / 100) * circ;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-[1600px] relative">
      {/* Hidden input */}
      <input ref={fileInputRef} type="file" accept=".pdf" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />

      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none orbit-gradient" />

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative z-10 animate-fade-in-up">
        <div>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tighter">
            Resume <span className="text-primary">Intelligence</span>
          </h2>
          <p className="text-slate-400 font-medium mt-2 max-w-2xl">
            Analyze your professional narrative against industry-standard ATS algorithms to land your dream role.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4 mt-4 md:mt-0">
          <button className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-slate-300 hover:text-white transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="flex items-center gap-4 pl-6 border-l border-white/10">
            <div className="text-right">
              <p className="text-sm font-bold text-white">{user?.name || "Operator"}</p>
              <p className="text-[9px] text-secondary font-black uppercase tracking-widest">Orbit · Navigator</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-white font-bold text-lg">
              {(user?.name || "O")[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6 md:gap-8 relative z-10">
        {/* Left column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 md:gap-8">
          {/* Upload area */}
          <div
            className={`glass p-2 rounded-[3rem] animate-fade-in-up animate-delay-100 transition-all ${dragging ? "ring-2 ring-primary" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
          >
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary/20 rounded-[2.5rem] p-12 md:py-20 flex flex-col items-center justify-center text-center bg-white/5 hover:bg-white/[0.08] transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
              <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500 border border-primary/30">
                <span className="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
              </div>
              {uploading ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">Analyzing your resume...</h3>
                  <p className="text-slate-400 text-sm mb-6">{uploadProgress}% complete</p>
                  <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }} />
                  </div>
                </>
              ) : resumeData ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">Resume Analyzed ✓</h3>
                  <p className="text-slate-400 text-sm mb-6">Drop a new file or click to re-analyze</p>
                  <button className="px-10 py-4 bg-primary/20 text-primary rounded-2xl font-black text-xs uppercase tracking-widest border border-primary/30 hover:bg-primary hover:text-white transition-all">
                    Upload New Resume
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">Drop your resume here</h3>
                  <p className="text-slate-400 text-sm mb-8 font-medium">Supports PDF (Max 10MB)</p>
                  <button className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all active:scale-95">
                    Browse Files
                  </button>
                </>
              )}
              {uploadMessage && (
                <p className="mt-4 text-sm font-semibold text-white">{uploadMessage}</p>
              )}
            </div>
          </div>

          {/* Feedback row */}
          {resumeData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Strengths */}
              <div className="glass p-8 md:p-10 rounded-[3rem] border-t border-secondary/20 animate-fade-in-up animate-delay-200">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-headline">Strengths</h3>
                </div>
                <ul className="space-y-5">
                  {(resumeData.strengths?.length
                    ? resumeData.strengths
                    : resumeData.skills?.slice(0, 3).map((s) => `Strong proficiency in ${s}`) || []
                  ).slice(0, 3).map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-2 w-2 h-2 rounded-full bg-secondary shrink-0 shadow-[0_0_10px_rgba(16,185,129,1)]" />
                      <p className="text-sm text-slate-300 font-medium leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="glass p-8 md:p-10 rounded-[3rem] border-t border-red-500/20 animate-fade-in-up animate-delay-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-400" style={{ fontVariationSettings: "'FILL' 1" }}>error_outline</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-headline">Improvements</h3>
                </div>
                <ul className="space-y-5">
                  {(resumeData.suggestions || ["Add measurable impact metrics", "Include more keywords", "Improve summary section"]).slice(0, 3).map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-2 w-2 h-2 rounded-full bg-red-400 shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                      <p className="text-sm text-slate-300 font-medium leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Empty state hint */}
          {!resumeData && (
            <div className="glass p-8 rounded-[2rem] animate-fade-in-up animate-delay-200 text-center">
              <p className="text-slate-400 text-sm">Upload your resume above to see strengths, improvement areas, and your ATS score.</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 md:gap-8">
          {/* ATS Score circle */}
          <div className="glass p-10 rounded-[3rem] flex flex-col items-center justify-center text-center relative overflow-hidden animate-fade-in-up animate-delay-400">
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10">ATS Performance Score</h3>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                <circle className="text-white/5" cx="96" cy="96" r="88" fill="transparent" stroke="currentColor" strokeWidth="12" />
                <circle
                  cx="96" cy="96" r="88" fill="transparent"
                  stroke="#6366f1" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={resumeData ? offset : circ}
                  style={{ filter: "drop-shadow(0 0 10px rgba(99,102,241,0.4))", transition: "stroke-dashoffset 1.5s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-7xl font-bold font-headline text-white tracking-tighter">{ats}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {ats >= 80 ? "EXCELLENT" : ats >= 60 ? "GOOD" : ats > 0 ? "FAIR" : "PENDING"}
                </span>
              </div>
            </div>
            <div className="mt-10 px-6 py-2 bg-secondary/10 border border-secondary/20 rounded-full">
              <p className="text-secondary font-black text-[10px] tracking-widest uppercase">
                {resumeData ? "ANALYSIS COMPLETE" : "AWAITING UPLOAD"}
              </p>
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="glass p-10 rounded-[3rem] flex-grow animate-fade-in-up animate-delay-500 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">bolt</span>
              </div>
              <h3 className="text-xl font-bold text-white font-headline">Neural Skill Gaps</h3>
            </div>
            <p className="text-[11px] text-slate-400 mb-8 font-medium uppercase tracking-wider">
              {resumeData ? "Missing keywords for target roles:" : "Upload resume to detect gaps"}
            </p>
            <div className="space-y-3">
              {(resumeData?.skillGaps || ["Cloud Architecture", "System Design", "GraphQL", "Kubernetes"]).slice(0, 4).map((gap) => (
                <div key={gap} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer border border-white/5">
                  <span className="text-sm font-bold text-slate-200">{gap}</span>
                  <span className="material-symbols-outlined text-red-400 text-xl group-hover:scale-125 transition-transform">add_circle</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/roadmap")}
              className="w-full mt-10 py-4 bg-transparent border border-primary text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95"
            >
              View Learning Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-12 pb-16 border-t border-white/5 flex justify-between items-center relative z-10 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-white font-headline">Orbit Engine</span>
          <span className="text-[10px] font-medium tracking-wider text-slate-600">© 2024 CELESTIAL CAREER ENGINE</span>
        </div>
        <div className="flex gap-10">
          {["Operations", "Privacy", "Protocol"].map((l) => (
            <span key={l} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors cursor-pointer">{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}