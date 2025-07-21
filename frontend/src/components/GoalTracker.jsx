import React, { useState } from "react";

const GoalTracker = ({
  goals = [],
  isCompact = false,
  showActions = true,
  theme = "light",
}) => {
  const [goalList, setGoalList] = useState(goals);

  // Default goals if none provided
  const defaultGoals = [
    {
      id: 1,
      name: "Daily Exercise",
      type: "habit",
      progress: 5,
      target: 7,
      unit: "days",
      category: "Health",
      streak: 3,
      lastUpdated: "2025-07-21",
    },
    {
      id: 2,
      name: "Read 12 Books This Year",
      type: "goal",
      progress: 8,
      target: 12,
      unit: "books",
      category: "Learning",
      deadline: "2025-12-31",
    },
    {
      id: 3,
      name: "Meditation Practice",
      type: "habit",
      progress: 15,
      target: 21,
      unit: "sessions",
      category: "Wellness",
      streak: 7,
      lastUpdated: "2025-07-21",
    },
    {
      id: 4,
      name: "Save $5000",
      type: "goal",
      progress: 3200,
      target: 5000,
      unit: "$",
      category: "Finance",
      deadline: "2025-09-30",
    },
    {
      id: 5,
      name: "Drink 8 Glasses of Water",
      type: "habit",
      progress: 6,
      target: 8,
      unit: "glasses",
      category: "Health",
      streak: 1,
      lastUpdated: "2025-07-21",
    },
  ];

  const currentGoals = goalList.length > 0 ? goalList : defaultGoals;

  const calculateProgress = (progress, target) => {
    return Math.min((progress / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100)
      return theme === "dark" ? "bg-green-500" : "bg-green-600";
    if (percentage >= 75)
      return theme === "dark" ? "bg-blue-500" : "bg-blue-600";
    if (percentage >= 50)
      return theme === "dark" ? "bg-yellow-500" : "bg-yellow-600";
    if (percentage >= 25)
      return theme === "dark" ? "bg-orange-500" : "bg-orange-600";
    return theme === "dark" ? "bg-red-500" : "bg-red-600";
  };

  const getCategoryColor = (category) => {
    const colors = {
      Health:
        theme === "dark"
          ? "text-green-400 bg-green-900/20"
          : "text-green-600 bg-green-100",
      Learning:
        theme === "dark"
          ? "text-blue-400 bg-blue-900/20"
          : "text-blue-600 bg-blue-100",
      Wellness:
        theme === "dark"
          ? "text-purple-400 bg-purple-900/20"
          : "text-purple-600 bg-purple-100",
      Finance:
        theme === "dark"
          ? "text-yellow-400 bg-yellow-900/20"
          : "text-yellow-600 bg-yellow-100",
      Work:
        theme === "dark"
          ? "text-red-400 bg-red-900/20"
          : "text-red-600 bg-red-100",
    };
    return colors[category] || colors.Health;
  };

  const updateProgress = (goalId, increment = 1) => {
    setGoalList((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const newProgress = Math.min(goal.progress + increment, goal.target);
          const isHabit = goal.type === "habit";
          return {
            ...goal,
            progress: newProgress,
            ...(isHabit && {
              streak:
                newProgress > goal.progress
                  ? (goal.streak || 0) + 1
                  : goal.streak,
              lastUpdated: new Date().toISOString().split("T")[0],
            }),
          };
        }
        return goal;
      })
    );
  };

  const formatValue = (value, unit) => {
    if (unit === "$") return `$${value.toLocaleString()}`;
    if (unit === "days" && value === 1) return "1 day";
    if (unit === "books" && value === 1) return "1 book";
    if (unit === "sessions" && value === 1) return "1 session";
    if (unit === "glasses" && value === 1) return "1 glass";
    return `${value} ${unit}`;
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const themeClasses = {
    container:
      theme === "dark"
        ? "bg-gray-800 border-gray-700 text-white"
        : "bg-white border-gray-200 text-gray-900",
    goalItem:
      theme === "dark"
        ? "bg-gray-700 border-gray-600"
        : "bg-gray-50 border-gray-200",
    progressBg: theme === "dark" ? "bg-gray-600" : "bg-gray-200",
    button:
      theme === "dark"
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white",
    text: theme === "dark" ? "text-gray-300" : "text-gray-600",
  };

  if (isCompact) {
    return (
      <div className={`rounded-lg border ${themeClasses.container} p-4`}>
        <h3
          className={`text-lg font-semibold mb-4 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Goal Progress
        </h3>
        <div className="space-y-3">
          {currentGoals.slice(0, 3).map((goal) => {
            const percentage = calculateProgress(goal.progress, goal.target);
            return (
              <div key={goal.id} className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {goal.name}
                    </span>
                    <span className={`text-xs ${themeClasses.text}`}>
                      {formatValue(goal.progress, goal.unit)} /{" "}
                      {formatValue(goal.target, goal.unit)}
                    </span>
                  </div>
                  <div
                    className={`w-full h-2 rounded-full ${themeClasses.progressBg}`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getProgressColor(
                        percentage
                      )}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${themeClasses.container} p-6`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2
            className={`text-xl font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Goals & Habits
          </h2>
          <p className={`text-sm ${themeClasses.text}`}>
            Track your progress and build lasting habits
          </p>
        </div>
        <div className={`text-sm ${themeClasses.text}`}>
          {
            currentGoals.filter(
              (g) => calculateProgress(g.progress, g.target) >= 100
            ).length
          }{" "}
          of {currentGoals.length} completed
        </div>
      </div>

      <div className="grid gap-4">
        {currentGoals.map((goal) => {
          const percentage = calculateProgress(goal.progress, goal.target);
          const daysUntilDeadline = getDaysUntilDeadline(goal.deadline);
          const isCompleted = percentage >= 100;
          const isOverdue =
            daysUntilDeadline !== null && daysUntilDeadline < 0 && !isCompleted;

          return (
            <div
              key={goal.id}
              className={`p-4 rounded-lg border ${themeClasses.goalItem} ${
                isCompleted ? "ring-2 ring-green-500" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3
                      className={`font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } ${isCompleted ? "text-green-500" : ""}`}
                    >
                      {goal.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        goal.category
                      )}`}
                    >
                      {goal.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        goal.type === "habit"
                          ? theme === "dark"
                            ? "bg-purple-900/20 text-purple-400"
                            : "bg-purple-100 text-purple-600"
                          : theme === "dark"
                          ? "bg-blue-900/20 text-blue-400"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {goal.type === "habit" ? "Habit" : "Goal"}
                    </span>
                  </div>

                  <div className={`text-sm ${themeClasses.text}`}>
                    {formatValue(goal.progress, goal.unit)} of{" "}
                    {formatValue(goal.target, goal.unit)}
                    {goal.type === "habit" && goal.streak && (
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${
                          theme === "dark"
                            ? "bg-orange-900/20 text-orange-400"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        🔥 {goal.streak} day streak
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${
                      isCompleted
                        ? "text-green-500"
                        : theme === "dark"
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {Math.round(percentage)}%
                  </div>
                  {goal.deadline && (
                    <div
                      className={`text-xs ${
                        isOverdue
                          ? "text-red-500"
                          : daysUntilDeadline !== null && daysUntilDeadline <= 7
                          ? "text-yellow-500"
                          : themeClasses.text
                      }`}
                    >
                      {daysUntilDeadline !== null && (
                        <>
                          {daysUntilDeadline < 0
                            ? `${Math.abs(daysUntilDeadline)} days overdue`
                            : daysUntilDeadline === 0
                            ? "Due today"
                            : `${daysUntilDeadline} days left`}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className={`w-full h-3 rounded-full ${themeClasses.progressBg} mb-3`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                    percentage
                  )}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Action Buttons */}
              {showActions && !isCompleted && (
                <div className="flex justify-between items-center">
                  <div className={`text-xs ${themeClasses.text}`}>
                    {goal.type === "habit" && goal.lastUpdated && (
                      <span>
                        Last updated:{" "}
                        {new Date(goal.lastUpdated).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {goal.type === "habit" && (
                      <button
                        onClick={() => updateProgress(goal.id, 1)}
                        className={`px-3 py-1 rounded text-xs font-medium ${themeClasses.button} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        Mark Complete
                      </button>
                    )}
                    {goal.type === "goal" && goal.unit !== "$" && (
                      <button
                        onClick={() => updateProgress(goal.id, 1)}
                        className={`px-3 py-1 rounded text-xs font-medium ${themeClasses.button} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        +1 {goal.unit.slice(0, -1)}
                      </button>
                    )}
                    {goal.type === "goal" && goal.unit === "$" && (
                      <button
                        onClick={() => updateProgress(goal.id, 100)}
                        className={`px-3 py-1 rounded text-xs font-medium ${themeClasses.button} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        +$100
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Completion Badge */}
              {isCompleted && (
                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-2 text-green-500">
                    <span className="text-xl">🎉</span>
                    <span className="font-medium">Completed!</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div
        className={`mt-6 pt-4 border-t ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {
                currentGoals.filter(
                  (g) => calculateProgress(g.progress, g.target) >= 100
                ).length
              }
            </div>
            <div className={`text-xs ${themeClasses.text}`}>Completed</div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {currentGoals.filter((g) => g.type === "habit").length}
            </div>
            <div className={`text-xs ${themeClasses.text}`}>Active Habits</div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {Math.round(
                currentGoals.reduce(
                  (acc, goal) =>
                    acc + calculateProgress(goal.progress, goal.target),
                  0
                ) / currentGoals.length
              )}
              %
            </div>
            <div className={`text-xs ${themeClasses.text}`}>Avg Progress</div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {Math.max(
                ...currentGoals
                  .filter((g) => g.streak)
                  .map((g) => g.streak || 0),
                0
              )}
            </div>
            <div className={`text-xs ${themeClasses.text}`}>Best Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;
