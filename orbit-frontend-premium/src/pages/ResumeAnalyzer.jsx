export default function ResumeAnalyzer() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-purple-400">
        Resume Analyzer
      </h1>

      <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold">
          ATS Score: <span className="text-purple-400">82%</span>
        </h2>

        <p className="text-gray-400 mt-2">
          Improve your resume with AI suggestions.
        </p>

        <button className="mt-6 px-6 py-3 bg-purple-500 rounded-xl hover:bg-purple-600 transition">
          Upload Resume
        </button>
      </div>
    </div>
  );
}