import { useState } from "react";
import {
  staticTasks,
  staticJournalEntries,
  staticGoals,
} from "../data/staticData";
import TaskList from "../components/TaskList";
import JournalEntry from "../components/JournalEntry";
import GoalTracker from "../components/GoalTracker";

function Dashboard() {
  const today = "2025-07-19";
  const todayTasks = staticTasks.filter((task) => task.dueDate === today);
  const recentEntries = staticJournalEntries.slice(0, 2);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
        {/* <TaskList tasks={todayTasks} /> */}
      </section>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Quick Journal Entry</h2>
        {/* <JournalEntry isQuickAdd={true} /> */}
      </section>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Goals & Habits</h2>
        {/* <GoalTracker goals={staticGoals} /> */}
      </section>
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
        {recentEntries.map((entry) => (
          <div key={entry.id} className="mb-4">
            <p className="font-medium">
              {entry.date}: {entry.content.substring(0, 50)}...
            </p>
            <p className="text-sm text-gray-600">
              Mood: {entry.mood} | Tags: {entry.tags.join(", ")}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Dashboard;
