import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Chat } from './components/Chat';
import { MemoryBank } from './components/MemoryBank';
import { Dashboard } from './components/Dashboard';
import { LockScreen } from './components/LockScreen';
import { Journal } from './components/Journal';
import { StorageService } from './services/storage';
import { AppState, Memory, Message, UserProfile, JournalEntry } from './types';

// Default initial state
const DEFAULT_PROFILE: UserProfile = {
  name: 'User',
  communicationStyle: 'Balanced',
  currentFocus: 'Personal Growth',
  traits: []
};

export default function App() {
  const [locked, setLocked] = useState(true);
  const [activeTab, setActiveTab] = useState<AppState['activeTab']>('chat');
  
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [history, setHistory] = useState<Message[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  // Load data on unlock (simulated by simple effect, real app would decrypt)
  useEffect(() => {
    if (!locked) {
      setUserProfile(StorageService.load('profile', DEFAULT_PROFILE));
      setMemories(StorageService.load('memories', []));
      setHistory(StorageService.load('history', []));
      setJournalEntries(StorageService.load('journal', []));
    }
  }, [locked]);

  // Persist data whenever it changes
  useEffect(() => {
    if (!locked) StorageService.save('profile', userProfile);
  }, [userProfile, locked]);

  useEffect(() => {
    if (!locked) StorageService.save('memories', memories);
  }, [memories, locked]);

  useEffect(() => {
    if (!locked) StorageService.save('history', history);
  }, [history, locked]);

  useEffect(() => {
    if (!locked) StorageService.save('journal', journalEntries);
  }, [journalEntries, locked]);

  // Handlers
  const handleAddMemory = (newMemory: Omit<Memory, 'id'>) => {
    const memory = { ...newMemory, id: Date.now().toString() };
    setMemories(prev => [...prev, memory]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const handleAddJournal = (entry: JournalEntry) => {
    setJournalEntries(prev => [...prev, entry]);
    // Optionally switch to dashboard to see impact?
    // setActiveTab('dashboard');
  };

  if (locked) {
    return <LockScreen onUnlock={() => setLocked(false)} />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLock={() => setLocked(true)}
      />

      <main className="flex-1 h-full overflow-hidden relative">
        {activeTab === 'chat' && (
          <Chat 
            history={history} 
            setHistory={setHistory}
            userProfile={userProfile}
            memories={memories}
            journalEntries={journalEntries}
          />
        )}
        {activeTab === 'memories' && (
          <MemoryBank 
            memories={memories}
            onAddMemory={handleAddMemory}
            onDeleteMemory={handleDeleteMemory}
          />
        )}
        {activeTab === 'dashboard' && (
          <Dashboard 
            entries={journalEntries}
            profile={userProfile}
            setProfile={setUserProfile}
          />
        )}
        {activeTab === 'journal' && (
          <Journal 
            entries={journalEntries}
            onAddEntry={handleAddJournal}
          />
        )}
      </main>
    </div>
  );
}