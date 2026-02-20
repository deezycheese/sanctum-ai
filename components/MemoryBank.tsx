import React, { useState } from 'react';
import { Memory, MemoryCategory } from '../types';
import { Trash2, Tag, Plus, Save } from 'lucide-react';

interface MemoryBankProps {
  memories: Memory[];
  onAddMemory: (m: Omit<Memory, 'id'>) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoryBank: React.FC<MemoryBankProps> = ({ memories, onAddMemory, onDeleteMemory }) => {
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>(MemoryCategory.IDENTITY);

  const handleAdd = () => {
    if (!newContent.trim()) return;
    onAddMemory({
      content: newContent,
      category: newCategory,
      createdAt: Date.now(),
      importance: 5
    });
    setNewContent('');
  };

  // Group memories by category
  const groupedMemories = Object.values(MemoryCategory).reduce((acc, category) => {
    acc[category] = memories.filter(m => m.category === category);
    return acc;
  }, {} as Record<MemoryCategory, Memory[]>);

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h2 className="text-2xl font-bold text-white mb-2">Memory Bank</h2>
          <p className="text-slate-400">Core identity data that shapes the AI's understanding of you.</p>
        </header>

        {/* Add New Memory */}
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-4">
          <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Plus size={16} /> Add Core Memory
          </h3>
          <div className="flex flex-col md:flex-row gap-3">
             <select 
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as MemoryCategory)}
              className="bg-slate-950 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            >
              {Object.values(MemoryCategory).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="e.g., 'I tend to self-sabotage when things are going too well.'"
              className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            />
            <button
              onClick={handleAdd}
              className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 justify-center"
            >
              <Save size={16} /> Save
            </button>
          </div>
        </div>

        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedMemories).map(([category, items]) => {
            if (items.length === 0) return null;
            return (
              <div key={category} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <h4 className="font-medium text-slate-200 text-sm flex items-center gap-2">
                    <Tag size={14} className="text-primary-400" /> {category}
                  </h4>
                  <span className="text-xs text-slate-500">{items.length} facts</span>
                </div>
                <ul className="divide-y divide-slate-800">
                  {items.map(memory => (
                    <li key={memory.id} className="p-4 hover:bg-slate-800/30 transition-colors group flex justify-between items-start gap-4">
                      <p className="text-sm text-slate-300 leading-relaxed">{memory.content}</p>
                      <button
                        onClick={() => onDeleteMemory(memory.id)}
                        className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        title="Forget this memory"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
