import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/resume/my-resumes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setResumeData(data[0]); // Get the latest resume
        }
      }
    } catch (error) {
      console.error("Error fetching resume data:", error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/resume/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setResumeData(data);
        alert("Resume uploaded and analyzed successfully!");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading resume");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold">
        Welcome Back, <span className="text-purple-400">{user?.name || "User"} 🚀</span>
      </h1>

      <p className="text-gray-400 mt-2">
        Track your progress and become placement-ready with Orbit AI.
      </p>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <StatCard title="Resume Score" value={resumeData ? `${resumeData.atsScore}%` : "Not uploaded"} />
        <StatCard title="Roadmap Progress" value={resumeData ? `${resumeData.roadmapProgress || 0}%` : "N/A"} />
        <StatCard title="Jobs Matched" value={resumeData ? resumeData.jobsMatched || 0 : "N/A"} />
      </div>

      {/* NEXT STEPS */}
      <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-purple-300">
          Next Recommended Step
        </h2>
        <p className="text-gray-400 mt-2">
          {resumeData 
            ? "Your resume has been analyzed. Check the Resume Analyzer for detailed insights."
            : "Upload your resume to generate a personalized roadmap."
          }
        </p>

        {!resumeData && (
          <div className="mt-6">
            <input
              type="file"
              id="dashboard-resume-upload"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <label
              htmlFor="dashboard-resume-upload"
              className={`inline-block px-6 py-3 rounded-xl transition cursor-pointer font-semibold ${
                uploading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-purple-500 hover:bg-purple-600"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Resume"}
            </label>
          </div>
        )}

        {resumeData && (
          <button
            onClick={() => navigate("/resume-analyzer")}
            className="mt-6 px-6 py-3 bg-purple-500 rounded-xl hover:bg-purple-600 transition font-semibold"
          >
            View Resume Analysis
          </button>
        )}
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