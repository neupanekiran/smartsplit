"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiHomeAlt, BiMap, BiPlusCircle, BiHeart, BiUser } from "react-icons/bi";
import { HiMenu } from "react-icons/hi";

const Topbar = () => {
  const router = useRouter();
  const [theme, setTheme] = useState("nord");
  const [activeIcon, setActiveIcon] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle Theme Function
  const toggleTheme = () => {
    const newTheme = theme === "nord" ? "dim" : "nord";
    setTheme(newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Navigation items
  const navigationItems = [
    { id: "home", icon: BiHomeAlt, label: "Home", path: "/" },
    { id: "map", icon: BiMap, label: "Map", path: "/dashboard" },
    { id: "create", icon: BiPlusCircle, label: "Create", path: "/group" },
    { id: "favorites", icon: BiHeart, label: "Favorites", path: "/chatbot" },
    { id: "profile", icon: BiUser, label: "Profile", path: "/profile" },
  ];

  const handleClick = (id, path) => {
    setActiveIcon(id);
    router.push(path);
    setIsMenuOpen(false); // Close menu on item click
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[70%] bg-white bg-opacity-80 dark:bg-[#121212] dark:bg-opacity-80 shadow-lg backdrop-blur-lg p-3 flex justify-between items-center md:rounded-full border border-gray-300 dark:border-gray-700">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-gray-800 dark:text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        <HiMenu className="text-2xl" />
      </button>

      {/* Navigation Icons */}
      <div className="flex md:flex gap-6 w-full justify-around">
        {navigationItems.map(({ id, icon: Icon, label, path }) => (
          <button
            key={id}
            onClick={() => handleClick(id, path)}
            className={`flex flex-col items-center justify-center transition-all duration-300 focus:outline-none ${
              activeIcon === id
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
            aria-label={label}
            aria-current={activeIcon === id ? "page" : undefined}
          >
            <Icon className="text-3xl" />
          </button>
        ))}
      </div>

      {/* Theme Toggle Button */}
      <button 
        className="hidden md:block text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-500"
        onClick={toggleTheme}
      >
        {theme === "nord" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>
  );
};

export default Topbar;
