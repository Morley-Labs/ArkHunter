import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Default Cardano Parameters
const DEFAULTS = {
  maxTxSize: 16384,
  minFeeA: 44,
  minFeeB: 155381,
  maxBlockSize: 65536,
  collateralPercentage: 150,
  mempoolCapacity: 50000,
  networkDelay: 1.0,
};

const SimulationApp = () => {
  const [params, setParams] = useState({ ...DEFAULTS });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    Object.keys(params).forEach((key) => {
      localStorage.setItem(key, params[key]);
    });
    setChartData(calculateSimulation(params));
  }, [params]);

  const resetToDefault = (param) => {
    setParams((prev) => ({ ...prev, [param]: DEFAULTS[param] }));
  };

  const calculateSimulation = (updatedParams) => {
    return Array.from({ length: 10 }, (_, i) => ({
      epoch: i,
      throughput: Math.max(10, (updatedParams.maxTxSize / 16000) * (100 - updatedParams.minFeeA)),
      blockUtilization: Math.min(100, (updatedParams.maxTxSize / updatedParams.maxBlockSize) * 100),
      adjustedFees: (updatedParams.minFeeA + updatedParams.minFeeB) * (updatedParams.collateralPercentage / 100) * 5,
      avgTxFees: (updatedParams.minFeeA + updatedParams.minFeeB) * (1 + (updatedParams.maxTxSize / updatedParams.maxBlockSize)) * 10,
      mempoolSize: Math.min(updatedParams.mempoolCapacity, Math.log1p((updatedParams.maxTxSize * 10) - updatedParams.maxBlockSize) * 100),
      blockTime: (0.2 + (updatedParams.maxBlockSize / 50000) + updatedParams.networkDelay) * 20,
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-black text-orange-400 p-6 overflow-hidden relative">
      <h1 className="text-2xl font-bold mb-4">Cardano Parameter Simulator</h1>
      
      {/* Logo */}
      <img src="https://raw.githubusercontent.com/Morley-Labs/morley-docs/refs/heads/main/branding/ArkHunter.png" 
           alt="ArkHunter Logo" 
           className="absolute top-4 right-4 w-40" />
      
      <div className="flex gap-6 flex-grow">
        <div className="w-1/3 overflow-y-auto pr-4">
          {Object.keys(DEFAULTS).map((key) => (
            <div key={key} className="mb-4">
              <label className="block">{key.replace(/([A-Z])/g, ' $1').trim()} ({params[key]})</label>
              <input type="range" min={DEFAULTS[key] * 0.5} max={DEFAULTS[key] * 1.5} step={1} value={params[key]} onChange={(e) => setParams((prev) => ({ ...prev, [key]: Number(e.target.value) }))} className="w-full accent-orange-500" />
              <button onClick={() => resetToDefault(key)} className="bg-orange-500 text-black px-2 py-1 mt-1">Reset</button>
            </div>
          ))}
        </div>
        
        <div className="flex-grow flex justify-center items-center pb-6">
          <ResponsiveContainer width="95%" height={500}>
            <LineChart data={chartData} margin={{ top: 40, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ff8800" />
              <XAxis dataKey="epoch" stroke="#ff8800" />
              <YAxis stroke="#ff8800" domain={[0, "auto"]} />
              <Tooltip
                wrapperStyle={{ backgroundColor: "#000", color: "#ff8800", border: "1px solid #ff8800", fontSize: "14px", padding: "6px" }}
                contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.85)", color: "#fff" }}
                labelStyle={{ color: "#ff8800" }}
                formatter={(value, name) => [value.toFixed(2), name.replace(/([A-Z])/g, ' $1').trim()]}
              />
              <Legend />
              <Line type="monotone" dataKey="throughput" stroke="#ff8800" strokeWidth={2} name="Throughput (TXs/s)" />
              <Line type="monotone" dataKey="blockUtilization" stroke="#ff4400" strokeWidth={2} name="Block Utilization (%)" />
              <Line type="monotone" dataKey="adjustedFees" stroke="#44ff00" strokeWidth={2} name="Adjusted Fees (lovelace)" />
              <Line type="monotone" dataKey="avgTxFees" stroke="#0099ff" strokeWidth={2} name="Avg Tx Fees (lovelace)" />
              <Line type="monotone" dataKey="mempoolSize" stroke="#ff00ff" strokeWidth={2} name="Mempool Size (TXs)" />
              <Line type="monotone" dataKey="blockTime" stroke="#ffff00" strokeWidth={2} name="Block Time (seconds)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SimulationApp;
