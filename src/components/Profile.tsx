import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, Calendar, UserCircle, ShieldAlert, Heart, LogOut } from 'lucide-react';
import { Card, Button, Input } from './UI';
import { User } from '../types';
import { storage } from '../services/storageService';

export const Profile: React.FC<{ t: any; onLogout: () => void }> = ({ t, onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    const data = storage.getUser();
    setUser(data);
    setFormData(data || {});
  }, []);

  const handleSave = () => {
    if (user) {
      const updated = { ...user, ...formData } as User;
      setUser(updated);
      storage.setUser(updated);
      setIsEditing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{t.profile}</h2>
        <Button size="sm" variant="ghost" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      <div className="flex flex-col items-center py-6">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-3">
          <UserIcon className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
        <p className="text-gray-500 text-sm">{user.email}</p>
      </div>

      {isEditing ? (
        <Card className="space-y-3">
          <Input label={t.fullName} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <Input label={t.age} type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })} />
          <Input label={t.gender} value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} />
          <Input label={t.emergencyContact} value={formData.emergencyContact} onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })} />
          <Button fullWidth onClick={handleSave}>{t.save}</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          <Card className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold">{t.email}</p>
              <p className="text-sm font-medium text-gray-700">{user.email}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold">{t.mobile}</p>
              <p className="text-sm font-medium text-gray-700">{user.mobile}</p>
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-3">
            <Card className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">{t.age}</p>
                <p className="text-sm font-medium text-gray-700">{user.age || 'Not set'}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-3">
              <UserCircle className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">{t.gender}</p>
                <p className="text-sm font-medium text-gray-700">{user.gender || 'Not set'}</p>
              </div>
            </Card>
          </div>
          <Card className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold">{t.emergencyContact}</p>
              <p className="text-sm font-medium text-gray-700">{user.emergencyContact || 'Not set'}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold">{t.medicalConditions}</p>
              <p className="text-sm font-medium text-gray-700">{user.medicalConditions?.join(', ') || 'None'}</p>
            </div>
          </Card>
          
          <Button fullWidth variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={onLogout}>
            <LogOut className="w-5 h-5 mr-2" /> {t.logout}
          </Button>
        </div>
      )}
    </div>
  );
};
