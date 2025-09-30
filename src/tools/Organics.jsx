
import React, { useState } from "react";

const Organics = () => {
  const [rpm, setRpm] = useState("");
  const [factor, setFactor] = useState(160);
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (!rpm || rpm <= 0) {
      setResult("Bitte gültige Drehzahl eingeben!");
      return;
    }
    const value = (rpm / 1000) * factor;
    setResult(`${value.toFixed(2)} m³/h`);
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">🌱 Organics Tool</h2>
      <input
        type="number"
        value={rpm}
        onChange={(e) => setRpm(e.target.value)}
        className="w-full p-2 border rounded-md mb-3"
        placeholder="Drehzahl (rpm)"
      />
      <input
        type="number"
        value={factor}
        onChange={(e) => setFactor(e.target.value)}
        className="w-full p-2 border rounded-md mb-3"
        placeholder="Faktor"
      />
      <button
        onClick={calculate}
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
      >
        Berechnen
      </button>
      {result && (
        <div className="mt-4 p-3 rounded-md bg-green-100 text-green-800 text-center font-medium">
          Ergebnis: {result}
        </div>
      )}
    </div>
  );
};

export default Organics;
