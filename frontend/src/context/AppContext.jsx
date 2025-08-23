import { createContext, useState, useMemo, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [tasks, setTasks] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";

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

  // Restore session from localStorage on app mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    // console.log("Restoring session:", { storedToken, storedUserId });
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
      // console.log("No session found in localStorage");
      localStorage.removeItem("userId"); // Ensure no stale userId
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

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

  const fetchData = async () => {
    try {
      setError(null);
      const [tasksRes, journalRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/tasks`),
        axios.get(`${API_BASE_URL}/journal`),
      ]);
      setTasks(tasksRes.data);
      setJournalEntries(journalRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError("Failed to fetch data. Please try again.");
      }
    }
  };

  const fetchCalendarEvents = async (start, end) => {
    if (!token || !userId) {
      setError("Please log in to view calendar events.");
      return [];
    }
    try {
      setError(null);
      const response = await axios.get(
        `${API_BASE_URL}/calendar/events?start=${start}&end=${end}`
      );
      return response.data; // Return the calendar events directly
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

  const createTask = async (taskData) => {
    if (!token) {
      setError("Please log in to create tasks.");
      return null;
    }
    try {
      setError(null);
      const tempId = `temp-${Date.now()}`;
      const tempTask = { ...taskData, _id: tempId };
      setTasks((prev) => [...prev, tempTask]);
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      setTasks((prev) =>
        prev.map((task) => (task._id === tempId ? response.data : task))
      );
      return response.data;
    } catch (err) {
      console.error("Error creating task:", err);
      setTasks((prev) => prev.filter((task) => task._id !== tempId));
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError("Failed to create task. Please try again.");
      }
      return null;
    }
  };

  const updateTask = async (taskId, taskData) => {
    if (!token) {
      setError("Please log in to update tasks.");
      return null;
    }
    try {
      setError(null);
      const originalTask = tasks.find((task) => task._id === taskId);
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, ...taskData } : task
        )
      );
      const response = await axios.put(
        `${API_BASE_URL}/tasks/${taskId}`,
        taskData
      );
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? response.data : task))
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

  const createJournalEntry = async (entryData) => {
    if (!token) {
      setError("Please log in to create journal entries.");
      return null;
    }
    try {
      setError(null);
      const tempId = `temp-${Date.now()}`;
      const tempEntry = { ...entryData, _id: tempId };
      setJournalEntries((prev) => [...prev, tempEntry]);
      const response = await axios.post(`${API_BASE_URL}/journal`, entryData);
      setJournalEntries((prev) =>
        prev.map((entry) => (entry._id === tempId ? response.data : entry))
      );
      return response.data;
    } catch (err) {
      console.error("Error creating journal entry:", err);
      setJournalEntries((prev) => prev.filter((entry) => entry._id !== tempId));
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError("Failed to create journal entry. Please try again.");
      }
      return null;
    }
  };

  const updateJournalEntry = async (entryId, entryData) => {
    if (!token) {
      setError("Please log in to update journal entries.");
      return null;
    }
    try {
      setError(null);
      const originalEntry = journalEntries.find(
        (entry) => entry._id === entryId
      );
      setJournalEntries((prev) =>
        prev.map((entry) =>
          entry._id === entryId ? { ...entry, ...entryData } : entry
        )
      );
      const response = await axios.put(
        `${API_BASE_URL}/journal/${entryId}`,
        entryData
      );
      setJournalEntries((prev) =>
        prev.map((entry) => (entry._id === entryId ? response.data : entry))
      );
      return response.data;
    } catch (err) {
      console.error("Error updating journal entry:", err);
      setJournalEntries((prev) =>
        prev.map((entry) => (entry._id === entryId ? originalEntry : entry))
      );
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError("Failed to update journal entry. Please try again.");
      }
      return null;
    }
  };

  const deleteJournalEntry = async (entryId) => {
    if (!token) {
      setError("Please log in to delete journal entries.");
      return false;
    }
    try {
      setError(null);
      const originalEntry = journalEntries.find(
        (entry) => entry._id === entryId
      );
      setJournalEntries((prev) =>
        prev.filter((entry) => entry._id !== entryId)
      );
      await axios.delete(`${API_BASE_URL}/journal/${entryId}`);
      return true;
    } catch (err) {
      console.error("Error deleting journal entry:", err);
      setJournalEntries((prev) =>
        [...prev, originalEntry].sort((a, b) => a._id.localeCompare(b._id))
      );
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError("Failed to delete journal entry. Please try again.");
      }
      return false;
    }
  };

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
      createJournalEntry,
      updateJournalEntry,
      deleteJournalEntry,
      fetchCalendarEvents,
    }),
    [theme, tasks, journalEntries, token, userId, error]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
