import React, { useState, useEffect, useContext } from "react";
import { Search, Plus, Filter, AlertTriangle } from "lucide-react";
import { AppContext } from "../context/AppContext";
import TaskForm from "../components/task/TaskForm";
import TaskList2 from "../components/task/TaskList2";
import { toast } from "react-toastify";
import { DateTime } from "luxon";

const TasksPage = () => {
  const {
    theme,
    tasks,
    createTask,
    updateTask,
    deleteTask,
    error,
    token,
    DateUtils,
  } = useContext(AppContext);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === "Completed") return false;
    return dueDate < DateTime.now().setZone("utc");
  };

  const overdueCount = tasks.filter((task) =>
    isOverdue(task.dueDate, task.status)
  ).length;

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    if (error) toast.error(error, { theme });
  }, [error, theme]);

  useEffect(() => {
    const filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      const today = DateTime.now().startOf("day");

      if (statusFilter === "overdue") {
        matchesStatus = isOverdue(task.dueDate, task.status);
      } else if (statusFilter === "today") {
        matchesStatus =
          task.dueDate && DateUtils.toLocal(task.dueDate).hasSame(today, "day");
      } else if (statusFilter === "thisweek") {
        const weekEnd = today.plus({ days: 7 });
        const due = task.dueDate ? DateUtils.toLocal(task.dueDate) : null;
        matchesStatus = due && due >= today && due <= weekEnd;
      } else if (statusFilter === "noduedate") {
        matchesStatus = !task.dueDate;
      } else if (statusFilter !== "all") {
        matchesStatus = task.status === statusFilter;
      }

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesCategory =
        categoryFilter === "all" || task.category === categoryFilter;
      return (
        matchesSearch && matchesStatus && matchesPriority && matchesCategory
      );
    });

    setFilteredTasks(filtered);
  }, [
    tasks,
    searchTerm,
    statusFilter,
    priorityFilter,
    categoryFilter,
    DateUtils,
  ]);

  const handleCreateTask = () => {
    if (!token) {
      toast.error("Please log in to create tasks.", { theme });
      window.location.href = "/login";
      return;
    }
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task) => {
    if (!token) {
      toast.error("Please log in to edit tasks.", { theme });
      window.location.href = "/login";
      return;
    }
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    if (!token) {
      toast.error("Please log in to save tasks.", { theme });
      window.location.href = "/login";
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
    } catch (err) {
      console.error("Error saving task:", err);
      toast.error("Failed to save task.", { theme });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!token) {
      toast.error("Please log in to delete tasks.", { theme });
      window.location.href = "/login";
      return;
    }
    if (window.confirm("Are you sure you want to delete this task?")) {
      const success = await deleteTask(taskId);
      if (success) {
        toast.success("Task deleted successfully!", { theme });
      }
    }
  };

  const handleToggleStatus = async (taskId) => {
    if (!token) {
      toast.error("Please log in to update task status.", { theme });
      window.location.href = "/login";
      return;
    }
    const task = tasks.find((t) => t._id === taskId);
    const statusOrder = ["To Do", "In Progress", "Completed"];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    await updateTask(taskId, { ...task, status: nextStatus });
    toast.success(`Task status updated to ${nextStatus}!`, { theme });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
  };

  const categories = [
    ...new Set(tasks.map((task) => task.category).filter(Boolean)),
  ];

  return (
    <div
      className={`min-h-screen transition-colors ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto mt-16 px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Tasks
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Manage and track all your tasks
              </p>
              {overdueCount > 0 && (
                <span
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    theme === "dark"
                      ? "bg-red-900/20 text-red-400"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  {overdueCount} overdue
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {overdueCount > 0 && (
              <button
                onClick={() =>
                  setStatusFilter((prev) =>
                    prev === "overdue" ? "all" : "overdue"
                  )
                }
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  statusFilter === "overdue"
                    ? theme === "dark"
                      ? "bg-red-900/20 border-red-500 text-red-400"
                      : "bg-red-50 border-red-200 text-red-700"
                    : theme === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Show Overdue</span>
              </button>
            )}
            <button
              onClick={handleCreateTask}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>
        <div
          className={`${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } rounded-lg border p-6 mb-6`}
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
          {showFilters && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option value="all">All Status</option>
                  <option value="overdue">🚨 Overdue & Critical</option>
                  <option value="today">⚡ Due Today</option>
                  <option value="thisweek">📅 Due This Week</option>
                  <option value="noduedate">📝 No Due Date</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Priority
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                    theme === "dark"
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mb-6">
          <div
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Showing {filteredTasks.length} of {tasks.length} tasks
            {statusFilter === "overdue" && filteredTasks.length > 0 && (
              <span
                className={`ml-2 font-medium ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                (Overdue tasks)
              </span>
            )}
          </div>
        </div>
        <TaskList2
          tasks={filteredTasks} // Pass UTC DateTime objects directly
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
          theme={theme}
          DateUtils={DateUtils}
        />
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          task={editingTask}
          onSave={handleSaveTask}
          theme={theme}
          DateUtils={DateUtils}
        />
      </div>
    </div>
  );
};

export default TasksPage;
