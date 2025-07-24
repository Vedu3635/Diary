// src/context/AppContext.jsx
import React, { createContext, useState, useEffect, useMemo } from "react";
import {
  staticTasks,
  staticJournalEntries,
  staticGoals,
  staticCalendarEvents,
} from "../data/staticData";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [tasks, setTasks] = useState(staticTasks);
  const [journalEntries, setJournalEntries] = useState(staticJournalEntries);
  const [goals, setGoals] = useState(staticGoals);
  const [calendarEvents, setCalendarEvents] = useState(staticCalendarEvents);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
      tasks,
      setTasks,
      journalEntries,
      setJournalEntries,
      goals,
      setGoals,
      calendarEvents,
      setCalendarEvents,
    }),
    [theme, tasks, journalEntries, goals, calendarEvents]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
