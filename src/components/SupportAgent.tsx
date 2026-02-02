import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { useTodos } from '../context/TodoContext';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import { format } from 'date-fns';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: number;
}

export function SupportAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hi! I'm your Todo Assistant. I can help you manage your tasks. Try asking 'summary' or 'overdue'.",
      sender: 'agent',
      timestamp: Date.now(),
    },
  ]);
  const { todos } = useTodos();
  const todosRef = useRef(todos);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasNotifiedRef = useRef(false);

  // Keep todos ref in sync
  useEffect(() => {
    todosRef.current = todos;
  }, [todos]);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Uncompleted Task Floating Notifications
  useEffect(() => {
    const checkUncompletedTasks = () => {
      const currentTodos = todosRef.current;
      const uncompleted = currentTodos.filter(t => !t.completed);
      const overdue = uncompleted.filter(t => t.dueDate && t.dueDate < Date.now());

      if (overdue.length > 0) {
        toast.error(`You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}!`, {
          description: "Don't forget to complete them.",
          duration: 5000,
          id: 'overdue-toast' // Prevent duplicates
        });
      } else if (uncompleted.length > 0) {
        // Only show general pending info if no overdue tasks
        // And maybe less aggressively (e.g. only if not recently notified)
        toast.info(`You have ${uncompleted.length} pending task${uncompleted.length > 1 ? 's' : ''}.`, {
          description: "Keep up the good work!",
          duration: 5000,
          id: 'pending-toast'
        });
      }
    };

    // Check on mount (with a slight delay to allow app to settle)
    const timer = setTimeout(() => {
       checkUncompletedTasks();
       hasNotifiedRef.current = true;
    }, 1000);

    // Check every 5 minutes
    const interval = setInterval(checkUncompletedTasks, 5 * 60 * 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []); // Empty dependency array - only runs on mount/unmount

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const responseText = generateResponse(input.toLowerCase());
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'agent',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 600);
  };

  const generateResponse = (query: string): string => {
    if (query.includes('help')) {
      return "I can help with: \n- 'summary': Get task stats\n- 'overdue': List overdue tasks\n- 'pending': List pending tasks\n- 'categories': List all categories";
    }
    
    if (query.includes('summary')) {
      const total = todos.length;
      const completed = todos.filter(t => t.completed).length;
      return `You have ${total} tasks in total. ${completed} completed and ${total - completed} pending.`;
    }

    if (query.includes('overdue')) {
      const overdue = todos.filter(t => !t.completed && t.dueDate && t.dueDate < Date.now());
      if (overdue.length === 0) return "Great news! You have no overdue tasks.";
      return `You have ${overdue.length} overdue tasks:\n${overdue.map(t => `• ${t.text}`).join('\n')}`;
    }

    if (query.includes('pending')) {
      const pending = todos.filter(t => !t.completed);
      if (pending.length === 0) return "You're all caught up!";
      const top5 = pending.slice(0, 5);
      return `You have ${pending.length} pending tasks. Here are the top ${top5.length}:\n${top5.map(t => `• ${t.text}`).join('\n')}`;
    }

    if (query.includes('hello') || query.includes('hi')) {
      return "Hello there! How can I assist you with your tasks today?";
    }

    return "I'm not sure I understand. Try typing 'help' to see what I can do.";
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200 z-50 flex items-center justify-center"
        aria-label="Open Support Agent"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10 fade-in duration-200">
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Todo Assistant</h3>
              <p className="text-indigo-200 text-xs">Always here to help</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  "flex gap-3 max-w-[85%]",
                  msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  msg.sender === 'user' ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"
                )}>
                  {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={clsx(
                  "p-3 rounded-2xl text-sm whitespace-pre-wrap",
                  msg.sender === 'user' 
                    ? "bg-indigo-600 text-white rounded-tr-none" 
                    : "bg-white dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-tl-none shadow-sm"
                )}>
                  {msg.text}
                  <div className={clsx(
                    "text-[10px] mt-1 opacity-70",
                    msg.sender === 'user' ? "text-indigo-200" : "text-gray-400"
                  )}>
                    {format(msg.timestamp, 'h:mm a')}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
