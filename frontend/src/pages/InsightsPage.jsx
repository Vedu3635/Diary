import React, { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import Chart from "chart.js/auto";
import NavTab from "../components/NavTab";
import StatCard from "../components/StatCard";
import InsightCard from "../components/InsightCard";
import ChartCard from "../components/ChartCard";
import {
  BarChart3,
  TrendingUp,
  Target,
  BookOpen,
  Calendar,
} from "lucide-react";

const InsightsPage = () => {
  const { theme } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedCards, setExpandedCards] = useState({});

  // Chart refs
  const productivityChartRef = useRef(null);
  const goalProgressChartRef = useRef(null);
  const moodTrendChartRef = useRef(null);
  const tasksChartRef = useRef(null);

  // Sample data
  const sampleData = {
    productivity: [65, 72, 58, 85, 91, 78, 82],
    goalProgress: [20, 35, 50, 65, 75, 85, 92],
    moodScores: [7, 6, 8, 7, 9, 6, 8],
    taskCompletion: [12, 15, 8, 20, 18, 22, 16],
    weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  };

  // AI Insights data
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

  // Chart configuration
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

  // Initialize charts
  useEffect(() => {
    destroyCharts();

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

  // Toggle card expansion
  const toggleCardExpansion = (cardId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-200 ${
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
            ].map(({ id, label, icon }) => (
              <NavTab
                key={id}
                id={id}
                label={label}
                icon={icon}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                theme={theme}
              />
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
                theme={theme}
              />
              <StatCard
                title="Goals Completed"
                value="24"
                change="+3 this week"
                icon={Target}
                trend="up"
                theme={theme}
              />
              <StatCard
                title="Journal Entries"
                value="18"
                change="+5 this week"
                icon={BookOpen}
                trend="up"
                theme={theme}
              />
              <StatCard
                title="Avg. Mood Score"
                value="7.3"
                change="+0.4 this week"
                icon={Calendar}
                trend="up"
                theme={theme}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Weekly Productivity Trend"
                chartRef={productivityChartRef}
                theme={theme}
              />
              <ChartCard
                title="Goal Progress"
                chartRef={goalProgressChartRef}
                theme={theme}
              />
              <ChartCard
                title="Mood Trends"
                chartRef={moodTrendChartRef}
                theme={theme}
              />
              <ChartCard
                title="Task Distribution"
                chartRef={tasksChartRef}
                height="250px"
                theme={theme}
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
                  <InsightCard
                    key={index}
                    insight={insight}
                    index={index}
                    expandedCards={expandedCards}
                    toggleCardExpansion={toggleCardExpansion}
                    theme={theme}
                  />
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
