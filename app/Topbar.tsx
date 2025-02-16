import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const Topbar = () => {
  const [theme, setTheme] = useState("nord");

  // Toggle Theme Function
  const toggleTheme = () => {
    const newTheme = theme === "nord" ? "dim" : "nord";
    setTheme(newTheme);
  };

  // Apply theme to the document root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
    <div className="navbar p-1 shadow-lg flex rounded-md justify-between items-center">
      <h1 className="text-xl font-bold">Splitwise</h1>
      
      {/* Theme Toggle Button */}
      <button
        className="btn btn-primary"
        onClick={toggleTheme}
      >
        {theme === "nord" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
    </div>
    <Navbar/>
     </>
  );
};

export default Topbar;
