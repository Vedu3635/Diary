// src/components/TasksPage.js
import React, { useState, useEffect, useContext } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit3,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { AppContext } from "../context/AppContext"; // Import AppContext
import TaskForm from "../components/TaskForm"; // Assuming TaskForm is a separate component
import TaskList2 from "../components/TaskList2"; // Assuming TaskList2 is a separate component

// Static tasks data (unchanged)
const staticTasks = [
  {
    id: 1,
    title: "Design new landing page",
    description:
      "Create wireframes and mockups for the company website redesign",
    status: "in-progress",
    priority: "high",
    category: "Design",
    assignee: "Sarah Johnson",
    dueDate: "2025-07-25",
    createdAt: "2025-07-20",
  },
  {
    id: 2,
    title: "Fix authentication bug",
    description: "Resolve login issues reported by multiple users",
    status: "todo",
    priority: "urgent",
    category: "Development",
    assignee: "Mike Chen",
    dueDate: "2025-07-22",
    createdAt: "2025-07-19",
  },
  {
    id: 3,
    title: "Update documentation",
    description: "Review and update API documentation for v2.0 release",
    status: "completed",
    priority: "medium",
    category: "Documentation",
    assignee: "Emily Davis",
    dueDate: "2025-07-21",
    createdAt: "2025-07-18",
  },
  {
    id: 4,
    title: "Conduct user interviews",
    description: "Interview 10 users about the new feature requirements",
    status: "todo",
    priority: "medium",
    category: "Research",
    assignee: "Alex Rodriguez",
    dueDate: "2025-07-28",
    createdAt: "2025-07-20",
  },
  {
    id: 5,
    title: "Setup CI/CD pipeline",
    description: "Configure automated testing and deployment pipeline",
    status: "in-progress",
    priority: "high",
    category: "DevOps",
    assignee: "Jordan Kim",
    dueDate: "2025-07-30",
    createdAt: "2025-07-19",
  },
  {
    id: 6,
    title: "Create marketing campaign",
    description: "Develop social media campaign for product launch",
    status: "todo",
    priority: "low",
    category: "Marketing",
    assignee: "Taylor Brown",
    dueDate: "2025-08-05",
    createdAt: "2025-07-21",
  },
];

// Main TasksPage Component
const TasksPage = () => {
  const { theme } = useContext(AppContext); // Use context to get theme and toggleTheme
  const [tasks, setTasks] = useState(staticTasks);
  const [filteredTasks, setFilteredTasks] = useState(staticTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters (unchanged)
  useEffect(() => {
    let filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesCategory =
        categoryFilter === "all" || task.category === categoryFilter;

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesCategory
      );
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? {
                ...taskData,
                id: editingTask.id,
                createdAt: editingTask.createdAt,
              }
            : task
        )
      );
    } else {
      const newTask = {
        ...taskData,
        id: Math.max(...tasks.map((t) => t.id)) + 1,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTasks((prev) => [...prev, newTask]);
    }
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    }
  };

  const handleToggleStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const statusOrder = ["todo", "in-progress", "completed"];
          const currentIndex = statusOrder.indexOf(task.status);
          const nextStatus =
            statusOrder[(currentIndex + 1) % statusOrder.length];
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Tasks
            </h1>
            <p
              className={`mt-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray600"
              }`}
            >
              Manage and track all your tasks
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateTask}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
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
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4     border-t ${
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
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
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

        {/* Tasks Count */}
        <div className="flex items-center justify-between mb-6">
          <div
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        </div>

        {/* Task List */}
        <TaskList2
          tasks={filteredTasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
          theme={theme}
        />

        {/* Task Form Modal */}
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          task={editingTask}
          onSave={handleSaveTask}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default TasksPage;
