import React, { useState, useEffect, useContext } from "react";
import { Check, Calendar, Flag, Tag } from "lucide-react";
import { AppContext } from "../context/AppContext";

const TaskList = ({ tasks = [] }) => {
  const { theme } = useContext(AppContext);
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
        return theme === "dark" ? "text-red-400" : "text-red-500";
      case "Medium":
        return theme === "dark" ? "text-yellow-400" : "text-yellow-500";
      case "Low":
        return theme === "dark" ? "text-green-400" : "text-green-500";
      default:
        return theme === "dark" ? "text-gray-400" : "text-gray-500";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Personal":
        return theme === "dark"
          ? "bg-blue-900/30 text-blue-300"
          : "bg-blue-100 text-blue-800";
      case "Work":
        return theme === "dark"
          ? "bg-purple-900/30 text-purple-300"
          : "bg-purple-100 text-purple-800";
      case "Other":
        return theme === "dark"
          ? "bg-gray-800 text-gray-300"
          : "bg-gray-100 text-gray-800";
      default:
        return theme === "dark"
          ? "bg-gray-800 text-gray-300"
          : "bg-gray-100 text-gray-800";
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
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } rounded-lg shadow-sm border p-4`}
      >
        <h3
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          } mb-4`}
        >
          Filter Tasks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label
              className={`block text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } mb-2`}
            >
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, status: e.target.value }))
              }
              className={`w-full px-3 py-2 border ${
                theme === "dark"
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label
              className={`block text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } mb-2`}
            >
              Priority
            </label>
            <select
              value={filter.priority}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, priority: e.target.value }))
              }
              className={`w-full px-3 py-2 border ${
                theme === "dark"
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label
              className={`block text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } mb-2`}
            >
              Category
            </label>
            <select
              value={filter.category}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, category: e.target.value }))
              }
              className={`w-full px-3 py-2 border ${
                theme === "dark"
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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
          <div
            className={`${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } rounded-lg shadow-sm border p-8 text-center`}
          >
            <p
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              } text-lg`}
            >
              No tasks found matching your filters
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
                task.completed
                  ? theme === "dark"
                    ? "border-green-800 bg-green-900/10"
                    : "border-green-200 bg-green-50"
                  : isOverdue(task.dueDate)
                  ? theme === "dark"
                    ? "border-red-800 bg-red-900/10"
                    : "border-red-200 bg-red-50"
                  : theme === "dark"
                  ? "border-gray-700 hover:border-gray-600"
                  : "border-gray-200 hover:border-gray-300"
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
                        : theme === "dark"
                        ? "border-gray-600 hover:border-green-500"
                        : "border-gray-300 hover:border-green-400"
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
                              ? theme === "dark"
                                ? "text-gray-400 line-through"
                                : "text-gray-500 line-through"
                              : theme === "dark"
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {task.name || task.title}
                        </h4>

                        {task.description && (
                          <p
                            className={`mt-1 text-sm ${
                              task.completed
                                ? theme === "dark"
                                  ? "text-gray-500"
                                  : "text-gray-400"
                                : theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
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
                              ? theme === "dark"
                                ? "text-red-400 font-medium"
                                : "text-red-600 font-medium"
                              : theme === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(task.dueDate)}</span>
                          {isOverdue(task.dueDate) && !task.completed && (
                            <span
                              className={`${
                                theme === "dark"
                                  ? "text-red-400"
                                  : "text-red-600"
                              } font-semibold ml-1`}
                            >
                              (Overdue)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Completion Status */}
                      {task.completed && (
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-green-400"
                              : "text-green-600"
                          } font-medium`}
                        >
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
        <div
          className={`${
            theme === "dark"
              ? "bg-gray-900 border-gray-700"
              : "bg-gray-50 border-gray-200"
          } rounded-lg border p-4`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {filteredTasks.length}
              </p>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Tasks
              </p>
            </div>
            <div>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`}
              >
                {filteredTasks.filter((t) => t.completed).length}
              </p>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Completed
              </p>
            </div>
            <div>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-yellow-400" : "text-yellow-600"
                }`}
              >
                {filteredTasks.filter((t) => !t.completed).length}
              </p>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Pending
              </p>
            </div>
            <div>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {
                  filteredTasks.filter(
                    (t) => isOverdue(t.dueDate) && !t.completed
                  ).length
                }
              </p>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Overdue
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
