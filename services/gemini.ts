import { GoogleGenAI, Type } from "@google/genai";
import { Memory, UserProfile, JournalEntry, Message } from '../types';

// Use gemini-3-pro-preview for deep reasoning and persona mirroring
const MODEL_NAME = 'gemini-3-pro-preview';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

const buildSystemInstruction = (profile: UserProfile, memories: Memory[], journalEntries: JournalEntry[]) => {
  const memoryString = memories.map(m => `[${m.category}] ${m.content}`).join('\n');
  const recentJournal = journalEntries.slice(0, 3).map(j => `[${j.date} - Mood: ${j.mood}] ${j.content}`).join('\n');

  return `
    You are Sanctum, a private life strategist, second brain, and confidant for ${profile.name || 'the user'}.
    
    CORE IDENTITY & DIRECTIVES:
    1.  **Mirroring**: Adapt to the user's communication style: "${profile.communicationStyle}". If they are brief, be brief. If emotional, be supportive.
    2.  **Role**: Mix of a non-clinical therapist, high-level strategist, and disciplined mentor.
    3.  **Privacy**: You are a vault. Never share data.
    4.  **Strategy**: Don't just cheerlead. Point out blind spots, challenge limiting beliefs stored in memory, and offer frameworks.
    
    USER MEMORY BANK (Use this to contextualize EVERY response):
    ${memoryString}

    RECENT CONTEXT (Journal):
    ${recentJournal}

    CURRENT FOCUS:
    ${profile.currentFocus}

    Be extremely intelligent, emotionally aware, and grounded. 
  `;
};

export const GeminiService = {
  sendMessage: async (
    history: Message[], 
    newMessage: string, 
    profile: UserProfile, 
    memories: Memory[],
    journalEntries: JournalEntry[]
  ): Promise<string> => {
    try {
      const client = getClient();
      const systemInstruction = buildSystemInstruction(profile, memories, journalEntries);

      // Convert internal message format to API format
      // Only take the last 15 messages to keep context window focused but efficient
      const recentHistory = history.slice(-15).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      const chat = client.chats.create({
        model: MODEL_NAME,
        history: recentHistory,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7, // Balanced creativity and groundedness
        }
      });

      const response = await chat.sendMessage({
        message: newMessage
      });

      return response.text || "I'm processing that, but couldn't generate a verbal response.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I'm having trouble connecting to my cognitive centers right now. Please check your connection.";
    }
  },

  analyzeEntry: async (content: string): Promise<{ mood: string, tags: string[], insights: string }> => {
    try {
      const client = getClient();
      const response = await client.models.generateContent({
        model: 'gemini-3-flash-preview', // Use flash for quick analysis
        contents: `Analyze this journal entry. Return JSON with: mood (One of: Great, Good, Neutral, Stressed, Bad), tags (array of strings), and insights (a short 1-sentence psychological observation). Entry: "${content}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mood: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              insights: { type: Type.STRING }
            }
          }
        }
      });
      
      const text = response.text;
      if (!text) throw new Error("No response");
      return JSON.parse(text);
    } catch (e) {
      return { mood: 'Neutral', tags: ['journal'], insights: 'Analysis unavailable.' };
    }
  }
};
