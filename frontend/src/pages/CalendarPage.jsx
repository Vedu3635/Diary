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
  Save,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

const CalendarPage = () => {
  const {
    theme,
    calendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    token,
  } = useContext(AppContext);
  console.log(calendarEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [showFilters, setShowFilters] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Event form state
  const [eventTitle, setEventTitle] = useState("");
  const [eventContent, setEventContent] = useState("");
  const [eventType, setEventType] = useState("journal");
  const [eventPriority, setEventPriority] = useState("medium");
  const [eventCompleted, setEventCompleted] = useState(false);

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
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    // console.log(days);
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
    return calendarEvents.filter((entry) => entry.date === dateString);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleOpenEventModal = (event = null) => {
    if (!token) {
      toast.error("Please log in to manage calendar events.", { theme });
      window.location.href = "/login";
      return;
    }
    setEditingEvent(event);
    if (event) {
      setEventTitle(event.title);
      setEventContent(event.content || "");
      setEventType(event.type);
      setEventPriority(event.priority || "medium");
      setEventCompleted(event.completed || false);
    } else {
      setEventTitle("");
      setEventContent("");
      setEventType("journal");
      setEventPriority("medium");
      setEventCompleted(false);
    }
    setShowEventModal(true);
  };

  const handleSaveEvent = async () => {
    if (!eventTitle.trim()) {
      toast.error("Title is required.", { theme });
      return;
    }
    const eventData = {
      date: selectedDate.toISOString().split("T")[0],
      title: eventTitle,
      content: eventContent,
      type: eventType,
      priority: eventType === "task" ? eventPriority : undefined,
      completed: eventType === "task" ? eventCompleted : undefined,
    };
    try {
      if (editingEvent) {
        await updateCalendarEvent(editingEvent._id, eventData);
        toast.success("Event updated successfully!", { theme });
      } else {
        await createCalendarEvent(eventData);
        toast.success("Event created successfully!", { theme });
      }
      setShowEventModal(false);
      setEditingEvent(null);
    } catch (err) {
      console.error("Error saving calendar event:", err);
      toast.error("Failed to save calendar event.", { theme });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!token) {
      toast.error("Please log in to delete calendar events.", { theme });
      window.location.href = "/login";
      return;
    }
    try {
      await deleteCalendarEvent(eventId);
      toast.success("Event deleted successfully!", { theme });
    } catch (err) {
      console.error("Error deleting calendar event:", err);
      toast.error("Failed to delete calendar event.", { theme });
    }
  };

  const filteredEvents = calendarEvents.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.content &&
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || entry.type === typeFilter;
    const matchesPriority =
      priorityFilter === "all" ||
      (entry.type === "task" && entry.priority === priorityFilter);
    return matchesSearch && matchesType && matchesPriority;
  });

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
                onClick={() => handleOpenEventModal()}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${themeClasses.button}`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            </div>
          </div>
          {showFilters && (
            <div className={`p-4 rounded-lg border mb-6 ${themeClasses.card}`}>
              <div className="flex flex-col md:flex-row items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search entries and tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
                  />
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
                >
                  <option value="all">All Types</option>
                  <option value="journal">Journal Entries</option>
                  <option value="task">Tasks</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
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
          <div className="lg:col-span-2">
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
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
                                  key={entry._id}
                                  className={`text-xs p-1 rounded truncate ${
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
          <div className="space-y-6">
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <h3 className="text-lg font-semibold mb-4">
                {formatDate(selectedDate)}
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => handleOpenEventModal()}
                  className={`w-full p-3 rounded-lg border-2 border-dashed transition-colors ${themeClasses.secondaryButton}`}
                >
                  <Plus className="w-5 h-5 mx-auto mb-2" />
                  <span className="text-sm">Add Event</span>
                </button>
              </div>
            </div>
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Today's Activities
              </h3>
              <div className="space-y-3">
                {getEntriesForDate(selectedDate).length > 0 ? (
                  getEntriesForDate(selectedDate).map((entry) => (
                    <div
                      key={entry._id}
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
                          <div className="flex justify-between items-center">
                            <h4
                              className={`font-medium ${
                                entry.completed
                                  ? "line-through text-gray-500"
                                  : ""
                              }`}
                            >
                              {entry.title}
                            </h4>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenEventModal(entry)}
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-300 hover:text-white"
                                    : "text-gray-600 hover:text-gray-800"
                                }`}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(entry._id)}
                                className={`text-sm text-red-500 hover:text-red-600`}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
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
                  <span className="font-semibold text-green-600">
                    {calendarEvents.filter((e) => e.type === "journal").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Tasks Completed
                  </span>
                  <span className="font-semibold text-blue-600">
                    {
                      calendarEvents.filter(
                        (e) => e.type === "task" && e.completed
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Tasks Pending
                  </span>
                  <span className="font-semibold text-orange-600">
                    {
                      calendarEvents.filter(
                        (e) => e.type === "task" && !e.completed
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`p-6 rounded-xl border max-w-lg w-full ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`text-xl font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {editingEvent ? "Edit Event" : "New Event"}
                </h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className={`p-2 rounded-lg ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className={`w-full p-2 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-800"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Event title..."
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className={`w-full p-2 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-800"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    <option value="journal">Journal Entry</option>
                    <option value="task">Task</option>
                  </select>
                </div>
                {eventType === "task" && (
                  <>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Priority
                      </label>
                      <select
                        value={eventPriority}
                        onChange={(e) => setEventPriority(e.target.value)}
                        className={`w-full p-2 rounded-lg border transition-colors ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-gray-50 border-gray-300 text-gray-800"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={eventCompleted}
                        onChange={(e) => setEventCompleted(e.target.checked)}
                        className="mr-2"
                      />
                      <label
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Completed
                      </label>
                    </div>
                  </>
                )}
                {eventType === "journal" && (
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Content
                    </label>
                    <textarea
                      value={eventContent}
                      onChange={(e) => setEventContent(e.target.value)}
                      className={`w-full p-2 rounded-lg border transition-colors ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-gray-50 border-gray-300 text-gray-800"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      rows="4"
                      placeholder="Event content..."
                    />
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowEventModal(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      theme === "dark"
                        ? "text-gray-300 hover:text-white hover:bg-gray-700"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEvent}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${themeClasses.button}`}
                  >
                    <Save size={16} />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
