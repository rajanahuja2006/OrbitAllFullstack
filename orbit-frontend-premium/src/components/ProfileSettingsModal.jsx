import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Settings, Save, Sparkles, BookOpen, Clock, Laptop } from "lucide-react";

export default function ProfileSettingsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-xl flex flex-col max-h-[90vh] pointer-events-auto"
            >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {activeTab === "profile" ? <User size={22} className="text-indigo-400" /> : <Settings size={22} className="text-indigo-400" />}
                Profile & Settings
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden min-h-0">
              {/* Sidebar */}
              <div className="w-64 shrink-0 border-r border-white/10 bg-white/5 p-4 flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    activeTab === "profile"
                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white shadow-sm border border-indigo-500/30"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <User size={18} />
                  My Profile
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    activeTab === "settings"
                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white shadow-sm border border-indigo-500/30"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Settings size={18} />
                  Settings
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {activeTab === "profile" ? <ProfileContent /> : <SettingsContent />}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 bg-black/20 px-6 py-4 flex justify-end gap-3 shrink-0">
              <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/10 transition">
                Cancel
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90">
                <Save size={16} />
                Save Changes
              </button>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function InputField({ label, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-white/70 tracking-wide uppercase">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 transition focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
}

function SelectField({ label, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-white/70 tracking-wide uppercase">{label}</label>
      <select className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white transition focus:border-indigo-500 focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function ProfileContent() {
  return (
    <div className="space-y-8 text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h3 className="mb-4 text-lg font-bold text-indigo-300 border-b border-white/10 pb-2">Basic Info</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <InputField label="Full Name" placeholder="Alex Astronaut" />
          <InputField label="Age" type="number" placeholder="24" />
          <InputField label="Education" placeholder="B.S. Computer Science" />
        </div>
      </section>

      <section>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-purple-300 border-b border-white/10 pb-2">
          <Sparkles size={18} /> Learning Goals
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <InputField label="Short-term Goal" placeholder="Learn React & Node.js" />
          <InputField label="Long-term Goal" placeholder="Become a Full-Stack Engineer at a high-tech company" />
        </div>
      </section>

      <section>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-teal-300 border-b border-white/10 pb-2">
          <BookOpen  size={18} /> Skills & Interests
        </h3>
        <div className="flex flex-col gap-6">
          <InputField label="Current Skills (comma separated)" placeholder="JavaScript, Python, Math, UI Design" />
          <InputField label="Interests (comma separated)" placeholder="AI, Web Dev, Data Science, Space Exploration" />
        </div>
      </section>

      <section>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-300 border-b border-white/10 pb-2">
          <Clock size={18} /> Learning Preferences
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField label="Study Time" options={["Morning", "Afternoon", "Evening", "Night"]} />
          <SelectField label="Learning Style" options={["Visual (Videos/Diagrams)", "Reading & Writing", "Auditory (Lectures)", "Kinesthetic (Hands-on)"]} />
        </div>
      </section>

      <section>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-sky-300 border-b border-white/10 pb-2">
          <Laptop size={18} /> Resources
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition">
            <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
            <span className="text-sm font-medium">Laptop / PC</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition">
            <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
            <span className="text-sm font-medium">High-speed Internet</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition">
            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
            <span className="text-sm font-medium">Paid Software/IDEs</span>
          </label>
        </div>
      </section>
    </div>
  );
}

function SettingsContent() {
  return (
    <div className="space-y-8 text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <section>
        <h3 className="mb-4 text-lg font-bold text-gray-300 border-b border-white/10 pb-2">Account</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-4">
          <InputField label="Email Address" type="email" placeholder="example@email.com" />
          <InputField label="New Password" type="password" placeholder="••••••••" />
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-bold text-gray-300 border-b border-white/10 pb-2">Notifications</h3>
        <div className="space-y-3">
          <ToggleSwitch label="Study Reminders" description="Receive a notification when it's time to study." defaultChecked />
          <ToggleSwitch label="Progress Alerts" description="Get updates when you hit your learning milestones." defaultChecked />
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-bold text-gray-300 border-b border-white/10 pb-2">Learning Settings</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField label="Difficulty Level" options={["Beginner", "Intermediate", "Advanced", "Expert"]} />
          <SelectField label="Pace" options={["Relaxed", "Standard", "Intensive", "Bootcamp"]} />
          <InputField label="Target Study Days/Week" type="number" placeholder="5" />
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-bold text-gray-300 border-b border-white/10 pb-2">AI Settings</h3>
        <div className="flex gap-4">
          <button className="rounded-xl border border-indigo-500/50 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 hover:bg-indigo-500/20 transition">
            Regenerate Career Path
          </button>
          <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition">
            Change Core Goal
          </button>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-bold text-gray-300 border-b border-white/10 pb-2">Privacy & Appearance</h3>
        <div className="space-y-3 mb-6">
          <ToggleSwitch label="Public Profile" description="Allow recruiters to see your verified skills and roadmap." />
          <ToggleSwitch label="Data Sharing" description="Share anonymized learning data to improve Orbit AI." defaultChecked />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField label="Theme" options={["Dark Mode (Default)", "Light Mode", "System Sync"]} />
          <SelectField label="Language" options={["English", "Spanish", "French", "Hindi"]} />
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-bold text-gray-300 border-b border-white/10 pb-2">Data & Support</h3>
        <div className="flex flex-wrap gap-4">
          <button className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20 transition hover:bg-red-500/30">
            Reset Progress
          </button>
          <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition">
            Download Report (PDF)
          </button>
          <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition">
            Help & Support
          </button>
        </div>
      </section>
    </div>
  );
}

function ToggleSwitch({ label, description, defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition cursor-pointer mb-2" onClick={() => setChecked(!checked)}>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-white/50">{description}</p>
      </div>
      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-indigo-500' : 'bg-gray-600'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
    </div>
  );
}
