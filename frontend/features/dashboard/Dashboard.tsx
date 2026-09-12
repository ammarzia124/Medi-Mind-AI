import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, Stethoscope, FlaskConical, Pill, Heart, Settings,
  Bell, Search, ChevronRight, Clock, Calendar, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

type NavItem = {
  icon: typeof Home;
  label: string;
  labelUr: string;
  path: string;
};

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', labelUr: 'ہوم', path: '/dashboard' },
  { icon: Stethoscope, label: 'Check Symptoms', labelUr: 'علامات چیک کریں', path: '/symptoms' },
  { icon: FlaskConical, label: 'Lab Reports', labelUr: 'لیب رپورٹس', path: '/lab' },
  { icon: Pill, label: 'Medications', labelUr: 'ادویات', path: '/medications' },
  { icon: Heart, label: 'Health Timeline', labelUr: 'صحت ٹائم لائن', path: '/timeline' },
  { icon: Settings, label: 'Settings', labelUr: 'ترتیبات', path: '/dashboard' },
];

const moods = [
  { emoji: '😊', label: 'Great', labelUr: 'بہترین' },
  { emoji: '🙂', label: 'Good', labelUr: 'اچھا' },
  { emoji: '😐', label: 'Okay', labelUr: 'ٹھیک' },
  { emoji: '😟', label: 'Not great', labelUr: 'اچھا نہیں' },
  { emoji: '😰', label: 'Unwell', labelUr: 'بیمار' },
];

