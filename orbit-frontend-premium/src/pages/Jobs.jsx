import { useState, useEffect } from "react";
import API_CONFIG from "../utils/api";

export default function Jobs() {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_CONFIG.RESUME_JOBS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJobData(data);
      } else {
        setError("Failed to load job matches");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Error loading jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    if (percentage >= 40) return "text-orange-400";
    return "text-red-400";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-purple-400">Loading job matches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-400 mb-4">
          Job Matches
        </h1>
        <div className="mt-10 p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-purple-400">
        Job Matches
      </h1>
      
      {jobData && (
        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-purple-300">
                Found {jobData.totalJobs} jobs matching your skills
              </span>
              <span className="text-purple-300">
                (ATS Score: {jobData.atsScore}%)
              </span>
            </div>
            {jobData.missingSkills && jobData.missingSkills.length > 0 && (
              <div className="text-sm text-gray-400">
                Skills to develop: {jobData.missingSkills.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobData?.jobs?.map((job) => (
          <div
            key={job.id}
            onClick={() => handleJobClick(job)}
            className="bg-white/5 border border-white/10 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`text-sm font-semibold px-2 py-1 rounded ${getDifficultyColor(job.minAtsScore)}`}>
                    {job.minAtsScore}+ ATS
                  </div>
                  <div className="text-xs text-gray-400">
                    {job.company}
                  </div>
                </div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-300 text-sm mb-2">{job.location}</p>
              </div>
              <div className="text-right">
                <div className={`text-xs font-semibold px-2 py-1 rounded ${getMatchColor(job.skillMatchPercentage)}`}>
                  {job.skillMatchPercentage}% Match
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-4">{job.description}</p>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {job.requiredSkills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {job.requiredSkills.length > 4 && (
                  <span className="text-xs text-gray-400">
                    +{job.requiredSkills.length - 4} more
                  </span>
                )}
              </div>
              <a
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition font-semibold text-center"
              >
                Apply Now
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-purple-400">
                {selectedJob.title} at {selectedJob.company}
              </h3>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Job Description</h4>
                <p className="text-gray-300">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-purple-400 mb-2">Match Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Skill Match:</span>
                    <span className="font-semibold">{selectedJob.skillMatchPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Minimum ATS:</span>
                    <span className="font-semibold">{selectedJob.minAtsScore}%</span>
                  </div>
                </div>
              </div>

              {selectedJob.skillRoadmap && (
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">Learning Roadmap</h4>
                  <div className="space-y-2">
                    {selectedJob.skillRoadmap.map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-8 text-center">
                          <div className={`w-6 h-6 rounded-full ${step.status === 'completed' ? 'bg-green-500' : step.status === 'current' ? 'bg-purple-500' : 'bg-gray-300'}`} />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{step.title}</div>
                          <div className="text-xs text-gray-400">{step.estimatedTime}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              <a
                href={selectedJob.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition font-semibold text-center"
              >
                Apply on {selectedJob.company} Website
              </a>
              <button
                onClick={() => setSelectedJob(null)}
                className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}