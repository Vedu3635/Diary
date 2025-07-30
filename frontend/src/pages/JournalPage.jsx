import React, { useState, useContext, useRef, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import {
  Calendar,
  Save,
  Plus,
  Search,
  Filter,
  BookOpen,
  Heart,
  Smile,
  Frown,
  Meh,
  Tag,
  Image,
  Paperclip,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { toast } from "react-toastify";

// Utility to save and restore cursor position
const saveSelection = () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    return selection.getRangeAt(0);
  }
  return null;
};

const restoreSelection = (range) => {
  if (range) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

// Journal Entry Component
const JournalEntry = ({ entry, onSave, onCancel, isNew = false, theme }) => {
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [mood, setMood] = useState(entry?.mood || "neutral");
  const [tags, setTags] = useState(entry?.tags || []);
  const [newTag, setNewTag] = useState("");
  const editorRef = useRef(null);

  const moods = [
    {
      value: "happy",
      icon: Smile,
      color: "text-green-500",
      bg: theme === "dark" ? "bg-green-900/30" : "bg-green-100",
    },
    {
      value: "neutral",
      icon: Meh,
      color: "text-gray-500",
      bg: theme === "dark" ? "bg-gray-800" : "bg-gray-100",
    },
    {
      value: "sad",
      icon: Frown,
      color: "text-blue-500",
      bg: theme === "dark" ? "bg-blue-900/30" : "bg-blue-100",
    },
    {
      value: "excited",
      icon: Heart,
      color: "text-red-500",
      bg: theme === "dark" ? "bg-red-900/30" : "bg-red-100",
    },
  ];

  // Handle text formatting
  const formatText = (command, value = null) => {
    const selection = saveSelection();
    document.execCommand(command, false, value);
    restoreSelection(selection);
    setContent(editorRef.current.innerHTML);
    editorRef.current.focus();
  };

  // Handle content input
  const handleContentChange = () => {
    setContent(editorRef.current.innerHTML);
  };

  // Initialize contentEditable with content
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      const selection = saveSelection();
      editorRef.current.innerHTML = content;
      restoreSelection(selection);
    }
  }, [content]);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    const entryData = {
      id: entry?._id || Date.now(), // Use _id for backend compatibility
      title: title || "Untitled Entry",
      content,
      mood,
      tags,
      createdAt: entry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(entryData);
  };

  return (
    <div
      className={`p-6 rounded-xl border transition-all duration-200 ${
        theme === "dark"
          ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm"
          : "bg-white border-gray-200 shadow-lg"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-xl font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          {isNew ? "New Journal Entry" : "Edit Entry"}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-gray-300 hover:text-white hover:bg-gray-700"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Save Entry
          </button>
        </div>
      </div>
      {/* Title Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Entry title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full text-lg font-medium p-3 rounded-lg border transition-colors ${
            theme === "dark"
              ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
              : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500"
          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
        />
      </div>
      {/* Mood Selector */}
      <div className="mb-4">
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          How are you feeling?
        </label>
        <div className="flex gap-2">
          {moods.map(({ value, icon: Icon, color, bg }) => (
            <button
              key={value}
              onClick={() => setMood(value)}
              className={`p-3 rounded-lg transition-all ${
                mood === value
                  ? `${bg} ${color} ring-2 ring-current ring-opacity-50`
                  : theme === "dark"
                  ? "bg-gray-700/30 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-600"
              }`}
            >
              <Icon size={20} />
            </button>
          ))}
        </div>
      </div>
      {/* Rich Text Toolbar */}
      <div
        className={`flex flex-wrap gap-1 p-2 mb-2 rounded-lg border ${
          theme === "dark"
            ? "bg-gray-700/30 border-gray-600"
            : "bg-gray-50 border-gray-300"
        }`}
      >
        {[
          { command: "bold", icon: Bold },
          { command: "italic", icon: Italic },
          { command: "underline", icon: Underline },
          { command: "insertUnorderedList", icon: List },
          { command: "insertOrderedList", icon: ListOrdered },
          { command: "formatBlock", icon: Quote, value: "blockquote" },
        ].map(({ command, icon: Icon, value }) => (
          <button
            key={command}
            onClick={() => formatText(command, value)}
            className={`p-2 rounded transition-colors ${
              theme === "dark"
                ? "text-gray-300 hover:text-white hover:bg-gray-600"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
            }`}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
      {/* Content Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        className={`w-full min-h-[300px] p-4 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          theme === "dark"
            ? "bg-gray-700/50 border-gray-600 text-white focus:border-blue-400"
            : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
        }`}
        data-placeholder="Start writing your thoughts..."
        style={{
          minHeight: "300px",
        }}
      />
      {/* Tags Section */}
      <div className="mt-4">
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                theme === "dark"
                  ? "bg-blue-900/50 text-blue-200 border border-blue-800"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              <Tag size={12} />
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTag()}
            className={`flex-1 p-2 rounded-lg border transition-colors ${
              theme === "dark"
                ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
          <button
            onClick={addTag}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </div>
      {/* Media Attachments (Placeholder) */}
      <div
        className={`border-t mt-4 pt-4 ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-gray-300 hover:text-white hover:bg-gray-700"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            <Image size={16} />
            Add Image
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-gray-300 hover:text-white hover:bg-gray-700"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            <Paperclip size={16} />
            Attach File
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Journal Page Component
const JournalPage = () => {
  const {
    theme,
    journalEntries,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
  } = useContext(AppContext);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMoodFilter, setSelectedMoodFilter] = useState("all");

  const handleSaveEntry = async (entryData) => {
    try {
      if (editingEntry) {
        await updateJournalEntry(editingEntry._id, entryData);
        toast.success("Journal entry updated successfully!");
        setEditingEntry(null);
      } else {
        await createJournalEntry(entryData);
        toast.success("Journal entry created successfully!");
        setShowNewEntry(false);
      }
    } catch (err) {
      toast.error("Failed to save journal entry.");
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowNewEntry(false);
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const success = await deleteJournalEntry(entryId);
      if (success) {
        toast.success("Journal entry deleted successfully!");
      } else {
        toast.error("Failed to delete journal entry.");
      }
    } catch (err) {
      toast.error("Failed to delete journal entry.");
    }
  };

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesMood =
      selectedMoodFilter === "all" || entry.mood === selectedMoodFilter;
    return matchesSearch && matchesMood;
  });

  const getMoodIcon = (mood) => {
    const moodMap = {
      happy: { icon: Smile, color: "text-green-500" },
      sad: { icon: Frown, color: "text-blue-500" },
      excited: { icon: Heart, color: "text-red-500" },
      neutral: { icon: Meh, color: "text-gray-500" },
    };
    return moodMap[mood] || moodMap.neutral;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div
              className={`p-3 rounded-xl ${
                theme === "dark"
                  ? "bg-blue-900/50 text-blue-300"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <BookOpen size={28} />
            </div>
            <div>
              <h1
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Journal
              </h1>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Capture your thoughts and memories
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowNewEntry(true);
              setEditingEntry(null);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            New Entry
          </button>
        </div>

        {/* Search and Filters */}
        <div
          className={`p-6 rounded-xl mb-6 ${
            theme === "dark"
              ? "bg-gray-800/50 border border-gray-700 backdrop-blur-sm"
              : "bg-white border border-gray-200 shadow-lg"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                size={20}
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter
                size={20}
                className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
              />
              <select
                value={selectedMoodFilter}
                onChange={(e) => setSelectedMoodFilter(e.target.value)}
                className={`px-4 py-3 rounded-lg border transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700/50 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-800"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                <option value="all">All Moods</option>
                <option value="happy">Happy</option>
                <option value="excited">Excited</option>
                <option value="neutral">Neutral</option>
                <option value="sad">Sad</option>
              </select>
            </div>
          </div>
        </div>

        {/* New/Edit Entry Form */}
        {(showNewEntry || editingEntry) && (
          <div className="mb-6">
            <JournalEntry
              entry={editingEntry}
              onSave={handleSaveEntry}
              onCancel={() => {
                setShowNewEntry(false);
                setEditingEntry(null);
              }}
              isNew={!editingEntry}
              theme={theme}
            />
          </div>
        )}

        {/* Entries List */}
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div
              className={`text-center py-12 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                {searchTerm || selectedMoodFilter !== "all"
                  ? "No entries match your search criteria"
                  : "No journal entries yet. Start writing your first entry!"}
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const { icon: MoodIcon, color } = getMoodIcon(entry.mood);
              return (
                <div
                  key={entry._id}
                  className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                    theme === "dark"
                      ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70"
                      : "bg-white border-gray-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className={`text-xl font-semibold ${
                            theme === "dark" ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {entry.title}
                        </h3>
                        <MoodIcon size={20} className={color} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "text-gray-300 hover:text-white hover:bg-gray-700"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry._id)}
                        className={`px-3 py-1 text-red-500 hover:text-red-600 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "hover:bg-red-900/20"
                            : "hover:bg-red-50"
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div
                    className={`prose max-w-none mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-600"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html:
                        entry.content.length > 200
                          ? entry.content.substring(0, 200) + "..."
                          : entry.content,
                    }}
                  />

                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                            theme === "dark"
                              ? "bg-blue-900/30 text-blue-300"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
