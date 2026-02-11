import { motion } from "framer-motion";
import { Sparkles, Rocket, Brain, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-10 py-16">

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-6xl font-extrabold leading-tight">
          Build Your Career With{" "}
          <span className="text-purple-400">Orbit AI</span>
        </h1>

        <p className="mt-6 text-lg text-gray-300">
          AI-powered learning paths for BTech CSE students.  
          Upload your resume, generate roadmaps, match jobs & become placement-ready 🚀
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 transition font-semibold">
            Generate My Roadmap
          </button>

          <button className="px-6 py-3 rounded-xl border border-gray-500 hover:border-purple-400 transition">
            Explore Features
          </button>
        </div>
      </motion.div>

      {/* FEATURE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">

        <FeatureCard
          icon={<Brain size={32} />}
          title="AI Mentor"
          desc="Personal guidance for your specialization journey."
        />

        <FeatureCard
          icon={<Target size={32} />}
          title="Career Roadmaps"
          desc="Step-by-step learning paths from beginner to job-ready."
        />

        <FeatureCard
          icon={<Rocket size={32} />}
          title="Placement Boost"
          desc="Projects + skills aligned with top companies."
        />

        <FeatureCard
          icon={<Sparkles size={32} />}
          title="Resume Analyzer"
          desc="Get ATS score + improvements instantly."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg"
    >
      <div className="text-purple-400">{icon}</div>
      <h3 className="text-xl font-bold mt-4">{title}</h3>
      <p className="text-gray-400 mt-2 text-sm">{desc}</p>
    </motion.div>
  );
}