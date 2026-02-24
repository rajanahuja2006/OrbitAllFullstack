import pdf from "pdf-parse";
import Resume from "../models/Resume.js";

export const uploadResume = async (req, res) => {
  try {
    console.log("📧 Upload request received");
    console.log("🔑 User ID:", req.user?.id);
    console.log("📁 File:", req.file ? { name: req.file.originalname, size: req.file.size } : "No file");
    console.log("Headers:", req.headers);

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

    // Expanded skill keywords for better detection
    const skillKeywords = [
      // Programming Languages
      "Python", "Java", "C++", "JavaScript", "TypeScript", "Go", "Rust", "PHP", "Ruby", "C#", "Swift", "Kotlin",
      // Frontend Technologies
      "React", "Angular", "Vue", "Next.js", "Svelte", "HTML", "CSS", "Sass", "Tailwind CSS", "Bootstrap", "Material UI",
      // Backend Technologies
      "Node.js", "Express.js", "Django", "Flask", "Spring", "Ruby on Rails", "ASP.NET", "FastAPI",
      // Databases
      "MongoDB", "SQL", "PostgreSQL", "MySQL", "SQLite", "Redis", "Cassandra", "Elasticsearch", "DynamoDB",
      // Cloud & DevOps
      "AWS", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins", "CI/CD",
      // Data Science & ML
      "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Keras", "Pandas", "NumPy", "Scikit-learn", "NLP",
      "Data Science", "Computer Vision", "Reinforcement Learning", "Artificial Intelligence",
      // Tools & Platforms
      "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence", "Slack", "Figma", "Postman",
      // Concepts & Practices
      "DSA", "Algorithms", "Data Structures", "System Design", "Object-Oriented Programming", "REST API", "GraphQL",
      "Microservices", "Agile", "Scrum", "Kanban", "Test-Driven Development", "DevOps",
      // Security & Infrastructure
      "Cybersecurity", "Network Security", "Linux", "Unix", "Windows", "Networking", "Load Balancing",
      // Other Technologies
      "Blockchain", "Web3", "Serverless", "Lambda", "API Gateway", "Message Queues", "Caching",
    ];

    const extractedSkills = skillKeywords.filter((skill) =>
      text.toLowerCase().includes(skill.toLowerCase())
    );

    // Consistent ATS score calculation (no randomness)
    let atsScore = 0;
    if (extractedSkills.length > 0) {
      atsScore = Math.min(50, extractedSkills.length * 3);

      const hasFrontend = extractedSkills.some((s) => ["React", "Angular", "Vue", "HTML", "CSS"].includes(s));
      const hasBackend = extractedSkills.some((s) => ["Node.js", "Express", "Django", "Spring"].includes(s));
      const hasDatabase = extractedSkills.some((s) => ["MongoDB", "SQL", "PostgreSQL"].includes(s));
      const hasCloud = extractedSkills.some((s) => ["AWS", "Azure", "Google Cloud", "Docker"].includes(s));
      const hasTools = extractedSkills.some((s) => ["Git", "GitHub", "Jira"].includes(s));

      if (hasFrontend) atsScore += 10;
      if (hasBackend) atsScore += 10;
      if (hasDatabase) atsScore += 10;
      if (hasCloud) atsScore += 10;
      if (hasTools) atsScore += 5;

      const wordCount = text.split(/\s+/).length;
      if (wordCount > 200) atsScore += 5;
      if (text.toLowerCase().includes("project")) atsScore += 5;
      if (text.toLowerCase().includes("experience")) atsScore += 5;

      atsScore = Math.min(95, atsScore);
    }

    // Enhanced experience extraction
    let experience = "Not specified";
    const experiencePatterns = [
      /(\d+)\s*(?:years?|yrs?)(?:\s*(?:of\s*)?(?:experience|work))?/gi,
      /(\d+)\s*(?:months?|mos?)(?:\s*(?:of\s*)?(?:experience|work))?/gi,
      /(\d+)\+?\s*(?:years?|yrs?)(?:\s*(?:of\s*)?(?:experience|work))?/gi,
      /(\d+)\s*(?:months?|mos?)\s*(?:of\s*)?internship/gi,
      /internship\s*(?:for\s*)?(\d+)\s*(?:months?|mos?)/gi,
      /summer\s*internship/gi,
      /(\d{4})\s*-\s*(\d{4})/g,
      /(\d+)\s*-\s*(\d+)\s*(?:years?|months?)/g,
    ];

    let totalMonths = 0;
    let hasInternship = false;

    for (const pattern of experiencePatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (pattern.toString().includes("internship")) {
          hasInternship = true;
          totalMonths += parseInt(match[1]) || 3;
        } else if (pattern.toString().includes("years?")) {
          totalMonths += (parseInt(match[1]) || 0) * 12;
        } else if (pattern.toString().includes("months?")) {
          totalMonths += parseInt(match[1]) || 0;
        } else if (match.length >= 3) {
          const startYear = parseInt(match[1]);
          const endYear = parseInt(match[2]);
          totalMonths += Math.max(0, (endYear - startYear) * 12);
        }
      }
    }

    if (totalMonths > 0) {
      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;
      if (years > 0 && months > 0) experience = `${years} years ${months} months`;
      else if (years > 0) experience = `${years} years`;
      else experience = `${months} months`;

      if (hasInternship) experience += " (including internship)";
    }

    const roadmap = generatePersonalizedRoadmap(extractedSkills, atsScore);
    const completedSteps = roadmap.filter((step) => step.status === "completed").length;
    const roadmapProgress = roadmap.length ? Math.min(100, (completedSteps / roadmap.length) * 100) : 0;
    const jobsMatched = Math.floor((atsScore / 100) * extractedSkills.length * 2);

    const missingSkills = skillKeywords.filter((skill) => !extractedSkills.includes(skill));

    const suggestions = [];
    if (extractedSkills.length < 5) suggestions.push("Add more technical skills to strengthen your profile");
    if (!hasInternship && totalMonths < 12) suggestions.push("Consider adding internship or project experience");
    if (!text.toLowerCase().includes("project")) suggestions.push("Include specific project descriptions with technologies used");
    if (missingSkills.length > 0) {
      const priorityMissing = missingSkills.slice(0, 5);
      suggestions.push(`Consider learning: ${priorityMissing.join(", ")}`);
    }
    if (atsScore < 70) suggestions.push("Quantify achievements with metrics and numbers");
    if (!text.toLowerCase().match(/\d+\s*(?:percent|%|increased|decreased|reduced|improved)/)) {
      suggestions.push("Add measurable achievements and impact statements");
    }
    if (suggestions.length === 0) suggestions.push("Strong resume! Consider tailoring it for specific job applications");

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
    
    const { message } = req.body || {};
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

    const q = question.toLowerCase();
    const completed = roadmap.filter((s) => s.status === "completed");
    const current = roadmap.filter((s) => s.status === "current");
    const locked = roadmap.filter((s) => s.status === "locked");

    const jobs = Array.isArray(jobAnalysis?.matchedJobs) ? jobAnalysis.matchedJobs : [];
    const missingSkills = Array.isArray(jobAnalysis?.missingSkills) ? jobAnalysis.missingSkills : [];

    let answer = "";
    if (q.includes("roadmap") || q.includes("next") || q.includes("learn")) {
      const next = current.slice(0, 2);
      answer = [
        `Roadmap status: ${completed.length} completed, ${current.length} in progress, ${locked.length} locked.`,
        next.length ? `Next focus:\n${next.map((x, i) => `${i + 1}. ${x.title} (${x.estimatedTime})`).join("\n")}` : "Next focus: Keep going—your roadmap is already optimized.",
      ].join("\n\n");
    } else if (q.includes("job") || q.includes("apply")) {
      const topJobs = jobs
        .slice()
        .sort((a, b) => (b.skillMatchPercentage || 0) - (a.skillMatchPercentage || 0))
        .slice(0, 3);
      answer = [
        `Based on your resume (ATS ${atsScore}%) I found ${jobs.length} matching roles.`,
        topJobs.length
          ? topJobs.map((j, idx) => `${idx + 1}. ${j.title} at ${j.company} (${j.skillMatchPercentage}% match)\n   Apply: ${j.applyLink}`).join("\n")
          : "No strong matches yet—add more projects/skills and re-upload.",
        missingSkills.length ? `Skill gaps to focus: ${missingSkills.slice(0, 8).join(", ")}.` : "Your coverage is strong—tailor your resume to each job description.",
      ].join("\n\n");
    } else {
      answer = [
        `Your ATS score is ${atsScore}%.`,
        `Detected skills: ${skills.slice(0, 12).join(", ") || "(none detected)"}`,
        "Ask: 'What should I learn next?' or 'Which jobs should I apply for first?'",
      ].join("\n\n");
    }

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Tutor chat failed" });
  }
};