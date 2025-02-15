"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaHome, FaMap, FaPlus, FaHeart, FaUser } from "react-icons/fa";

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeIcon, setActiveIcon] = useState("home");
  const [lastActivity, setLastActivity] = useState(Date.now());

  const handleUserActivity = useCallback(() => {
    setLastActivity(Date.now());
    setIsCollapsed(false);
  }, []);

  useEffect(() => {
    const inactivityTimer = setInterval(() => {
      if (Date.now() - lastActivity > 30000) {
        setIsCollapsed(true);
      }
    }, 1000);

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);

    return () => {
      clearInterval(inactivityTimer);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("keypress", handleUserActivity);
    };
  }, [lastActivity, handleUserActivity]);

  const navigationItems = [
    { id: "home", icon: FaHome, label: "Home" },
    { id: "map", icon: FaMap, label: "Map" },
    { id: "create", icon: FaPlus, label: "Create" },
    { id: "favorites", icon: FaHeart, label: "Favorites" },
    { id: "profile", icon: FaUser, label: "Profile" },
  ];

  const handleClick = (id) => {
    setActiveIcon(id);
    handleUserActivity();
  };

  return (
    <nav
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-slate-900 bg-opacity-10 dark:bg-[#060606] dark:bg-opacity-80 backdrop-blur-lg rounded-full shadow-lg transition-all duration-500 ease-in-out ${
        isCollapsed ? "w-16 h-16 flex items-center justify-center" : "w-[calc(100%-40px)] max-w-lg h-16"
      }`}
      onMouseEnter={() => setIsCollapsed(false)}
    >
      {isCollapsed ? (
        <img
          src="/infinity.png"
          alt="Infinity"
          className="w-8 h-8 animate-spin-slow transition-all duration-300 ease-in-out"
        />
      ) : (
        <div className="flex items-center justify-around h-full opacity-100 transition-opacity duration-300">
          {navigationItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={`relative group flex items-center justify-center w-12 h-12 rounded-full transition-transform duration-300 focus:outline-none focus:ring-2 dark:focus:ring-slate-500 focus:ring-slate-500 ${
                activeIcon === id
                  ? "text-white bg-[#575757] dark:bg-[#434448] transform scale-110"
                  : "text-white hover:text-[#747578] dark:hover:text-slate-100"
              }`}
              aria-label={label}
            >
              <Icon className={`text-2xl transition-all duration-300 ${activeIcon === id ? "transform scale-110 text-slate-300" : ""}`} />
              <span className="ripple-effect" />
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
