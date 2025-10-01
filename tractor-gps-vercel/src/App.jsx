import React from "react";
import GPSCalculator from "./tools/GPSCalculator.jsx";

export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-2 bg-emerald-600 text-white text-lg font-bold">
        🚜 TractorGPS Web
      </header>
      <main className="flex-1 p-2">
        <GPSCalculator />
      </main>
    </div>
  );
}
