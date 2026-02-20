import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { Message, UserProfile, Memory, JournalEntry } from '../types';
import { GeminiService } from '../services/gemini';

interface ChatProps {
  history: Message[];
  setHistory: (msgs: Message[]) => void;
  userProfile: UserProfile;
  memories: Memory[];
  journalEntries: JournalEntry[];
}

export const Chat: React.FC<ChatProps> = ({ history, setHistory, userProfile, memories, journalEntries }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    const updatedHistory = [...history, userMsg];
    setHistory(updatedHistory);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await GeminiService.sendMessage(
        updatedHistory,
        userMsg.content,
        userProfile,
        memories,
        journalEntries
      );

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };

      setHistory([...updatedHistory, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-white">Sanctum Interface</h2>
        <p className="text-xs text-slate-400">End-to-end encrypted session active</p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 opacity-50">
            <Bot size={48} />
            <p>Sanctum is ready. Share your thoughts.</p>
          </div>
        )}
        {history.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`flex flex-col space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                 <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600/20 text-indigo-100 border border-indigo-500/20 rounded-tr-sm' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-slate-500 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start w-full animate-pulse">
             <div className="flex max-w-[70%] gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2 border border-slate-700">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="text-xs text-slate-400">Thinking...</span>
              </div>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your thoughts..."
            className="w-full bg-slate-950 text-white placeholder-slate-500 border border-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none h-14 scrollbar-hide"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 p-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
