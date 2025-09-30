
import React, { useState, useRef, useEffect } from "react";

export default function GPSCalculator(){
  const canvasRef = useRef(null);
  const [mode, setMode] = useState("AB"); // "AB" oder "Polyline"
  const [aPoint, setAPoint] = useState(null);
  const [bPoint, setBPoint] = useState(null);
  const [polyline, setPolyline] = useState([]);
  const [tractor, setTractor] = useState({x:300, y:350, heading:0, offset:0});
  const [workWidth, setWorkWidth] = useState(20);
  const [field, setField] = useState([]);

  // Hilfsfunktion: Abstand Punkt zu Linie (für AB oder Polyline)
  const pointLineDistance = (px, py) => {
    if(mode === "AB" && aPoint && bPoint){
      // Abstand zur AB-Linie
      const x0=px,y0=py, x1=aPoint.x,y1=aPoint.y, x2=bPoint.x,y2=bPoint.y;
      const num = Math.abs((y2-y1)*x0 - (x2-x1)*y0 + x2*y1 - y2*x1);
      const den = Math.sqrt((y2-y1)**2+(x2-x1)**2);
      return num/den;
    } else if(mode==="Polyline" && polyline.length>1){
      let minDist = Infinity;
      for(let i=0;i<polyline.length-1;i++){
        const x1=polyline[i].x,y1=polyline[i].y;
        const x2=polyline[i+1].x,y2=polyline[i+1].y;
        const num = Math.abs((y2-y1)*px - (x2-x1)*py + x2*y1 - y2*x1);
        const den = Math.sqrt((y2-y1)**2+(x2-x1)**2);
        const dist = num/den;
        if(dist<minDist) minDist=dist;
      }
      return minDist;
    }
    return 0;
  };

  useEffect(()=>{
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0,0,600,400);

    // Feld (bearbeitete Flächen) grün einfärben
    field.forEach(p=>{
      ctx.fillStyle = "rgba(0,200,0,0.3)";
      ctx.fillRect(p.x-workWidth/2, p.y-5, workWidth, 10);
    });

    // Leitlinien zeichnen
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if(mode==="AB" && aPoint && bPoint){
      ctx.moveTo(aPoint.x,aPoint.y);
      ctx.lineTo(bPoint.x,bPoint.y);
    }
    if(mode==="Polyline" && polyline.length>1){
      ctx.moveTo(polyline[0].x,polyline[0].y);
      polyline.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));
    }
    ctx.stroke();

    // Traktor zeichnen
    ctx.save();
    ctx.translate(tractor.x, tractor.y);
    ctx.rotate(tractor.heading);
    ctx.fillStyle="red";
    ctx.fillRect(-10,-20,20,40);
    ctx.restore();
  },[tractor,aPoint,bPoint,polyline,field,workWidth,mode]);

  // Simulation Fahrt mit Drift
  useEffect(()=>{
    const interval = setInterval(()=>{
      setTractor(t=>{
        const newY = t.y-2;
        const offset = (Math.sin(Date.now()/1000))*5; // Drift cm
        setField(f=>[...f,{x:t.x+offset,y:newY}]);
        return {...t,y:newY,offset};
      });
    },200);
    return ()=>clearInterval(interval);
  },[]);

  const handleCanvasClick=(e)=>{
    const rect = canvasRef.current.getBoundingClientRect();
    const point = {x:e.clientX-rect.left,y:e.clientY-rect.top};
    if(mode==="AB"){
      if(!aPoint) setAPoint(point);
      else if(!bPoint) setBPoint(point);
    } else if(mode==="Polyline"){
      setPolyline([...polyline,point]);
    }
  };

  const deviation = pointLineDistance(tractor.x,tractor.y);

  return <div className="space-y-2 text-sm">
    <div className="flex gap-2">
      <button onClick={()=>{setMode("AB");setAPoint(null);setBPoint(null);}} className="px-2 py-1 bg-blue-500 text-white rounded">AB-Modus</button>
      <button onClick={()=>{setMode("Polyline");setPolyline([]);}} className="px-2 py-1 bg-green-500 text-white rounded">Polyline-Modus</button>
    </div>
    <canvas ref={canvasRef} width={600} height={400} className="border" onClick={handleCanvasClick}></canvas>
    <div>Arbeitsbreite: <input type="number" value={workWidth} onChange={e=>setWorkWidth(+e.target.value)} /> m</div>
    <div>Abweichung: {deviation.toFixed(1)} cm</div>
    <div className="text-xs text-gray-500">Klick ins Feld: {mode==="AB" ? "erst A, dann B" : "Polyline-Punkte setzen"}</div>
  </div>;
}
