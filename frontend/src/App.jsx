import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
// import TasksPage from "./pages/TasksPage";
// import JournalPage from "./pages/JournalPage";
// import CalendarPage from "./pages/CalendarPage";
// import InsightsPage from "./pages/InsightsPage";
import "./index.css";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6 bg-gray-100 ml-0 md:ml-56">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                {/* <Route path="/tasks" element={<TasksPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/insights" element={<InsightsPage />} /> */}
              </Routes>
            </main>
          </div>
          {/* <Footer /> */}
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
