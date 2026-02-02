import { useState } from 'react';
import { useTodos } from '../context/TodoContext';
import { TodoItem } from './TodoItem';
import { Category } from '../types';

export function TodoList() {
  const { todos, categories } = useTodos();
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Completed'>('All');

  const filteredTodos = todos.filter((todo) => {
    const matchesCategory = filterCategory === 'All' || todo.category === filterCategory;
    const matchesStatus =
      filterStatus === 'All'
        ? true
        : filterStatus === 'Active'
        ? !todo.completed
        : todo.completed;
    return matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as Category | 'All')}
            className="p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm"
          >
            <option value="All">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Active' | 'Completed')}
            className="p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 ml-auto flex items-center">
            {filteredTodos.length} tasks found
        </div>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No todos found matching your filters.
        </div>
      ) : (
        filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
      )}
    </div>
  );
}
