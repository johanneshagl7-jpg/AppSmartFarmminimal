import React from "react";
import { useParams, Link } from "react-router-dom";
import * as ToolComps from "../tools";

const mapping = {
  boden: [
    {id:"nb", comp:ToolComps.NutrientBalance, name:"Nährstoffbilanz-Rechner"},
    {id:"org", comp:ToolComps.Organics, name:"Organik-Rechner"},
    {id:"gps", comp:ToolComps.GPSCalculator, name:"GPS-Kalkulator Streuer/Spritze"},
    {id:"hs", comp:ToolComps.HS180, name:"HS-180 N-Rechner"}
  ],
  pflanze: [
    {id:"seed", comp:ToolComps.SeedCalc, name:"Saatgut-Kalkulator"},
    {id:"sow", comp:ToolComps.SowingAdvisor, name:"Aussaat-Terminberater"},
    {id:"yield", comp:ToolComps.YieldForecast, name:"Ertragsprognose-Tool"}
  ],
  maschine: [
    {id:"field", comp:ToolComps.FieldTime, name:"Feldzeit-Rechner"},
    {id:"power", comp:ToolComps.PowerCheck, name:"Traktor-Kraftbedarf-Check"},
    {id:"tire", comp:ToolComps.TirePressure, name:"Reifendruck-Rechner"}
  ],
  wetter: [
    {id:"spray", comp:ToolComps.SprayWeather, name:"Spritzwetter-Check"},
    {id:"soil", comp:ToolComps.SoilMoisture, name:"Bodenfeuchte-Karte"},
    {id:"co2", comp:ToolComps.CO2Calc, name:"CO₂/Energie-Rechner"}
  ]
};

export default function Tools(){
  const { id } = useParams();
  const tools = mapping[id]||[];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold capitalize">{id}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {tools.map(t=>(
          <div key={t.id} className="p-5 rounded-2xl shadow bg-white dark:bg-gray-800">
            <h2 className="text-lg font-semibold mb-2">{t.name}</h2>
            <t.comp />
          </div>
        ))}
      </div>
      <Link to="/" className="text-blue-600 dark:text-blue-400">← zurück</Link>
    </div>
  );
}
