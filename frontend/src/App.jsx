import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
// import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/TasksPage";
import JournalPage from "./pages/JournalPage";
import CalendarPage from "./pages/CalendarPage";
import InsightsPage from "./pages/InsightsPage";
import "./index.css";
import { AppProvider, AppContext } from "./context/AppContext";

// App content component that has access to context
function AppContent() {
  const { theme } = useContext(AppContext);

  return (
    <BrowserRouter>
      <div
        className={`flex flex-col min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
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
            </Routes>
          </main>
        </div>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}

// Main App component that provides context
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
