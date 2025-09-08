import { React, useContext } from "react";
import { AppContext } from "../../context/AppContext"; // Adjust path as needed

const Footer = () => {
  const { theme } = useContext(AppContext);

  const handleExportData = () => {
    // Placeholder for export functionality
    alert("Export Data feature coming soon!");
  };

  return (
    <footer
      className={`
      w-full py-6 px-4 mt-auto border-t transition-colors duration-200
      ${
        theme === "dark"
          ? "bg-gray-900 border-gray-700 text-gray-300"
          : "bg-white border-gray-200 text-gray-600"
      }
    `}
    >
      <div className="max-w-4xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Version Info */}
          <div className="text-center md:text-left">
            <p
              className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Reflectly v1.0 © 2025
            </p>
          </div>

          {/* Links */}
          <div className="flex space-x-6">
            <a
              href="#contact"
              className={`
                text-sm transition-colors duration-200 hover:underline
                ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              Contact
            </a>
            <a
              href="#privacy"
              className={`
                text-sm transition-colors duration-200 hover:underline
                ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              Privacy Policy
            </a>
            <button
              className={`
                text-sm transition-colors duration-200 hover:underline focus:outline-none
                ${
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }
              `}
              onClick={handleExportData}
            >
              Export Data
            </button>
          </div>
        </div>

        {/* Optional: Additional Footer Info */}
        <div
          className={`
          mt-4 pt-4 border-t text-center
          ${theme === "dark" ? "border-gray-700" : "border-gray-200"}
        `}
        >
          <p
            className={`text-xs ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Your personal reflection journal. Keep your thoughts safe and
            organized.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
