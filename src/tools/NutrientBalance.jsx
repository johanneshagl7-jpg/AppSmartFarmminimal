import React, { useState } from "react";

const NutrientBalance = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleCalc = () => {
    setResult(`Eingabe war: ${input}`);
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">NutrientBalance</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 border rounded-md mb-3"
        placeholder="Gib etwas ein..."
      />
      <button
        onClick={handleCalc}
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

export default NutrientBalance;
