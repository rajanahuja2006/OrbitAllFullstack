export default function Roadmap() {
  const steps = [
    "Learn Programming Basics",
    "Master Data Structures",
    "Build Projects",
    "Learn System Design",
    "Crack Interviews",
    "Get Placement 🚀",
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-purple-400">
        Your AI Roadmap
      </h1>

      <div className="mt-10 space-y-4">
        {steps.map((step, i) => (
          <div
            key={i}
            className="p-5 bg-white/5 border border-white/10 rounded-xl"
          >
            <span className="text-purple-400 font-bold">
              Step {i + 1}
            </span>
            <h2 className="text-xl mt-1">{step}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}