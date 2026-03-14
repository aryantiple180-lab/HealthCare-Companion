import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Bell, 
  Activity, 
  MapPin, 
  ShoppingCart, 
  Lightbulb, 
  MessageSquare, 
  User as UserIcon, 
  Home, 
  ChevronRight, 
  Globe, 
  Navigation, 
  Loader2,
  Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Input, Card } from './components/UI';
import { translations } from './translations';
import { storage } from './services/storageService';
import { User } from './types';
import { MedicineReminder } from './components/MedicineReminder';
import { HealthTracker } from './components/HealthTracker';
import { NearbyHospitals } from './components/NearbyHospitals';
import { OrderMedicines } from './components/OrderMedicines';
import { HealthTips } from './components/HealthTips';
import { Chatbot } from './components/Chatbot';
import { Profile } from './components/Profile';

type Screen = 'splash' | 'auth' | 'lang' | 'location' | 'dashboard' | 'medicine' | 'tracker' | 'hospitals' | 'order' | 'tips' | 'chatbot' | 'profile';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<'en' | 'hi' | 'mr'>('en');
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const t = translations[lang];

  useEffect(() => {
    // Splash screen timer
    const timer = setTimeout(() => {
      const savedUser = storage.getUser();
      const savedLang = storage.getLang() as any;
      if (savedLang) setLang(savedLang);
      
      if (savedUser) {
        setUser(savedUser);
        setScreen('dashboard');
      } else {
        setScreen('auth');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '9876543210',
        language: lang,
      };
      setUser(mockUser);
      storage.setUser(mockUser);
      setScreen('lang');
      setLoading(false);
    }, 1500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '9876543210',
        language: lang,
      };
      setUser(mockUser);
      storage.setUser(mockUser);
      setScreen('lang');
      setLoading(false);
    }, 1500);
  };

  const handleLangSelect = (l: 'en' | 'hi' | 'mr') => {
    setLang(l);
    storage.setLang(l);
    setScreen('location');
  };

  const handleLocation = () => {
    setLoading(true);
    setTimeout(() => {
      setScreen('dashboard');
      setLoading(false);
    }, 1000);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col items-center justify-center bg-white"
          >
            <motion.div 
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-32 h-32 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-200 mb-6"
            >
              <Stethoscope className="w-16 h-16 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.appName}</h1>
            <p className="text-emerald-600 font-medium">{t.tagline}</p>
            <div className="mt-12">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          </motion.div>
        );

      case 'auth':
        return (
          <motion.div 
            initial={{ x: 300, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="min-h-screen p-6 bg-white flex flex-col"
          >
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {authMode === 'login' ? t.login : t.signup}
              </h2>
              <p className="text-gray-500 mb-8">Welcome to HealthCare Companion</p>

              <form onSubmit={authMode === 'login' ? handleLogin : handleSignup} className="space-y-4">
                {authMode === 'signup' && (
                  <Input label={t.fullName} placeholder="Enter your name" required />
                )}
                <Input label={t.email} type="email" placeholder="Enter your email" required />
                {authMode === 'signup' && (
                  <Input label={t.mobile} type="tel" placeholder="Enter mobile number" required />
                )}
                <Input label={t.password} type="password" placeholder="Enter password" required />
                {authMode === 'signup' && (
                  <Input label={t.confirmPassword} type="password" placeholder="Confirm password" required />
                )}
                
                {authMode === 'login' && (
                  <div className="text-right">
                    <button type="button" className="text-sm text-emerald-600 font-medium">{t.forgotPassword}</button>
                  </div>
                )}

                <Button fullWidth size="lg" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (authMode === 'login' ? t.login : t.signup)}
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                  <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
                </div>
                <Button fullWidth variant="outline" onClick={() => {}}>
                  <Globe className="w-5 h-5 mr-2" /> {t.googleLogin}
                </Button>
              </div>
            </div>

            <div className="py-6 text-center">
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-sm text-gray-600"
              >
                {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <span className="text-emerald-600 font-bold">{authMode === 'login' ? t.signup : t.login}</span>
              </button>
            </div>
          </motion.div>
        );

      case 'lang':
        return (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="min-h-screen p-6 bg-white flex flex-col items-center justify-center text-center"
          >
            <Globe className="w-16 h-16 text-emerald-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.selectLanguage}</h2>
            <p className="text-gray-500 mb-8">Choose your preferred language</p>
            <div className="w-full space-y-3">
              <Button fullWidth variant="outline" size="lg" onClick={() => handleLangSelect('en')}>English</Button>
              <Button fullWidth variant="outline" size="lg" onClick={() => handleLangSelect('hi')}>हिंदी (Hindi)</Button>
              <Button fullWidth variant="outline" size="lg" onClick={() => handleLangSelect('mr')}>मराठी (Marathi)</Button>
            </div>
          </motion.div>
        );

      case 'location':
        return (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="min-h-screen p-6 bg-white flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-6">
              <Navigation className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Location Access</h2>
            <p className="text-gray-500 mb-8">{t.allowLocation}</p>
            <div className="w-full space-y-3">
              <Button fullWidth size="lg" onClick={handleLocation} disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.allow}
              </Button>
              <Button fullWidth variant="ghost" onClick={handleLocation}>{t.manualLocation}</Button>
            </div>
          </motion.div>
        );

      case 'dashboard':
        return (
          <div className="min-h-screen bg-gray-50 p-6 pb-24">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Hello, {user?.name}</h2>
                <p className="text-sm text-gray-500">How are you feeling today?</p>
              </div>
              <button onClick={() => setScreen('profile')} className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500">
                <UserIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card onClick={() => setScreen('medicine')} className="flex flex-col items-center text-center p-6">
                <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 mb-3">
                  <Bell className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{t.medicineReminder}</h3>
              </Card>
              <Card onClick={() => setScreen('tracker')} className="flex flex-col items-center text-center p-6">
                <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 mb-3">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{t.healthTracker}</h3>
              </Card>
              <Card onClick={() => setScreen('hospitals')} className="flex flex-col items-center text-center p-6">
                <div className="p-3 bg-red-100 rounded-2xl text-red-600 mb-3">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{t.nearbyHospitals}</h3>
              </Card>
              <Card onClick={() => setScreen('order')} className="flex flex-col items-center text-center p-6">
                <div className="p-3 bg-orange-100 rounded-2xl text-orange-600 mb-3">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{t.orderMedicines}</h3>
              </Card>
              <Card onClick={() => setScreen('tips')} className="flex flex-col items-center text-center p-6">
                <div className="p-3 bg-yellow-100 rounded-2xl text-yellow-600 mb-3">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{t.healthTips}</h3>
              </Card>
              <Card onClick={() => setScreen('chatbot')} className="flex flex-col items-center text-center p-6">
                <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600 mb-3">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{t.aiChatbot}</h3>
              </Card>
            </div>

            <Card className="mt-6 bg-emerald-500 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Daily Health Tip</h3>
                <p className="text-sm opacity-90 mt-1">Drink at least 8 glasses of water today.</p>
              </div>
              <ChevronRight className="w-6 h-6 opacity-50" />
            </Card>
          </div>
        );

      default:
        const FeatureComponent = {
          medicine: MedicineReminder,
          tracker: HealthTracker,
          hospitals: NearbyHospitals,
          order: OrderMedicines,
          tips: HealthTips,
          chatbot: Chatbot,
          profile: Profile,
        }[screen as string] as any;

        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <FeatureComponent 
              t={t} 
              onLogout={() => { storage.clear(); setUser(null); setScreen('auth'); }} 
            />
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-2xl overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>

      {['dashboard', 'medicine', 'tracker', 'hospitals', 'order', 'tips', 'chatbot', 'profile'].includes(screen) && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
          <button onClick={() => setScreen('dashboard')} className={cn("flex flex-col items-center", screen === 'dashboard' ? "text-emerald-500" : "text-gray-400")}>
            <Home className="w-6 h-6" />
            <span className="text-[10px] mt-1">Home</span>
          </button>
          <button onClick={() => setScreen('tracker')} className={cn("flex flex-col items-center", screen === 'tracker' ? "text-emerald-500" : "text-gray-400")}>
            <Activity className="w-6 h-6" />
            <span className="text-[10px] mt-1">Tracker</span>
          </button>
          <button onClick={() => setScreen('chatbot')} className={cn("flex flex-col items-center", screen === 'chatbot' ? "text-emerald-500" : "text-gray-400")}>
            <MessageSquare className="w-6 h-6" />
            <span className="text-[10px] mt-1">AI Chat</span>
          </button>
          <button onClick={() => setScreen('profile')} className={cn("flex flex-col items-center", screen === 'profile' ? "text-emerald-500" : "text-gray-400")}>
            <UserIcon className="w-6 h-6" />
            <span className="text-[10px] mt-1">Profile</span>
          </button>
        </div>
      )}
    </div>
  );
}

import { cn } from './utils';
