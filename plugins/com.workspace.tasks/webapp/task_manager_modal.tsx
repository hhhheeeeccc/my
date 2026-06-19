import "./task_manager_modal.scss";
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Filter,
  X,
  Search,
  ChevronRight
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

const TaskManagerModal: React.FC<TaskManagerModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isRTL = i18n.dir() === 'rtl';

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesFilter =
        filter === 'all' ? true :
        filter === 'active' ? !task.completed :
        task.completed;

      const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, searchQuery]);

  const activeCount = tasks.filter(t => !t.completed).length;

  if (!isOpen) return null;

  return (
    <div className="task-manager-overlay" onClick={onClose}>
      <motion.div
        className="task-manager-container"
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
              <h2 className="text-xl font-semibold tracking-tight text-slate-100">
                {t('tasks.title')}
              </h2>
              <span className="text-xs font-mono text-slate-500 tracking-wider uppercase">
                {t('tasks.subtitle')}
              </span>
            </div>
            <button className="close-button" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={addTask} className="task-input-group">
            <div className="input-wrapper">
              <Plus className="input-icon" size={18} />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('tasks.placeholder')}
                className="task-input"
              />
            </div>
          </form>

          <div className="controls-bar">
            <div className="filter-group">
              {(['all', 'active', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                >
                  {t(`tasks.filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
                </button>
              ))}
            </div>

            <div className="search-wrapper">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                placeholder="..."
              />
            </div>
          </div>
        </header>

        <div className="task-list-viewport">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredTasks.length > 0 ? (
              <div className="task-list">
                {filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`task-item ${task.completed ? 'completed' : ''}`}
                  >
                    <button
                      className="status-toggle"
                      onClick={() => toggleTask(task.id)}
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
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
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
