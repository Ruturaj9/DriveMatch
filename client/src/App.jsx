import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChatAssistant from "./components/ChatAssistant";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";

const VehicleDetails = () => <div className="p-10 text-center">Vehicle Details Page</div>;
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
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
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
