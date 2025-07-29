import React, { createContext, useState, useMemo, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [tasks, setTasks] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchData();
    } else {
      setError("Please log in to access data.");
    }
  }, [token]);

  const fetchData = async () => {
    try {
      setError(null);
      const [tasksRes, journalRes, calendarRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/tasks`),
        axios.get(`${API_BASE_URL}/journal`),
        axios.get(`${API_BASE_URL}/calendar`),
      ]);
      setTasks(tasksRes.data);
      setJournalEntries(journalRes.data);
      setCalendarEvents(calendarRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError("Failed to fetch data. Please try again.");
      }
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
        premap((entry) =>
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

  const createCalendarEvent = async (eventData) => {
    if (!token) {
      setError("Please log in to create calendar events.");
      return null;
    }
    try {
      setError(null);
      const tempId = `temp-${Date.now()}`;
      const tempEvent = { ...eventData, _id: tempId };
      setCalendarEvents((prev) => [...prev, tempEvent]);
      const response = await axios.post(`${API_BASE_URL}/calendar`, eventData);
      setCalendarEvents((prev) =>
        prev.map((event) => (event._id === tempId ? response.data : event))
      );
      return response.data;
    } catch (err) {
      console.error("Error creating calendar event:", err);
      setCalendarEvents((prev) => prev.filter((event) => event._id !== tempId));
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError("Failed to create calendar event. Please try again.");
      }
      return null;
    }
  };

  const updateCalendarEvent = async (eventId, eventData) => {
    if (!token) {
      setError("Please log in to update calendar events.");
      return null;
    }
    try {
      setError(null);
      const originalEvent = calendarEvents.find(
        (event) => event._id === eventId
      );
      setCalendarEvents((prev) =>
        prev.map((event) =>
          event._id === eventId ? { ...event, ...eventData } : event
        )
      );
      const response = await axios.put(
        `${API_BASE_URL}/calendar/${eventId}`,
        eventData
      );
      setCalendarEvents((prev) =>
        prev.map((event) => (event._id === eventId ? response.data : event))
      );
      return response.data;
    } catch (err) {
      console.error("Error updating calendar event:", err);
      setCalendarEvents((prev) =>
        prev.map((event) => (event._id === eventId ? originalEvent : event))
      );
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError("Failed to update calendar event. Please try again.");
      }
      return null;
    }
  };

  const deleteCalendarEvent = async (eventId) => {
    if (!token) {
      setError("Please log in to delete calendar events.");
      return false;
    }
    try {
      setError(null);
      const originalEvent = calendarEvents.find(
        (event) => event._id === eventId
      );
      setCalendarEvents((prev) =>
        prev.filter((event) => event._id !== eventId)
      );
      await axios.delete(`${API_BASE_URL}/calendar/${eventId}`);
      return true;
    } catch (err) {
      console.error("Error deleting calendar event:", err);
      setCalendarEvents((prev) =>
        [...prev, originalEvent].sort((a, b) => a._id.localeCompare(b._id))
      );
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        setError("Failed to delete calendar event. Please try again.");
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
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials. Please try again.");
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setTasks([]);
    setJournalEntries([]);
    setCalendarEvents([]);
    setError(null);
    localStorage.removeItem("token");
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
      calendarEvents,
      setCalendarEvents,
      token,
      login,
      logout,
      error,
      createTask,
      updateTask,
      deleteTask,
      createJournalEntry,
      updateJournalEntry,
      deleteJournalEntry,
      createCalendarEvent,
      updateCalendarEvent,
      deleteCalendarEvent,
    }),
    [theme, tasks, journalEntries, calendarEvents, token, error]
  );

  console.log("AppContext state:", {
    theme,
    tasks,
    journalEntries,
    calendarEvents,
    token,
    error,
  });

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
