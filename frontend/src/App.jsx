import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import NavBar from "./components/layout/NavBar";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/TasksPage";
import JournalPage from "./pages/JournalPage";
import CalendarPage from "./pages/CalendarPage";
import InsightsPage from "./pages/InsightsPage";
import LoginPage from "./pages/LoginPage";
import { AppProvider, AppContext } from "./context/AppContext";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const { theme, token } = useContext(AppContext);

  return (
    <div
      className={`flex flex-col min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      <ToastContainer position="top-right" autoClose={3000} theme={theme} />
      {token ? (
        <>
          <NavBar />
          <div className="flex flex-1">
            <Sidebar />
            <main
              className={`flex-1 p-6 ml-0 md:ml-56 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </main>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
