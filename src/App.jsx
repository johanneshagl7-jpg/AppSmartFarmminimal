import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import GPSCalculator from "./tools/GPSCalculator.jsx";

export default function App(){
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">🌾 SmartFarming Portal</h1>
      <Routes>
        <Route path="/" element={<GPSCalculator />} />
      </Routes>
    </div>
  );
}
