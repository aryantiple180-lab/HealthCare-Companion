export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  age?: number;
  gender?: string;
  medicalConditions?: string[];
  allergies?: string[];
  emergencyContact?: string;
  language: 'en' | 'hi' | 'mr';
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: 'daily' | 'weekly' | 'custom';
  startDate: string;
  endDate: string;
  history: { date: string; taken: boolean }[];
}

export interface HealthMetric {
  id: string;
  type: 'bp' | 'heartRate' | 'bloodSugar' | 'weight' | 'steps';
  value: number;
  unit: string;
  timestamp: string;
}

export interface Order {
  id: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface MoodEntry {
  id: string;
  mood: 'happy' | 'neutral' | 'sad' | 'stressed' | 'anxious';
  timestamp: string;
}
