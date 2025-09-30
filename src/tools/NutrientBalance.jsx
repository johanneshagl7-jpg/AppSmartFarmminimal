import React, { useState } from "react";
export default function NutrientBalance(){
  const [n,setN]=useState(0),[p,setP]=useState(0),[k,setK]=useState(0);
  const [nOut,setNOut]=useState(0),[pOut,setPOut]=useState(0),[kOut,setKOut]=useState(0);
  return (<div className="space-y-2 text-sm">
    <div>N-Gabe [kg/ha] <input type='number' value={n} onChange={e=>setN(+e.target.value)} /></div>
    <div>P-Gabe [kg/ha] <input type='number' value={p} onChange={e=>setP(+e.target.value)} /></div>
    <div>K-Gabe [kg/ha] <input type='number' value={k} onChange={e=>setK(+e.target.value)} /></div>
    <div>Entzug N [kg/ha] <input type='number' value={nOut} onChange={e=>setNOut(+e.target.value)} /></div>
    <div>Entzug P [kg/ha] <input type='number' value={pOut} onChange={e=>setPOut(+e.target.value)} /></div>
    <div>Entzug K [kg/ha] <input type='number' value={kOut} onChange={e=>setKOut(+e.target.value)} /></div>
    <div className="mt-2 font-bold">Bilanz: N {n-nOut} kg/ha | P {p-pOut} kg/ha | K {k-kOut} kg/ha</div>
  </div>);
}