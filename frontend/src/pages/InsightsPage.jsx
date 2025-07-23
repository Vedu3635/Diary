import React, { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import {
  BarChart3,
  TrendingUp,
  Target,
  BookOpen,
  Calendar,
  Brain,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Chart from "chart.js/auto"; // This automatically registers all components

const InsightsPage = () => {
  const { theme } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedCards, setExpandedCards] = useState({});

  // Chart refs
  const productivityChartRef = useRef(null);
  const goalProgressChartRef = useRef(null);
  const moodTrendChartRef = useRef(null);
  const tasksChartRef = useRef(null);

  // Sample data - in real app, this would come from your data store
  const sampleData = {
    productivity: [65, 72, 58, 85, 91, 78, 82],
    goalProgress: [20, 35, 50, 65, 75, 85, 92],
    moodScores: [7, 6, 8, 7, 9, 6, 8],
    taskCompletion: [12, 15, 8, 20, 18, 22, 16],
    weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  };

  const aiInsights = [
    {
      type: "productivity",
      title: "Peak Performance Pattern",
      insight:
        "Your productivity peaks on Fridays (91%) and drops midweek. Consider scheduling important tasks for Thursday-Friday.",
      confidence: 85,
    },
    {
      type: "goals",
      title: "Goal Achievement Trend",
      insight:
        "You're on track to exceed your monthly goal by 15%. Your consistent daily progress is paying off.",
      confidence: 92,
    },
    {
      type: "mood",
      title: "Emotional Wellness",
      insight:
        "Your mood correlates positively with task completion. Physical activities seem to boost your overall satisfaction.",
      confidence: 78,
    },
  ];

  // Chart configuration based on theme
  const getChartConfig = (type, data, labels) => {
    const isDark = theme === "dark";
    const primaryColor = isDark ? "rgb(59, 130, 246)" : "rgb(37, 99, 235)";
    const secondaryColor = isDark ? "rgb(16, 185, 129)" : "rgb(5, 150, 105)";
    const textColor = isDark ? "rgb(229, 231, 235)" : "rgb(55, 65, 81)";
    const gridColor = isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)";

    const baseConfig = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
        y: {
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
      },
    };

    switch (type) {
      case "line":
        return {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "Progress",
                data,
                borderColor: primaryColor,
                backgroundColor: primaryColor + "20",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: baseConfig,
        };
      case "bar":
        return {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Completion",
                data,
                backgroundColor: primaryColor,
                borderColor: primaryColor,
                borderWidth: 1,
              },
            ],
          },
          options: baseConfig,
        };
      case "doughnut":
        return {
          type: "doughnut",
          data: {
            labels: ["Completed", "In Progress", "Pending"],
            datasets: [
              {
                data: [65, 25, 10],
                backgroundColor: [
                  secondaryColor,
                  primaryColor,
                  isDark ? "rgb(107, 114, 128)" : "rgb(156, 163, 175)",
                ],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { color: textColor },
              },
            },
          },
        };
      default:
        return baseConfig;
    }
  };

  // Initialize charts
  const initCharts = () => {
    // Destroy existing charts first
    destroyCharts();

    // Productivity Chart (Line)
    if (productivityChartRef.current) {
      const ctx = productivityChartRef.current.getContext("2d");
      productivityChart.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: sampleData.weekDays,
          datasets: [
            {
              label: "Productivity",
              data: sampleData.productivity,
              borderColor:
                theme === "dark" ? "rgb(59, 130, 246)" : "rgb(37, 99, 235)",
              backgroundColor:
                theme === "dark"
                  ? "rgba(59, 130, 246, 0.2)"
                  : "rgba(37, 99, 235, 0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: getChartOptions(),
      });
    }

    // Goal Progress Chart (Line)
    if (goalProgressChartRef.current) {
      const ctx = goalProgressChartRef.current.getContext("2d");
      goalProgressChart.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: sampleData.weekDays,
          datasets: [
            {
              label: "Goal Progress",
              data: sampleData.goalProgress,
              borderColor:
                theme === "dark" ? "rgb(16, 185, 129)" : "rgb(5, 150, 105)",
              backgroundColor:
                theme === "dark"
                  ? "rgba(16, 185, 129, 0.2)"
                  : "rgba(5, 150, 105, 0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: getChartOptions(),
      });
    }

    // Mood Trend Chart (Bar)
    if (moodTrendChartRef.current) {
      const ctx = moodTrendChartRef.current.getContext("2d");
      moodTrendChart.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: sampleData.weekDays,
          datasets: [
            {
              label: "Mood Score",
              data: sampleData.moodScores,
              backgroundColor:
                theme === "dark"
                  ? "rgba(167, 139, 250, 0.7)"
                  : "rgba(139, 92, 246, 0.7)",
              borderColor:
                theme === "dark" ? "rgb(167, 139, 250)" : "rgb(139, 92, 246)",
              borderWidth: 1,
            },
          ],
        },
        options: getChartOptions(),
      });
    }

    // Tasks Chart (Doughnut)
    if (tasksChartRef.current) {
      const ctx = tasksChartRef.current.getContext("2d");
      tasksChart.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Completed", "In Progress", "Pending"],
          datasets: [
            {
              data: [65, 25, 10],
              backgroundColor: [
                theme === "dark" ? "rgb(16, 185, 129)" : "rgb(5, 150, 105)",
                theme === "dark" ? "rgb(59, 130, 246)" : "rgb(37, 99, 235)",
                theme === "dark" ? "rgb(107, 114, 128)" : "rgb(156, 163, 175)",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color:
                  theme === "dark" ? "rgb(229, 231, 235)" : "rgb(55, 65, 81)",
              },
            },
          },
        },
      });
    }
  };

  // Destroy all charts
  const destroyCharts = () => {
    [
      productivityChartRef,
      goalProgressChartRef,
      moodTrendChartRef,
      tasksChartRef,
    ].forEach((ref) => {
      if (ref.current?.chart) {
        ref.current.chart.destroy();
        ref.current.chart = null;
      }
    });
  };

  // Common chart options
  const getChartOptions = () => {
    const isDark = theme === "dark";
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: isDark ? "rgb(229, 231, 235)" : "rgb(55, 65, 81)",
          },
        },
      },
      scales: {
        x: {
          ticks: { color: isDark ? "rgb(229, 231, 235)" : "rgb(55, 65, 81)" },
          grid: { color: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)" },
        },
        y: {
          ticks: { color: isDark ? "rgb(229, 231, 235)" : "rgb(55, 65, 81)" },
          grid: { color: isDark ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)" },
        },
      },
    };
  };
  // Initialize charts
  useEffect(() => {
    destroyCharts(); // Destroy existing charts before initializing new ones

    initializeChart(
      productivityChartRef,
      "line",
      sampleData.productivity,
      sampleData.weekDays
    );
    initializeChart(
      goalProgressChartRef,
      "line",
      sampleData.goalProgress,
      sampleData.weekDays
    );
    initializeChart(
      moodTrendChartRef,
      "bar",
      sampleData.moodScores,
      sampleData.weekDays
    );
    initializeChart(
      tasksChartRef,
      "doughnut",
      [65, 25, 10],
      ["Completed", "In Progress", "Pending"]
    );

    return () => {
      destroyCharts();
    };
  }, [theme]);

  // Helper function to initialize charts
  const initializeChart = (ref, type, data, labels) => {
    if (!ref.current) return;

    try {
      if (ref.current.chart) {
        ref.current.chart.destroy();
      }

      const ctx = ref.current.getContext("2d");
      ref.current.chart = new Chart(ctx, getChartConfig(type, data, labels));
    } catch (error) {
      console.error(`Failed to initialize ${type} chart:`, error);
    }
  };

  const toggleCardExpansion = (cardId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const StatCard = ({ title, value, change, icon: Icon, trend = "up" }) => (
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

  const InsightCard = ({ insight, index }) => {
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

  const ChartCard = ({ title, chartRef, height = "300px" }) => (
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

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-200${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto mt-16">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-4xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Insights
          </h1>
          <p
            className={`text-lg ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            AI-powered analytics for your productivity, goals, and well-being
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "goals", label: "Goals", icon: Target },
              { id: "journal", label: "Journal", icon: BookOpen },
              { id: "trends", label: "Trends", icon: TrendingUp },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === id
                    ? theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Weekly Productivity"
                value="78%"
                change="+12% from last week"
                icon={TrendingUp}
                trend="up"
              />
              <StatCard
                title="Goals Completed"
                value="24"
                change="+3 this week"
                icon={Target}
                trend="up"
              />
              <StatCard
                title="Journal Entries"
                value="18"
                change="+5 this week"
                icon={BookOpen}
                trend="up"
              />
              <StatCard
                title="Avg. Mood Score"
                value="7.3"
                change="+0.4 this week"
                icon={Calendar}
                trend="up"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Weekly Productivity Trend"
                chartRef={productivityChartRef}
              />
              <ChartCard
                title="Goal Progress"
                chartRef={goalProgressChartRef}
              />
              <ChartCard title="Mood Trends" chartRef={moodTrendChartRef} />
              <ChartCard
                title="Task Distribution"
                chartRef={tasksChartRef}
                height="250px"
              />
            </div>

            {/* AI Insights */}
            <div>
              <h2
                className={`text-2xl font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                AI-Powered Insights
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {aiInsights.map((insight, index) => (
                  <InsightCard key={index} insight={insight} index={index} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "goals" && (
          <div
            className={`text-center py-16 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              Goal Analytics Coming Soon
            </h3>
            <p>
              Detailed goal tracking and progress visualization will be
              available here.
            </p>
          </div>
        )}

        {activeTab === "journal" && (
          <div
            className={`text-center py-16 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              Journal Insights Coming Soon
            </h3>
            <p>
              Sentiment analysis and writing pattern insights will be available
              here.
            </p>
          </div>
        )}

        {activeTab === "trends" && (
          <div
            className={`text-center py-16 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              Advanced Trends Coming Soon
            </h3>
            <p>
              Long-term trend analysis and predictive insights will be available
              here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPage;
