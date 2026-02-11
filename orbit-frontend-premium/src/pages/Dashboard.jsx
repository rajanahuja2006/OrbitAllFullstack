import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-4xl font-bold">
        Welcome Back, <span className="text-purple-400">Rajan 🚀</span>
      </h1>

      <p className="text-gray-400 mt-2">
        Track your progress and become placement-ready with Orbit AI.
      </p>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <StatCard title="Resume Score" value="82%" />
        <StatCard title="Roadmap Progress" value="45%" />
        <StatCard title="Jobs Matched" value="12" />
      </div>

      {/* NEXT STEPS */}
      <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-purple-300">
          Next Recommended Step
        </h2>
        <p className="text-gray-400 mt-2">
          Upload your resume to generate a personalized roadmap.
        </p>

        <button className="mt-6 px-6 py-3 bg-purple-500 rounded-xl hover:bg-purple-600 transition">
          Upload Resume
        </button>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg"
    >
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-3xl font-bold mt-2 text-purple-400">{value}</p>
    </motion.div>
  );
}