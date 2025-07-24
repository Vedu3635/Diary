# Diary 📝

A modern, responsive task management application built with **React** and **Tailwind CSS**.

## ✨ Features

- Create, edit, and delete tasks
- Filter tasks by status (e.g., To‑do, In‑progress, Done), priority, and category
- Light/Dark theme switch using React Context
- Clean UI with **Lucide React** icons
- Fully responsive design for desktop and mobile

## 📦 Tech Stack

- **React** (Create React App)
- **Tailwind CSS**
- **React Context API**
- **Lucide React** (icon library)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+) and npm or yarn

### Installation

```bash
git clone https://github.com/Vedu3635/Diary.git
cd Diary/frontend
npm install     # or yarn install
```

### Running Locally

```bash
npm run dev       # or yarn start
```

App will run at `http://localhost:3000/`

### Building for Production

```bash
npm run build   # or yarn build
```

Generated production files will be in `frontend/build`

## 🧩 Project Structure

```
/frontend
├─ public/               # Static assets
├─ src/
│  ├─ components/        # UI components (TaskItem, Filters, ThemeToggle, etc.)
│  ├─ context/           # ThemeContext, TaskContext
│  ├─ hooks/             # Custom hooks
│  ├─ styles/            # Tailwind CSS custom configurations
│  └─ App.jsx            # Root component
├─ tailwind.config.js
└─ package.json
```

## 🛠️ Usage

1. Start the app (`npm start`)
2. Add a new task: enter title/category/priority/status
3. Use filters at the top to sort tasks as needed
4. Click ✏️ to edit or 🗑️ to delete a task
5. Switch theme using the toggle in the header

## 📁 Folder for Ideas / To-Dos

You’ll find a directory called `ProjectIdea_Journal/`—use it to jot down future features like drag‑and‑drop, deadlines, rich text in task notes, user auth, etc.

## 🌟 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a new branch (e.g., `feature/new-feature`)
3. Commit your changes with clear messages
4. Open a pull request against the `main` branch

## 🧪 License

This project is licensed under the [MIT License](LICENSE).
