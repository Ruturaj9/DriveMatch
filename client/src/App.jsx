import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import VehicleDetails from "./pages/VehicleDetails";
import Compare from "./pages/Compare";
// import Insights from "./pages/Insights";
import ChatAssistant from "./components/ChatAssistant";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeProvider";
import { CompareProvider } from "./context/CompareProvider";

function App() {
  return (
    <ThemeProvider>
      <CompareProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vehicle/:id" element={<VehicleDetails />} />
              <Route path="/compare" element={<Compare />} />
              {/* <Route path="/insights" element={<Insights />} /> */}
            </Routes>
            <ChatAssistant />
          </div>
        </Router>
      </CompareProvider>
    </ThemeProvider>
  );
}

export default App;
