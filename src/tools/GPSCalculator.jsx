
import React, { useState, useRef, useEffect } from "react";

export default function GPSCalculator(){
  const canvasRef = useRef(null);
  const [aPoint, setAPoint] = useState(null);
  const [bPoint, setBPoint] = useState(null);
  const [mode, setMode] = useState(null); // "A" oder "B"
  const [workWidth, setWorkWidth] = useState(20); // Meter
  const [tractor, setTractor] = useState({x:300,y:350,heading:0,offset:0});
  const [lines, setLines] = useState([]);
  const [deviation,setDeviation] = useState(0);

  // Zeichnen
  useEffect(()=>{
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "#1a1f2b"; // Hintergrund
    ctx.fillRect(0,0,600,400);

    // A und B Punkte
    if(aPoint){
      ctx.fillStyle="lime";
      ctx.beginPath();
      ctx.arc(aPoint.x,aPoint.y,6,0,2*Math.PI);
      ctx.fill();
    }
    if(bPoint){
      ctx.fillStyle="red";
      ctx.beginPath();
      ctx.arc(bPoint.x,bPoint.y,6,0,2*Math.PI);
      ctx.fill();
    }

    // Leitlinien zeichnen
    ctx.strokeStyle = "#00aaff";
    ctx.lineWidth = 2;
    lines.forEach(ln=>{
      ctx.beginPath();
      ctx.moveTo(ln[0].x,ln[0].y);
      ctx.lineTo(ln[1].x,ln[1].y);
      ctx.stroke();
    });

    // Traktor zeichnen
    ctx.save();
    ctx.translate(tractor.x,tractor.y);
    ctx.rotate(tractor.heading);
    ctx.fillStyle="yellow";
    ctx.fillRect(-10,-20,20,40);
    ctx.fillStyle="white";
    ctx.beginPath();
    ctx.moveTo(0,-20);
    ctx.lineTo(10,-10);
    ctx.lineTo(-10,-10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },[aPoint,bPoint,tractor,lines]);

  // Fahrt Simulation
  useEffect(()=>{
    const interval=setInterval(()=>{
      setTractor(t=>({...t,y:t.y-2}));
    },200);
    return ()=>clearInterval(interval);
  },[]);

  // Linien berechnen
  useEffect(()=>{
    if(aPoint && bPoint){
      const dx = bPoint.x-aPoint.x;
      const dy = bPoint.y-aPoint.y;
      const len = Math.sqrt(dx*dx+dy*dy);
      const nx = -(dy/len);
      const ny = dx/len;
      const newLines = [[aPoint,bPoint]];
      for(let i=1;i<=5;i++){
        const shift = i*workWidth/2; // Pixelmaßstab vereinfacht
        newLines.push([{x:aPoint.x+nx*shift,y:aPoint.y+ny*shift},{x:bPoint.x+nx*shift,y:bPoint.y+ny*shift}]);
        newLines.push([{x:aPoint.x-nx*shift,y:aPoint.y-ny*shift},{x:bPoint.x-nx*shift,y:bPoint.y-ny*shift}]);
      }
      setLines(newLines);
    }
  },[aPoint,bPoint,workWidth]);

  // Abweichung berechnen (Distanz zu Hauptlinie)
  useEffect(()=>{
    if(aPoint && bPoint){
      const x0=tractor.x,y0=tractor.y;
      const x1=aPoint.x,y1=aPoint.y;
      const x2=bPoint.x,y2=bPoint.y;
      const num = Math.abs((y2-y1)*x0 - (x2-x1)*y0 + x2*y1 - y2*x1);
      const den = Math.sqrt((y2-y1)**2+(x2-x1)**2);
      setDeviation(((num/den)).toFixed(1));
    }
  },[tractor,aPoint,bPoint]);

  const handleCanvasClick=(e)=>{
    const rect = canvasRef.current.getBoundingClientRect();
    const pt = {x:e.clientX-rect.left,y:e.clientY-rect.top};
    if(mode==="A"){ setAPoint(pt); setMode(null); }
    if(mode==="B"){ setBPoint(pt); setMode(null); }
  };

  let devColor = "lime";
  if(deviation>20) devColor="yellow";
  if(deviation>50) devColor="red";

  return <div className="bg-gray-900 text-white p-2 rounded-lg">
    <div className="flex">
      <canvas ref={canvasRef} width={600} height={400} className="border" onClick={handleCanvasClick}></canvas>
      <div className="flex flex-col ml-2 space-y-2">
        <button onClick={()=>setMode("A")} className="px-3 py-2 bg-blue-600 rounded">Setze A</button>
        <button onClick={()=>setMode("B")} className="px-3 py-2 bg-green-600 rounded">Setze B</button>
        <button onClick={()=>{setAPoint(null);setBPoint(null);setLines([]);}} className="px-3 py-2 bg-red-600 rounded">Reset</button>
        <div className="text-xs">Arbeitsbreite: <input type="number" value={workWidth} onChange={e=>setWorkWidth(+e.target.value)} className="text-black w-16"/></div>
      </div>
    </div>
    <div className="text-center mt-3 text-3xl font-bold" style={{color:devColor}}>
      Abweichung: {deviation} cm
    </div>
  </div>;
}
