import React, { useState } from "react";
import {
  NutrientBalance,
  Organics,
  GPSCalculator,
  SeedCalculator,
  SowingAdvisor,
  YieldForecast,
  FieldTime,
  PowerRequirement,
  TirePressure,
  SprayWeather,
  SoilMoisture,
  CO2Calculator,
} from "./tools";

const toolList = [
  { name: "Nährstoffbilanz", component: <NutrientBalance /> },
  { name: "Organik-Rechner", component: <Organics /> },
  { name: "GPS-Kalkulator", component: <GPSCalculator /> },
  { name: "Saatgut-Kalkulator", component: <SeedCalculator /> },
  { name: "Aussaat-Berater", component: <SowingAdvisor /> },
  { name: "Ertragsprognose", component: <YieldForecast /> },
  { name: "Feldzeit-Rechner", component: <FieldTime /> },
  { name: "Kraftbedarf", component: <PowerRequirement /> },
  { name: "Reifendruck", component: <TirePressure /> },
  { name: "Spritzwetter", component: <SprayWeather /> },
  { name: "Bodenfeuchte", component: <SoilMoisture /> },
  { name: "CO₂/Energie", component: <CO2Calculator /> },
];

const App = () => {
  const [activeTool, setActiveTool] = useState(toolList[0]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">🌾 Agrar Tools</h1>
        <ul>
          {toolList.map((tool, index) => (
            <li key={index}>
              <button
                onClick={() => setActiveTool(tool)}
                className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                  activeTool.name === tool.name
                    ? "bg-green-600"
                    : "hover:bg-gray-700"
                }`}
              >
                {tool.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">{activeTool.component}</div>
    </div>
  );
};

export default App;
