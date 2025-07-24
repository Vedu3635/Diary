import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  BookOpen,
  Filter,
  Search,
} from "lucide-react";

const CalendarPage = () => {
  const { theme } = useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // month, week, day
  const [showFilters, setShowFilters] = useState(false);

  // Sample data - replace with actual data from context/API
  const sampleEntries = [
    {
      id: 1,
      date: "2024-01-15",
      type: "journal",
      title: "Morning Reflections",
      content: "Started the day with meditation...",
    },
    {
      id: 2,
      date: "2024-01-15",
      type: "task",
      title: "Complete project proposal",
      completed: false,
      priority: "high",
    },
    {
      id: 3,
      date: "2024-01-16",
      type: "task",
      title: "Team meeting",
      completed: true,
      priority: "medium",
    },
    {
      id: 4,
      date: "2024-01-17",
      type: "journal",
      title: "Evening Thoughts",
      content: "Productive day overall...",
    },
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return date?.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date?.toDateString() === selectedDate.toDateString();
  };

  const getEntriesForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split("T")[0];
    return sampleEntries.filter((entry) => entry.date === dateString);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const themeClasses = {
    container:
      theme === "dark"
        ? "bg-gray-900 text-white min-h-screen"
        : "bg-gray-50 text-gray-900 min-h-screen",
    card:
      theme === "dark"
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200",
    input:
      theme === "dark"
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
    button:
      theme === "dark"
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "bg-blue-500 hover:bg-blue-600 text-white",
    secondaryButton:
      theme === "dark"
        ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300",
    calendarDay:
      theme === "dark"
        ? "hover:bg-gray-700 text-gray-300"
        : "hover:bg-gray-100 text-gray-700",
    selectedDay:
      theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white",
    todayDay:
      theme === "dark"
        ? "bg-gray-700 text-blue-400 border-blue-400"
        : "bg-blue-50 text-blue-600 border-blue-300",
  };

  return (
    <div className={themeClasses.container}>
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold">Calendar</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg border transition-colors ${themeClasses.secondaryButton}`}
              >
                <Filter className="w-5 h-5" />
              </button>

              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("month")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === "month"
                      ? themeClasses.button
                      : themeClasses.secondaryButton
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode("week")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === "week"
                      ? themeClasses.button
                      : themeClasses.secondaryButton
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode("day")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === "day"
                      ? themeClasses.button
                      : themeClasses.secondaryButton
                  }`}
                >
                  Day
                </button>
              </div>

              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${themeClasses.button}`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Entry</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className={`p-4 rounded-lg border mb-6 ${themeClasses.card}`}>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search entries and tasks..."
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
                    />
                  </div>
                </div>

                <select
                  className={`px-3 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
                >
                  <option value="all">All Types</option>
                  <option value="journal">Journal Entries</option>
                  <option value="task">Tasks</option>
                </select>

                <select
                  className={`px-3 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className={`p-2 rounded-lg transition-colors ${themeClasses.calendarDay}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${themeClasses.secondaryButton}`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className={`p-2 rounded-lg transition-colors ${themeClasses.calendarDay}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="p-3 text-center text-sm font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((date, index) => {
                  const entries = getEntriesForDate(date);
                  const hasEntries = entries.length > 0;

                  return (
                    <div
                      key={index}
                      className={`
                        min-h-[80px] p-2 border border-transparent rounded-lg cursor-pointer transition-all duration-200
                        ${date ? "hover:border-blue-300" : ""}
                        ${
                          date && isSelected(date)
                            ? themeClasses.selectedDay
                            : ""
                        }
                        ${
                          date && isToday(date) && !isSelected(date)
                            ? `border ${themeClasses.todayDay}`
                            : ""
                        }
                        ${
                          date && !isSelected(date) && !isToday(date)
                            ? themeClasses.calendarDay
                            : ""
                        }
                      `}
                      onClick={() => date && setSelectedDate(date)}
                    >
                      {date && (
                        <>
                          <div className="text-sm font-medium mb-1">
                            {date.getDate()}
                          </div>
                          {hasEntries && (
                            <div className="space-y-1">
                              {entries.slice(0, 2).map((entry) => (
                                <div
                                  key={entry.id}
                                  className={` text-xs p-1 rounded truncate ${
                                    entry.type === "journal"
                                      ? theme === "dark"
                                        ? "bg-green-900 text-green-200"
                                        : "bg-green-100 text-green-800"
                                      : entry.completed
                                      ? theme === "dark"
                                        ? "bg-gray-700 text-gray-400 line-through"
                                        : "bg-gray-100 text-gray-600 line-through"
                                      : theme === "dark"
                                      ? "bg-blue-900 text-blue-200"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {entry.title}
                                </div>
                              ))}
                              {entries.length > 2 && (
                                <div
                                  className={`text-xs ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  +{entries.length - 2} more
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Selected Date Details */}
          <div className="space-y-6">
            {/* Selected Date Info */}
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <h3 className="text-lg font-semibold mb-4">
                {formatDate(selectedDate)}
              </h3>

              <div className="space-y-4">
                <button
                  className={`w-full p-3 rounded-lg border-2 border-dashed transition-colors ${themeClasses.secondaryButton}`}
                >
                  <Plus className="w-5 h-5 mx-auto mb-2" />
                  <span className="text-sm">Add Journal Entry</span>
                </button>

                <button
                  className={`w-full p-3 rounded-lg border-2 border-dashed transition-colors ${themeClasses.secondaryButton}`}
                >
                  <Plus className="w-5 h-5 mx-auto mb-2" />
                  <span className="text-sm">Add Task</span>
                </button>
              </div>
            </div>

            {/* Entries for Selected Date */}
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Today's Activities
              </h3>

              <div className="space-y-3">
                {getEntriesForDate(selectedDate).length > 0 ? (
                  getEntriesForDate(selectedDate).map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-3 rounded-lg border transition-colors ${themeClasses.card} hover:border-blue-300`}
                    >
                      <div className="flex items-start space-x-3">
                        {entry.type === "journal" ? (
                          <BookOpen className="w-5 h-5 text-green-500 mt-0.5" />
                        ) : entry.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-blue-500 mt-0.5" />
                        )}

                        <div className="flex-1">
                          <h4
                            className={`font-medium ${
                              entry.completed
                                ? "line-through text-gray-500"
                                : ""
                            }`}
                          >
                            {entry.title}
                          </h4>
                          {entry.content && (
                            <p
                              className={`text-sm mt-1 ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {entry.content.substring(0, 60)}...
                            </p>
                          )}

                          {entry.priority && (
                            <span
                              className={`inline-block text-xs px-2 py-1 rounded mt-2 ${
                                entry.priority === "high"
                                  ? theme === "dark"
                                    ? "bg-red-900 text-red-200"
                                    : "bg-red-100 text-red-800"
                                  : entry.priority === "medium"
                                  ? theme === "dark"
                                    ? "bg-yellow-900 text-yellow-200"
                                    : "bg-yellow-100 text-yellow-800"
                                  : theme === "dark"
                                  ? "bg-green-900 text-green-200"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {entry.priority} priority
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className={`text-center py-8 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No activities for this date</p>
                    <p className="text-sm">
                      Add a journal entry or task to get started
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <h3 className="text-lg font-semibold mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Journal Entries
                  </span>

                  <span className="font-semibold text-green-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  className=
                  {`text-sm  ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                  <span
                    className={`text-sm  ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Tasks Completed
                  </span>
                  <span className="font-semibold text-blue-600">8</span>
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm  ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Tasks Pending
                  </span>
                  <span className="font-semibold text-orange-600">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
