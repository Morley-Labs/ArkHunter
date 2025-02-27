import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/tailwind.css";
import SimulationApp from "./components/SimulationApp";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SimulationApp />
  </React.StrictMode>
);
