import React from "react";
import { TrendingUp } from "lucide-react";

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  trend = "up",
  theme,
}) => (
  <div
    className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
      theme === "dark"
        ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
        : "bg-white border-gray-200 hover:bg-gray-50"
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p
          className={`text-sm font-medium ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-3xl font-bold mt-2 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </p>
        <p
          className={`text-sm mt-1 flex items-center ${
            trend === "up" ? "text-green-500" : "text-red-500"
          }`}
        >
          <TrendingUp
            className={`w-4 h-4 mr-1 ${trend === "down" ? "rotate-180" : ""}`}
          />
          {change}
        </p>
      </div>
      <Icon
        className={`w-8 h-8 ${
          theme === "dark" ? "text-blue-400" : "text-blue-500"
        }`}
      />
    </div>
  </div>
);

export default StatCard;
