import React, { useState, useEffect, useRef, useContext } from "react";
import { Sun, Moon, Bell, User, Settings, LogOut, Home } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { theme, toggleTheme, logout } = useContext(AppContext);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // logout
  const handleLogout = () => {
    logout();
    navigate("/"); // or wherever your login page is
  };

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "task",
      message: "Complete project proposal",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "journal",
      message: "Daily reflection reminder",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "goal",
      message: "Monthly goal check-in",
      time: "1 day ago",
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case "task":
        return "📋";
      case "journal":
        return "📝";
      case "goal":
        return "🎯";
      default:
        return "🔔";
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        theme === "dark"
          ? "bg-gray-900 border-gray-700 text-white"
          : "bg-white border-gray-200 text-gray-900"
      } border-b shadow-sm`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  theme === "dark" ? "bg-blue-600" : "bg-blue-500"
                }`}
              >
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Dashboard</span>
            </a>
          </div>

          {/* Right side - Theme toggle, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                theme === "dark"
                  ? "hover:bg-gray-800 text-yellow-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative p-2 rounded-lg transition-colors duration-200 ${
                  theme === "dark"
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  3
                </span>
              </button>

              {isNotificationsOpen && (
                <div
                  className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg border overflow-hidden ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    className={`px-4 py-3 border-b ${
                      theme === "dark"
                        ? "border-gray-700 bg-gray-750"
                        : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <h3 className="font-semibold">Notifications</h3>
                    <p className="text-sm opacity-75">3 new notifications</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b last:border-b-0 hover:bg-opacity-50 transition-colors ${
                          theme === "dark"
                            ? "border-gray-700 hover:bg-gray-700"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-lg">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                              {notification.message}
                            </p>
                            <p className="text-xs opacity-60 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className={`px-4 py-3 text-center border-t ${
                      theme === "dark" ? "border-gray-700" : "border-gray-100"
                    }`}
                  >
                    <button
                      className={`text-sm font-medium ${
                        theme === "dark"
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-700"
                      }`}
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${
                  theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
                aria-label="User profile"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  John Doe
                </span>
              </button>

              {isProfileOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border overflow-hidden ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    className={`px-4 py-3 border-b ${
                      theme === "dark" ? "border-gray-700" : "border-gray-100"
                    }`}
                  >
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm opacity-75">john.doe@example.com</p>
                  </div>
                  <div className="py-1">
                    <a
                      href="/profile"
                      className={`flex items-center px-4 py-2 text-sm transition-colors ${
                        theme === "dark"
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </a>
                    <a
                      href="/settings"
                      className={`flex items-center px-4 py-2 text-sm transition-colors ${
                        theme === "dark"
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </a>
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                        theme === "dark"
                          ? "hover:bg-gray-700 text-red-400"
                          : "hover:bg-gray-100 text-red-600"
                      }`}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
