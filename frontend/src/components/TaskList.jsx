import React, { useContext, useState } from "react";
import {
  CheckCircle,
  Circle,
  Edit3,
  Trash2,
  Calendar,
  Flag,
  Tag,
} from "lucide-react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const TaskList = ({ tasks = [], overdueCount = 0, onEditTask, theme }) => {
  const { updateTask, deleteTask } = useContext(AppContext);
  const [filter, setFilter] = useState({
    status: "all",
    priority: "all",
    category: "all",
  });
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const onToggleStatus = async (taskId) => {
    if (updatingTaskId) return; // Prevent multiple clicks
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    // Cycle through statuses: To Do -> In Progress -> Completed -> To Do
    const statusCycle = ["To Do", "In Progress", "Completed"];
    const currentIndex = statusCycle.indexOf(task.status);
    const newStatus = statusCycle[(currentIndex + 1) % 3];

    setUpdatingTaskId(taskId);
    try {
      await updateTask(taskId, { status: newStatus });
      toast.success(`Task marked as ${newStatus.toLowerCase()}!`, { theme });
    } catch (err) {
      toast.error("Failed to update task status.", { theme });
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const onDeleteTask = async (taskId) => {
    try {
      const success = await deleteTask(taskId);
      if (success) {
        toast.success("Task deleted successfully!", { theme });
      } else {
        toast.error("Failed to delete task.", { theme });
      }
    } catch (err) {
      toast.error("Failed to delete task.", { theme });
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      filter.status === "all" ||
      (filter.status === "completed" && task.status === "Completed") ||
      (filter.status === "in-progress" && task.status === "In Progress") ||
      (filter.status === "to-do" && task.status === "To Do");

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "In Progress":
        return <Circle className="w-5 h-5 text-blue-500" />;
      case "To Do":
        return <Circle className="w-5 h-5 text-grey-500" />;
      default:
        return <Circle className="w-5 h-5" />;
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

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === "Completed") return false;
    const due = new Date(dueDate);
    if (isNaN(due.getTime())) return false;
    const today = new Date();
    const dueDateStr = due.toISOString().split("T")[0];
    const todayStr = today.toISOString().split("T")[0];
    return dueDateStr < todayStr;
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
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Filter Tasks
          </h3>
          <button
            onClick={() =>
              setFilter({ status: "all", priority: "all", category: "all" })
            }
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              theme === "dark"
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Reset Filters
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option value="to-do">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
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
              key={task._id}
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
                task.status === "Completed"
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
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleStatus(task._id)}
                      disabled={updatingTaskId === task._id}
                      className={`${
                        theme === "dark"
                          ? "text-gray-400 hover:text-blue-400"
                          : "text-gray-500 hover:text-blue-600"
                      } transition-colors ${
                        updatingTaskId === task._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <h3
                      className={`font-semibold ${
                        task.status === "Completed" ? "line-through" : ""
                      } ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      {task.title}
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEditTask && onEditTask(task)}
                      className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                        theme === "dark"
                          ? "text-gray-400 hover:bg-gray-600"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task._id)}
                      className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                        theme === "dark"
                          ? "text-gray-400 hover:bg-red-900 hover:text-red-400"
                          : "text-gray-500 hover:bg-red-100 hover:text-red-600"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Task Details */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Flag
                        className={`w-3 h-3 ${getPriorityColor(task.priority)}`}
                      />
                      <span
                        className={`font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <div
                      className={`flex items-center space-x-1 ${
                        isOverdue(task.dueDate) && task.status !== "Completed"
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
                      {isOverdue(task.dueDate) &&
                        task.status !== "Completed" && (
                          <span
                            className={`${
                              theme === "dark" ? "text-red-400" : "text-red-600"
                            } font-semibold ml-1`}
                          >
                            (Overdue)
                          </span>
                        )}
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        task.category
                      )}`}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {task.category}
                    </span>
                  </div>
                  <span
                    className={`font-medium ${
                      task.status === "Completed"
                        ? theme === "dark"
                          ? "text-green-400"
                          : "text-green-600"
                        : task.status === "In Progress"
                        ? theme === "dark"
                          ? "text-blue-400"
                          : "text-blue-600"
                        : theme === "dark"
                        ? "text-grey-400"
                        : "text-grey-600"
                    }`}
                  >
                    {task.status}
                  </span>
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
                {filteredTasks.filter((t) => t.status === "Completed").length}
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
                {filteredTasks.filter((t) => t.status === "In Progress").length}
              </p>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                In Progress
              </p>
            </div>
            <div>
              <p
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {overdueCount}
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
