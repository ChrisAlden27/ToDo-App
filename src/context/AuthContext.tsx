import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Storing password in local storage is not secure for production, but per requirements
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  findUserByEmail: (email: string) => User | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('current_user', null);
  const [users, setUsers] = useLocalStorage<User[]>('users_db', []);

  const login = (email: string, password: string) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      // Don't store password in session
      setUser({ id: foundUser.id, name: foundUser.name, email: foundUser.email });
      toast.success('Welcome back!');
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string) => {
    if (users.some(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: email.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name,
      email,
      password,
    };

    setUsers(prev => [...prev, newUser]);
    
    // Login automatically
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email });
    toast.success('Account created successfully!');
    return true;
  };

  const logout = () => {
    setUser(null);
    toast.info('Logged out successfully');
  };

  const findUserByEmail = (email: string) => users.find(u => u.email === email);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, findUserByEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
