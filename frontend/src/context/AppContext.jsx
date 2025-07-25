// src/context/AppContext.jsx
import React, { createContext, useState, useMemo, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [tasks, setTasks] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const [tasksRes, journalRes, calendarRes] = await Promise.all([
        axios.get("http://localhost:5000/api/tasks"),
        axios.get("http://localhost:5000/api/journal"),
        axios.get("http://localhost:5000/api/calendar"),
      ]);
      setTasks(tasksRes.data);
      setJournalEntries(journalRes.data);
      setCalendarEvents(calendarRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setTasks([]);
    setJournalEntries([]);
    setCalendarEvents([]);
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
    }),
    [theme, tasks, journalEntries, calendarEvents, token]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
