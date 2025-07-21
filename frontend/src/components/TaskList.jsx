import React, { useState, useEffect } from "react";
import { Check, Calendar, Flag, Tag } from "lucide-react";

const TaskList = ({ tasks = [] }) => {
  const [taskList, setTaskList] = useState(tasks);
  const [filter, setFilter] = useState({
    status: "all",
    priority: "all",
    category: "all",
  });

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const toggleTaskCompletion = (taskId) => {
    setTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = taskList.filter((task) => {
    const statusMatch =
      filter.status === "all" ||
      (filter.status === "completed" && task.completed) ||
      (filter.status === "pending" && !task.completed);

    const priorityMatch =
      filter.priority === "all" || task.priority === filter.priority;
    const categoryMatch =
      filter.category === "all" || task.category === filter.category;

    return statusMatch && priorityMatch && categoryMatch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-500 dark:text-red-400";
      case "Medium":
        return "text-yellow-500 dark:text-yellow-400";
      case "Low":
        return "text-green-500 dark:text-green-400";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Personal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Work":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "Other":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return (
      new Date(dueDate) < new Date() &&
      !taskList.find((t) => t.dueDate === dueDate)?.completed
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filter Tasks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={filter.priority}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, priority: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filter.category}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No tasks found matching your filters
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
                task.completed
                  ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
                  : isOverdue(task.dueDate)
                  ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500"
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3" />}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4
                          className={`text-sm font-medium transition-colors ${
                            task.completed
                              ? "text-gray-500 dark:text-gray-400 line-through"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {task.name || task.title}
                        </h4>

                        {task.description && (
                          <p
                            className={`mt-1 text-sm ${
                              task.completed
                                ? "text-gray-400 dark:text-gray-500"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Task Meta Info */}
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        {/* Category Badge */}
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                            task.category
                          )}`}
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {task.category}
                        </span>
                      </div>
                    </div>

                    {/* Task Details */}
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <div className="flex items-center space-x-4">
                        {/* Priority */}
                        <div className="flex items-center space-x-1">
                          <Flag
                            className={`w-3 h-3 ${getPriorityColor(
                              task.priority
                            )}`}
                          />
                          <span
                            className={`font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Due Date */}
                        <div
                          className={`flex items-center space-x-1 ${
                            isOverdue(task.dueDate) && !task.completed
                              ? "text-red-600 dark:text-red-400 font-medium"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(task.dueDate)}</span>
                          {isOverdue(task.dueDate) && !task.completed && (
                            <span className="text-red-600 dark:text-red-400 font-semibold ml-1">
                              (Overdue)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Completion Status */}
                      {task.completed && (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredTasks.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {filteredTasks.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Tasks
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {filteredTasks.filter((t) => t.completed).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Completed
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {filteredTasks.filter((t) => !t.completed).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {
                  filteredTasks.filter(
                    (t) => isOverdue(t.dueDate) && !t.completed
                  ).length
                }
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overdue
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sample data for demonstration
const sampleTasks = [
  {
    id: 1,
    name: "Complete project proposal",
    description: "Finish the Q4 project proposal document",
    category: "Work",
    priority: "High",
    dueDate: "2025-07-25",
    completed: false,
  },
  {
    id: 2,
    name: "Buy groceries",
    description: "Weekly grocery shopping",
    category: "Personal",
    priority: "Medium",
    dueDate: "2025-07-22",
    completed: true,
  },
  {
    id: 3,
    name: "Schedule dentist appointment",
    category: "Personal",
    priority: "Low",
    dueDate: "2025-07-30",
    completed: false,
  },
  {
    id: 4,
    name: "Review team reports",
    description: "Monthly performance review",
    category: "Work",
    priority: "High",
    dueDate: "2025-07-18",
    completed: false,
  },
  {
    id: 5,
    name: "Plan weekend trip",
    category: "Other",
    priority: "Low",
    dueDate: "2025-08-01",
    completed: false,
  },
];

// Demo component
export default function TaskListDemo() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Task Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your tasks with filtering and completion tracking
          </p>
        </div>
        <TaskList tasks={sampleTasks} />
      </div>
    </div>
  );
}
