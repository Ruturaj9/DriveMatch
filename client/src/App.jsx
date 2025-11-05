import React from "react";
import ChatAssistant from "./components/ChatAssistant";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-2">DriveMatch AI 🚗</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Ask me about cars or bikes — I’ll find the best match for you.
      </p>
      <ChatAssistant />
    </div>
  );
}

export default App;
