import React, { useState, useContext } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Sidebar = () => {
  const { theme } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/tasks", label: "Tasks", icon: "📋" },
    { path: "/journal", label: "Journal", icon: "✍️" },
    { path: "/calendar", label: "Calendar", icon: "📅" },
    { path: "/insights", label: "Insights", icon: "📊" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-20 left-4 z-50 md:hidden bg-gradient-to-r ${
          theme === "dark"
            ? "from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            : "from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        } text-white p-2 rounded-lg shadow-lg transition-all duration-200`}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className={`fixed inset-0 ${
            theme === "dark" ? "bg-black/50" : "bg-black/30"
          } z-30 md:hidden`}
          style={{ top: "64px" }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 bg-gradient-to-b ${
          theme === "dark"
            ? "from-gray-900 via-gray-800 to-gray-900"
            : "from-gray-50 to-white"
        } backdrop-blur-xl border-r ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        } shadow-2xl z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-56`}
        style={{ top: "64px", height: "calc(100vh - 64px)" }}
      >
        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                      isActive
                        ? theme === "dark"
                          ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-white shadow-lg shadow-purple-500/10 font-semibold"
                          : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 shadow-sm font-semibold"
                        : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-md hover:scale-[1.02]"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow-md hover:scale-[1.01]"
                    }`}
                  >
                    <span
                      className={`text-lg transition-transform duration-200 ${
                        isActive ? "scale-110" : "group-hover:scale-110"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive && (
                      <div
                        className={`ml-auto w-2 h-2 bg-gradient-to-r ${
                          theme === "dark"
                            ? "from-purple-400 to-blue-400"
                            : "from-blue-400 to-purple-400"
                        } rounded-full animate-pulse`}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Navigation Sections */}
          <div className="mt-6">
            <h3
              className={`text-xs font-semibold ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              } uppercase tracking-wider mb-3 px-3`}
            >
              Quick Actions
            </h3>
            <div className="space-y-1.5">
              <button
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-md hover:scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow-md hover:scale-[1.01]"
                }`}
              >
                <span>⚡</span>
                <span className="text-sm">New Task</span>
              </button>
              <button
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-md hover:scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow-md hover:scale-[1.01]"
                }`}
              >
                <span>📝</span>
                <span className="text-sm">Quick Note</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
