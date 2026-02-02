import { useState } from 'react';
import { Trash2, Edit2, Check, X, Calendar } from 'lucide-react';
import { Todo, Category } from '../types';
import { useTodos } from '../context/TodoContext';
import { format } from 'date-fns';
import { clsx } from 'clsx';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo, updateTodo, categories } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editCategory, setEditCategory] = useState<Category>(todo.category);
  const [editDueDate, setEditDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : ''
  );

  const handleUpdate = () => {
    if (editText.trim()) {
      const timestamp = editDueDate ? new Date(editDueDate).getTime() : undefined;
      updateTodo(todo.id, editText, editCategory, timestamp);
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setEditText(todo.text);
    setEditCategory(todo.category);
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : '');
    setIsEditing(false);
  };

  return (
    <div
      className={clsx(
        'flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 mb-3 rounded-lg shadow-sm border transition-all',
        todo.completed
          ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-75'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
      )}
    >
      <div className="flex items-center gap-3 flex-1 w-full">
        <button
          onClick={() => toggleTodo(todo.id)}
          className={clsx(
            'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0',
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 dark:border-gray-500 hover:border-green-500'
          )}
        >
          {todo.completed && <Check className="w-4 h-4" />}
        </button>

        {isEditing ? (
          <div className="flex-1 flex flex-col gap-2 w-full">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              autoFocus
            />
            <div className="flex gap-2">
                <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as Category)}
                className="p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                >
                {categories.map((cat) => (
                    <option key={cat} value={cat}>
                    {cat}
                    </option>
                ))}
                </select>
                <input
                    type="datetime-local"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                />
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <p
              className={clsx(
                'text-lg font-medium break-all',
                todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'
              )}
            >
              {todo.text}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 font-medium">
                {todo.category}
              </span>
              <span>• {format(todo.createdAt, 'MMM d, h:mm a')}</span>
              {todo.dueDate && (
                  <span className={clsx(
                      "flex items-center gap-1",
                      !todo.completed && todo.dueDate < Date.now() ? "text-red-500 font-medium" : "text-blue-500"
                  )}>
                      • <Calendar className="w-3 h-3" /> 
                      {format(todo.dueDate, 'MMM d, h:mm a')}
                  </span>
              )}
              {todo.completed && todo.completedAt && (
                  <span className="text-green-600 dark:text-green-400">
                      • Completed {format(todo.completedAt, 'h:mm a')}
                  </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={cancelEdit}
              className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
