import React, { useContext } from "react";
import ChatAssistant from "./components/ChatAssistant";
import { ThemeContext } from "./context/ThemeContext";

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="flex justify-between items-center w-full px-6 py-4">
        <h1 className="text-3xl font-bold text-blue-600">DriveMatch 🚗</h1>
        <button
          onClick={toggleTheme}
          className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-100 shadow hover:scale-105 transition"
        >
          {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Ask me about cars or bikes — I’ll find the best match for you.
      </p>

      <ChatAssistant />
    </div>
  );
}

export default App;
