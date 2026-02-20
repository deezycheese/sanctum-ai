import React from 'react';
import { MessageSquare, Brain, LayoutDashboard, Book, Lock, ShieldCheck } from 'lucide-react';
import { AppState } from '../types';

interface SidebarProps {
  activeTab: AppState['activeTab'];
  onTabChange: (tab: AppState['activeTab']) => void;
  onLock: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onLock }) => {
  const navItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'dashboard', label: 'Life Analytics', icon: LayoutDashboard },
    { id: 'memories', label: 'Memory Bank', icon: Brain },
    { id: 'journal', label: 'Journal', icon: Book },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-primary-500" />
        <span className="text-xl font-bold tracking-tight text-white hidden md:block">Sanctum</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as AppState['activeTab'])}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-600/10 text-primary-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="hidden md:block font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLock}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <Lock size={20} />
          <span className="hidden md:block font-medium">Secure Lock</span>
        </button>
        <div className="text-xs text-slate-600 text-center mt-2 hidden md:block">v1.0.1</div>
      </div>
    </div>
  );
};
