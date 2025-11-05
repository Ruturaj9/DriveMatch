import React from "react";
import ChatAssistant from "./components/ChatAssistant";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-center text-3xl font-bold text-blue-600 pt-10">
        DriveMatch AI Assistant 🚗
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400">
        Ask me about cars or bikes below!
      </p>
      <ChatAssistant />
    </div>
  );
}

export default App;
