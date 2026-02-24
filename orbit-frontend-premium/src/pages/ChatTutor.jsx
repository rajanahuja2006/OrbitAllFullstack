import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiBase } from "../utils/api";
import CrazyBackground from "../components/CrazyBackground";
import AnimatedParticles from "../components/AnimatedParticles";

export default function ChatTutor() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "🤖 Hey there! I'm your AI career coach. I can help with your roadmap, ATS score, job matches, and more. What would you like to know?",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);

  const apiBase = useMemo(() => getApiBase(), []);
  
  const suggestedQuestions = [
    "What should I learn next?",
    "Which jobs should I apply for?",
    "How can I improve my ATS?",
    "Create a 7-day learning plan",
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    setLoading(true);

    const userMsg = { id: `u-${Date.now()}`, role: "user", content: text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBase}/api/resume/tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Tutor request failed");
      }

      const data = await res.json();
      const assistantMsg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data?.answer || "I couldn’t generate an answer. Try again.",
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <CrazyBackground />
      <AnimatedParticles count={30} />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
            AI Career Tutor 💬
          </h1>
          <p className="text-lg text-gray-300">
            Get personalized guidance from your AI career coach
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 rounded-3xl bg-gradient-to-b from-gray-900/50 to-black/50 border border-purple-500/30 backdrop-blur-xl overflow-hidden flex flex-col"
        >
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <AnimatePresence>
              {messages.map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20, x: m.role === "user" ? 30 : -30 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-3xl px-6 py-4 ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                        : "bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-500/30 text-gray-100"
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                      {m.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-500/30 text-gray-100 rounded-3xl px-6 py-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-2xl"
                    >
                      🤔
                    </motion.div>
                    <p className="font-semibold">Thinking...</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-200">
                  <p className="font-semibold text-sm">⚠️ {error}</p>
                </div>
              </motion.div>
            )}

            <div ref={endRef} />
          </div>

        <div className="mt-4">
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
              className="flex-1 p-3 rounded-xl bg-black border border-white/10 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Type your question... (Enter to send, Shift+Enter for new line)"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                loading || !input.trim()
                  ? "bg-purple-500/40 text-white/70 cursor-not-allowed"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
              }`}
            >
              Send
            </button>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Tip: Ask for a “7-day plan” and include your daily study time.
          </div>
        </div>
      </div>
    </div>
  );
}