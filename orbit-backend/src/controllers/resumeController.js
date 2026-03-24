import pdf from "pdf-parse";
import Resume from "../models/Resume.js";
import { canUploadResume, decrementUploadCount } from "./paymentController.js";
import { GoogleGenAI } from "@google/genai";

export const uploadResume = async (req, res) => {
  try {
    console.log("📧 Upload request received");
    console.log("🔑 User ID:", req.user?.id);
    console.log("📁 File:", req.file ? { name: req.file.originalname, size: req.file.size } : "No file");
    
    // Check if user has active subscription and remaining uploads
    const uploadCheck = await canUploadResume(req.user.id);
    if (!uploadCheck.allowed) {
      console.log("❌ Upload denied:", uploadCheck.reason);
      return res.status(403).json({ 
        message: uploadCheck.reason,
        requiresPayment: true,
        currentPlan: uploadCheck.currentPlan,
        uploadsRemaining: uploadCheck.uploadsRemaining,
      });
    }

    console.log("✅ Upload allowed for plan:", uploadCheck.plan);

    if (!req.user) {
      console.error("❌ No user authenticated");
      return res.status(401).json({ message: "User not authenticated. Please login again." });
    }

    if (!req.file) {
      console.error("❌ No file provided");
      return res.status(400).json({ message: "No file uploaded. Please select a PDF resume." });
    }

    if (!req.file.buffer) {
      console.error("❌ File buffer missing");
      return res.status(400).json({ message: "File upload failed. Please try again." });
    }

    console.log("📄 Processing PDF...");
    const data = await pdf(req.file.buffer);
    console.log("✅ PDF processed successfully");
    const text = data.text;

    console.log("🤖 Analyzing resume with Gemini AI...");
    let atsScore = 0;
    let extractedSkills = [];
    let experience = "Not specified";
    let suggestions = [];

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing from environment variables.");
      }
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
You are a highly analytical Senior Technical Recruiter and ATS Expert. Deeply analyze the following resume text to provide extremely detailed, actionable feedback.

Extract exactly 4 fields into a JSON object:
1. "atsScore" (Number): Calculate a rigorous ATS score (0-100). Deduct points for lack of quantifiable metrics (e.g., "increased revenue by 20%"), missing standard technical keywords, poor structuring, or vague bullet points. Most average resumes score between 40-60. Only score above 80 if the resume is truly exceptional.
2. "skills" (Array of Strings): Extract a highly exhaustive, comprehensive list of ALL technical skills, languages, frameworks, developer tools, soft skills, and cloud platforms mentioned.
3. "experience" (String): Calculate the total years of professional experience accurately (e.g., "3 years 2 months").
4. "suggestions" (Array of Strings): Provide 4-6 highly specific, actionable suggestions to improve the resume. DO NOT give generic advice like "Add more metrics." INSTEAD, give precise examples: "Rewrite the bullet point about 'managing databases' to include the database size, request volume, or query optimization metrics." Suggest extremely targeted technical keywords they might be missing based on their role.

Respond ONLY with a valid JSON object starting with '{' and ending with '}'. Do not use markdown wrappers, code blocks, or explanations.

Example Output:
{
  "atsScore": 52,
  "skills": ["React", "TypeScript", "Node.js", "AWS EC2", "Leadership", "Agile", "PostgreSQL"],
  "experience": "2 years 6 months",
  "suggestions": [
    "Quantify your impact in the backend role: mention the scale of API requests handled (e.g., 'Handles 10k requests/min')",
    "The resume lacks testing frameworks (e.g., Jest, Cypress); add them if you have experience.",
    "Change the vague summary to a targeted professional summary highlighting your top 3 tech stacks."
  ]
}

Resume Text:
${text.substring(0, 15000)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.2,
            responseMimeType: "application/json",
        }
      });
      
      const responseText = response.text;
      
      // Attempt to parse JSON response
      let parsedData;
      try {
        parsedData = JSON.parse(responseText.replace(/```json\n?|\n?```/g, ""));
      } catch (parseError) {
        console.error("❌ Failed to parse Gemini response:", responseText);
        throw new Error("Invalid format returned by AI.");
      }
      
      atsScore = parsedData.atsScore || 0;
      extractedSkills = parsedData.skills || [];
      experience = parsedData.experience || "Not specified";
      suggestions = parsedData.suggestions || [];
      console.log("✅ Gemini AI analysis complete. Score:", atsScore);
    } catch (aiError) {
      console.error("❌ Gemini AI analysis failed:", aiError.message);
      console.log("Fallback to basic extraction...");
      // Fallback if AI fails or key is missing
      extractedSkills = ["JavaScript", "React", "Node.js", "MongoDB"]; // Mock fallback
      atsScore = 50;
      experience = "Unknown";
      suggestions = ["Add more details to your resume.", "Ensure your API key is configured for AI analysis."];
    }

    const roadmap = generatePersonalizedRoadmap(extractedSkills, atsScore);
    const completedSteps = roadmap.filter((step) => step.status === "completed").length;
    const roadmapProgress = roadmap.length ? Math.min(100, (completedSteps / roadmap.length) * 100) : 0;
    const jobsMatched = Math.floor((atsScore / 100) * extractedSkills.length * 2);

    const uniqueSkills = [...new Set(extractedSkills)];

    console.log("💾 Saving resume to database...");
    const savedResume = await Resume.create({
      user: req.user.id,
      extractedSkills: uniqueSkills,
      readinessScore: atsScore,
      roadmapProgress: Math.round(roadmapProgress),
      jobsMatched,
    });
    console.log("✅ Resume saved successfully:", savedResume._id);

    // Decrement upload count for paid users
    await decrementUploadCount(req.user.id);

    res.status(200).json({
      message: "Resume processed successfully",
      atsScore,
      skills: uniqueSkills,
      experience,
      suggestions,
      roadmapProgress: Math.round(roadmapProgress),
      jobsMatched,
    });
  } catch (error) {
    console.error("❌ Resume upload error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "Resume processing failed: " + error.message,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getMyResumes = async (req, res) => {
  try {
    const latestResume = await Resume.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });

    const transformedResumes = resumes.map((resume) => ({
      ...resume.toObject(),
      atsScore: resume.readinessScore,
      skills: resume.extractedSkills,
      roadmapProgress: resume.roadmapProgress,
      jobsMatched: resume.jobsMatched,
    }));

    if (!latestResume) {
      return res.json({ latestResume: null, resumes: transformedResumes });
    }

    res.json({
      latestResume: {
        ...latestResume.toObject(),
        atsScore: latestResume.readinessScore,
        skills: latestResume.extractedSkills,
        roadmapProgress: latestResume.roadmapProgress,
        jobsMatched: latestResume.jobsMatched,
      },
      resumes: transformedResumes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
};

export const generateRoadmap = async (req, res) => {
  try {
    const latestResume = await Resume.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (!latestResume) {
      return res.status(404).json({ message: "No resume found. Please upload a resume first." });
    }

    const skills = latestResume.extractedSkills;
    const atsScore = latestResume.readinessScore;
    const roadmap = generatePersonalizedRoadmap(skills, atsScore);

    res.json({
      roadmap,
      currentSkills: skills,
      atsScore,
      totalSteps: roadmap.length,
      completedSteps: roadmap.filter((s) => s.status === "completed").length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate roadmap" });
  }
};

function generatePersonalizedRoadmap(skills, atsScore) {
  const userSkillsLower = skills.map((s) => s.toLowerCase());

  const allSteps = [
    {
      id: 1,
      title: "Programming Fundamentals",
      description: "Master basic programming concepts, variables, loops, and functions",
      estimatedTime: "2-4 weeks",
      difficulty: "Beginner",
      requiredSkills: [],
      status: hasAnySkill(userSkillsLower, ["python", "java", "c++", "javascript", "typescript", "go", "rust"]) ? "completed" : "current",
      resources: ["Codecademy", "FreeCodeCamp", "CS50", "The Odin Project"],
    },
    {
      id: 2,
      title: "Data Structures & Algorithms",
      description: "Learn arrays, linked lists, trees, graphs, and algorithmic thinking",
      estimatedTime: "6-8 weeks",
      difficulty: "Intermediate",
      requiredSkills: ["python", "java", "c++", "javascript", "dsa", "algorithms"],
      status: hasAnySkill(userSkillsLower, ["dsa", "algorithms", "data structures"]) ? "completed" : hasAnySkill(userSkillsLower, ["python", "java", "c++", "javascript"]) ? "current" : "locked",
      resources: ["LeetCode", "HackerRank", "GeeksforGeeks", "AlgoExpert"],
    },
    {
      id: 3,
      title: "Web Development Basics",
      description: "HTML, CSS, JavaScript fundamentals and responsive design",
      estimatedTime: "4-6 weeks",
      difficulty: "Beginner",
      requiredSkills: [],
      status: hasAnySkill(userSkillsLower, ["html", "css", "javascript", "react", "angular", "vue"]) ? "completed" : "current",
      resources: ["MDN Web Docs", "CSS Tricks", "JavaScript.info", "Frontend Masters"],
    },
    {
      id: 4,
      title: "Frontend Framework Mastery",
      description: "Deep dive into React, Vue, or Angular with state management",
      estimatedTime: "6-8 weeks",
      difficulty: "Intermediate",
      requiredSkills: ["react", "angular", "vue", "next.js", "svelte"],
      status: hasAnySkill(userSkillsLower, ["react", "angular", "vue", "next.js"]) ? "completed" : hasAnySkill(userSkillsLower, ["html", "css", "javascript"]) ? "current" : "locked",
      resources: ["React Documentation", "Vue Mastery", "Angular University", "Next.js Docs"],
    },
    {
      id: 5,
      title: "Backend Development",
      description: "Server-side programming with Node.js, Express, databases, and APIs",
      estimatedTime: "6-8 weeks",
      difficulty: "Intermediate",
      requiredSkills: ["node.js", "express.js", "django", "flask", "spring", "ruby on rails"],
      status: hasAnySkill(userSkillsLower, ["node.js", "express.js", "django", "flask", "spring"]) ? "completed" : hasAnySkill(userSkillsLower, ["node.js", "python", "java", "javascript"]) ? "current" : "locked",
      resources: ["Node.js Docs", "Express.js Guide", "MongoDB University", "API Design"],
    },
    {
      id: 6,
      title: "Database Management",
      description: "SQL and NoSQL databases, query optimization, and data modeling",
      estimatedTime: "4-6 weeks",
      difficulty: "Intermediate",
      requiredSkills: ["mongodb", "sql", "postgresql", "mysql", "redis", "cassandra"],
      status: hasAnySkill(userSkillsLower, ["mongodb", "sql", "postgresql", "mysql"]) ? "completed" : hasAnySkill(userSkillsLower, ["node.js", "python", "java"]) ? "current" : "locked",
      resources: ["SQLBolt", "MongoDB Docs", "PostgreSQL Tutorial", "Database Design"],
    },
    {
      id: 7,
      title: "Cloud & DevOps Fundamentals",
      description: "Learn AWS, Docker, Kubernetes, and deployment strategies",
      estimatedTime: "6-8 weeks",
      difficulty: "Intermediate",
      requiredSkills: ["aws", "azure", "google cloud", "docker", "kubernetes", "terraform"],
      status: hasAnySkill(userSkillsLower, ["aws", "azure", "docker", "kubernetes"]) ? "completed" : hasAnySkill(userSkillsLower, ["aws", "azure", "google cloud"]) ? "current" : "locked",
      resources: ["AWS Free Tier", "Docker Hub", "Kubernetes Docs", "DevOps Roadmap"],
    },
    {
      id: 8,
      title: "Version Control & Collaboration",
      description: "Git workflows, GitHub, and team collaboration best practices",
      estimatedTime: "2-3 weeks",
      difficulty: "Beginner",
      requiredSkills: ["git", "github", "gitlab", "bitbucket"],
      status: hasAnySkill(userSkillsLower, ["git", "github", "gitlab"]) ? "completed" : "current",
      resources: ["Git Tutorial", "GitHub Skills", "Atlassian Git", "Git Flow"],
    },
    {
      id: 9,
      title: "Machine Learning & AI",
      description: "Introduction to ML concepts, algorithms, and neural networks",
      estimatedTime: "8-12 weeks",
      difficulty: "Advanced",
      requiredSkills: ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "pandas"],
      status: hasAnySkill(userSkillsLower, ["machine learning", "deep learning", "tensorflow", "pytorch"]) ? "completed" : hasAnySkill(userSkillsLower, ["python", "data science", "artificial intelligence"]) ? "current" : "locked",
      resources: ["Coursera ML", "Fast.ai", "TensorFlow Tutorials", "PyTorch Docs"],
    },
    {
      id: 10,
      title: "System Design & Architecture",
      description: "Design scalable systems, microservices, and distributed applications",
      estimatedTime: "8-10 weeks",
      difficulty: "Advanced",
      requiredSkills: ["node.js", "python", "java", "sql", "mongodb", "system design", "microservices"],
      status: hasAnySkill(userSkillsLower, ["system design", "microservices", "architecture"]) ? "completed" : hasAllSkills(userSkillsLower, ["node.js", "python", "sql", "mongodb"]) && atsScore > 70 ? "current" : "locked",
      resources: ["System Design Primer", "Designing Data-Intensive Apps", "Grokking System Design", "Alex Xu Blog"],
    },
    {
      id: 11,
      title: "Full-Stack Integration",
      description: "Build complete applications with frontend, backend, and deployment",
      estimatedTime: "8-10 weeks",
      difficulty: "Advanced",
      requiredSkills: ["react", "node.js", "mongodb", "aws", "docker"],
      status: hasAllSkills(userSkillsLower, ["react", "node.js", "mongodb"]) && hasAnySkill(userSkillsLower, ["aws", "docker"]) ? "completed" : hasAnySkill(userSkillsLower, ["react", "node.js", "mongodb"]) ? "current" : "locked",
      resources: ["Full Stack Open", "MERN Stack Tutorial", "Deployment Guides", "Cloud Architecture"],
    },
    {
      id: 12,
      title: "Interview Preparation",
      description: "Technical interviews, behavioral questions, and problem-solving strategies",
      estimatedTime: "4-6 weeks",
      difficulty: "Intermediate",
      requiredSkills: ["dsa", "algorithms", "system design"],
      status: atsScore > 75 ? "current" : "locked",
      resources: ["Interview Cake", "Pramp", "LeetCode Interview Prep", "Glassdoor Interview Questions"],
    },
    {
      id: 13,
      title: "Specialization Tracks",
      description: "Deep dive into your chosen domain: Cloud, ML, or Web Development",
      estimatedTime: "10-12 weeks",
      difficulty: "Advanced",
      requiredSkills: [],
      status: atsScore > 80 ? "current" : "locked",
      resources: generateSpecializationResources(userSkillsLower),
    },
  ];

  return allSteps;
}

function hasAnySkill(userSkills, skills) {
  return skills.some((skill) => userSkills.includes(skill.toLowerCase()));
}

function hasAllSkills(userSkills, skills) {
  if (skills.length === 0) return true;
  return skills.every((skill) => userSkills.includes(skill.toLowerCase()));
}

function generateSpecializationResources(userSkills) {
  const resources = [];

  if (hasAnySkill(userSkills, ["aws", "azure", "google cloud"])) {
    resources.push("AWS Solutions Architect", "Azure Developer", "Google Cloud Professional");
  }

  if (hasAnySkill(userSkills, ["machine learning", "deep learning", "tensorflow"])) {
    resources.push("ML Specialization", "Deep Learning Course", "AI Engineer Path");
  }

  if (hasAnySkill(userSkills, ["react", "angular", "vue", "next.js"])) {
    resources.push("Frontend Masters", "React Advanced Patterns", "UI/UX Design");
  }

  if (hasAnySkill(userSkills, ["node.js", "express", "django", "spring"])) {
    resources.push("Backend Architecture", "API Design", "Microservices Course");
  }

  return resources.length > 0 ? resources : ["Career Development", "Industry Certifications", "Open Source Contributions"];
}

function generateJobMatches(userSkills, atsScore) {
  const jobOpportunities = [
    {
      id: "frontend-dev-google",
      title: "Frontend Developer",
      company: "Google",
      location: "Remote",
      requiredSkills: ["react", "javascript", "html", "css", "redux", "typescript", "webpack", "git"],
      minAtsScore: 70,
      applyLink: "https://www.google.com/about/careers/applications/jobs/results/?q=Frontend%20Developer",
      description: "Develop and maintain user-facing features using modern frontend technologies.",
    },
    {
      id: "backend-eng-amazon",
      title: "Backend Engineer",
      company: "Amazon",
      location: "Bangalore",
      requiredSkills: ["java", "spring", "microservices", "aws", "sql", "docker", "kubernetes", "git"],
      minAtsScore: 75,
      applyLink: "https://www.amazon.jobs/en/search?base_query=Backend%20Engineer",
      description: "Design, build, and maintain scalable backend services and APIs.",
    },
    {
      id: "ai-engineer-microsoft",
      title: "AI Engineer",
      company: "Microsoft",
      location: "Hyderabad",
      requiredSkills: ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "azure", "nlp", "git"],
      minAtsScore: 80,
      applyLink: "https://jobs.careers.microsoft.com/global/en/search?q=AI%20Engineer",
      description: "Build and deploy machine learning models and AI-powered applications.",
    },
    {
      id: "fullstack-meta",
      title: "Full Stack Developer",
      company: "Meta",
      location: "Menlo Park",
      requiredSkills: ["react", "node.js", "javascript", "python", "sql", "graphql", "git"],
      minAtsScore: 75,
      applyLink: "https://www.metacareers.com/jobs/?q=Full%20Stack%20Developer",
      description: "Build end-to-end applications across frontend, backend, and infrastructure.",
    },
    {
      id: "devops-netflix",
      title: "DevOps Engineer",
      company: "Netflix",
      location: "Los Gatos",
      requiredSkills: ["aws", "docker", "kubernetes", "terraform", "jenkins", "ci/cd", "linux", "python", "git"],
      minAtsScore: 75,
      applyLink: "https://jobs.netflix.com/search?q=DevOps%20Engineer",
      description: "Maintain and improve deployment infrastructure for streaming services.",
    },
    {
      id: "data-scientist-spark",
      title: "Data Scientist",
      company: "Apache Spark",
      location: "San Francisco",
      requiredSkills: ["python", "pandas", "numpy", "machine learning", "deep learning", "sql", "spark"],
      minAtsScore: 80,
      applyLink: "https://www.linkedin.com/jobs/search/?keywords=Data%20Scientist%20Spark",
      description: "Analyze large datasets and build predictive models using Apache Spark.",
    },
    {
      id: "mobile-ios-apple",
      title: "iOS Developer",
      company: "Apple",
      location: "Cupertino",
      requiredSkills: ["swift", "objective-c", "ios", "xcode", "coredata", "ui/ux", "git"],
      minAtsScore: 75,
      applyLink: "https://jobs.apple.com/en-us/search?search=iOS%20Developer",
      description: "Build incredibly fast and beautiful applications for the iPhone and iPad.",
    },
    {
      id: "mobile-android-google",
      title: "Android Developer",
      company: "Google",
      location: "Mountain View",
      requiredSkills: ["kotlin", "java", "android studio", "android sdk", "jetpack", "git"],
      minAtsScore: 75,
      applyLink: "https://www.google.com/about/careers/applications/jobs/results/?q=Android%20Developer",
      description: "Develop seamless and high-performing features for the Android ecosystem.",
    },
    {
      id: "cloud-architect-aws",
      title: "Cloud Architect",
      company: "AWS",
      location: "Seattle",
      requiredSkills: ["aws", "cloud architecture", "terraform", "microservices", "docker", "kubernetes", "linux"],
      minAtsScore: 85,
      applyLink: "https://www.amazon.jobs/en/search?base_query=Cloud%20Architect",
      description: "Design robust, highly scalable cloud architectures for enterprise customers.",
    },
    {
      id: "ui-ux-designer-adobe",
      title: "UI/UX Designer",
      company: "Adobe",
      location: "San Jose",
      requiredSkills: ["figma", "adobe xd", "sketch", "ui design", "ux design", "prototyping", "wireframing"],
      minAtsScore: 70,
      applyLink: "https://careers.adobe.com/us/en/search-results?keywords=UX%20Designer",
      description: "Create stunning, user-centric interfaces and user flows for creative products.",
    },
    {
      id: "qa-engineer-atlassian",
      title: "QA Engineer",
      company: "Atlassian",
      location: "Sydney",
      requiredSkills: ["selenium", "cypress", "jest", "testing", "automation", "python", "javascript", "git"],
      minAtsScore: 70,
      applyLink: "https://www.atlassian.com/company/careers/all-jobs?search=QA%20Engineer",
      description: "Ensure software reliability and quality with robust automated testing frameworks.",
    },
    {
      id: "blockchain-dev-coinbase",
      title: "Blockchain Developer",
      company: "Coinbase",
      location: "Remote",
      requiredSkills: ["solidity", "ethereum", "web3.js", "smart contracts", "rust", "go", "cryptography"],
      minAtsScore: 80,
      applyLink: "https://www.coinbase.com/careers/positions?department=Engineering",
      description: "Develop secure and scalable smart contracts and decentralized applications (dApps).",
    },
    {
      id: "data-analyst-spotify",
      title: "Data Analyst",
      company: "Spotify",
      location: "Stockholm",
      requiredSkills: ["sql", "python", "excel", "tableau", "data visualization", "statistics", "pandas"],
      minAtsScore: 65,
      applyLink: "https://lifeatspotify.com/jobs?q=Data%20Analyst",
      description: "Turn data into actionable product insights to improve the user listening experience.",
    },
    {
      id: "cybersecurity-analyst-crowdstrike",
      title: "Cybersecurity Analyst",
      company: "CrowdStrike",
      location: "Austin",
      requiredSkills: ["security", "network security", "linux", "python", "penetration testing", "siem", "firewalls"],
      minAtsScore: 75,
      applyLink: "https://crowdstrike.wd5.myworkdayjobs.com/crowdstrike_careers?q=Cybersecurity",
      description: "Monitor, analyze, and defend against advanced cyber threats and vulnerabilities.",
    },
    {
      id: "ml-engineer-openai",
      title: "Machine Learning Engineer",
      company: "OpenAI",
      location: "San Francisco",
      requiredSkills: ["python", "pytorch", "cuda", "transformers", "llm", "deep learning", "nlp", "c++"],
      minAtsScore: 85,
      applyLink: "https://openai.com/careers/search?q=Machine%20Learning",
      description: "Train large language models and push the boundaries of artificial general intelligence.",
    },
    {
      id: "sre-google",
      title: "Site Reliability Engineer",
      company: "Google",
      location: "London",
      requiredSkills: ["python", "go", "linux", "distributed systems", "kubernetes", "monitoring", "networking"],
      minAtsScore: 80,
      applyLink: "https://www.google.com/about/careers/applications/jobs/results/?q=Site%20Reliability%20Engineer",
      description: "Combine software and systems engineering to build and run large-scale computing systems.",
    }
  ];

  const userSkillsLower = userSkills.map((s) => s.toLowerCase());

  const matchedJobs = jobOpportunities.filter((job) => {
    if (atsScore < job.minAtsScore) return false;

    const matchingSkills = job.requiredSkills.filter((skill) => userSkillsLower.includes(skill.toLowerCase()));
    const skillMatchPercentage = (matchingSkills.length / job.requiredSkills.length) * 100;
    return skillMatchPercentage >= 50;
  });

  const missingSkills = matchedJobs.flatMap((job) =>
    job.requiredSkills.filter((skill) => !userSkillsLower.includes(skill.toLowerCase()))
  );

  return {
    matchedJobs: matchedJobs.map((job) => ({
      ...job,
      skillMatchPercentage: Math.round(
        (job.requiredSkills.filter((skill) => userSkillsLower.includes(skill.toLowerCase())).length / job.requiredSkills.length) * 100
      ),
    })),
    missingSkills: [...new Set(missingSkills.map((s) => s.toLowerCase()))],
    skillRoadmap: null,
  };
}

export const getJobMatches = async (req, res) => {
  try {
    const latestResume = await Resume.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (!latestResume) {
      return res.status(404).json({ message: "No resume found. Please upload a resume first." });
    }

    const skills = latestResume.extractedSkills;
    const atsScore = latestResume.readinessScore;
    const jobAnalysis = generateJobMatches(skills, atsScore);

    res.json({
      message: "Job matches generated successfully",
      jobs: jobAnalysis.matchedJobs,
      totalJobs: jobAnalysis.matchedJobs.length,
      missingSkills: jobAnalysis.missingSkills,
      skillRoadmap: jobAnalysis.skillRoadmap,
      currentSkills: skills,
      atsScore,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate job matches" });
  }
};

export const tutorChat = async (req, res) => {
  try {
    console.log("🤖 tutorChat function called");
    console.log("📋 Request body:", { message: req.body.message });
    console.log("👤 User ID:", req.user?.id);
    
    const { message, history } = req.body || {};
    const question = typeof message === "string" ? message.trim() : "";
    if (!question) {
      return res.status(400).json({ message: "Message is required" });
    }

    const latestResume = await Resume.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (!latestResume) {
      return res.status(404).json({ message: "No resume found. Please upload a resume first." });
    }

    const skills = Array.isArray(latestResume.extractedSkills) ? latestResume.extractedSkills : [];
    const atsScore = latestResume.readinessScore || 0;
    const roadmap = generatePersonalizedRoadmap(skills, atsScore);
    const jobAnalysis = generateJobMatches(skills, atsScore);

    const completed = roadmap.filter((s) => s.status === "completed");
    const current = roadmap.filter((s) => s.status === "current");
    const locked = roadmap.filter((s) => s.status === "locked");

    const jobs = Array.isArray(jobAnalysis?.matchedJobs) ? jobAnalysis.matchedJobs : [];
    const missingSkills = Array.isArray(jobAnalysis?.missingSkills) ? jobAnalysis.missingSkills : [];

    let answer = "";
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY missing");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const historyText = Array.isArray(history) && history.length > 0 
        ? history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n") 
        : "No previous chat history.";

      const prompt = `
You are an expert, highly encouraging, and actionable AI career coach for Orbit.
You are helping a candidate navigate their career, roadmap, and jobs. 
Be concise, clear, and very practical. DO NOT use technical Markdown syntax (like **bolding**, # headers, or *italics*). Avoid literal asterisks completely as the frontend cannot render them. Instead, use emojis, UPPERCASE for emphasis, empty lines, and simple bullet points (-) to format your response nicely.

--- USER CONTEXT ---
- Resume ATS Score: ${atsScore}%
- Detected Skills: ${skills.join(", ") || "None"}
- Roadmap Status: ${completed.length} completed, ${current.length} in progress, ${locked.length} locked steps.
- Current Learning Focus: ${current.map(s => s.title).join(", ") || "None"}
- Top Job Matches: ${jobs.slice(0, 3).map(j => `${j.title} at ${j.company} (${j.skillMatchPercentage}% match)`).join(" | ") || "None"}
- Suggested Skills to learn for jobs: ${missingSkills.slice(0, 5).join(", ") || "None"}

--- CHAT HISTORY ---
${historyText}

--- CURRENT QUESTION ---
USER: "${question}"

Respond directly to the user's latest question. If they ask for recommendations, use the context above to suggest top matches or learning topics.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });
      answer = response.text;
    } catch (aiError) {
      console.error("AI Tutor fallback:", aiError.message);
      answer = "I'm sorry, my AI brain is currently resting. However, based on your profile, your ATS score is " + atsScore + "%. I'd recommend focusing on your next roadmap steps: " + (current.map(s => s.title).join(", ") || "building more projects.");
    }

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Tutor chat failed" });
  }
};