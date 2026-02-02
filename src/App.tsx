import { ThemeProvider } from './context/ThemeContext';
import { TodoProvider } from './context/TodoContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeToggle } from './components/ThemeToggle';
import { AddTodo } from './components/AddTodo';
import { TodoList } from './components/TodoList';
import { Dashboard } from './components/Dashboard';
import { HistoryList } from './components/HistoryList';
import { SupportAgent } from './components/SupportAgent';
import { Login } from './components/Login';
import { Toaster } from 'sonner';
import { CheckSquare, LogOut } from 'lucide-react';

function AppContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    // Key forces TodoProvider to remount when user changes, resetting state
    <TodoProvider key={user.id} userId={user.id}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Toaster position="top-right" richColors />
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <CheckSquare className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Task Master
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden sm:block">
                  Hi, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
              <ThemeToggle />
            </div>
          </header>

          <Dashboard />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
                <AddTodo />
                <TodoList />
              </div>
            </div>

            <div className="lg:col-span-1">
              <HistoryList />
            </div>
          </div>
        </div>
        <SupportAgent />
      </div>
    </TodoProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
