import React, { useState, useEffect } from 'react';
import { Plus, Bell, History, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Card, Button, Input } from './UI';
import { Medicine } from '../types';
import { storage } from '../services/storageService';
import { format } from 'date-fns';
import { cn } from '../utils';

export const MedicineReminder: React.FC<{ t: any }> = ({ t }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState<Partial<Medicine>>({
    name: '',
    dosage: '',
    time: '08:00',
    frequency: 'daily',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    setMedicines(storage.getMedicines());
  }, []);

  const handleAdd = () => {
    if (!newMed.name || !newMed.dosage) return;
    const med: Medicine = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMed.name!,
      dosage: newMed.dosage!,
      time: newMed.time!,
      frequency: newMed.frequency as any,
      startDate: newMed.startDate!,
      endDate: newMed.endDate!,
      history: [],
    };
    const updated = [...medicines, med];
    setMedicines(updated);
    storage.setMedicines(updated);
    setShowAdd(false);
    setNewMed({ name: '', dosage: '', time: '08:00', frequency: 'daily', startDate: format(new Date(), 'yyyy-MM-dd'), endDate: format(new Date(), 'yyyy-MM-dd') });
  };

  const handleDelete = (id: string) => {
    const updated = medicines.filter(m => m.id !== id);
    setMedicines(updated);
    storage.setMedicines(updated);
  };

  const toggleTaken = (id: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const updated = medicines.map(m => {
      if (m.id === id) {
        const existing = m.history.find(h => h.date === today);
        if (existing) {
          return { ...m, history: m.history.map(h => h.date === today ? { ...h, taken: !h.taken } : h) };
        } else {
          return { ...m, history: [...m.history, { date: today, taken: true }] };
        }
      }
      return m;
    });
    setMedicines(updated);
    storage.setMedicines(updated);
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{t.medicineReminder}</h2>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-1" /> {t.addMedicine}
        </Button>
      </div>

      {showAdd && (
        <Card className="space-y-3 border-emerald-200 bg-emerald-50/30">
          <Input label={t.medicineName} value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} />
          <Input label={t.dosage} value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <Input label={t.time} type="time" value={newMed.time} onChange={e => setNewMed({ ...newMed, time: e.target.value })} />
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">{t.frequency}</label>
              <select 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white"
                value={newMed.frequency}
                onChange={e => setNewMed({ ...newMed, frequency: e.target.value as any })}
              >
                <option value="daily">{t.daily}</option>
                <option value="weekly">{t.weekly}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input label={t.startDate} type="date" value={newMed.startDate} onChange={e => setNewMed({ ...newMed, startDate: e.target.value })} />
            <Input label={t.endDate} type="date" value={newMed.endDate} onChange={e => setNewMed({ ...newMed, endDate: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button fullWidth onClick={handleAdd}>{t.save}</Button>
            <Button fullWidth variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {medicines.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No medicines added yet</p>
          </div>
        )}
        {medicines.map(med => {
          const today = format(new Date(), 'yyyy-MM-dd');
          const isTaken = med.history.find(h => h.date === today)?.taken;
          return (
            <Card key={med.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full", isTaken ? "bg-emerald-100 text-emerald-600" : "bg-blue-50 text-blue-600")}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{med.name}</h3>
                  <p className="text-xs text-gray-500">{med.dosage} • {med.time} • {med.frequency}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleTaken(med.id)}>
                  {isTaken ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-gray-300" />}
                </button>
                <button onClick={() => handleDelete(med.id)} className="text-red-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
