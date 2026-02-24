import { useState } from "react";
import API_CONFIG from "../utils/api";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_CONFIG.RESUME_UPLOAD, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setAnalysis(data);
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
      <h1 className="text-4xl font-bold text-purple-400">
        Resume Analyzer
      </h1>

      <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold">
          ATS Score: <span className="text-purple-400">
            {analysis ? `${analysis.atsScore}%` : "82%"}
          </span>
        </h2>

        <p className="text-gray-400 mt-2">
          Improve your resume with AI suggestions.
        </p>

        {/* File Upload */}
        <div className="mt-6">
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <label
            htmlFor="resume-upload"
            className="inline-block px-6 py-3 bg-purple-500 rounded-xl hover:bg-purple-600 transition cursor-pointer"
          >
            {file ? file.name : "Choose Resume File"}
          </label>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`mt-4 px-6 py-3 rounded-xl transition font-semibold ${
            !file || uploading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600"
          }`}
        >
          {uploading ? "Analyzing..." : "Upload Resume"}
        </button>

        {/* Analysis Results */}
        {analysis && (
          <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
            <div className="space-y-3">
              <p><strong>ATS Score:</strong> {analysis.atsScore}%</p>
              <p><strong>Skills Found:</strong> {analysis.skills?.join(", ") || "N/A"}</p>
              <p><strong>Experience:</strong> {analysis.experience || "N/A"}</p>
              <p><strong>Suggestions:</strong></p>
              <ul className="list-disc list-inside text-gray-300">
                {analysis.suggestions?.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                )) || <li>No suggestions available</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}