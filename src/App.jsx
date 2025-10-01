import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import * as ToolComps from "./tools";

export default function App(){
  return (
    <div className="min-h-screen flex flex-col dark:text-gray-100">
      <header className="p-4 flex justify-between items-center bg-emerald-600 text-white">
        <Link to="/" className="font-bold">🌾 SmartFarming GPS</Link>
      </header>
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<ToolComps.GPSCalculator />} />
        </Routes>
      </main>
    </div>
  );
}
