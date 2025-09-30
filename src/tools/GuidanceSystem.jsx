
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Hilfsfunktion: Abstand Punkt zu Linie
function perpendicularDistance(latA, lonA, latB, lonB, latP, lonP) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000; // Erdradius in m

  const Ax = R * Math.cos(toRad(latA)) * Math.cos(toRad(lonA));
  const Ay = R * Math.cos(toRad(latA)) * Math.sin(toRad(lonA));
  const Az = R * Math.sin(toRad(latA));

  const Bx = R * Math.cos(toRad(latB)) * Math.cos(toRad(lonB));
  const By = R * Math.cos(toRad(latB)) * Math.sin(toRad(lonB));
  const Bz = R * Math.sin(toRad(latB));

  const Px = R * Math.cos(toRad(latP)) * Math.cos(toRad(lonP));
  const Py = R * Math.cos(toRad(latP)) * Math.sin(toRad(lonP));
  const Pz = R * Math.sin(toRad(latP));

  // Richtungsvektoren
  const AB = [Bx - Ax, By - Ay, Bz - Az];
  const AP = [Px - Ax, Py - Ay, Pz - Az];

  // Kreuzprodukt für Abstand
  const cross = [
    AB[1] * AP[2] - AB[2] * AP[1],
    AB[2] * AP[0] - AB[0] * AP[2],
    AB[0] * AP[1] - AB[1] * AP[0],
  ];

  const area = Math.sqrt(cross[0] ** 2 + cross[1] ** 2 + cross[2] ** 2);
  const base = Math.sqrt(AB[0] ** 2 + AB[1] ** 2 + AB[2] ** 2);
  return area / base; // Abstand in m
}

const GuidanceSystem = () => {
  const [latA, setLatA] = useState("");
  const [lonA, setLonA] = useState("");
  const [latB, setLatB] = useState("");
  const [lonB, setLonB] = useState("");
  const [currentPos, setCurrentPos] = useState(null);
  const [line, setLine] = useState(null);
  const [deviation, setDeviation] = useState(null);

  const setABLine = () => {
    if (!latA || !lonA || !latB || !lonB) {
      alert("❌ Bitte A- und B-Punkt eingeben!");
      return;
    }
    setLine([
      [parseFloat(latA), parseFloat(lonA)],
      [parseFloat(latB), parseFloat(lonB)],
    ]);
  };

  // aktuelle GPS-Position holen
  useEffect(() => {
    if (navigator.geolocation) {
      const watch = navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentPos([latitude, longitude]);

        if (line) {
          const d = perpendicularDistance(
            line[0][0], line[0][1],
            line[1][0], line[1][1],
            latitude, longitude
          );
          setDeviation(d.toFixed(2));
        }
      });
      return () => navigator.geolocation.clearWatch(watch);
    }
  }, [line]);

  return (
    <div className="w-full h-[600px] p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">🚜 Spurführung mit Karte</h2>

      {/* Eingabe A & B */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input type="number" step="any" value={latA} onChange={(e) => setLatA(e.target.value)} className="p-2 border rounded-md" placeholder="Lat A" />
        <input type="number" step="any" value={lonA} onChange={(e) => setLonA(e.target.value)} className="p-2 border rounded-md" placeholder="Lon A" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input type="number" step="any" value={latB} onChange={(e) => setLatB(e.target.value)} className="p-2 border rounded-md" placeholder="Lat B" />
        <input type="number" step="any" value={lonB} onChange={(e) => setLonB(e.target.value)} className="p-2 border rounded-md" placeholder="Lon B" />
      </div>
      <button onClick={setABLine} className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 mb-3">
        AB-Linie setzen
      </button>

      {/* Karte */}
      <MapContainer
        center={currentPos || [48.2, 16.3]}
        zoom={16}
        className="w-full h-[400px] rounded-md"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {line && <Polyline positions={line} color="blue" />}
        {currentPos && <Marker position={currentPos}></Marker>}
      </MapContainer>

      {/* Abweichung */}
      {deviation && (
        <div className="mt-3 p-3 bg-blue-100 text-blue-800 text-center font-medium rounded-md">
          Abweichung von der Spur: {deviation} m
        </div>
      )}
    </div>
  );
};

export default GuidanceSystem;
