import { useState, useEffect } from "react";

export default function Roadmap() {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/resume/roadmap", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRoadmapData(data);
      } else if (response.status === 404) {
        setError("Please upload a resume first to generate your personalized roadmap.");
      } else {
        setError("Failed to load roadmap");
      }
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      setError("Error loading roadmap");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-purple-400">Generating your personalized roadmap...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-400 mb-4">
          Your AI Roadmap
        </h1>
        <div className="mt-10 p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 border-green-500 text-green-400";
      case "current":
        return "bg-purple-500/20 border-purple-500 text-purple-400";
      case "locked":
        return "bg-gray-500/20 border-gray-500 text-gray-400";
      default:
        return "bg-white/5 border-white/10 text-white";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-400";
      case "Intermediate":
        return "text-yellow-400";
      case "Advanced":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-purple-400">
          Your AI Roadmap
        </h1>
        <p className="text-gray-400 mt-2">
          Personalized learning path based on your resume analysis
        </p>
        {roadmapData && (
          <div className="mt-4 flex gap-6 text-sm">
            <span className="text-purple-300">
              Current Skills: {roadmapData.currentSkills.join(", ")}
            </span>
            <span className="text-purple-300">
              ATS Score: {roadmapData.atsScore}%
            </span>
            <span className="text-purple-300">
              Progress: {roadmapData.completedSteps}/{roadmapData.totalSteps} steps
            </span>
          </div>
        )}
      </div>

      <div className="mt-10 space-y-4">
        {roadmapData?.roadmap.map((step, i) => (
          <div
            key={step.id}
            className={`p-6 border rounded-xl transition-all hover:scale-[1.02] ${getStatusColor(step.status)}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-bold text-sm">
                  Step {i + 1}
                </span>
                <h2 className="text-xl font-semibold mt-1">{step.title}</h2>
              </div>
              <div className="text-right">
                <span className={`text-xs font-semibold ${getDifficultyColor(step.difficulty)}`}>
                  {step.difficulty}
                </span>
                <div className="text-xs text-gray-400 mt-1">
                  {step.estimatedTime}
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">{step.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {step.requiredSkills.length > 0 && (
                  <span className="text-xs bg-white/10 px-2 py-1 rounded">
                    Requires: {step.requiredSkills.join(", ")}
                  </span>
                )}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                step.status === "completed" ? "bg-green-500/20 text-green-400" :
                step.status === "current" ? "bg-purple-500/20 text-purple-400" :
                "bg-gray-500/20 text-gray-400"
              }`}>
                {step.status === "completed" ? "✅ Completed" :
                 step.status === "current" ? "🎯 Current Focus" :
                 "🔒 Locked"}
              </span>
            </div>

            {step.resources && step.resources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-2">Recommended Resources:</p>
                <div className="flex flex-wrap gap-2">
                  {step.resources.map((resource, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded"
                    >
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}