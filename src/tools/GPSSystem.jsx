
import React, { useState } from "react";

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const GPSSystem = () => {
  const [lat1, setLat1] = useState("");
  const [lon1, setLon1] = useState("");
  const [lat2, setLat2] = useState("");
  const [lon2, setLon2] = useState("");
  const [distance, setDistance] = useState(null);

  const calculate = () => {
    if (!lat1 || !lon1 || !lat2 || !lon2) {
      setDistance("Bitte alle Koordinaten eingeben!");
      return;
    }
    const dist = haversine(parseFloat(lat1), parseFloat(lon1), parseFloat(lat2), parseFloat(lon2));
    setDistance(`${(dist / 1000).toFixed(2)} km`);
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">📍 GPS System</h2>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input type="number" step="any" value={lat1} onChange={(e) => setLat1(e.target.value)} className="p-2 border rounded-md" placeholder="Lat Punkt 1" />
        <input type="number" step="any" value={lon1} onChange={(e) => setLon1(e.target.value)} className="p-2 border rounded-md" placeholder="Lon Punkt 1" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input type="number" step="any" value={lat2} onChange={(e) => setLat2(e.target.value)} className="p-2 border rounded-md" placeholder="Lat Punkt 2" />
        <input type="number" step="any" value={lon2} onChange={(e) => setLon2(e.target.value)} className="p-2 border rounded-md" placeholder="Lon Punkt 2" />
      </div>
      <button onClick={calculate} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Distanz berechnen</button>
      {distance && (
        <div className="mt-4 p-3 rounded-md bg-blue-100 text-blue-800 text-center font-medium">
          Distanz: {distance}
        </div>
      )}
    </div>
  );
};

export default GPSSystem;
