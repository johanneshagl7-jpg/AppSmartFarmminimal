
import React, { useState } from "react";

const GuidanceSystem = () => {
  const [lat1, setLat1] = useState("");
  const [lon1, setLon1] = useState("");
  const [lat2, setLat2] = useState("");
  const [lon2, setLon2] = useState("");
  const [width, setWidth] = useState(3);
  const [lines, setLines] = useState([]);

  const calculate = () => {
    if (!lat1 || !lon1 || !lat2 || !lon2) {
      alert("Bitte alle Koordinaten eingeben!");
      return;
    }

    const x1 = parseFloat(lat1);
    const y1 = parseFloat(lon1);
    const x2 = parseFloat(lat2);
    const y2 = parseFloat(lon2);

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const newLines = [];
    for (let i = -5; i <= 5; i++) {
      const dx = (i * width * Math.sin(angle)) / 111320;
      const dy = (i * width * Math.cos(angle)) / 111320;
      newLines.push({
        start: { lat: x1 + dx, lon: y1 - dy },
        end: { lat: x2 + dx, lon: y2 - dy },
      });
    }
    setLines(newLines);
  };

  return (
    <div className="max-w-xl mx-auto p-6 rounded-2xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">🚜 Spurführung (AB-Linien)</h2>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input type="number" step="any" value={lat1} onChange={(e) => setLat1(e.target.value)} className="p-2 border rounded-md" placeholder="Lat A" />
        <input type="number" step="any" value={lon1} onChange={(e) => setLon1(e.target.value)} className="p-2 border rounded-md" placeholder="Lon A" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input type="number" step="any" value={lat2} onChange={(e) => setLat2(e.target.value)} className="p-2 border rounded-md" placeholder="Lat B" />
        <input type="number" step="any" value={lon2} onChange={(e) => setLon2(e.target.value)} className="p-2 border rounded-md" placeholder="Lon B" />
      </div>
      <div className="mb-3">
        <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Arbeitsbreite (m)" />
      </div>
      <button onClick={calculate} className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">Spuren berechnen</button>
      {lines.length > 0 && (
        <div className="mt-4 p-3 rounded-md bg-green-100 text-green-800 text-sm">
          <h3 className="font-semibold mb-2">Generierte Linien:</h3>
          <ul className="space-y-1">
            {lines.map((line, i) => (
              <li key={i}>
                Spur {i + 1}: Start ({line.start.lat.toFixed(5)}, {line.start.lon.toFixed(5)}) → Ende ({line.end.lat.toFixed(5)}, {line.end.lon.toFixed(5)})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GuidanceSystem;
