import React, { useState, useContext, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Clock3, Moon, Sun } from "lucide-react";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // 🧠 Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Compare", path: "/compare" },
    // you can re-enable Insights later
  ];

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300
        ${
          theme === "dark"
            ? "bg-[#0d1117]/90 border-gray-800 shadow-[0_1px_0_#161b22]"
            : "bg-white/90 border-gray-200 shadow-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* 🚗 Brand */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-90 transition"
        >
          DriveMatch
        </Link>

        {/* 🧭 Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* 🕓 Compare History */}
          <NavLink
            to="/compare-history"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              }`
            }
          >
            <Clock3 size={16} />
            Compare History
          </NavLink>

          {/* 🌗 Fancy Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-4 w-10 h-10 flex items-center justify-center rounded-full
                       bg-gray-100 dark:bg-[#161b22] border border-gray-200 dark:border-gray-700
                       hover:scale-105 transition-transform shadow-sm"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-blue-600" />
              )}
            </motion.div>
          </button>
        </div>

        {/* 📱 Mobile Menu Button */}
        <button
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-gray-700 dark:text-gray-200 focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* 📱 Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`md:hidden border-t transition-all ${
              theme === "dark"
                ? "bg-[#0d1117] border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-3 border-b ${
                    theme === "dark"
                      ? "border-gray-800 text-gray-300 hover:text-blue-400"
                      : "border-gray-100 text-gray-700 hover:text-blue-600"
                  } ${
                    isActive
                      ? "font-semibold text-blue-600 dark:text-blue-400"
                      : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Compare History */}
            <NavLink
              to="/compare-history"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-6 py-3 border-b ${
                  theme === "dark"
                    ? "border-gray-800 text-gray-300 hover:text-blue-400"
                    : "border-gray-100 text-gray-700 hover:text-blue-600"
                } ${
                  isActive
                    ? "font-semibold text-blue-600 dark:text-blue-400"
                    : ""
                }`
              }
            >
              <Clock3 size={16} />
              Compare History
            </NavLink>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-6 py-3 bg-gray-100 dark:bg-[#161b22]
                         text-gray-800 dark:text-gray-200 text-sm"
            >
              {theme === "dark" ? (
                <>
                  <Sun size={16} className="text-yellow-400" /> Light Mode
                </>
              ) : (
                <>
                  <Moon size={16} className="text-blue-600" /> Dark Mode
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
