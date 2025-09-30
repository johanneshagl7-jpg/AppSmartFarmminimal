
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Traktor-Icon
const tractorIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

export default function GPSCalculator(){
  const [position, setPosition] = useState(null);
  const [aPoint, setAPoint] = useState(null);
  const [bPoint, setBPoint] = useState(null);
  const [lines, setLines] = useState([]);
  const [workWidth, setWorkWidth] = useState(6);
  const [deviation, setDeviation] = useState(0);
  const [mode, setMode] = useState(null); // "A" oder "B"

  // Live GPS
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  // Linie + Spurlinien berechnen (nur zwischen A und B)
  useEffect(() => {
    if(aPoint && bPoint){
      const newLines = [];
      const lat1 = aPoint[0], lon1 = aPoint[1];
      const lat2 = bPoint[0], lon2 = bPoint[1];

      // Richtung berechnen
      const dx = lon2-lon1;
      const dy = lat2-lat1;
      const len = Math.sqrt(dx*dx+dy*dy);
      const nx = -(dy/len);
      const ny = dx/len;

      // Hauptlinie
      newLines.push([aPoint,bPoint]);

      // Parallellinien links und rechts in Arbeitsbreite
      for(let i=1;i<=5;i++){
        const shift = i*workWidth*0.00001; // Umrechnung grob
        const shiftLat = ny*shift;
        const shiftLon = nx*shift;
        newLines.push([[lat1+shiftLat, lon1+shiftLon],[lat2+shiftLat, lon2+shiftLon]]);
        newLines.push([[lat1-shiftLat, lon1-shiftLon],[lat2-shiftLat, lon2-shiftLon]]);
      }
      setLines(newLines);
    }
  },[aPoint,bPoint,workWidth]);

  // Abweichung berechnen (Distanz zur AB-Linie)
  useEffect(()=>{
    if(position && aPoint && bPoint){
      const [x0,y0] = position;
      const [x1,y1] = aPoint;
      const [x2,y2] = bPoint;
      const num = Math.abs((y2-y1)*x0 - (x2-x1)*y0 + x2*y1 - y2*x1);
      const den = Math.sqrt((y2-y1)**2+(x2-x1)**2);
      const dist = (num/den)*111139; // grob in Meter
      setDeviation(dist.toFixed(2));
    }
  },[position,aPoint,bPoint]);

  // Map-Klick → aktiven Punkt setzen
  const handleMapClick = (e) => {
    const latlng = [e.latlng.lat, e.latlng.lng];
    if(mode==="A"){ setAPoint(latlng); setMode(null); }
    if(mode==="B"){ setBPoint(latlng); setMode(null); }
  };

  let devColor = "lime";
  if(deviation>0.1) devColor="yellow";
  if(deviation>0.3) devColor="red";

  return (
    <div className="w-full h-[80vh] relative">
      <MapContainer center={[48.2,16.37]} zoom={18} className="w-full h-full" whenCreated={(map)=>map.on("click",handleMapClick)}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {position && <Marker position={position} icon={tractorIcon}/>}
        {aPoint && <Marker position={aPoint}/>}
        {bPoint && <Marker position={bPoint}/>}
        {lines.map((ln,i)=>(<Polyline key={i} positions={ln} color="blue"/>))}
      </MapContainer>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-3xl font-bold px-4 py-2 rounded" style={{background:"rgba(0,0,0,0.5)",color:devColor}}>
        {deviation} m
      </div>
      <div className="absolute top-2 right-2 bg-white text-black p-2 rounded space-y-2">
        <div>Arbeitsbreite: <input type="number" value={workWidth} onChange={e=>setWorkWidth(+e.target.value)} className="w-16"/></div>
        <button onClick={()=>setMode("A")} className="px-2 py-1 bg-blue-500 text-white rounded w-full">Setze A</button>
        <button onClick={()=>setMode("B")} className="px-2 py-1 bg-green-500 text-white rounded w-full">Setze B</button>
        <button onClick={()=>{setAPoint(null);setBPoint(null);setLines([]);}} className="px-2 py-1 bg-red-600 text-white rounded w-full">Reset</button>
      </div>
    </div>
  );
}
