import { createContext, useState, useMemo, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [tasks, setTasks] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Theme handling
  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Token initialization and validation
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");
      if (storedToken && storedUserId) {
        setAuthToken(storedToken);
        setToken(storedToken);
        setUserId(storedUserId);
        try {
          await fetchData();
        } catch (err) {
          console.error("initializeAuth: Fetch failed", {
            message: err.message,
          });
          setError("Session expired. Please log in again.");
        }
      } else {
        setError("Please log in to access data.");
      }
      setIsInitialized(true);
    };
    initializeAuth();
  }, []);

  // Generic API fetch
  const handleApiError = (err, rollback) => {
    console.error("API Error:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    if (rollback) rollback();
    if (err.response?.status === 401)
      setError("Session expired. Please log in again.");
    else setError(err.response?.data?.message || "Something went wrong");
  };

  const fetchResource = async (endpoint) => {
    try {
      const res = await api.get(endpoint);
      return res.data;
    } catch (err) {
      handleApiError(err);
      return [];
    }
  };

  const fetchData = async ({ includeCalendar = false, start, end } = {}) => {
    setLoading(true);
    try {
      setError(null);
      const promises = [fetchResource("/tasks"), fetchResource("/journal")];
      if (includeCalendar && start && end && token && userId) {
        promises.push(
          fetchResource(`/calendar/events?start=${start}&end=${end}`)
        );
      }
      const [tasksData, journalData, calendarData] = await Promise.all(
        promises
      );
      console.log("fetchData: Success", {
        taskCount: tasksData.length,
        journalCount: journalData.length,
        calendarCount: calendarData?.length || 0,
      });
      setTasks(tasksData);
      setJournalEntries(journalData);
      if (includeCalendar && calendarData) setCalendarEvents(calendarData);
    } catch (err) {
      throw err; // Let the caller handle errors
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarEvents = async (start, end) => {
    if (!token || !userId || !isInitialized) {
      console.log(
        "fetchCalendarEvents: Skipping due to missing token, userId, or initialization",
        {
          token: !!token,
          userId: !!userId,
          isInitialized,
        }
      );
      setError("Please log in to view calendar events.");
      return [];
    }
    try {
      const data = await fetchResource(
        `/calendar/events?start=${start}&end=${end}`
      );
      setCalendarEvents(data);
      console.log("fetchCalendarEvents: Success", { eventCount: data.length });
      return data;
    } catch (err) {
      handleApiError(err);
      return [];
    }
  };

  const createTask = async (taskData) => {
    if (!token || !isInitialized) {
      setError("Please log in to create tasks.");
      return null;
    }
    try {
      setError(null);
      const tempId = `temp-${Date.now()}`;
      const tempTask = { ...taskData, _id: tempId };
      setTasks((prev) => [...prev, tempTask]);
      const response = await api.post("/tasks", taskData);
      setTasks((prev) =>
        prev.map((task) => (task._id === tempId ? response.data : task))
      );
      return response.data;
    } catch (err) {
      console.error("Error creating task:", err);
      setTasks((prev) => prev.filter((task) => task._id !== tempId));
      handleApiError(err);
      return null;
    }
  };

  const updateTask = async (taskId, taskData) => {
    if (!token || !isInitialized) {
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
      const response = await api.put(`/tasks/${taskId}`, taskData);
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? response.data : task))
      );
      return response.data;
    } catch (err) {
      console.error("Error updating task:", err);
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? originalTask : task))
      );
      handleApiError(err);
      return null;
    }
  };

  const deleteTask = async (taskId) => {
    if (!token || !isInitialized) {
      setError("Please log in to delete tasks.");
      return false;
    }
    try {
      setError(null);
      const originalTask = tasks.find((task) => task._id === taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      await api.delete(`/tasks/${taskId}`);
      return true;
    } catch (err) {
      console.error("Error deleting task:", err);
      setTasks((prev) =>
        [...prev, originalTask].sort((a, b) => a._id.localeCompare(b._id))
      );
      handleApiError(err);
      return false;
    }
  };

  const createJournalEntry = async (entryData) => {
    if (!token || !isInitialized) {
      setError("Please log in to create journal entries.");
      return null;
    }
    try {
      setError(null);
      const tempId = `temp-${Date.now()}`;
      const tempEntry = { ...entryData, _id: tempId };
      setJournalEntries((prev) => [...prev, tempEntry]);
      const response = await api.post("/journal", entryData);
      setJournalEntries((prev) =>
        prev.map((entry) => (entry._id === tempId ? response.data : entry))
      );
      return response.data;
    } catch (err) {
      console.error("Error creating journal entry:", err);
      setJournalEntries((prev) => prev.filter((entry) => entry._id !== tempId));
      handleApiError(err);
      return null;
    }
  };

  const updateJournalEntry = async (entryId, entryData) => {
    if (!token || !isInitialized) {
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
      const response = await api.put(`/journal/${entryId}`, entryData);
      setJournalEntries((prev) =>
        prev.map((entry) => (entry._id === entryId ? response.data : entry))
      );
      return response.data;
    } catch (err) {
      console.error("Error updating journal entry:", err);
      setJournalEntries((prev) =>
        prev.map((entry) => (entry._id === entryId ? originalEntry : entry))
      );
      handleApiError(err);
      return null;
    }
  };

  const deleteJournalEntry = async (entryId) => {
    if (!token || !isInitialized) {
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
      await api.delete(`/journal/${entryId}`);
      return true;
    } catch (err) {
      console.error("Error deleting journal entry:", err);
      setJournalEntries((prev) =>
        [...prev, originalEntry].sort((a, b) => a._id.localeCompare(b._id))
      );
      handleApiError(err);
      return false;
    }
  };

  const createResource = async (
    endpoint,
    data,
    setState,
    tempIdPrefix = "temp"
  ) => {
    if (!token || !isInitialized) {
      setError("Please log in.");
      return null;
    }
    const tempId = `${tempIdPrefix}-${Date.now()}`;
    const tempItem = { ...data, _id: tempId };
    setState((prev) => [...prev, tempItem]);
    try {
      const res = await api.post(endpoint, data);
      setState((prev) =>
        prev.map((item) => (item._id === tempId ? res.data : item))
      );
      return res.data;
    } catch (err) {
      handleApiError(err, () =>
        setState((prev) => prev.filter((item) => item._id !== tempId))
      );
      return null;
    }
  };

  const updateResource = async (endpoint, id, data, state, setState) => {
    if (!token || !isInitialized) {
      setError("Please log in.");
      return null;
    }
    const original = state.find((item) => item._id === id);
    setState((prev) =>
      prev.map((item) => (item._id === id ? { ...item, ...data } : item))
    );
    try {
      const res = await api.put(`${endpoint}/${id}`, data);
      setState((prev) =>
        prev.map((item) => (item._id === id ? res.data : item))
      );
      return res.data;
    } catch (err) {
      handleApiError(err, () =>
        setState((prev) =>
          prev.map((item) => (item._id === id ? original : item))
        )
      );
      return null;
    }
  };

  const deleteResource = async (endpoint, id, state, setState) => {
    if (!token || !isInitialized) {
      setError("Please log in.");
      return false;
    }
    const original = state.find((item) => item._id === id);
    setState((prev) => prev.filter((item) => item._id !== id));
    try {
      await api.delete(`${endpoint}/${id}`);
      return true;
    } catch (err) {
      handleApiError(err, () =>
        setState((prev) =>
          [...prev, original].sort((a, b) => a._id.localeCompare(b._id))
        )
      );
      return false;
    }
  };

  const createTaskResource = (data) => createResource("/tasks", data, setTasks);
  const updateTaskResource = (id, data) =>
    updateResource("/tasks", id, data, tasks, setTasks);
  const deleteTaskResource = (id) =>
    deleteResource("/tasks", id, tasks, setTasks);

  const createJournalEntryResource = (data) =>
    createResource("/journal", data, setJournalEntries);
  const updateJournalEntryResource = (id, data) =>
    updateResource("/journal", id, data, journalEntries, setJournalEntries);
  const deleteJournalEntryResource = (id) =>
    deleteResource("/journal", id, journalEntries, setJournalEntries);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await api.post("/auth/login", { email, password });
      setToken(res.data.token);
      setUserId(res.data.userId);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid credentials.");
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setTasks([]);
    setJournalEntries([]);
    setCalendarEvents([]);
    setError(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setAuthToken(null);
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
      calendarEvents,
      setCalendarEvents,
      token,
      userId,
      login,
      logout,
      error,
      loading,
      fetchData,
      fetchCalendarEvents,
      createTask: createTaskResource,
      updateTask: updateTaskResource,
      deleteTask: deleteTaskResource,
      createJournalEntry: createJournalEntryResource,
      updateJournalEntry: updateJournalEntryResource,
      deleteJournalEntry: deleteJournalEntryResource,
    }),
    [
      theme,
      tasks,
      journalEntries,
      calendarEvents,
      token,
      userId,
      error,
      loading,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
