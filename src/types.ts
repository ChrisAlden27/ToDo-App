export type Category = string;

export const DEFAULT_CATEGORIES: Category[] = ['Personal', 'Work', 'Shopping', 'Health', 'Other'];

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: Category;
  createdAt: number;
  completedAt?: number;
  dueDate?: number;
}

export interface HistoryLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'complete' | 'uncomplete';
  todoText: string;
  timestamp: number;
}
