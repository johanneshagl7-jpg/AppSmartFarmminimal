
import React, { useState, useEffect } from "react";

const GuidanceSystem = () => {
  const [mode, setMode] = useState("straight"); // straight oder curve
  const [width, setWidth] = useState(3); // Arbeitsbreite in m
  const [points, setPoints] = useState([]); // A, B oder Kurvenpunkte
  const [currentPos, setCurrentPos] = useState([0, -10]); // Startposition
  const [heading, setHeading] = useState(0); // Fahrtrichtung in Grad
  const [deviation, setDeviation] = useState(0); // Abweichung in m

  // Live GPS-Position (hier Simulation, kann durch navigator.geolocation ersetzt werden)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPos(([x, y]) => {
        const newY = y + 0.5; // nach oben fahren
        return [x + (Math.random() - 0.5) * 0.1, newY];
      });
      setHeading((h) => (h + (Math.random() - 0.5) * 2) % 360);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Abweichung berechnen (vereinfacht: Distanz zur y-Achse als Referenzspur)
  useEffect(() => {
    setDeviation(currentPos[0]); // seitliche Abweichung in m
  }, [currentPos]);

  const deviationCm = (deviation * 100).toFixed(0);

  // Spurlinien generieren
  const lines = [];
  for (let i = -5; i <= 5; i++) {
    lines.push(i * width);
  }

  // SVG-Traktor (Vogelperspektive)
  const Tractor = ({ x, y, heading }) => (
    <g transform={`translate(${x},${y}) rotate(${heading})`}>
      {/* Reifen */}
      <rect x={-4} y={-8} width={2} height={16} fill="black" />
      <rect x={2} y={-8} width={2} height={16} fill="black" />
      {/* Körper */}
      <rect x={-3} y={-6} width={6} height={12} fill="green" stroke="black" />
      {/* Kabine */}
      <rect x={-2} y={-3} width={4} height={6} fill="lightgreen" stroke="black" />
      {/* Auspuff */}
      <rect x={-0.5} y={-7} width={1} height={2} fill="gray" />
    </g>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">🚜 Spurführung</h2>

      {/* Modusauswahl */}
      <div className="flex justify-center mb-3">
        <label className="mr-2">Modus:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="straight">AB Gerade</option>
          <option value="curve">AB Kurve</option>
        </select>
      </div>

      {/* Arbeitsbreite */}
      <div className="flex justify-center mb-3">
        <label className="mr-2">Arbeitsbreite (m):</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(parseFloat(e.target.value))}
          className="border p-1 rounded w-20 text-center"
        />
      </div>

      {/* SVG Spurdisplay */}
      <svg viewBox="-50 -100 100 120" className="w-full h-80 border rounded bg-gray-100">
        {/* Spurlinien */}
        {lines.map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={-100}
            x2={x}
            y2={20}
            stroke={x === 0 ? "blue" : "lightgray"}
            strokeWidth={x === 0 ? 0.4 : 0.2}
          />
        ))}

        {/* Fahrzeug */}
        <Tractor x={currentPos[0]} y={currentPos[1]} heading={heading} />
      </svg>

      {/* Abweichungsanzeige */}
      <div
        className={`mt-4 p-3 text-center font-bold rounded-md ${
          Math.abs(deviationCm) < 5
            ? "bg-green-200 text-green-800"
            : Math.abs(deviationCm) < 20
            ? "bg-yellow-200 text-yellow-800"
            : "bg-red-200 text-red-800"
        }`}
      >
        Abweichung: {deviationCm} cm
      </div>
    </div>
  );
};

export default GuidanceSystem;
