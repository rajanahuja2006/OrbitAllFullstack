export default function Jobs() {
  const jobs = [
    { role: "Frontend Developer", company: "Google", location: "Remote" },
    { role: "Backend Engineer", company: "Amazon", location: "Bangalore" },
    { role: "AI Engineer", company: "Microsoft", location: "Hyderabad" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-purple-400">
        Job Matches
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        {jobs.map((job, i) => (
          <div
            key={i}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:scale-105 transition"
          >
            <h2 className="text-xl font-bold">{job.role}</h2>
            <p className="text-gray-400">{job.company}</p>
            <p className="text-sm text-gray-500">{job.location}</p>

            <button className="mt-4 px-4 py-2 bg-purple-500 rounded-xl">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}