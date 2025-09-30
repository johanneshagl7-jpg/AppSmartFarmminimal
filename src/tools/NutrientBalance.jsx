
import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const NutrientBalance = () => {
  const [nInput, setNInput] = useState("");
  const [pInput, setPInput] = useState("");
  const [kInput, setKInput] = useState("");
  const [nOutput, setNOutput] = useState("");
  const [pOutput, setPOutput] = useState("");
  const [kOutput, setKOutput] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const nBal = parseFloat(nInput || 0) - parseFloat(nOutput || 0);
    const pBal = parseFloat(pInput || 0) - parseFloat(pOutput || 0);
    const kBal = parseFloat(kInput || 0) - parseFloat(kOutput || 0);
    setResult([
      { name: "N", Wert: nBal },
      { name: "P", Wert: pBal },
      { name: "K", Wert: kBal },
    ]);
  };

  return (
    <div className="max-w-lg mx-auto p-6 rounded-2xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">🌾 Nährstoffbilanz</h2>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className="p-2 border rounded-md" placeholder="N Zufuhr (kg/ha)" />
        <input type="number" value={nOutput} onChange={(e) => setNOutput(e.target.value)} className="p-2 border rounded-md" placeholder="N Entzug (kg/ha)" />
        <input type="number" value={pInput} onChange={(e) => setPInput(e.target.value)} className="p-2 border rounded-md" placeholder="P Zufuhr (kg/ha)" />
        <input type="number" value={pOutput} onChange={(e) => setPOutput(e.target.value)} className="p-2 border rounded-md" placeholder="P Entzug (kg/ha)" />
        <input type="number" value={kInput} onChange={(e) => setKInput(e.target.value)} className="p-2 border rounded-md" placeholder="K Zufuhr (kg/ha)" />
        <input type="number" value={kOutput} onChange={(e) => setKOutput(e.target.value)} className="p-2 border rounded-md" placeholder="K Entzug (kg/ha)" />
      </div>
      <button onClick={calculate} className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">Bilanz berechnen</button>
      {result && (
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={result}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Wert" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default NutrientBalance;
