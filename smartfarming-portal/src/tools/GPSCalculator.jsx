
import React, { useState, useRef, useEffect } from "react";

export default function GPSCalculator(){
  const canvasRef = useRef(null);
  const [apPoints, setApPoints] = useState([]);
  const [tractor, setTractor] = useState({x:150, y:150, heading:0, offset:0});
  const [workWidth, setWorkWidth] = useState(20);
  const [field, setField] = useState([]);

  useEffect(()=>{
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0,0,600,400);
    // Feld grün färben
    field.forEach(p=>{
      ctx.fillStyle = "rgba(0,200,0,0.3)";
      ctx.fillRect(p.x-workWidth/2, p.y-5, workWidth, 10);
    });
    // AP-Linie zeichnen
    if(apPoints.length>1){
      ctx.strokeStyle = "blue";
      ctx.beginPath();
      ctx.moveTo(apPoints[0].x, apPoints[0].y);
      apPoints.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));
      ctx.stroke();
    }
    // Traktor zeichnen
    ctx.save();
    ctx.translate(tractor.x, tractor.y);
    ctx.rotate(tractor.heading);
    ctx.fillStyle="red";
    ctx.fillRect(-10,-20,20,40);
    ctx.restore();
  },[tractor,apPoints,field,workWidth]);

  // Simulierte Fahrt
  useEffect(()=>{
    const interval = setInterval(()=>{
      setTractor(t=>{
        const newY = t.y-2;
        const offset = Math.sin(Date.now()/1000)*5; // simulierte Abweichung
        setField(f=>[...f,{x:t.x+offset,y:newY}]);
        return {...t,y:newY,offset};
      });
    },200);
    return ()=>clearInterval(interval);
  },[]);

  const addApPoint=(e)=>{
    const rect = canvasRef.current.getBoundingClientRect();
    setApPoints([...apPoints,{x:e.clientX-rect.left,y:e.clientY-rect.top}]);
  };

  return <div className="space-y-2 text-sm">
    <canvas ref={canvasRef} width={600} height={400} className="border" onClick={addApPoint}></canvas>
    <div>Arbeitsbreite: <input type="number" value={workWidth} onChange={e=>setWorkWidth(+e.target.value)} /> m</div>
    <div>Abweichung: {tractor.offset.toFixed(1)} cm</div>
    <div className="text-xs text-gray-500">Klick ins Feld = AP-Punkt setzen</div>
  </div>;
}
