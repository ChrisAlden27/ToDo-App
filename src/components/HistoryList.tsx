import { useTodos } from '../context/TodoContext';
import { format } from 'date-fns';
import { History, Trash2 } from 'lucide-react';

export function HistoryList() {
  const { history, clearHistory } = useTodos();

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No history available.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History className="w-5 h-5" />
          Activity Log
        </h3>
        <button
          onClick={clearHistory}
          className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {history.map((log) => (
          <div key={log.id} className="text-sm border-b dark:border-gray-700 last:border-0 pb-2">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span className="capitalize font-medium text-blue-600 dark:text-blue-400">
                {log.action}
              </span>
              <span>{format(log.timestamp, 'MMM d, h:mm:ss a')}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
              {log.todoText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
