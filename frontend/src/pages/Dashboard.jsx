import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import TaskList from "../components/TaskList";
import JournalEntry from "../components/JournalEntry";
import GoalTracker from "../components/GoalTracker";
import { staticGoals } from "../data/staticData";

const Dashboard = () => {
  const {
    theme,
    tasks,
    journalEntries,
    token,
    error,
    loading,
    isInitialized,
    isDataFetched,
    fetchData,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [today] = useState(() => {
    const date = new Date();
    return date.toISOString().split("T")[0]; // e.g., "2025-09-01"
  });

  useEffect(() => {
    if (
      isInitialized &&
      (!token ||
        error?.includes("Please log in") ||
        error?.includes("Session expired"))
    ) {
      toast.error(error || "Please log in to access the dashboard.", { theme });
      navigate("/login");
    }
  }, [token, error, isInitialized, navigate, theme]);

  useEffect(() => {
    if (
      error &&
      !error.includes("Please log in") &&
      !error.includes("Session expired")
    ) {
      toast.error(error, { theme });
    }
  }, [error, theme]);

  useEffect(() => {
    if (isInitialized && token && !isDataFetched) {
      fetchData();
    }
  }, [isInitialized, token, isDataFetched, fetchData]);

  // Filter tasks for today
  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    if (isNaN(due.getTime())) return false; // Invalid date
    return due.toISOString().split("T")[0] === today;
  });

  // Calculate overdue count from all tasks
  const overdueCount = tasks.filter((task) => {
    if (!task.dueDate || task.status === "Completed") return false;
    const due = new Date(task.dueDate);
    if (isNaN(due.getTime())) return false;
    const today = new Date();
    const dueDateStr = due.toISOString().split("T")[0];
    const todayStr = today.toISOString().split("T")[0];
    return dueDateStr < todayStr;
  }).length;

  const recentEntries = journalEntries.slice(0, 2);

  useEffect(() => {
    console.log("Dashboard: Data updated", {
      todayTasks: todayTasks.map((t) => ({
        _id: t._id,
        title: t.title,
        dueDate: t.dueDate,
        status: t.status,
      })),
      recentEntries: recentEntries.length,
      staticGoalsCount: staticGoals.length,
      tasks,
      journalEntries: journalEntries.map((entry) => ({
        _id: entry._id,
        title: entry.title,
        date: entry.date,
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags,
      })),

      isDataFetched,
      loading,
      error,
    });
  }, [todayTasks, recentEntries, isDataFetched, loading, error]);

  const themeClasses = {
    container:
      theme === "dark"
        ? "bg-gray-900 text-white min-h-screen"
        : "bg-gray-50 text-gray-900 min-h-screen",
    card: theme === "dark" ? "bg-gray-800 shadow-md" : "bg-white shadow-md",
    title: theme === "dark" ? "text-white" : "text-gray-900",
    subtitle: theme === "dark" ? "text-gray-200" : "text-gray-800",
    text: theme === "dark" ? "text-gray-400" : "text-gray-600",
  };

  return (
    <div className={themeClasses.container}>
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16 space-y-6">
        {loading && (
          <div className="text-center py-4">
            <p className={themeClasses.text}>Loading data, please wait...</p>
          </div>
        )}
        {error && (
          <div
            className={`p-4 mb-4 rounded-lg ${
              theme === "dark"
                ? "bg-red-900 text-red-200"
                : "bg-red-100 text-red-800"
            }`}
          >
            {error}
          </div>
        )}
        {!loading &&
          isDataFetched &&
          tasks.length === 0 &&
          journalEntries.length === 0 &&
          staticGoals.length === 0 && (
            <div className="text-center py-4">
              <p className={themeClasses.text}>
                No data available. Start by adding tasks or journal entries!
              </p>
            </div>
          )}

        <section className={`p-6 rounded-lg ${themeClasses.card}`}>
          <h2 className={`text-xl font-semibold mb-4 ${themeClasses.title}`}>
            Today's Tasks
          </h2>
          {todayTasks.length === 0 && !loading && isDataFetched ? (
            <p className={themeClasses.text}>No tasks due today.</p>
          ) : (
            <TaskList tasks={todayTasks} overdueCount={overdueCount} />
          )}
        </section>

        <section className={`p-6 rounded-lg ${themeClasses.card}`}>
          <h2 className={`text-xl font-semibold mb-4 ${themeClasses.title}`}>
            Quick Journal Entry
          </h2>
          <JournalEntry isQuickAdd={true} />
        </section>

        <section className={`p-6 rounded-lg ${themeClasses.card}`}>
          <h2 className={`text-xl font-semibold mb-4 ${themeClasses.title}`}>
            Goals & Habits
          </h2>
          {staticGoals.length === 0 ? (
            <p className={themeClasses.text}>No goals available.</p>
          ) : (
            <GoalTracker goals={staticGoals} />
          )}
        </section>

        <section className={`p-6 rounded-lg ${themeClasses.card}`}>
          <h2 className={`text-xl font-semibold mb-4 ${themeClasses.title}`}>
            Recent Entries
          </h2>
          {recentEntries.length === 0 && !loading && isDataFetched ? (
            <p className={themeClasses.text}>No recent journal entries.</p>
          ) : (
            recentEntries.map((entry, index) => (
              <div key={entry._id || `journal-${index}`} className="mb-4">
                <p className={`font-medium ${themeClasses.subtitle}`}>
                  {(entry.date || "").split("T")[0] || "Unknown Date"}:{" "}
                  {entry.content
                    ? entry.content.substring(0, 50) + "..."
                    : "No content"}
                </p>
                <p className={`text-sm ${themeClasses.text}`}>
                  Mood: {entry.mood || "Unknown"} | Tags:{" "}
                  {(entry.tags || []).join(", ") || "None"}
                </p>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
