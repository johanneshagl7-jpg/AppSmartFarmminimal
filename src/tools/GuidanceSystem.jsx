
import React, { useState, useEffect } from "react";

const GuidanceSystem = () => {
  const [width, setWidth] = useState(3); // Arbeitsbreite in m
  const [deviation, setDeviation] = useState(0); // Abweichung in m

  // Simulation: Fahrzeug driftet leicht links/rechts
  useEffect(() => {
    const interval = setInterval(() => {
      setDeviation((prev) => {
        let next = prev + (Math.random() - 0.5) * 0.2; // ±0.1 m pro Tick
        if (next > 2) next = 2;
        if (next < -2) next = -2;
        return parseFloat(next.toFixed(2));
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const lines = [];
  for (let i = -5; i <= 5; i++) {
    lines.push(i * width);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">🚜 Spurführung</h2>

      <div className="flex justify-center mb-3">
        <label className="mr-2">Arbeitsbreite (m):</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          className="border p-1 rounded w-20 text-center"
        />
      </div>

      {/* SVG Spurdisplay */}
      <svg viewBox="-50 -100 100 100" className="w-full h-64 border rounded bg-gray-100">
        {/* Spurlinien */}
        {lines.map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={-100}
            x2={x}
            y2={0}
            stroke={x === 0 ? "blue" : "lightgray"}
            strokeWidth={x === 0 ? 0.4 : 0.2}
          />
        ))}

        {/* Fahrzeug */}
        <circle
          cx={deviation}
          cy={-5}
          r={2}
          fill="red"
          stroke="black"
          strokeWidth={0.2}
        />
      </svg>

      {/* Abweichungstext */}
      <div
        className={`mt-4 p-3 text-center font-bold rounded-md ${
          Math.abs(deviation) < 0.2
            ? "bg-green-200 text-green-800"
            : Math.abs(deviation) < 1
            ? "bg-yellow-200 text-yellow-800"
            : "bg-red-200 text-red-800"
        }`}
      >
        Abweichung: {deviation} m
      </div>
    </div>
  );
};

export default GuidanceSystem;
