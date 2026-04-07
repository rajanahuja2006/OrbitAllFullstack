import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const menu = [
  { name: "Command Hub",    path: "/dashboard",       icon: "dashboard" },
  { name: "Resume Forge",   path: "/resume-analyzer", icon: "description" },
  { name: "Star Map",       path: "/roadmap",          icon: "map" },
  { name: "Neural Tutor",   path: "/chat-tutor",       icon: "psychology" },
  { name: "Target Sectors", path: "/jobs",             icon: "work" },
];

export default function Layout() {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-8 glass-dark w-72 rounded-r-[3rem] z-50">
        {/* Logo */}
        <div className="px-8 mb-12 flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-indigo-400 flex items-center justify-center shadow-lg glow-orbit transition-all group-hover:scale-110">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              rocket_launch
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-headline">Orbit</h1>
            <p className="text-[9px] font-extrabold text-secondary uppercase tracking-[0.3em]">Career Nexus</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-2">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "bg-primary/20 text-white rounded-2xl px-6 py-4 flex items-center gap-4 text-sm font-semibold border border-white/10 transition-all"
                  : "text-slate-400 px-6 py-4 hover:bg-white/5 rounded-2xl flex items-center gap-4 text-sm font-semibold transition-all hover:translate-x-2 hover:text-white"
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade Card */}
        <div className="px-6 mt-auto">
          <div className="bg-gradient-to-br from-primary-container to-slate-900 p-6 rounded-3xl relative overflow-hidden group border border-white/5">
            <div className="relative z-10">
              <p className="text-white font-bold text-sm mb-1">Ascend to Pro</p>
              <p className="text-slate-400 text-[11px] mb-4">Neural Mock Interviews &amp; Global Analytics</p>
              <button
                onClick={() => navigate("/pricing")}
                className="w-full py-3 bg-white rounded-xl text-xs font-black transition-all hover:bg-indigo-50 active:scale-95 uppercase tracking-widest"
                style={{ color: '#3730a3' }}
              >
                Initiate Upgrade
              </button>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <span className="material-symbols-outlined text-8xl text-white">grade</span>
            </div>
          </div>

          {/* User info + logout */}
          <div className="mt-6 px-2">
            <p className="text-xs text-slate-500 truncate mb-1">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="ml-72 flex-1 min-h-screen">
        <Outlet />
      </main>

      {/* ── Floating Action Button ── */}
      <div className="fixed bottom-10 right-10 z-[100]">
        <button
          onClick={() => navigate("/chat-tutor")}
          className="w-16 h-16 rounded-[1.5rem] bg-primary shadow-[0_20px_50px_rgba(99,102,241,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 relative group overflow-hidden border border-white/20"
          title="Open AI Tutor"
        >
          <span className="material-symbols-outlined text-2xl relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
}
