import { createContext, useState, useEffect } from "react";
import {
  staticTasks,
  staticJournalEntries,
  staticGoals,
  staticSettings,
} from "../data/staticData";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(staticTasks);
  const [journalEntries, setJournalEntries] = useState(staticJournalEntries);
  const [goals, setGoals] = useState(staticGoals);
  const [settings, setSettings] = useState(staticSettings);
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage or fallback to staticSettings.theme
    return localStorage.getItem("theme") || staticSettings.theme;
  });

  useEffect(() => {
    // Apply theme on mount
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setSettings({ ...settings, theme: newTheme });
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        setTasks,
        journalEntries,
        setJournalEntries,
        goals,
        setGoals,
        settings,
        setSettings,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
