import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API_CONFIG from "../utils/api";
import CrazyBackground from "../components/CrazyBackground";
import AnimatedParticles from "../components/AnimatedParticles";
import MorphingCard from "../components/MorphingCard";
import InteractiveButton from "../components/InteractiveButton";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_CONFIG.RESUME_MY_RESUMES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setResumeData(data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching resume data:", error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    
    // Validation
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    // Check file type
    if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
      alert("Please upload a PDF file only");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("You are not logged in. Please login first.");
        setUploading(false);
        return;
      }

      console.log("Uploading file:", file.name);
      
      const response = await fetch(API_CONFIG.RESUME_UPLOAD, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setResumeData(data);
        alert(`✅ Resume uploaded successfully!\n\nATS Score: ${data.atsScore}%\nSkills Found: ${data.skills.length}\nJobs Matched: ${data.jobsMatched}`);
        // Reset file input
        event.target.value = "";
      } else {
        console.error("Upload failed:", data);
        alert(`❌ Upload failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(`❌ Error: ${error.message || "Failed to upload resume"}`);
    } finally {
      setUploading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, type: "spring" },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <CrazyBackground />
      <AnimatedParticles count={40} />

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .dashboard-container {
          position: relative;
          z-index: 10;
        }

        .welcome-text {
          background: linear-gradient(135deg, #00ff88, #00ffff, #00ff88);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: morphGradient 4s ease infinite;
        }

        @keyframes morphGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .glow-card {
          background: rgba(10, 14, 39, 0.4);
          border: 1px solid rgba(0, 255, 136, 0.2);
          backdrop-filter: blur(15px);
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.1);
          transition: all 0.3s ease;
        }

        .glow-card:hover {
          border-color: rgba(0, 255, 136, 0.6);
          box-shadow: 0 0 40px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.05);
        }

        .neon-text {
          color: #00ff88;
          text-shadow: 0 0 10px #00ff88;
        }
      `}</style>

      <div className="dashboard-container max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-6xl font-black mb-4 welcome-text">
            Welcome Back, {user?.name || "Navigator"} 🌟
          </h1>
          <p className="text-xl text-gray-300 font-light">
            Your AI-powered career companion is ready to guide you forward
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <MorphingCard
            icon="📊"
            title="ATS Score"
            value={resumeData ? `${resumeData.atsScore}%` : "0%"}
            gradient={["#667eea", "#764ba2", "#f093fb", "#4facfe"]}
            delay={0}
          />
          <MorphingCard
            icon="🎯"
            title="Roadmap Progress"
            value={resumeData ? `${resumeData.roadmapProgress || 0}%` : "0%"}
            gradient={["#f093fb", "#f5576c", "#4facfe", "#00f2fe"]}
            delay={0.1}
          />
          <MorphingCard
            icon="💼"
            title="Jobs Matched"
            value={resumeData ? resumeData.jobsMatched || 0 : 0}
            gradient={["#4facfe", "#00f2fe", "#667eea", "#764ba2"]}
            delay={0.2}
          />
        </motion.div>

        {/* Next Steps Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          className="glow-card p-10 rounded-3xl mb-16"
        >
          <h2 className="text-3xl font-bold neon-text mb-4">
            🚀 Next Recommended Step
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            {resumeData
              ? "Your resume has been analyzed. Explore detailed insights and get personalized guidance."
              : "Upload your resume to unlock personalized AI guidance and career insights."}
          </p>

          {!resumeData && (
            <div className="mt-8">
              <input
                type="file"
                id="dashboard-resume-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />

              <label htmlFor="dashboard-resume-upload" className="cursor-pointer">
                <InteractiveButton
                  icon="📤"
                  variant="primary"
                  as="span"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Resume"}
                </InteractiveButton>
              </label>
            </div>
          )}

          {resumeData && (
            <motion.div whileHover={{ scale: 1.05 }}>
              <InteractiveButton
                icon="📈"
                variant="secondary"
                onClick={() => navigate("/resume-analyzer")}
              >
                View Analysis
              </InteractiveButton>
            </motion.div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <QuickActionCard
            icon="🛣️"
            title="Roadmap"
            onClick={() => navigate("/roadmap")}
            delay={0}
          />
          <QuickActionCard
            icon="💬"
            title="Chat Tutor"
            onClick={() => navigate("/chat-tutor")}
            delay={0.1}
          />
          <QuickActionCard
            icon="💼"
            title="Job Matches"
            onClick={() => navigate("/jobs")}
            delay={0.2}
          />
          <QuickActionCard
            icon="✨"
            title="Resume Tips"
            onClick={() => navigate("/resume-analyzer")}
            delay={0.3}
          />
        </motion.div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, onClick, delay }) {
  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { delay, duration: 0.5, type: "spring" },
        },
      }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="relative p-6 rounded-2xl glow-card group"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 via-cyan-500 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity" />
      <div className="relative text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <p className="text-sm font-bold text-gray-300 group-hover:text-cyan-300 transition-colors">
          {title}
        </p>
      </div>
    </motion.button>
  );
}