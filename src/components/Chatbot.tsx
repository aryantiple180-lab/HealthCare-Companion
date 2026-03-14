import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Smile, Frown, Meh, Loader2 } from 'lucide-react';
import { Card, Button, Input } from './UI';
import { ChatMessage, MoodEntry } from '../types';
import { storage } from '../services/storageService';
import { getChatbotResponse } from '../services/aiService';
import { format } from 'date-fns';
import { cn } from '../utils';

export const Chatbot: React.FC<{ t: any }> = ({ t }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(storage.getChat());
    setMoods(storage.getMood());
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    storage.setChat(newMessages);
    setInput('');
    setLoading(true);

    const history = newMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await getChatbotResponse(input, history);
    
    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date().toISOString(),
    };

    const finalMessages = [...newMessages, botMsg];
    setMessages(finalMessages);
    storage.setChat(finalMessages);
    setLoading(false);
  };

  const handleMood = (mood: MoodEntry['mood']) => {
    const entry: MoodEntry = {
      id: Date.now().toString(),
      mood,
      timestamp: new Date().toISOString(),
    };
    const updated = [...moods, entry];
    setMoods(updated);
    storage.setMood(updated);
  };

  const moodIcons = {
    happy: { icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    neutral: { icon: Meh, color: 'text-blue-500', bg: 'bg-blue-50' },
    sad: { icon: Frown, color: 'text-orange-500', bg: 'bg-orange-50' },
    stressed: { icon: Frown, color: 'text-red-500', bg: 'bg-red-50' },
    anxious: { icon: Meh, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] space-y-4">
      <h2 className="text-xl font-bold text-gray-800">{t.aiChatbot}</h2>

      <Card className="p-3">
        <p className="text-xs font-medium text-gray-500 mb-2">{t.howDoYouFeel}</p>
        <div className="flex justify-between">
          {(Object.keys(moodIcons) as Array<keyof typeof moodIcons>).map(mood => {
            const Config = moodIcons[mood];
            const isSelected = moods[moods.length - 1]?.mood === mood;
            return (
              <button
                key={mood}
                onClick={() => handleMood(mood)}
                className={cn(
                  "p-2 rounded-full transition-all",
                  isSelected ? Config.bg + " scale-110 ring-2 ring-emerald-200" : "hover:bg-gray-50"
                )}
              >
                <Config.icon className={cn("w-6 h-6", Config.color)} />
              </button>
            );
          })}
        </div>
      </Card>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <Bot className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Hi! I'm your Mental Health Assistant. How can I help you today?</p>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] p-3 rounded-2xl text-sm",
              msg.role === 'user' ? "bg-emerald-500 text-white rounded-tr-none" : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
            )}>
              {msg.text}
              <p className={cn("text-[8px] mt-1 opacity-50 text-right")}>
                {format(new Date(msg.timestamp), 'hh:mm a')}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 pb-2">
        <Input 
          placeholder="Type a message..." 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} disabled={loading}>
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
