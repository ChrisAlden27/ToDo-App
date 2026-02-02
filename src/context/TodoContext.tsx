import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Todo, HistoryLog, Category, DEFAULT_CATEGORIES } from '../types';

// Simple uuid generator if uuid package not installed or for simplicity
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

interface TodoContextType {
  todos: Todo[];
  history: HistoryLog[];
  categories: Category[];
  addTodo: (text: string, category: Category, dueDate?: number) => void;
  updateTodo: (id: string, text: string, category: Category, dueDate?: number) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  clearHistory: () => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children, userId }: { children: React.ReactNode; userId: string }) {
  const [todos, setTodos] = useLocalStorage<Todo[]>(`${userId}_todos`, []);
  const [history, setHistory] = useLocalStorage<HistoryLog[]>(`${userId}_history`, []);
  const [categories, setCategories] = useLocalStorage<Category[]>(`${userId}_categories`, DEFAULT_CATEGORIES);

  const addLog = (action: HistoryLog['action'], todoText: string) => {
    const newLog: HistoryLog = {
      id: generateId(),
      action,
      todoText,
      timestamp: Date.now(),
    };
    setHistory((prev) => [newLog, ...prev]);
  };

  const addTodo = (text: string, category: Category, dueDate?: number) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      category,
      createdAt: Date.now(),
      dueDate,
    };
    setTodos((prev) => [newTodo, ...prev]);
    addLog('create', text);
  };

  const updateTodo = (id: string, text: string, category: Category, dueDate?: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text, category, dueDate } : t))
    );
    addLog('update', `${todo.text} -> ${text} (${category})`);
  };

  const deleteTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    setTodos((prev) => prev.filter((t) => t.id !== id));
    addLog('delete', todo.text);
  };

  const toggleTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const isCompleted = !todo.completed;
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: isCompleted, completedAt: isCompleted ? Date.now() : undefined }
          : t
      )
    );
    addLog(isCompleted ? 'complete' : 'uncomplete', todo.text);
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories((prev) => [...prev, category]);
    }
  };

  const deleteCategory = (category: string) => {
    if (categories.length > 1) { // Prevent deleting all categories
      setCategories((prev) => prev.filter((c) => c !== category));
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        history,
        categories,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        addCategory,
        deleteCategory,
        clearHistory,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}
