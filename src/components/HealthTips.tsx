import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw, Heart, Apple, Dumbbell, Moon } from 'lucide-react';
import { Card, Button } from './UI';
import { getDailyHealthTip } from '../services/aiService';
import { cn } from '../utils';

export const HealthTips: React.FC<{ t: any }> = ({ t }) => {
  const [tip, setTip] = useState<{ category: string; tip: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTip = async () => {
    setLoading(true);
    const newTip = await getDailyHealthTip();
    setTip(newTip);
    setLoading(false);
  };

  useEffect(() => {
    fetchTip();
  }, []);

  const categories = [
    { name: 'Nutrition', icon: Apple, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Fitness', icon: Dumbbell, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Mental Health', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    { name: 'Lifestyle', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{t.healthTips}</h2>
        <button onClick={fetchTip} disabled={loading} className="p-2 text-emerald-500">
          <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
        </button>
      </div>

      <Card className="bg-emerald-500 text-white p-6 relative overflow-hidden">
        <Lightbulb className="absolute -right-4 -top-4 w-24 h-24 opacity-10 rotate-12" />
        <div className="relative z-10">
          <span className="bg-white/20 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full mb-2 inline-block">
            {tip?.category || 'Daily Tip'}
          </span>
          <p className="text-lg font-medium leading-relaxed">
            {tip?.tip || 'Loading your daily health tip...'}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {categories.map(cat => (
          <Card key={cat.name} className="flex flex-col items-center p-4 text-center">
            <div className={cn("p-3 rounded-full mb-2", cat.bg)}>
              <cat.icon className={cn("w-6 h-6", cat.color)} />
            </div>
            <h4 className="font-bold text-gray-800 text-sm">{cat.name}</h4>
            <p className="text-[10px] text-gray-500 mt-1">Get expert advice on {cat.name.toLowerCase()}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-gray-700">Recommended for You</h3>
        <Card className="flex gap-3 items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            <Moon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Better Sleep Habits</h4>
            <p className="text-xs text-gray-500">Learn how to improve your sleep quality</p>
          </div>
        </Card>
        <Card className="flex gap-3 items-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <Apple className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Balanced Diet Plan</h4>
            <p className="text-xs text-gray-500">Nutritional advice for a healthier life</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
