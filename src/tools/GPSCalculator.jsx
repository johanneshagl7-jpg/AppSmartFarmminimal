
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const tractorIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/861/861348.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function LocationWatcher({ setPosition }) {
  const map = useMap();
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watch = navigator.geolocation.watchPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition([latitude, longitude]);
      map.setView([latitude, longitude]);
    });
    return () => navigator.geolocation.clearWatch(watch);
  }, [map, setPosition]);
  return null;
}

// Abstand Punkt zu Linie (A-B) in Metern
function distanceToLine(point, A, B) {
  if (!point || !A || !B) return 0;
  const [x0, y0] = point;
  const [x1, y1] = A;
  const [x2, y2] = B;
  const num = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2*y1 - y2*x1);
  const den = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
  return den === 0 ? 0 : num / den; // Meter
}

export default function GPSCalculator(){
  const [position, setPosition] = useState(null);
  const [aPoint, setAPoint] = useState(null);
  const [bPoint, setBPoint] = useState(null);
  const [workWidth, setWorkWidth] = useState(20);
  const [path, setPath] = useState([]);

  const setA = () => position && setAPoint(position);
  const setB = () => position && setBPoint(position);

  const line = aPoint && bPoint ? [aPoint, bPoint] : [];

  useEffect(() => {
    if (position) setPath(prev => [...prev, position]);
  }, [position]);

  const deviation = aPoint && bPoint && position
    ? (distanceToLine(position, aPoint, bPoint) * 100).toFixed(1)
    : null;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex gap-2">
        <button onClick={setA} className="px-3 py-1 bg-blue-500 text-white rounded">A setzen</button>
        <button onClick={setB} className="px-3 py-1 bg-green-500 text-white rounded">B setzen</button>
      </div>
      <div>Arbeitsbreite: <input type="number" value={workWidth} onChange={e=>setWorkWidth(+e.target.value)} /> m</div>
      {deviation && <div>Abweichung: {deviation} cm</div>}
      <MapContainer center={[48.2,16.3]} zoom={18} style={{height:"400px",width:"100%"}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        <LocationWatcher setPosition={setPosition} />
        {position && <Marker position={position} icon={tractorIcon}/>}
        {line.length===2 && <Polyline positions={line} color="blue"/>}
        {path.length>1 && <Polyline positions={path} color="green"/>}
      </MapContainer>
    </div>
  );
}
