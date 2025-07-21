import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

const JournalEntry = ({
  isQuickAdd = false,
  availableTasks = [],

  onSubmit = null,
}) => {
  const { theme } = useContext(AppContext);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("Neutral");
  const [linkedTasks, setLinkedTasks] = useState([]);

  // Default tasks if none provided
  const defaultTasks = [
    { id: 1, name: "Complete project proposal", category: "Work" },
    { id: 2, name: "Buy groceries", category: "Personal" },
    { id: 3, name: "Team meeting preparation", category: "Work" },
    { id: 4, name: "Read daily news", category: "Other" },
    { id: 5, name: "Exercise routine", category: "Personal" },
  ];

  const tasks = availableTasks.length > 0 ? availableTasks : defaultTasks;

  const moodOptions = [
    { value: "Happy", emoji: "😊", color: "text-green-500" },
    { value: "Stressed", emoji: "😰", color: "text-red-500" },
    { value: "Neutral", emoji: "😐", color: "text-gray-500" },
    { value: "Excited", emoji: "🤗", color: "text-blue-500" },
    { value: "Tired", emoji: "😴", color: "text-purple-500" },
    { value: "Focused", emoji: "🎯", color: "text-orange-500" },
  ];

  const handleTaskToggle = (taskId) => {
    setLinkedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const entryData = {
      content,
      mood,
      linkedTasks: linkedTasks.map((taskId) =>
        tasks.find((task) => task.id === taskId)
      ),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
    };

    if (onSubmit) {
      onSubmit(entryData);
    } else {
      // Default prototype behavior
      alert(
        `Journal Entry Created!\n\nContent: ${content}\nMood: ${mood}\nLinked Tasks: ${linkedTasks.length}`
      );
    }

    // Reset form
    setContent("");
    setMood("Neutral");
    setLinkedTasks([]);
  };

  const isFormValid = content.trim().length > 0;

  const themeClasses = {
    container:
      theme === "dark"
        ? "bg-gray-800 border-gray-700 text-white"
        : "bg-white border-gray-200 text-gray-900",
    input:
      theme === "dark"
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
    label: theme === "dark" ? "text-gray-300" : "text-gray-700",
    task:
      theme === "dark"
        ? "bg-gray-700 border-gray-600 hover:bg-gray-650 text-white"
        : "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-900",
    selectedTask:
      theme === "dark"
        ? "bg-blue-600 border-blue-500"
        : "bg-blue-100 border-blue-400",
    button:
      theme === "dark"
        ? "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
        : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400",
  };

  const selectedMood = moodOptions.find((option) => option.value === mood);

  return (
    <div
      className={`rounded-lg border ${themeClasses.container} ${
        isQuickAdd ? "p-4" : "p-6"
      }`}
    >
      <div className="mb-4">
        <h2
          className={`text-lg font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {isQuickAdd ? "Quick Journal Entry" : "Create Journal Entry"}
        </h2>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {isQuickAdd
            ? "Capture your thoughts quickly"
            : "Record your thoughts, mood, and link related tasks"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content Textarea */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${themeClasses.label}`}
          >
            What's on your mind?
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              isQuickAdd
                ? "Quick thoughts..."
                : "Write about your day, thoughts, or reflections..."
            }
            rows={isQuickAdd ? 3 : 5}
            className={`w-full px-3 py-2 rounded-md border ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
            required
          />
          <div
            className={`text-xs mt-1 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {content.length} characters
          </div>
        </div>

        {/* Mood Selection */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${themeClasses.label}`}
          >
            Current Mood
          </label>
          <div
            className={`grid ${
              isQuickAdd ? "grid-cols-3" : "grid-cols-6"
            } gap-2`}
          >
            {moodOptions.map((moodOption) => (
              <button
                key={moodOption.value}
                type="button"
                onClick={() => setMood(moodOption.value)}
                className={`p-2 rounded-lg border transition-colors ${
                  mood === moodOption.value
                    ? `${
                        theme === "dark"
                          ? "bg-blue-600 border-blue-500"
                          : "bg-blue-100 border-blue-400"
                      }`
                    : `${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 hover:bg-gray-650"
                          : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                      }`
                }`}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">{moodOption.emoji}</div>
                  <div
                    className={`text-xs ${isQuickAdd ? "hidden sm:block" : ""}`}
                  >
                    {moodOption.value}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div
            className={`text-sm mt-2 flex items-center ${selectedMood?.color}`}
          >
            <span className="mr-2">{selectedMood?.emoji}</span>
            Feeling {mood.toLowerCase()}
          </div>
        </div>

        {/* Task Linking */}
        {!isQuickAdd && (
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${themeClasses.label}`}
            >
              Link Related Tasks (Optional)
            </label>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskToggle(task.id)}
                  className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                    linkedTasks.includes(task.id)
                      ? themeClasses.selectedTask
                      : themeClasses.task
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={linkedTasks.includes(task.id)}
                      onChange={() => {}} // Controlled by parent div click
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">{task.name}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        theme === "dark"
                          ? "bg-gray-600 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {task.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {linkedTasks.length > 0 && (
              <div
                className={`text-sm mt-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {linkedTasks.length} task(s) linked to this entry
              </div>
            )}
          </div>
        )}

        {/* Quick Task Linking for QuickAdd */}
        {isQuickAdd && (
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${themeClasses.label}`}
            >
              Related Task (Optional)
            </label>
            <select
              value={linkedTasks[0] || ""}
              onChange={(e) =>
                setLinkedTasks(e.target.value ? [parseInt(e.target.value)] : [])
              }
              className={`w-full px-3 py-2 rounded-md border text-sm ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">No task selected</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name} ({task.category})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${themeClasses.button} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed`}
          >
            {isQuickAdd ? "Save Entry" : "Create Journal Entry"}
          </button>
        </div>
      </form>

      {/* Entry Preview (for quick add) */}
      {isQuickAdd && content && (
        <div
          className={`mt-4 pt-4 border-t ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div
            className={`text-xs ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Preview: {content.substring(0, 100)}
            {content.length > 100 ? "..." : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntry;
