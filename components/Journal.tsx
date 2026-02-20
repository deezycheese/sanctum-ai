import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { GeminiService } from '../services/gemini';
import { Save, Loader2, Calendar } from 'lucide-react';

interface JournalProps {
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
}

export const Journal: React.FC<JournalProps> = ({ entries, onAddEntry }) => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    
    // AI Analysis for metadata
    const analysis = await GeminiService.analyzeEntry(content);
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: content,
      mood: analysis.mood as any,
      tags: analysis.tags
    };

    onAddEntry(newEntry);
    setContent('');
    setIsAnalyzing(false);
  };

  return (
    <div className="h-full bg-slate-950 flex flex-col md:flex-row">
      {/* Entry List */}
      <div className="w-full md:w-80 border-r border-slate-800 overflow-y-auto">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="text-slate-400" size={18} /> Journal History
          </h2>
        </div>
        <div className="divide-y divide-slate-800">
          {entries.length === 0 && (
            <p className="p-4 text-sm text-slate-500 text-center">No entries yet.</p>
          )}
          {entries.slice().reverse().map((entry) => (
            <div key={entry.id} className="p-4 hover:bg-slate-900 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-1">
                 <span className="text-sm font-medium text-slate-200">
                  {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                 </span>
                 <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    entry.mood === 'Great' ? 'bg-emerald-500/20 text-emerald-300' :
                    entry.mood === 'Stressed' ? 'bg-orange-500/20 text-orange-300' :
                    'bg-slate-700 text-slate-300'
                 }`}>{entry.mood}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{entry.content}</p>
              <div className="mt-2 flex gap-1 flex-wrap">
                {entry.tags.map(tag => (
                  <span key={tag} className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col p-6">
        <h2 className="text-2xl font-bold text-white mb-4">New Reflection</h2>
        <div className="flex-1 relative">
           <textarea
             value={content}
             onChange={(e) => setContent(e.target.value)}
             placeholder="How are you feeling right now? Be honest..."
             className="w-full h-full bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-slate-200 resize-none focus:outline-none focus:border-slate-600 focus:bg-slate-900 transition-all placeholder-slate-600"
           />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!content.trim() || isAnalyzing}
            className="bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isAnalyzing ? "Analyzing & Encrypting..." : "Save Entry"}
          </button>
        </div>
      </div>
    </div>
  );
};
