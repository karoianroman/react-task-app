import React, { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import './App.css';

const PRIORITIES = ['low', 'medium', 'high'];

const PRIORITY_LABEL = { low: 'LOW', medium: 'MED', high: 'HIGH' };

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onAdd({ title: title.trim(), priority });
    setTitle('');
    setPriority('medium');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        className="task-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task..."
        autoFocus
      />
      <div className="form-controls">
        <div className="priority-toggle">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              className={`priority-btn priority-${p} ${priority === p ? 'active' : ''}`}
              onClick={() => setPriority(p)}
            >
              {PRIORITY_LABEL[p]}
            </button>
          ))}
        </div>
        <button type="submit" className="add-btn">ADD</button>
      </div>
    </form>
  );
}

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`task-item ${task.done ? 'done' : ''} priority-border-${task.priority}`}>
      <button
        className={`check-btn ${task.done ? 'checked' : ''}`}
        onClick={() => onToggle(task)}
        aria-label="toggle done"
      >
        {task.done ? '✓' : ''}
      </button>
      <div className="task-content">
        <span className="task-title">{task.title}</span>
        {task.description && (
          <span className="task-desc">{task.description}</span>
        )}
      </div>
      <span className={`priority-tag priority-${task.priority}`}>
        {PRIORITY_LABEL[task.priority]}
      </span>
      <button className="delete-btn" onClick={() => onDelete(task.id)} aria-label="delete">
        ×
      </button>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (e) {
      setError('Cannot connect to API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (task) => {
    const newTask = await createTask(task);
    setTasks((prev) => [...prev, newTask]);
  };

  const handleToggle = async (task) => {
    const updated = await updateTask(task.id, { done: !task.done });
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  const doneCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <h1 className="app-title">TASKS</h1>
          {totalCount > 0 && (
            <span className="progress-label">
              {doneCount}/{totalCount}
            </span>
          )}
        </div>
        {totalCount > 0 && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(doneCount / totalCount) * 100}%` }}
            />
          </div>
        )}
      </header>

      <TaskForm onAdd={handleAdd} />

      <div className="filters">
        {['all', 'active', 'done'].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="task-list">
        {loading && <div className="state-msg">Loading...</div>}
        {error && <div className="state-msg error">{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="state-msg">No tasks here</div>
        )}
        {filtered.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
