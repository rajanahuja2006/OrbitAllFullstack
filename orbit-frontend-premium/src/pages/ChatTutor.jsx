import { useEffect, useMemo, useRef, useState } from "react";
import { getApiBase } from "../utils/api";

export default function ChatTutor() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ask me anything about your roadmap, ATS score, or job matches. Try: 'What should I learn next?' or 'Which jobs should I apply for first?'",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);

  const apiBase = useMemo(() => getApiBase(), []);

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

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-purple-400">AI Tutor Chat</h1>
          <p className="text-gray-400 mt-2">
            Resume-aware coaching. Deterministic answers. Zero fluff.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          {["What should I learn next?", "Which jobs should I apply for first?", "How can I improve my ATS?"]
            .map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 transition text-sm"
              >
                {q}
              </button>
            ))}
        </div>
      </div>

      <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 h-[560px] flex flex-col backdrop-blur-xl">
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`w-full flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] md:max-w-[70%] bg-purple-600 text-white rounded-2xl px-4 py-3 shadow"
                    : "max-w-[85%] md:max-w-[70%] bg-black/40 border border-white/10 text-gray-100 rounded-2xl px-4 py-3"
                }
              >
                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="w-full flex justify-start">
              <div className="max-w-[85%] md:max-w-[70%] bg-black/40 border border-white/10 text-gray-200 rounded-2xl px-4 py-3">
                Thinking...
              </div>
            </div>
          )}

          {error && (
            <div className="w-full">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {error}
              </div>
            </div>
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