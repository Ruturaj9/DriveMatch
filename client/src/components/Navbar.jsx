import React, { useState, useContext, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Compare", path: "/compare" },
    { name: "Insights", path: "/insights" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-colors duration-300 motion-reduce:transition-none backdrop-blur-md navbar-backdrop
        ${
          theme === "dark"
            ? "bg-[rgba(0,0,0,0.65)] border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
            : "bg-[rgba(255,255,255,0.72)] border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
        }
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-3 md:py-4 transition-all duration-300">
        {/* 🚗 Brand */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity duration-300 select-none "
        >
          DriveMatch
        </Link>

        {/* 🧭 Nav Links + Toggle */}
        <div className="flex items-center gap-8 md:gap-10 ">
          <div className="flex items-center gap-6 md:gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative font-medium text-[15px] tracking-[0.02em] transition-all duration-300
                  ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400"
                  }
                  after:content-[''] after:absolute after:left-0 after:-bottom-[3px] after:h-[2px]
                  after:bg-indigo-500 after:rounded-full after:w-0 hover:after:w-full after:transition-all after:duration-300`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* 🌗 Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`flex items-center justify-center w-10 h-10 rounded-full border transition-colors duration-200 motion-reduce:transition-none
              ${
                theme === "dark"
                  ? "border-gray-700 bg-[#161b22]/70 hover:bg-[#1e2630]/80 hover:border-indigo-500 hover:shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                  : "border-gray-300 bg-white/70 hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-[0_0_12px_rgba(99,102,241,0.2)]"
              }
              backdrop-blur-md navbar-backdrop active:scale-95`}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400 transition-transform duration-500 hover:rotate-[360deg]" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 transition-transform duration-500 hover:rotate-[360deg]" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
