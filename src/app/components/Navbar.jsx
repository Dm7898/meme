"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Load dark mode state from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "enabled") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "disabled");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide">
          <Link href="/">
            {" "}
            Mem<span className="text-[#017848] dark:text-[#512FEB]">ez</span>
          </Link>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {[
            { name: "Home", path: "/" },
            { name: "Memes", path: "/explore" },
            { name: "Create", path: "/upload" },
            { name: "Profile", path: "/profile" },
            { name: "Leaderboard", path: "/leaderboard" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="relative text-gray-700 dark:text-gray-300 text-lg font-medium transition rounded-full px-2 py-1 hover:text-[#292B29] dark:hover:text-[#512FEB] focus:outline-none focus:ring-2 focus:ring-greentxt dark:focus:ring-[#512FEB]"
            >
              {item.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-blue-500 dark:bg-blue-400 rounded transition-all hover:w-full"></span>
            </Link>
          ))}

          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="relative flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 w-14 h-7 transition-all hover:scale-105"
          >
            <motion.div
              className="w-6 h-6 bg-white dark:bg-black rounded-full shadow-md absolute"
              animate={{ x: darkMode ? 28 : 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            />
            <Sun className="w-5 h-5 text-yellow-500 absolute left-1" />
            <Moon className="w-5 h-5 text-gray-400 absolute right-1" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 dark:text-white p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-0 right-0 h-screen w-64 bg-white dark:bg-gray-900 shadow-lg flex flex-col items-center py-6 space-y-6 md:hidden"
          >
            {[
              { name: "Home", path: "/" },
              { name: "Memes", path: "/explore" },
              { name: "Create", path: "/upload" },
              { name: "Profile", path: "/profile" },
              { name: "Leaderboard", path: "/leaderboard" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-gray-700 dark:text-gray-300 text-xl font-medium hover:text-[#292B29] dark:hover:text-[#512FEB] transition"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Dark Mode Toggle for Mobile */}
            <button
              onClick={toggleDarkMode}
              className="relative flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 w-14 h-7 transition-all hover:scale-105"
            >
              <motion.div
                className="w-6 h-6 bg-white dark:bg-black rounded-full shadow-md absolute"
                animate={{ x: darkMode ? 28 : 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              />
              <Sun className="w-5 h-5 text-yellow-500 absolute left-1" />
              <Moon className="w-5 h-5 text-gray-400 absolute right-1" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
