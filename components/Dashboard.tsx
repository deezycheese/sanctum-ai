import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { JournalEntry, UserProfile } from '../types';
import { Activity, Target, BrainCircuit, TrendingUp } from 'lucide-react';

interface DashboardProps {
  entries: JournalEntry[];
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ entries, profile, setProfile }) => {
  // Process data for charts
  const data = entries.slice().reverse().map(entry => {
    let moodVal = 3;
    if (entry.mood === 'Great') moodVal = 5;
    if (entry.mood === 'Good') moodVal = 4;
    if (entry.mood === 'Neutral') moodVal = 3;
    if (entry.mood === 'Stressed') moodVal = 2;
    if (entry.mood === 'Bad') moodVal = 1;

    return {
      date: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      mood: moodVal,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-2 rounded shadow-xl text-xs">
          <p className="text-slate-200 font-bold">{label}</p>
          <p className="text-primary-400">Mood Level: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h2 className="text-2xl font-bold text-white mb-2">Life Analytics</h2>
          <p className="text-slate-400">Your psychological profile and emotional trends.</p>
        </header>

        {/* Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
             <div className="flex items-center gap-3 mb-4">
                <BrainCircuit className="text-purple-400" size={24}/>
                <h3 className="text-lg font-semibold text-white">Identity & Focus</h3>
             </div>
             <div className="space-y-4">
               <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Current Focus</label>
                  <input 
                    type="text" 
                    value={profile.currentFocus}
                    onChange={(e) => setProfile({...profile, currentFocus: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:border-purple-500 focus:outline-none"
                  />
               </div>
               <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Communication Style</label>
                  <div className="text-sm text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {profile.communicationStyle}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Detected automatically from your conversations.</p>
               </div>
             </div>
          </div>

           <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
             <div className="flex items-center gap-3 mb-4">
                <Target className="text-emerald-400" size={24}/>
                <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                   <div className="text-2xl font-bold text-white">{entries.length}</div>
                   <div className="text-xs text-slate-500">Journal Entries</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                   <div className="text-2xl font-bold text-white">
                      {data.length > 0 ? (data.reduce((a, b) => a + b.mood, 0) / data.length).toFixed(1) : '-'}
                   </div>
                   <div className="text-xs text-slate-500">Avg Mood Score</div>
                </div>
             </div>
          </div>
        </div>

        {/* Mood Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="text-primary-400" size={24} />
              <h3 className="text-lg font-semibold text-white">Emotional Trend</h3>
            </div>
            <span className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">Last 14 Entries</span>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 6]} tickLine={false} hide />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pattern Recognition (Mock) */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={100} />
           </div>
           <h3 className="text-lg font-semibold text-white mb-3 relative z-10">AI Recognized Patterns</h3>
           <ul className="space-y-3 relative z-10">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 shrink-0"></span>
                You tend to feel more stressed when you mention "deadlines" but perform highly.
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                 <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0"></span>
                 Consistency in journaling correlates with higher reported mood scores.
              </li>
           </ul>
        </div>
      </div>
    </div>
  );
};
