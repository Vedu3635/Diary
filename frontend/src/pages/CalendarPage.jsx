import React, { useState, useContext, useEffect } from "react";
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
import { AppContext } from "../context/AppContext";

const CalendarPage = () => {
  const {
    theme,
    token,

    error,
    fetchCalendarEvents,
    createTask,
    updateTask,
    deleteTask,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
  } = useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [showFilters, setShowFilters] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Event form state
  const [eventTitle, setEventTitle] = useState("");
  const [eventContent, setEventContent] = useState("");
  const [eventType, setEventType] = useState("task");
  const [eventPriority, setEventPriority] = useState("Medium");
  const [eventCompleted, setEventCompleted] = useState(false);
  const [eventRecurrence, setEventRecurrence] = useState("");
  const [eventCategory, setEventCategory] = useState("Personal");

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

  // Fetch events for the current month
  useEffect(() => {
    // console.log("useEffect triggered", { token, currentDate });
    if (!token) {
      // console.log("Missing token, skipping fetch");
      setEvents([]);
      toast.info("Please log in to view your calendar events.", { theme });
      return;
    }

    const fetchEvents = async () => {
      setLoading(true);
      const start = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      start.setHours(0, 0, 0, 0);
      const end = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      end.setHours(23, 59, 59, 999);
      // console.log("Fetching events with:", {
      //   start: start.toISOString(),
      //   end: end.toISOString(),
      // });

      try {
        const fetchedEvents = await fetchCalendarEvents(
          start.toISOString(),
          end.toISOString()
        );
        // console.log("Fetched events:", fetchedEvents);
        setEvents(fetchedEvents || []);
      } catch (err) {
        console.error("fetchEvents: Error", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        toast.error(err.message || "Failed to fetch events.", { theme });
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentDate, token, fetchCalendarEvents, theme]);

  // Display errors from AppContext
  useEffect(() => {
    if (error) {
      // console.log("CalendarPage: Error from AppContext", { error });
      toast.error(error, { theme });
    }
  }, [error, theme]);

  // Log events whenever they change
  // useEffect(() => {
  //   // console.log("Events state updated:", events);
  // }, [events]);

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
    const entries = events.filter((entry) => {
      const entryDate = entry.start ?? entry.date;

      return entryDate.toFormat("yyyy-MM-dd") === dateString;
    });
    // console.log(`Entries for ${dateString}:`, entries);
    return entries;
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
      toast.error("Please log in to manage events.", { theme });
      window.location.href = "/login";
      return;
    }
    setEditingEvent(event);
    if (event) {
      setEventTitle(event.title);
      setEventContent(event.content || "");
      setEventType(event.type || "task");
      setEventPriority(event.priority || "Medium");
      setEventCompleted(event.completed || false);
      setEventRecurrence(event.recurrenceRule || "");
      setEventCategory(event.category || "Personal");
    } else {
      setEventTitle("");
      setEventContent("");
      setEventType("task");
      setEventPriority("Medium");
      setEventCompleted(false);
      setEventRecurrence("");
      setEventCategory("Personal");
    }
    setShowEventModal(true);
  };

  const handleSaveEvent = async () => {
    if (!eventTitle.trim()) {
      toast.error("Title is required.", { theme });
      return;
    }

    const eventData = {
      title: eventTitle,
      start: selectedDate.toISOString(),
      end: new Date(selectedDate.getTime() + 30 * 60 * 1000).toISOString(), // Default 30-minute duration
      ...(eventType === "task"
        ? {
            status: eventCompleted ? "Completed" : "To Do",
            completed: eventCompleted,
            priority: eventPriority,
            recurrenceRule: eventRecurrence || undefined,
            category: eventCategory,
          }
        : {}),
      ...(eventType === "journal"
        ? { content: eventContent, mood: eventContent.mood || "neutral" }
        : {}),
    };
    // console.log("Saving event:", eventData);

    try {
      let updatedEvent;
      if (editingEvent) {
        const id = editingEvent.id;
        if (eventType === "task") {
          updatedEvent = await updateTask(id, eventData);
        } else {
          updatedEvent = await updateJournalEntry(id, eventData);
        }
      } else {
        if (eventType === "task") {
          updatedEvent = await createTask(eventData);
        } else {
          updatedEvent = await createJournalEntry(eventData);
        }
      }

      if (!updatedEvent) {
        throw new Error(
          `Failed to ${editingEvent ? "update" : "create"} event`
        );
      }
      // console.log("Saved event:", updatedEvent);

      // Refresh events
      const start = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      start.setHours(0, 0, 0, 0);
      const end = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      end.setHours(23, 59, 59, 999);
      // console.log("Refetching events with:", {
      //   start: start.toISOString(),
      //   end: end.toISOString(),
      // });
      const updatedEvents = await fetchCalendarEvents(
        start.toISOString(),
        end.toISOString()
      );
      // console.log("Refreshed events after save:", updatedEvents);

      setEvents(updatedEvents || []);
      toast.success(
        `Event ${editingEvent ? "updated" : "created"} successfully!`,
        { theme }
      );
      setShowEventModal(false);
      setEditingEvent(null);
    } catch (err) {
      // console.error("handleSaveEvent: Error", err);
      toast.error(`Failed to ${editingEvent ? "update" : "create"} event.`, {
        theme,
      });
    }
  };

  const handleDeleteEvent = async (eventId, type) => {
    if (!token) {
      toast.error("Please log in to delete events.", { theme });
      window.location.href = "/login";
      return;
    }

    try {
      let success;
      if (type === "task") {
        success = await deleteTask(eventId);
      } else {
        success = await deleteJournalEntry(eventId);
      }

      if (!success) {
        throw new Error("Failed to delete event");
      }
      // console.log(`Deleted ${type} with ID:`, eventId);

      // Refresh events
      const start = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      start.setHours(0, 0, 0, 0);
      const end = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      end.setHours(23, 59, 59, 999);
      // console.log("Refetching events with:", {
      //   start: start.toISOString(),
      //   end: end.toISOString(),
      // });
      const updatedEvents = await fetchCalendarEvents(
        start.toISOString(),
        end.toISOString()
      );
      // console.log("Refreshed events//////// after delete:", updatedEvents);

      setEvents(updatedEvents || []);
      toast.success("Event deleted successfully!", { theme });
    } catch (err) {
      console.error("handleDeleteEvent: Error", err);
      toast.error("Failed to delete event.", { theme });
    }
  };

  const filteredEvents = events.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.content &&
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || entry.type === typeFilter;
    const matchesPriority =
      priorityFilter === "all" ||
      (entry.type === "task" &&
        entry.priority.toLowerCase() === priorityFilter.toLowerCase());
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

  if (loading) return <div className="text-center p-4">Loading...</div>;

  if (!token) {
    return (
      <div className={themeClasses.container}>
        <div className="max-w-7xl mx-auto px-4 py-8 mt-16 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-500" />
          <h1 className="text-2xl font-semibold mb-4">
            Please log in to view your calendar
          </h1>
          <button
            onClick={() => (window.location.href = "/login")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${themeClasses.button}`}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
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
                                  key={entry.id}
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
                                onClick={() =>
                                  handleDeleteEvent(entry.id, entry.type)
                                }
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
                                entry.priority === "High"
                                  ? theme === "dark"
                                    ? "bg-red-900 text-red-200"
                                    : "bg-red-100 text-red-800"
                                  : entry.priority === "Medium"
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
                          {entry.category && (
                            <span
                              className={`inline-block text-xs px-2 py-1 rounded mt-2 ${
                                theme === "dark"
                                  ? "bg-blue-900 text-blue-200"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {entry.category}
                            </span>
                          )}
                          {entry.mood && (
                            <span
                              className={`inline-block text-xs px-2 py-1 rounded mt-2 ${
                                theme === "dark"
                                  ? "bg-purple-900 text-purple-200"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              Mood: {entry.mood}
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
                    {events.filter((e) => e.type === "journal").length}
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
                      events.filter((e) => e.type === "task" && e.completed)
                        .length
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
                      events.filter((e) => e.type === "task" && !e.completed)
                        .length
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
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
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
                      <input
                        type="text"
                        value={eventCategory}
                        onChange={(e) => setEventCategory(e.target.value)}
                        className={`w-full p-2 rounded-lg border transition-colors ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-gray-50 border-gray-300 text-gray-800"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="e.g., Personal, Work"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Recurrence (e.g., FREQ=DAILY;INTERVAL=1)
                      </label>
                      <input
                        type="text"
                        value={eventRecurrence}
                        onChange={(e) => setEventRecurrence(e.target.value)}
                        className={`w-full p-2 rounded-lg border transition-colors ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-gray-50 border-gray-300 text-gray-800"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="Leave blank for non-recurring"
                      />
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
                  <>
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
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Mood
                      </label>
                      <select
                        value={eventContent.mood || "neutral"}
                        onChange={(e) =>
                          setEventContent((prev) => ({
                            ...prev,
                            mood: e.target.value,
                          }))
                        }
                        className={`w-full p-2 rounded-lg border transition-colors ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-gray-50 border-gray-300 text-gray-800"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      >
                        <option value="happy">Happy</option>
                        <option value="neutral">Neutral</option>
                        <option value="sad">Sad</option>
                        <option value="excited">Excited</option>
                      </select>
                    </div>
                  </>
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
