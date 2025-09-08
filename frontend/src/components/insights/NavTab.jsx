import React from "react";

const NavTab = ({ id, label, icon: Icon, activeTab, setActiveTab, theme }) => {
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        activeTab === id
          ? theme === "dark"
            ? "bg-blue-600 text-white"
            : "bg-blue-500 text-white"
          : theme === "dark"
          ? "text-gray-400 hover:text-white hover:bg-gray-800"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );
};

export default NavTab;
