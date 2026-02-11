export default function ChatTutor() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-purple-400">
        AI Tutor Chat
      </h1>

      <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6 h-[500px] flex flex-col">
        <div className="flex-1 text-gray-400">
          🤖 Ask me anything about your roadmap...
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 p-3 rounded-xl bg-black border border-white/10 text-white"
            placeholder="Type your question..."
          />
          <button className="px-5 bg-purple-500 rounded-xl">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}