import React, { useState } from 'react';
import { Plus, Settings, X } from 'lucide-react';
import { useTodos } from '../context/TodoContext';
import { Category } from '../types';

export function AddTodo() {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>('');
  const [dueDate, setDueDate] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const { addTodo, categories, addCategory, deleteCategory } = useTodos();

  // Set default category when categories load or change
  React.useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    const timestamp = dueDate ? new Date(dueDate).getTime() : undefined;
    addTodo(text, category || categories[0], timestamp);
    setText('');
    setDueDate('');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2">
            <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center sm:hidden"
            >
            <Plus className="w-6 h-6" />
            </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
                {categories.map((cat) => (
                <option key={cat} value={cat}>
                    {cat}
                </option>
                ))}
            </select>

            <input 
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <button
                type="button"
                onClick={() => setShowCategoryManager(!showCategoryManager)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Manage Categories"
            >
                <Settings className="w-5 h-5" />
            </button>

            <button
            type="submit"
            className="hidden sm:flex p-2 ml-auto bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 items-center justify-center"
            >
            <Plus className="w-6 h-6" />
            </button>
        </div>
      </form>

      {showCategoryManager && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Manage Categories</h3>
            <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
                <button
                    onClick={handleAddCategory}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                    Add
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <div key={cat} className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-sm">
                        <span>{cat}</span>
                        {categories.length > 1 && (
                            <button 
                                onClick={() => deleteCategory(cat)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
