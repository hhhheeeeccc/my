import "./task_manager_modal.scss";
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  X,
  Search
} from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TaskManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Cryptographically strong ID generator for SonarCloud Security Hotspot
const generateSecureId = () => {
  if (typeof crypto !== 'undefined') {
    if (crypto.randomUUID) return crypto.randomUUID();
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0].toString(36) + Date.now().toString(36);
  }
  return 'task-' + Date.now() + Math.floor(Math.random() * 1000);
};

// Extracted Task Item Component for performance & maintainability
const TaskItem: React.FC<{
  task: Task;
  isRTL: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}> = React.memo(({ task, isRTL, onToggle, onDelete }) => (
  <motion.div
    layout
    role="listitem"
    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className={`task-item ${task.completed ? 'completed' : ''}`}
  >
    <button
      className="status-toggle"
      onClick={() => onToggle(task.id)}
      aria-label={task.completed ? "Mark as active" : "Mark as completed"}
    >
      {task.completed ? (
        <CheckCircle2 size={18} className="text-blue-500" />
      ) : (
        <Circle size={18} className="text-slate-600" />
      )}
    </button>
    <span className="task-text">{task.text}</span>
    <button
      className="delete-btn"
      onClick={() => onDelete(task.id)}
      aria-label="Delete task"
    >
      <Trash2 size={16} />
    </button>
  </motion.div>
));

TaskItem.displayName = 'TaskItem';

const TaskManagerModal: React.FC<TaskManagerModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isRTL = i18n.dir() === 'rtl';

  const addTask = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    const newTask: Task = {
      id: generateSecureId(),
      text: trimmedValue,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks(prev => [newTask, ...prev]);
    setInputValue('');
  }, [inputValue]);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.completed));
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return tasks.filter(task => {
      const matchesFilter =
        activeFilter === 'all' ? true :
        activeFilter === 'active' ? !task.completed :
        task.completed;

      const matchesSearch = task.text.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [tasks, activeFilter, searchQuery]);

  const activeCount = tasks.filter(t => !t.completed).length;

  if (!isOpen) return null;

  return (
    <div
      className="task-manager-overlay"
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        className="task-manager-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-manager-title"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}
        dir={i18n.dir()}
      >
        <header className="task-manager-header">
          <div className="header-top">
            <div className="title-group">
              <h2 id="task-manager-title" className="text-xl font-semibold tracking-tight text-slate-100">
                {t('tasks.title')}
              </h2>
              <span className="text-xs font-mono text-slate-500 tracking-wider uppercase">
                {t('tasks.subtitle')}
              </span>
            </div>
            <button
              className="close-button"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={addTask} className="task-input-group">
            <div className="input-wrapper">
              <Plus className="input-icon" size={18} aria-hidden="true" />
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={t('tasks.placeholder')}
                className="task-input"
                aria-label={t('tasks.placeholder')}
              />
            </div>
          </form>

          <div className="controls-bar">
            <div className="filter-group" role="radiogroup" aria-label="Task filters">
              {(['all', 'active', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                  aria-pressed={activeFilter === f}
                >
                  {t(`tasks.filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
                </button>
              ))}
            </div>

            <div className="search-wrapper">
              <Search size={14} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
                placeholder="..."
                aria-label="Search tasks"
              />
            </div>
          </div>
        </header>

        <div className="task-list-viewport">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredTasks.length > 0 ? (
              <div className="task-list" role="list">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isRTL={isRTL}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="empty-state"
              >
                <p className="text-slate-500 text-sm">{t('tasks.empty')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="task-manager-footer">
          <span className="count-text">
            {t('tasks.itemsRemaining', { count: activeCount })}
          </span>
          {tasks.some(t => t.completed) && (
            <button className="clear-btn" onClick={clearCompleted}>
              {t('tasks.clearCompleted')}
            </button>
          )}
        </footer>
      </motion.div>
    </div>
  );
};

export default TaskManagerModal;
