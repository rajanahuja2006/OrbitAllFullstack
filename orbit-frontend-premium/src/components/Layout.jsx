import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";

import {
  LayoutDashboard,
  FileText,
  Map,
  Briefcase,
  MessageCircle,
  LogOut,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";

export default function Layout() {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard /> },
    { name: "Resume Analyzer", path: "/resume-analyzer", icon: <FileText /> },
    { name: "Roadmap", path: "/roadmap", icon: <Map /> },
    { name: "Job Match", path: "/jobs", icon: <Briefcase /> },
    { name: "AI Tutor", path: "/chat-tutor", icon: <MessageCircle /> },
  ];

  // ✅ Handle Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white/5 border-r border-white/10 p-6 backdrop-blur-xl flex flex-col justify-between">

        {/* TOP */}
        <div>
          <Link to="/dashboard" className="inline-block">
            <h1 className="text-2xl font-extrabold text-purple-400 mb-10">
              Orbit AI 🚀
            </h1>
          </Link>

          <nav className="flex flex-col gap-3">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "bg-purple-500 text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* BOTTOM (Logout Section) */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-sm text-gray-400 mb-3">
            Logged in as:
            <span className="block text-purple-300 font-medium">
              {user?.email}
            </span>
          </p>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/80 hover:bg-red-600 transition font-semibold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}