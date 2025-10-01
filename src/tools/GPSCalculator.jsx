
import React, { useState, useEffect, useRef } from "react";

export default function GPSCalculator(){
  const canvasRef = useRef(null);
  const [aPoint, setAPoint] = useState(null);
  const [bPoint, setBPoint] = useState(null);
  const [mode, setMode] = useState(null); // "A" oder "B"
  const [workWidth, setWorkWidth] = useState(20); // Meter
  const [deviation,setDeviation] = useState(0);
  const [position,setPosition] = useState(null);

  // GPS vom Gerät
  useEffect(()=>{
    if(!navigator.geolocation) return;
    const watch = navigator.geolocation.watchPosition(
      (pos)=>{
        setPosition({lat:pos.coords.latitude, lon:pos.coords.longitude});
      },
      (err)=>console.error(err),
      { enableHighAccuracy:true }
    );
    return ()=>navigator.geolocation.clearWatch(watch);
  },[]);

  // Meter pro Grad grob (für Österreich ca.)
  const meterPerLat = 111320;
  const meterPerLon = 75000;

  // Zeichnen
  useEffect(()=>{
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "#1a1f2b";
    ctx.fillRect(0,0,600,400);

    // Mittelpunkt = Traktor fix
    const cx=300, cy=200;

    // AB + Spurlinien
    if(aPoint && bPoint){
      // Delta in Meter
      const dx = (bPoint.lon-aPoint.lon)*meterPerLon;
      const dy = (bPoint.lat-aPoint.lat)*meterPerLat;
      const len = Math.sqrt(dx*dx+dy*dy);
      const nx = -(dy/len);
      const ny = dx/len;

      // Alle Linien zeichnen
      ctx.strokeStyle="#00aaff";
      ctx.lineWidth=2;
      for(let i=-5;i<=5;i++){
        const shift = i*workWidth;
        ctx.beginPath();
        ctx.moveTo(cx+nx*shift,cy+ny*shift-1000);
        ctx.lineTo(cx+nx*shift,cy+ny*shift+1000);
        ctx.stroke();
      }

      // Abweichung berechnen wenn GPS vorhanden
      if(position){
        const px = (position.lon-aPoint.lon)*meterPerLon;
        const py = (position.lat-aPoint.lat)*meterPerLat;
        const num = Math.abs(dy*px - dx*py);
        const den = Math.sqrt(dx*dx+dy*dy);
        const dist = (num/den);
        setDeviation(dist.toFixed(1));
      }
    }

    // Traktor (fix mittig)
    ctx.fillStyle="yellow";
    ctx.fillRect(cx-10,cy-20,20,40);
    ctx.fillStyle="white";
    ctx.beginPath();
    ctx.moveTo(cx,cy-20);
    ctx.lineTo(cx+10,cy-10);
    ctx.lineTo(cx-10,cy-10);
    ctx.closePath();
    ctx.fill();

  },[aPoint,bPoint,position,workWidth]);

  const handleCanvasClick=(e)=>{
    const rect = canvasRef.current.getBoundingClientRect();
    const pt = {x:e.clientX-rect.left,y:e.clientY-rect.top};
    // Klickpunkte als Dummy Koordinaten speichern
    const lon = pt.x/10;
    const lat = pt.y/10;
    if(mode==="A"){ setAPoint({lat,lon}); setMode(null); }
    if(mode==="B"){ setBPoint({lat,lon}); setMode(null); }
  };

  let devColor="lime";
  if(deviation>20) devColor="yellow";
  if(deviation>50) devColor="red";

  return <div className="bg-gray-900 text-white p-2 rounded-lg">
    <div className="flex">
      <canvas ref={canvasRef} width={600} height={400} className="border" onClick={handleCanvasClick}></canvas>
      <div className="flex flex-col ml-2 space-y-2">
        <button onClick={()=>setMode("A")} className="px-3 py-2 bg-blue-600 rounded">Setze A</button>
        <button onClick={()=>setMode("B")} className="px-3 py-2 bg-green-600 rounded">Setze B</button>
        <button onClick={()=>{setAPoint(null);setBPoint(null);setDeviation(0);}} className="px-3 py-2 bg-red-600 rounded">Reset</button>
        <div className="text-xs">Arbeitsbreite: <input type="number" value={workWidth} onChange={e=>setWorkWidth(+e.target.value)} className="text-black w-16"/></div>
      </div>
    </div>
    <div className="text-center mt-3 text-3xl font-bold" style={{color:devColor}}>
      Abweichung: {deviation} cm
    </div>
  </div>;
}
