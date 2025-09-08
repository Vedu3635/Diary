import React from "react";

const ChartCard = ({ title, chartRef, height = "300px", theme }) => (
  <div
    className={`p-6 rounded-xl border ${
      theme === "dark"
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200"
    }`}
  >
    <h3
      className={`text-lg font-semibold mb-4 ${
        theme === "dark" ? "text-white" : "text-gray-900"
      }`}
    >
      {title}
    </h3>
    <div style={{ height, position: "relative" }}>
      <canvas ref={chartRef} />
    </div>
  </div>
);

export default ChartCard;
