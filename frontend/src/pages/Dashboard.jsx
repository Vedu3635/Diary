import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import TaskList from "../components/TaskList";
import JournalEntry from "../components/JournalEntry";
import GoalTracker from "../components/GoalTracker";
import TaskForm from "../components/TaskForm";
import { staticGoals } from "../data/staticData";

const Dashboard = () => {
  const {
    theme,
    tasks,
    createTask,
    updateTask,
    deleteTask,
    journalEntries,
    token,
    error,
    loading,
    isInitialized,
    isDataFetched,
    fetchData,
  } = useContext(AppContext);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showOverdue, setShowOverdue] = useState(false);
  const navigate = useNavigate();
  const [today] = useState(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
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

  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    if (isNaN(due.getTime())) return false;
    return due.toISOString().split("T")[0] === today;
  });

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "Completed") return false;
    const due = new Date(task.dueDate);
    if (isNaN(due.getTime())) return false;
    const today = new Date();
    return due.toISOString().split("T")[0] < today.toISOString().split("T")[0];
  });

  const recentEntries = journalEntries.slice(0, 2);

  const handleEditTask = (task) => {
    if (!token) {
      toast.error("Please log in to edit tasks.", { theme });
      navigate("/login");
      return;
    }
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    if (!token) {
      toast.error("Please log in to save tasks.", { theme });
      navigate("/login");
      return;
    }
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
        toast.success("Task updated successfully!", { theme });
      } else {
        await createTask(taskData);
        toast.success("Task created successfully!", { theme });
      }
      setIsTaskFormOpen(false);
      setEditingTask(null);
    } catch (err) {
      toast.error("Failed to save task.", { theme });
    }
  };

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
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${themeClasses.title}`}>
              {showOverdue ? "Overdue Tasks" : "Today's Tasks"}
            </h2>
            <button
              onClick={() => setShowOverdue(!showOverdue)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {showOverdue
                ? "Show Today's Tasks"
                : `Show Overdue Tasks (${overdueTasks.length})`}
            </button>
          </div>
          {(showOverdue ? overdueTasks : todayTasks).length === 0 &&
          !loading &&
          isDataFetched ? (
            <p className={themeClasses.text}>
              {showOverdue ? "No overdue tasks." : "No tasks due today."}
            </p>
          ) : (
            <TaskList
              tasks={showOverdue ? overdueTasks : todayTasks}
              overdueCount={overdueTasks.length}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
              onToggleStatus={updateTask}
              theme={theme}
            />
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

        {isTaskFormOpen && (
          <TaskForm
            isOpen={isTaskFormOpen}
            onClose={() => {
              setIsTaskFormOpen(false);
              setEditingTask(null);
            }}
            task={editingTask}
            onSave={handleSaveTask}
            initialData={editingTask}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
