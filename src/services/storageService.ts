import { User, Medicine, HealthMetric, Order, ChatMessage, MoodEntry } from '../types';

const STORAGE_KEYS = {
  USER: 'hcc_user',
  MEDICINES: 'hcc_medicines',
  METRICS: 'hcc_metrics',
  ORDERS: 'hcc_orders',
  CHAT: 'hcc_chat',
  MOOD: 'hcc_mood',
  LANGUAGE: 'hcc_lang'
};

export const storage = {
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  setUser: (user: User) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
  
  getMedicines: (): Medicine[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MEDICINES);
    return data ? JSON.parse(data) : [];
  },
  setMedicines: (meds: Medicine[]) => localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(meds)),
  
  getMetrics: (): HealthMetric[] => {
    const data = localStorage.getItem(STORAGE_KEYS.METRICS);
    return data ? JSON.parse(data) : [];
  },
  setMetrics: (metrics: HealthMetric[]) => localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics)),
  
  getOrders: (): Order[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  },
  setOrders: (orders: Order[]) => localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)),
  
  getChat: (): ChatMessage[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CHAT);
    return data ? JSON.parse(data) : [];
  },
  setChat: (chat: ChatMessage[]) => localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chat)),
  
  getMood: (): MoodEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MOOD);
    return data ? JSON.parse(data) : [];
  },
  setMood: (mood: MoodEntry[]) => localStorage.setItem(STORAGE_KEYS.MOOD, JSON.stringify(mood)),
  
  getLang: (): string => localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en',
  setLang: (lang: string) => localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang),
  
  clear: () => localStorage.clear()
};
