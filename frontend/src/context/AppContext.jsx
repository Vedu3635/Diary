import { createContext, useState, useMemo, useEffect } from "react";
import axios from "axios";
import { DateTime } from "luxon";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ------------------------------
  // State
  // ------------------------------
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [tasks, setTasks] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // ------------------------------
  // Date Conversion Utilities
  // ------------------------------
  const DateUtils = {
    toUTC(localDate) {
      if (!localDate) return null;
      const dt =
        typeof localDate === "string"
          ? DateTime.fromISO(localDate, { zone: userTimeZone })
          : localDate; // Already a DateTime object
      return dt.isValid ? dt.toUTC().toISO() : null;
    },
    toLocal(utcDate) {
      if (!utcDate) return null;
      const dt =
        typeof utcDate === "string"
          ? DateTime.fromISO(utcDate, { zone: "utc" })
          : utcDate; // Already a DateTime object
      return dt.isValid ? dt.setZone(userTimeZone) : null;
    },
    formatForDisplay(utcDate, format = "yyyy-MM-dd HH:mm") {
      if (!utcDate) return "";
      const dt =
        typeof utcDate === "string"
          ? DateTime.fromISO(utcDate, { zone: "utc" })
          : utcDate;
      return dt.isValid ? dt.setZone(userTimeZone).toFormat(format) : "";
    },
    toDateInput(utcDate) {
      // Convert UTC DateTime to local date string for <input type="date">
      if (!utcDate) return "";
      const dt =
        typeof utcDate === "string"
          ? DateTime.fromISO(utcDate, { zone: "utc" })
          : utcDate;
      return dt.isValid ? dt.setZone(userTimeZone).toISODate() : "";
    },
  };

  // ------------------------------
  // JWT parser
  // ------------------------------
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error parsing JWT:", e);
      return {};
    }
  };

  // ------------------------------
  // Restore session on mount
  // ------------------------------
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (storedToken) {
      setToken(storedToken);
      let userIdFromToken = null;
      if (storedUserId && storedUserId !== "undefined") {
        userIdFromToken = storedUserId;
      } else {
        const parsed = parseJwt(storedToken);
        userIdFromToken = parsed.userId || parsed.id || parsed._id || null;
        if (userIdFromToken) {
          localStorage.setItem("userId", userIdFromToken);
        } else {
          localStorage.removeItem("userId"); // Clear invalid userId
        }
      }
      setUserId(userIdFromToken);
    } else {
      localStorage.removeItem("userId"); // Ensure no stale userId
    }
  }, []);

  // ------------------------------
  // Theme handling
  // ------------------------------
  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // ------------------------------
  // Fetch base data if logged in
  // ------------------------------
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchData();
    } else {
      setTasks([]);
      setJournalEntries([]);
      setError("Please log in to access data.");
    }
  }, [token]);

  // ------------------------------
  // Fetch tasks & journal entries
  // Store as UTC DateTime
  // ------------------------------
  const fetchData = async () => {
    try {
      setError(null);
      const [tasksRes, journalRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/tasks`),
        axios.get(`${API_BASE_URL}/journal`),
      ]);

      // ✅ Convert any date fields to DateTimes
      setTasks(
        tasksRes.data.map((task) => ({
          ...task,
          dueDate: task.dueDate
            ? DateTime.fromISO(task.dueDate, { zone: "utc" })
            : null,
          createdAt: task.createdAt
            ? DateTime.fromISO(task.createdAt, { zone: "utc" })
            : null,
        }))
      );

      setJournalEntries(
        journalRes.data.map((entry) => ({
          ...entry,
          createdAt: entry.createdAt
            ? DateTime.fromISO(entry.createdAt, { zone: "utc" })
            : null,
        }))
      );
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError("Failed to fetch data. Please try again.");
      }
    }
  };

  // ------------------------------
  // Calendar Events
  // start/end: UTC ISO strings
  // Returns UTC DateTime objects
  // ------------------------------
  const fetchCalendarEvents = async (start, end) => {
    if (!token || !userId) {
      setError("Please log in to view calendar events.");
      return [];
    }
    try {
      setError(null);

      // 🔐 Ensure start/end are in UTC ISO format
      const startISO = DateTime.fromISO(start, { zone: "utc" }).toISO();
      const endISO = DateTime.fromISO(end, { zone: "utc" }).toISO();

      const response = await axios.get(
        `${API_BASE_URL}/calendar/events?start=${startISO}&end=${endISO}`
      );
      // ✅ Convert returned dates to DateTime
      return response.data.map((evt) => ({
        ...evt,
        start: DateTime.fromISO(evt.start, { zone: "utc" }),
        end: DateTime.fromISO(evt.end, { zone: "utc" }),
      }));
    } catch (err) {
      console.error("Error fetching calendar events:", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError("Failed to fetch calendar events. Please try again.");
      }
      return [];
    }
  };

  const handleUnauthorized = () => {
    setError("Session expired. Please log in again.");
    logout();
  };

  // ------------------------------
  // Task CRUD
  // ------------------------------
  const createTask = async (taskData) => {
    if (!token) {
      setError("Please log in to create tasks.");
      return null;
    }
    try {
      setError(null);

      // ✅ Convert any DateTime to ISO before sending
      const payload = {
        ...taskData,
        dueDate: DateUtils.toUTC(taskData.dueDate), // Handle string or DateTime
      };

      const tempId = `temp-${Date.now()}`;
      const tempTask = {
        ...taskData,
        _id: tempId,
        dueDate: taskData.dueDate
          ? DateTime.fromISO(taskData.dueDate, { zone: userTimeZone })
          : null,
      };
      setTasks((prev) => [...prev, tempTask]);

      const response = await axios.post(`${API_BASE_URL}/tasks`, payload);

      setTasks((prev) =>
        prev.map((task) =>
          task._id === tempId
            ? {
                ...response.data,
                dueDate: response.data.dueDate
                  ? DateTime.fromISO(response.data.dueDate, { zone: "utc" })
                  : null,
                createdAt: response.data.createdAt
                  ? DateTime.fromISO(response.data.createdAt, { zone: "utc" })
                  : null,
              }
            : task
        )
      );

      return response.data;
    } catch (err) {
      console.error("Error creating task:", err);
      setTasks((prev) => prev.filter((task) => task._id !== tempId));
      if (err.response?.status === 401) handleUnauthorized();
      else setError("Failed to create task. Please try again.");
      return null;
    }
  };

  const updateTask = async (taskId, taskData) => {
    if (!token) {
      setError("Please log in to update tasks.");
      return null;
    }
    const originalTask = tasks.find((task) => task._id === taskId);
    try {
      setError(null);
      const payload = {
        ...taskData,
        dueDate: DateUtils.toUTC(taskData.dueDate), // Handle string or DateTime
      };

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? {
                ...task,
                ...taskData,
                dueDate: taskData.dueDate
                  ? typeof taskData.dueDate === "string"
                    ? DateTime.fromISO(taskData.dueDate, { zone: userTimeZone })
                    : taskData.dueDate
                  : null,
              }
            : task
        )
      );

      const response = await axios.put(
        `${API_BASE_URL}/tasks/${taskId}`,
        payload
      );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? {
                ...response.data,
                dueDate: response.data.dueDate
                  ? DateTime.fromISO(response.data.dueDate, { zone: "utc" })
                  : null,
                createdAt: response.data.createdAt
                  ? DateTime.fromISO(response.data.createdAt, { zone: "utc" })
                  : null,
              }
            : task
        )
      );

      return response.data;
    } catch (err) {
      console.error("Error updating task:", err);
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? originalTask : task))
      );
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError("Failed to update task. Please try again.");
      }
      return null;
    }
  };

  const deleteTask = async (taskId) => {
    if (!token) {
      setError("Please log in to delete tasks.");
      return false;
    }
    try {
      setError(null);
      const originalTask = tasks.find((task) => task._id === taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
      return true;
    } catch (err) {
      console.error("Error deleting task:", err);
      setTasks((prev) =>
        [...prev, originalTask].sort((a, b) => a._id.localeCompare(b._id))
      );
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError("Failed to delete task. Please try again.");
      }
      return false;
    }
  };

  // ------------------------------
  // Auth
  // ------------------------------
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      const token = res.data.token;
      setToken(token);
      localStorage.setItem("token", token);
      const parsed = parseJwt(token);
      const userIdFromToken = parsed.userId || parsed.id || parsed._id || null;
      setUserId(userIdFromToken);
      if (userIdFromToken) {
        localStorage.setItem("userId", userIdFromToken);
      } else {
        localStorage.removeItem("userId");
      }
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials. Please try again.");
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setTasks([]);
    setJournalEntries([]);
    setError(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    delete axios.defaults.headers.common["Authorization"];
  };

  // ------------------------------
  // Context Value
  // ------------------------------
  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((prev) => (prev === "light" ? "dark" : "light")),
      tasks,
      setTasks,
      journalEntries,
      setJournalEntries,
      token,
      userId,
      login,
      logout,
      error,
      createTask,
      updateTask,
      deleteTask,
      fetchCalendarEvents,
      DateUtils,
    }),
    [theme, tasks, journalEntries, token, userId, error]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
