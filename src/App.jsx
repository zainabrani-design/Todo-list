
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  ListTodo,
  CircleCheck,
  Clock,
  Sparkles,
  Search
} from "lucide-react";

const initialTasks = [
  {
    id: 1,
    text: "Welcome to your Todo List!",
    completed: false
  },
  {
    id: 2,
    text: "Complete your first task",
    completed: false
  },
  {
    id: 3,
    text: "Enjoy being productive",
    completed: true
  }
];

function loadTasks() {
  try {
    const saved = localStorage.getItem("todo-list-tasks");
    return saved === null ? initialTasks : JSON.parse(saved);
  } catch {
    return initialTasks;
  }
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("todo-list-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const remainingCount = tasks.length - completedCount;
  const progress =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  const visibleTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed);

    return (
      matchesFilter &&
      task.text.toLowerCase().includes(search.toLowerCase())
    );
  });

  function addTask(event) {
    event.preventDefault();
    const text = input.trim();

    if (!text) return;

    setTasks((current) => [
      {
        id: Date.now(),
        text,
        completed: false
      },
      ...current
    ]);

    setInput("");
    setFilter("all");
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));

    if (editingId === id) {
      setEditingId(null);
      setEditText("");
    }
  }

  function startEditing(task) {
    setEditingId(task.id);
    setEditText(task.text);
  }

  function saveEdit(id) {
    const text = editText.trim();
    if (!text) return;

    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, text } : task
      )
    );

    setEditingId(null);
    setEditText("");
  }

  function clearCompleted() {
    setTasks((current) => current.filter((task) => !task.completed));
  }

  return (
    <main className="page">
      <div className="app-shell">
        <header className="topbar">
          <div className="brand">
            <div className="brand-icon">
              <ListTodo size={25} />
            </div>
            <span>TaskFlow</span>
          </div>
          <span className="saved-label">
            <span className="status-dot" />
            Saved locally
          </span>
        </header>

        <section className="welcome">
          <div className="eyebrow">
            <Sparkles size={15} />
            YOUR PERSONAL WORKSPACE
          </div>
          <h1>Make today <span>count.</span></h1>
          <p>Small steps every day lead to big results.</p>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon purple"><ListTodo size={21} /></div>
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total tasks</span>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Clock size={21} /></div>
            <span className="stat-number">{remainingCount}</span>
            <span className="stat-label">Remaining</span>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><CircleCheck size={21} /></div>
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </section>

        <section className="progress-card">
          <div className="progress-heading">
            <div>
              <h2>Daily progress</h2>
              <p>Keep going, you're doing great!</p>
            </div>
            <strong>{progress}%</strong>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="tasks-panel">
          <div className="section-heading">
            <div>
              <h2>My tasks</h2>
              <p>Plan it. Do it. Done.</p>
            </div>
            <span className="task-count">{remainingCount} left</span>
          </div>

          <form className="add-form" onSubmit={addTask}>
            <input
              aria-label="New task"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="What do you need to do?"
              maxLength={200}
            />
            <button className="add-button" type="submit">
              <Plus size={19} />
              <span>Add task</span>
            </button>
          </form>

          <div className="toolbar">
            <div className="filters">
              {[
                ["all", "All"],
                ["active", "Active"],
                ["completed", "Completed"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`filter-button ${filter === value ? "selected" : ""}`}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <label className="search-box">
              <Search size={16} />
              <input
                aria-label="Search tasks"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
              />
            </label>
          </div>

          <div className="task-list">
            {visibleTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><ListTodo size={28} /></div>
                <h3>{search ? "No matching tasks" : "Nothing here yet"}</h3>
                <p>
                  {search
                    ? "Try another search term."
                    : "Add a task above and get your day started."}
                </p>
              </div>
            ) : (
              visibleTasks.map((task) => (
                <article
                  className={`task-row ${task.completed ? "is-completed" : ""}`}
                  key={task.id}
                >
                  <button
                    type="button"
                    className={`check-button ${task.completed ? "checked" : ""}`}
                    onClick={() => toggleTask(task.id)}
                    aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                  >
                    {task.completed && <Check size={15} />}
                  </button>

                  {editingId === task.id ? (
                    <form
                      className="edit-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        saveEdit(task.id);
                      }}
                    >
                      <input
                        autoFocus
                        value={editText}
                        onChange={(event) => setEditText(event.target.value)}
                        maxLength={200}
                        aria-label="Edit task"
                      />
                      <button className="icon-button save-button" type="submit" aria-label="Save">
                        <Check size={17} />
                      </button>
                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => setEditingId(null)}
                        aria-label="Cancel editing"
                      >
                        <X size={17} />
                      </button>
                    </form>
                  ) : (
                    <>
                      <span className="task-text">{task.text}</span>
                      <div className="task-actions">
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => startEditing(task)}
                          aria-label="Edit task"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="icon-button delete-button"
                          onClick={() => deleteTask(task.id)}
                          aria-label="Delete task"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </article>
              ))
            )}
          </div>

          <footer className="list-footer">
            <span>{completedCount} of {tasks.length} tasks completed</span>
            {completedCount > 0 && (
              <button type="button" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </footer>
        </section>

        <footer className="page-footer">
          Made for a more focused day <span>♥</span>
        </footer>
      </div>
    </main>
  );
}
