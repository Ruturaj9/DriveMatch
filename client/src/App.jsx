import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChatAssistant from "./components/ChatAssistant";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";
import VehicleDetails from "./pages/VehicleDetails"; // ✅ Keep this import

// ✅ Rename the locally defined components to avoid naming conflict
const Compare = () => <div className="p-10 text-center">Compare Page</div>;
const Insights = () => <div className="p-10 text-center">Insights Page</div>;

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
          {/* Global Navbar */}
          <Navbar />

          {/* Page Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehicle/:id" element={<VehicleDetails />} /> {/* uses imported component */}
            <Route path="/compare" element={<Compare />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>

          {/* Floating Chat Assistant */}
          <ChatAssistant />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
