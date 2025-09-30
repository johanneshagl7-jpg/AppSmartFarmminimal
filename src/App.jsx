import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Tools from "./pages/Tools.jsx";

export default function App(){
  const [dark, setDark] = useState(false);
  useEffect(()=>{
    if(dark){ document.documentElement.classList.add("dark"); }
    else{ document.documentElement.classList.remove("dark"); }
  },[dark]);

  return (
    <div className="min-h-screen flex flex-col dark:text-gray-100">
      <header className="p-4 flex justify-between items-center bg-emerald-600 dark:bg-emerald-800 text-white">
        <Link to="/" className="font-bold">🌾 SmartFarming Portal</Link>
        <button onClick={()=>setDark(!dark)} className="px-3 py-1 rounded-lg border">
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tools/:id" element={<Tools />} />
        </Routes>
      </main>
      <footer className="p-3 text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} SmartFarming Portal · <Link to="/impressum">Impressum</Link>
      </footer>
    </div>
  );
}