export default function Dashboard() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');
  const userName = language === 'en' ? 'Sarah' : 'سارہ';

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return language === 'en' ? 'Good morning' : 'صبح بخیر';
    if (currentHour < 18) return language === 'en' ? 'Good afternoon' : 'دوپہر بخیر';
    return language === 'en' ? 'Good evening' : 'شام بخیر';
  };

  const recentActivity = [
    { id: '1', type: 'symptom', title: language === 'en' ? 'Headache' : 'سر درد', time: language === 'en' ? '2 hours ago' : '2 گھنٹے پہلے', severity: 'low' as const },
    { id: '2', type: 'lab', title: language === 'en' ? 'Vitamin D Test' : 'وٹامن ڈی ٹیسٹ', time: language === 'en' ? 'Yesterday' : 'کل', severity: 'medium' as const },
  ];

  const quickActions = [
    { icon: Stethoscope, title: language === 'en' ? 'Check Symptoms' : 'علامات چیک کریں', subtitle: language === 'en' ? 'Tell me how you feel' : 'مجھے بتائیں آپ کو کیا محسوس ہو رہا ہے', path: '/symptoms', color: 'text-[#0D9488] bg-[#0D9488]/10' },
    { icon: FlaskConical, title: language === 'en' ? 'Lab Reports' : 'لیب رپورٹس', subtitle: language === 'en' ? 'Upload & understand results' : 'نتائج اپلوڈ کریں اور سمجھیں', path: '/lab', color: 'text-[#3B82F6] bg-[#3B82F6]/10' },
    { icon: Pill, title: language === 'en' ? 'Medications' : 'ادویات', subtitle: language === 'en' ? 'Check interactions & safety' : 'تعارف اور حفاظت چیک کریں', path: '/medications', color: 'text-[#8B5CF6] bg-[#8B5CF6]/10' },
    { icon: Heart, title: language === 'en' ? 'Health Timeline' : 'صحت ٹائم لائن', subtitle: language === 'en' ? 'View your health journey' : 'اپنا صحت کا سفر دیکھیں', path: '/timeline', color: 'text-[#EC4899] bg-[#EC4899]/10' },
  ];

  const severityColors = {
    low: 'bg-[#22C55E]/10 text-[#22C55E]',
    medium: 'bg-[#F59E0B]/10 text-[#F59E0B]',
    high: 'bg-[#EF4444]/10 text-[#EF4444]',
  };

  const Sidebar = () => (
    <div className="hidden lg:flex flex-col w-64 bg-[#134E4A] min-h-screen p-4 fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-4 mb-6">
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
          <Heart className="w-5 h-5 text-[#0D9488]" fill="#0D9488" />
        </div>
        <span className="text-lg font-bold text-white">MediMind AI</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = activeNav === item.label;
          return (
            <button
              key={item.label}
              onClick={() => { setActiveNav(item.label); navigate(item.path); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white text-[#0D9488] border-l-4 border-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {language === 'en' ? item.label : item.labelUr}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="flex items-center gap-3 px-3 py-3 border-t border-white/10 mt-4">
        <div className="w-9 h-9 rounded-full bg-[#0D9488] flex items-center justify-center text-white font-semibold text-sm">
          {userName.charAt(0)}
        </div>
        <span className="text-sm text-white/80 font-medium">{userName}</span>
      </div>
    </div>
  );

  const TopBar = () => (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#CCFBF1]">
      <div>
        <h1 className="text-xl font-bold text-[#134E4A]">
          {getGreeting()}, {userName} 👋
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
        </button>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button className={`px-3 py-1 rounded-md text-xs font-semibold ${language === 'en' ? 'bg-white text-[#0D9488] shadow-sm' : 'text-gray-500'}`}>
            EN
          </button>
          <button className={`px-3 py-1 rounded-md text-xs font-semibold ${language === 'ur' ? 'bg-white text-[#0D9488] shadow-sm' : 'text-gray-500'}`}>
            اردو
          </button>
        </div>
      </div>
    </div>
  );

  const WelcomeCard = () => (
    <div className="bg-gradient-to-r from-[#0D9488] to-[#0F766E] rounded-2xl p-6 md:p-8 text-white mb-6">
      <h2 className="text-2xl font-bold mb-2">
        {language === 'en' ? `How are you feeling today, ${userName}?` : `آج آپ کیسے محسوس کر رہے ہیں، ${userName}؟`}
      </h2>
      <p className="text-white/80 mb-4">
        {language === 'en' ? 'Select your mood to get started' : 'شروع کرنے کے لیے اپنا مزاج منتخب کریں'}
      </p>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => navigate('/symptoms')}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <span className="text-xl">{mood.emoji}</span>
            <span className="text-sm font-medium">{language === 'en' ? mood.label : mood.labelUr}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {quickActions.map((action) => (
        <button
          key={action.title}
          onClick={() => navigate(action.path)}
          className="bg-white border border-[#CCFBF1] rounded-2xl p-5 text-left hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <action.icon className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-[#134E4A] mb-1 group-hover:text-[#0D9488] transition-colors">{action.title}</h3>
          <p className="text-sm text-gray-500">{action.subtitle}</p>
        </button>
      ))}
    </div>
  );

  const StatsRow = () => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { label: language === 'en' ? 'Reports Uploaded' : 'اپلوڈ شدہ رپورٹس', value: '12' },
        { label: language === 'en' ? 'Symptoms Checked' : 'چیک شدہ علامات', value: '28' },
        { label: language === 'en' ? 'Days Tracked' : 'ٹریک کردہ دن', value: '45' },
      ].map((stat) => (
        <div key={stat.label} className="bg-white border border-[#CCFBF1] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[#0D9488]">{stat.value}</p>
          <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );

  const RecentActivity = () => (
    <div className="bg-white border border-[#CCFBF1] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#134E4A]">{language === 'en' ? 'Recent Activity' : 'حالیہ سرگرمی'}</h3>
        <button className="text-sm text-[#0D9488] font-semibold flex items-center gap-1 hover:underline">
          {language === 'en' ? 'View All' : 'سب دیکھیں'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {recentActivity.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#F0FDFA] rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">{language === 'en' ? 'No activity yet. Start by checking your symptoms.' : 'ابھی تک کوئی سرگرمی نہیں۔ اپنی علامات چیک کرکے شروع کریں۔'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                item.type === 'symptom' ? 'bg-[#0D9488]/10 text-[#0D9488]' : 'bg-[#3B82F6]/10 text-[#3B82F6]'
              }`}>
                {item.type === 'symptom' ? <Stethoscope className="w-5 h-5" /> : <FlaskConical className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#134E4A] text-sm">{item.title}</p>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${severityColors[item.severity]}`}>
                {item.severity === 'low' ? (language === 'en' ? 'Low' : 'کم') : item.severity === 'medium' ? (language === 'en' ? 'Medium' : 'درمیانی') : (language === 'en' ? 'High' : 'زیادہ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const BottomNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#CCFBF1] px-4 py-2 z-50">
      <div className="flex justify-around">
        {navItems.slice(0, 5).map((item) => {
          const isActive = activeNav === item.label;
          return (
            <button
              key={item.label}
              onClick={() => { setActiveNav(item.label); navigate(item.path); }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-[#0D9488]' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{language === 'en' ? item.label.split(' ')[0] : item.labelUr.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FFFE]">
      <Sidebar />

      <div className="lg:ml-64">
        <TopBar />

        <main className="p-4 md:p-6 pb-24 lg:pb-6">
          <WelcomeCard />
          <QuickActions />
          <StatsRow />
          <RecentActivity />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
