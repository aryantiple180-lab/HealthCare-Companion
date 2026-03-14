import React, { useState, useEffect } from 'react';
import { Activity, Heart, Droplets, Scale, Footprints, Plus } from 'lucide-react';
import { Card, Button, Input } from './UI';
import { HealthMetric } from '../types';
import { storage } from '../services/storageService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { cn } from '../utils';

export const HealthTracker: React.FC<{ t: any }> = ({ t }) => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [activeTab, setActiveTab] = useState<HealthMetric['type']>('heartRate');
  const [showAdd, setShowAdd] = useState(false);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    setMetrics(storage.getMetrics());
  }, []);

  const handleAdd = () => {
    if (!newValue) return;
    const metric: HealthMetric = {
      id: Math.random().toString(36).substr(2, 9),
      type: activeTab,
      value: parseFloat(newValue),
      unit: activeTab === 'weight' ? 'kg' : activeTab === 'heartRate' ? 'bpm' : activeTab === 'bloodSugar' ? 'mg/dL' : activeTab === 'steps' ? 'steps' : 'mmHg',
      timestamp: new Date().toISOString(),
    };
    const updated = [...metrics, metric];
    setMetrics(updated);
    storage.setMetrics(updated);
    setShowAdd(false);
    setNewValue('');
  };

  const chartData = metrics
    .filter(m => m.type === activeTab)
    .slice(-7)
    .map(m => ({
      time: format(new Date(m.timestamp), 'MMM dd'),
      value: m.value,
    }));

  const tabs = [
    { id: 'heartRate', icon: Heart, label: t.heartRate, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'bp', icon: Activity, label: t.bloodPressure, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'bloodSugar', icon: Droplets, label: t.bloodSugar, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'weight', icon: Scale, label: t.weight, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'steps', icon: Footprints, label: t.steps, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-xl font-bold text-gray-800">{t.healthTracker}</h2>

      <div className="grid grid-cols-3 gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex flex-col items-center p-3 rounded-2xl transition-all border",
              activeTab === tab.id ? "border-emerald-500 bg-emerald-50" : "border-gray-100 bg-white"
            )}
          >
            <tab.icon className={cn("w-6 h-6 mb-1", tab.color)} />
            <span className="text-[10px] font-medium text-gray-600 text-center">{tab.label}</span>
          </button>
        ))}
      </div>

      <Card className="h-64">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700">{tabs.find(t => t.id === activeTab)?.label} {t.history}</h3>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10B981" 
                strokeWidth={3} 
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No data available for this metric
          </div>
        )}
      </Card>

      {showAdd && (
        <Card className="space-y-3 border-emerald-200 bg-emerald-50/30">
          <Input 
            label={`Enter ${tabs.find(t => t.id === activeTab)?.label} value`} 
            type="number" 
            value={newValue} 
            onChange={e => setNewValue(e.target.value)} 
          />
          <div className="flex gap-2">
            <Button fullWidth onClick={handleAdd}>{t.save}</Button>
            <Button fullWidth variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700">Recent Logs</h3>
        {metrics.filter(m => m.type === activeTab).reverse().slice(0, 5).map(m => (
          <div key={m.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-50">
            <span className="text-sm text-gray-600">{format(new Date(m.timestamp), 'MMM dd, hh:mm a')}</span>
            <span className="font-bold text-gray-800">{m.value} {m.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
