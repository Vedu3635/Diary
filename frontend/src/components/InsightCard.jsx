import React from "react";
import { Brain, ChevronUp, ChevronDown } from "lucide-react";

const InsightCard = ({
  insight,
  index,
  expandedCards,
  toggleCardExpansion,
  theme,
}) => {
  const isExpanded = expandedCards[`insight-${index}`];

  return (
    <div
      className={`p-6 rounded-xl border transition-all duration-200 ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <Brain
            className={`w-5 h-5 mr-3 ${
              theme === "dark" ? "text-purple-400" : "text-purple-500"
            }`}
          />
          <h3
            className={`font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {insight.title}
          </h3>
        </div>
        <button
          onClick={() => toggleCardExpansion(`insight-${index}`)}
          className={`p-1 rounded-full transition-colors ${
            theme === "dark"
              ? "hover:bg-gray-700 text-gray-400"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      <p
        className={`text-sm mb-3 ${
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {insight.insight}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span
            className={`text-xs font-medium ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Confidence:
          </span>
          <div
            className={`ml-2 flex-1 bg-gray-200 rounded-full h-2 w-16 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${insight.confidence}%` }}
            />
          </div>
          <span
            className={`ml-2 text-xs font-semibold ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {insight.confidence}%
          </span>
        </div>
      </div>

      {isExpanded && (
        <div
          className={`mt-4 pt-4 border-t ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h4
            className={`font-medium mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Recommendations:
          </h4>
          <ul
            className={`text-sm space-y-1 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <li>
              • Schedule important tasks during your peak performance hours
            </li>
            <li>• Consider implementing midweek motivation strategies</li>
            <li>• Track correlation between activities and mood patterns</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default InsightCard;
