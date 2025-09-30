
import React, { useState } from "react";
import {
  NutrientBalance,
  Organics,
  GPSCalculator,
  GPSSystem,
  GuidanceSystem,
  HS180,
  SeedCalc,
  SowingAdvisor,
  YieldForecast,
  FieldTime,
  PowerCheck,
  TirePressure,
  SprayWeather,
  SoilMoisture,
  CO2Calc,
} from "./tools";

const toolList = [
  { name: "Nutrient Balance", component: <NutrientBalance /> },
  { name: "Organics", component: <Organics /> },
  { name: "GPS Calculator", component: <GPSCalculator /> },
  { name: "GPS System", component: <GPSSystem /> },
  { name: "Spurführung", component: <GuidanceSystem /> },
  { name: "HS180", component: <HS180 /> },
  { name: "Seed Calc", component: <SeedCalc /> },
  { name: "Sowing Advisor", component: <SowingAdvisor /> },
  { name: "Yield Forecast", component: <YieldForecast /> },
  { name: "Field Time", component: <FieldTime /> },
  { name: "Power Check", component: <PowerCheck /> },
  { name: "Tire Pressure", component: <TirePressure /> },
  { name: "Spray Weather", component: <SprayWeather /> },
  { name: "Soil Moisture", component: <SoilMoisture /> },
  { name: "CO₂ Calc", component: <CO2Calc /> },
];

const App = () => {
  const [activeTool, setActiveTool] = useState(toolList[0]);

  return (
    <div className="flex min-h-screen">
      <div className="w-72 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">⚙️ Agrar Tools Portal</h1>
        <ul>
          {toolList.map((tool, index) => (
            <li key={index}>
              <button
                onClick={() => setActiveTool(tool)}
                className={`w-full text-left px-3 py-2 rounded-md mb-1 ${activeTool.name === tool.name ? "bg-green-600" : "hover:bg-gray-700"}`}
              >
                {tool.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-6">{activeTool.component}</div>
    </div>
  );
};

export default App;
