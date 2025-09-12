import React, { useState, useContext } from "react";
import {
  Edit3,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { DateTime } from "luxon";
// import { AppContext } from "../../context/AppContext";

const TaskList2 = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  theme,
  DateUtils,
}) => {
  // const { DateUtils } = useContext(AppContext);
  const [collapsedSections, setCollapsedSections] = useState({
    overdue: false,
    today: false,
    thisWeek: false,
    later: false,
    noDueDate: false,
    completed: false,
  });

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === "Completed") return false;
    return dueDate < DateTime.now().setZone("utc");
  };

  const isDueToday = (dueDate) => {
    if (!dueDate) return false;
    return dueDate.setZone("local").hasSame(DateTime.now(), "day");
  };

  const isDueThisWeek = (dueDate) => {
    if (!dueDate) return false;
    const today = DateTime.now().startOf("day");
    const weekEnd = today.plus({ days: 7 });
    const due = dueDate.setZone("local");
    return due >= today && due <= weekEnd;
  };

  const isDueLater = (dueDate) => {
    if (!dueDate) return false;
    const weekEnd = DateTime.now().plus({ days: 7 }).endOf("day");
    return dueDate.setZone("local") > weekEnd;
  };

  const isWithinLast30Days = (date) => {
    if (!date) return false;
    const thirtyDaysAgo = DateTime.now().minus({ days: 30 });
    return date >= thirtyDaysAgo;
  };

  const getDaysOverdue = (dueDate) => {
    if (!dueDate) return 0;
    return Math.ceil(DateTime.now().diff(dueDate, "days").days);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low:
        theme === "dark"
          ? "bg-green-900/20 text-green-400"
          : "bg-green-100 text-green-800",
      medium:
        theme === "dark"
          ? "bg-yellow-900/20 text-yellow-400"
          : "bg-yellow-100 text-yellow-800",
      high:
        theme === "dark"
          ? "bg-orange-900/20 text-orange-400"
          : "bg-orange-100 text-orange-800",
      urgent:
        theme === "dark"
          ? "bg-red-900/20 text-red-400"
          : "bg-red-100 text-red-800",
    };
    return colors[priority?.toLowerCase()] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      "To Do":
        theme === "dark"
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-100 text-gray-700",
      "In Progress":
        theme === "dark"
          ? "bg-blue-900/20 text-blue-400"
          : "bg-blue-100 text-blue-800",
      Completed:
        theme === "dark"
          ? "bg-green-900/20 text-green-400"
          : "bg-green-100 text-green-800",
    };
    return colors[status] || colors["To Do"];
  };

  const groupedTasks = {
    overdue: tasks.filter((task) => isOverdue(task.dueDate, task.status)),
    today: tasks.filter(
      (task) => isDueToday(task.dueDate) && task.status !== "Completed"
    ),
    thisWeek: tasks.filter(
      (task) => isDueThisWeek(task.dueDate) && task.status !== "Completed"
    ),
    later: tasks.filter(
      (task) => isDueLater(task.dueDate) && task.status !== "Completed"
    ),
    noDueDate: tasks.filter(
      (task) => !task.dueDate && task.status !== "Completed"
    ),
    completed: tasks.filter(
      (task) =>
        task.status === "Completed" && isWithinLast30Days(task.createdAt)
    ),
  };

  Object.keys(groupedTasks).forEach((key) => {
    groupedTasks[key].sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return (
        (priorityOrder[b.priority?.toLowerCase()] || 2) -
        (priorityOrder[a.priority?.toLowerCase()] || 2)
      );
    });
  });

  const renderTaskCard = (task, sectionType) => {
    const taskOverdue = isOverdue(task.dueDate, task.status);
    const daysOverdue = taskOverdue ? getDaysOverdue(task.dueDate) : 0;

    return (
      <div
        key={task._id}
        className={`rounded-lg border p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 hover:border-gray-600"
            : "bg-white border-gray-200 hover:border-gray-300"
        }`}
      >
        {taskOverdue && sectionType === "overdue" && (
          <div
            className={`flex items-center gap-2 mb-3 p-2 rounded-lg ${
              theme === "dark"
                ? "bg-red-900/30 text-red-300"
                : "bg-red-100 text-red-800"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-medium">
              {daysOverdue} day{daysOverdue > 1 ? "s" : ""} overdue
            </span>
          </div>
        )}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleStatus(task._id)}
              className={`${
                theme === "dark"
                  ? "text-gray-400 hover:text-blue-400"
                  : "text-gray-500 hover:text-blue-600"
              } transition-colors`}
            >
              {task.status === "Completed" ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
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
              onClick={() => onEditTask(task)}
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
        {task.description && (
          <p
            className={`text-sm mb-3 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {task.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              task.status
            )}`}
          >
            {task.status}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
          </span>
          {task.category && (
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                theme === "dark"
                  ? "bg-purple-900/20 text-purple-400"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {task.category}
            </span>
          )}
        </div>
        <div
          className={`space-y-1 text-xs ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                Due {DateUtils.formatForDisplay(task.dueDate, "yyyy-MM-dd")}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              Created {DateUtils.formatForDisplay(task.createdAt, "yyyy-MM-dd")}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (title, emoji, tasks, sectionKey, bgColor) => {
    if (tasks.length === 0) return null;
    const isCollapsed = collapsedSections[sectionKey];
    return (
      <div className="mb-6">
        <button
          onClick={() => toggleSection(sectionKey)}
          className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${bgColor} ${
            theme === "dark" ? "hover:opacity-80" : "hover:opacity-90"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{emoji}</span>
            <h2
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </h2>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-300"
                  : "bg-white/50 text-gray-700"
              }`}
            >
              {tasks.length}
            </span>
          </div>
          {isCollapsed ? (
            <ChevronRight
              className={`w-5 h-5 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            />
          ) : (
            <ChevronDown
              className={`w-5 h-5 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            />
          )}
        </button>
        {!isCollapsed && (
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => renderTaskCard(task, sectionKey))}
          </div>
        )}
      </div>
    );
  };

  const getSectionBgColor = (section) => {
    const colors = {
      overdue:
        theme === "dark"
          ? "bg-red-900/20 border border-red-500/30"
          : "bg-red-50 border border-red-200",
      today:
        theme === "dark"
          ? "bg-amber-900/20 border border-amber-500/30"
          : "bg-amber-50 border border-amber-200",
      thisWeek:
        theme === "dark"
          ? "bg-blue-900/20 border border-blue-500/30"
          : "bg-blue-50 border border-blue-200",
      later:
        theme === "dark"
          ? "bg-gray-700 border border-gray-600"
          : "bg-gray-100 border border-gray-200",
      noDueDate:
        theme === "dark"
          ? "bg-gray-800 border border-gray-600"
          : "bg-gray-50 border border-gray-300",
      completed:
        theme === "dark"
          ? "bg-green-900/20 border border-green-500/30"
          : "bg-green-50 border border-green-200",
    };
    return colors[section] || colors.later;
  };

  if (tasks.length === 0) {
    return (
      <div
        className={`text-center py-12 ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium mb-2">No tasks found</h3>
        <p>Create your first task or adjust your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderSection(
        "Overdue & Critical",
        "🚨",
        groupedTasks.overdue,
        "overdue",
        getSectionBgColor("overdue")
      )}
      {renderSection(
        "Due Today",
        "⚡",
        groupedTasks.today,
        "today",
        getSectionBgColor("today")
      )}
      {renderSection(
        "Due This Week",
        "📅",
        groupedTasks.thisWeek,
        "thisWeek",
        getSectionBgColor("thisWeek")
      )}
      {renderSection(
        "Due Later",
        "🔵",
        groupedTasks.later,
        "later",
        getSectionBgColor("later")
      )}
      {renderSection(
        "No Due Date",
        "📝",
        groupedTasks.noDueDate,
        "noDueDate",
        getSectionBgColor("noDueDate")
      )}
      {renderSection(
        "Completed",
        "✅",
        groupedTasks.completed,
        "completed",
        getSectionBgColor("completed")
      )}
    </div>
  );
};

export default TaskList2;
