import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Navigation, Star, Search } from 'lucide-react';
import { Card, Button, Input } from './UI';

export const NearbyHospitals: React.FC<{ t: any }> = ({ t }) => {
  const [search, setSearch] = useState('');
  const [hospitals, setHospitals] = useState([
    { id: 1, name: 'City General Hospital', distance: '1.2 km', rating: 4.5, type: 'Hospital', phone: '+1 234 567 890' },
    { id: 2, name: 'Wellness Pharmacy', distance: '0.5 km', rating: 4.2, type: 'Pharmacy', phone: '+1 234 567 891' },
    { id: 3, name: 'Emergency Care Center', distance: '2.8 km', rating: 4.8, type: 'Clinic', phone: '+1 234 567 892' },
    { id: 4, name: 'LifeLine Ambulance', distance: '0.8 km', rating: 4.0, type: 'Ambulance', phone: '+1 234 567 893' },
    { id: 5, name: 'St. Mary\'s Medical', distance: '3.5 km', rating: 4.6, type: 'Hospital', phone: '+1 234 567 894' },
  ]);

  const filtered = hospitals.filter(h => h.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 pb-20">
      <h2 className="text-xl font-bold text-gray-800">{t.nearbyHospitals}</h2>
      
      <div className="relative">
        <Input 
          placeholder="Search hospitals, pharmacies..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {filtered.map(h => (
          <Card key={h.id} className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800">{h.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{h.type}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {h.distance}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {h.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button fullWidth variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" /> Call
              </Button>
              <Button fullWidth size="sm">
                <Navigation className="w-4 h-4 mr-2" /> Directions
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
