import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion"; // For smooth animations

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I’m DriveMatch AI — ask me about cars or bikes." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/api/advisor", { query: input });
      const reply = res.data;

      let botResponse = `🤖 ${reply.message || "Here’s what I found!"}`;
      if (reply.reasoning && reply.reasoning.length) {
        botResponse += "\n\n🧠 **Reasoning:**\n" + reply.reasoning.map(r => `- ${r}`).join("\n");
      }

      // Add delay to simulate AI typing
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: botResponse, results: reply.results || [] },
        ]);
        setIsTyping(false);
      }, 1000 + Math.random() * 800); // 1–1.8s delay
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, something went wrong. Please try again." },
      ]);
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg hover:bg-blue-700 transition"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 font-semibold flex justify-between items-center">
            DriveMatch AI Assistant
            <button onClick={() => setIsOpen(false)} className="text-white">✖</button>
          </div>

          {/* Messages Section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-xl ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                    }`}
                  >
                    {msg.text.split("\n").map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>

                  {/* Vehicle Cards */}
                  {msg.results && msg.results.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {msg.results.slice(0, 4).map((v) => (
                        <motion.div
                          key={v._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm bg-white dark:bg-gray-900"
                        >
                          <img
                            src={v.image}
                            alt={v.name}
                            className="w-full h-20 object-cover rounded"
                          />
                          <p className="font-semibold mt-1">{v.name}</p>
                          <p className="text-xs text-gray-500">{v.brand}</p>
                          <p className="text-sm text-green-600 font-semibold">
                            ₹{v.price?.toLocaleString() || v.priceNum}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <span>🤖</span>
                <span className="typing-dots">
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={sendMessage} className="p-3 border-t dark:border-gray-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none"
              placeholder="Ask about cars or bikes..."
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
