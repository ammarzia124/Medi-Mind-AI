import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Clock, 
  Plus, 
  Heart, 
  FlaskConical, 
  FileText,
  X,
  Calendar,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineEntry {
  id: string;
  type: 'symptom' | 'lab' | 'note' | 'medication';
  title: string;
  description: string;
  date: Date;
  severity?: 'low' | 'moderate' | 'high';
}

// Sample timeline entries
const sampleEntries: TimelineEntry[] = [
  {
    id: '1',
    type: 'symptom',
    title: 'Headache & Fatigue',
    description: 'Mild headache in the morning, felt tired throughout the day. Improved after rest and hydration.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    severity: 'low',
  },
  {
    id: '2',
    type: 'lab',
    title: 'Vitamin D Test',
    description: 'Vitamin D level: 18 ng/mL (Low). Doctor recommended supplementation of 2000 IU daily.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: '3',
    type: 'medication',
    title: 'Started Vitamin D Supplement',
    description: 'Began taking Vitamin D3 2000 IU daily as recommended by doctor.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: '4',
    type: 'note',
    title: 'Annual Check-up Completed',
    description: 'Routine blood work done. All results within normal range except Vitamin D. Next check-up in 6 months.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: '5',
    type: 'symptom',
    title: 'Mild Cough',
    description: 'Developed a mild dry cough. No fever. Started drinking warm fluids and resting.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    severity: 'low',
  },
];

export function Timeline() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<TimelineEntry[]>(sampleEntries);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: 'note' as TimelineEntry['type'],
    title: '',
    description: '',
  });

  const getTypeIcon = (type: TimelineEntry['type']) => {
    switch (type) {
      case 'symptom': return Heart;
      case 'lab': return FlaskConical;
      case 'note': return FileText;
      case 'medication': return Activity;
      default: return FileText;
    }
  };

  const getTypeColor = (type: TimelineEntry['type']) => {
    switch (type) {
      case 'symptom': return 'bg-primary-50 text-primary';
      case 'lab': return 'bg-info/10 text-info';
      case 'note': return 'bg-success/10 text-success';
      case 'medication': return 'bg-warning/10 text-warning';
      default: return 'bg-border text-text-secondary';
    }
  };

  const getTypeLabel = (type: TimelineEntry['type']) => {
    switch (type) {
      case 'symptom': return t('symptoms');
      case 'lab': return t('labReports');
      case 'note': return t('today');
      case 'medication': return t('routine');
      default: return '';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return t('yesterday');
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const handleAddEntry = () => {
    if (!newEntry.title.trim()) return;
    
    const entry: TimelineEntry = {
      id: Date.now().toString(),
      type: newEntry.type,
      title: newEntry.title,
      description: newEntry.description,
      date: new Date(),
    };
    
    setEntries([entry, ...entries]);
    setNewEntry({ type: 'note', title: '', description: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{t('timelineTitle')}</h1>
          <p className="text-sm text-text-secondary">{t('timelineSubtitle')}</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-dark transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t('addEntry')}</span>
        </button>
      </div>

      {/* Add Entry Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">{t('addEntry')}</h3>
                <button onClick={() => setShowAddForm(false)} className="p-1 rounded-lg hover:bg-background">
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              {/* Type Selection */}
              <div className="flex gap-2 flex-wrap">
                {(['symptom', 'lab', 'medication', 'note'] as const).map((type) => {
                  const Icon = getTypeIcon(type);
                  return (
                    <button
                      key={type}
                      onClick={() => setNewEntry({ ...newEntry, type })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
                        ${newEntry.type === type 
                          ? 'bg-primary text-white' 
                          : 'bg-background text-text-secondary hover:bg-primary-50'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {getTypeLabel(type)}
                    </button>
                  );
                })}
              </div>

              {/* Title */}
              <input
                type="text"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                placeholder="Title (e.g., 'Fever started')"
                className="w-full p-3 rounded-xl border border-border bg-background text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-light transition-all"
              />

              {/* Description */}
              <textarea
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                placeholder="Describe what happened..."
                className="w-full min-h-[80px] p-3 rounded-xl border border-border bg-background text-text-primary placeholder:text-text-secondary/60 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-light transition-all"
              />

              <button
                onClick={handleAddEntry}
                disabled={!newEntry.title.trim()}
                className="w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('submit')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline Entries */}
      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-surface border border-border rounded-2xl p-12 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-text-primary mb-2">{t('noEntries')}</h3>
          <p className="text-sm text-text-secondary">{t('noEntriesDesc')}</p>
        </motion.div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />
          
          <div className="space-y-4">
            {entries.map((entry, index) => {
              const Icon = getTypeIcon(entry.type);
              const colorClass = getTypeColor(entry.type);
              
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4"
                >
                  {/* Timeline dot */}
                  <div className="hidden md:flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0 z-10`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  
                  {/* Entry Card */}
                  <div className="flex-1 bg-surface border border-border rounded-2xl p-4 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 md:hidden">
                        <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${colorClass}`}>
                            {getTypeLabel(entry.type)}
                          </span>
                          {entry.severity && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              entry.severity === 'low' ? 'bg-success/10 text-success' :
                              entry.severity === 'moderate' ? 'bg-warning/10 text-warning' :
                              'bg-critical/10 text-critical'
                            }`}>
                              {entry.severity === 'low' ? '🟢' : entry.severity === 'moderate' ? '🟡' : '🔴'} {t(entry.severity)}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-text-primary text-sm">{entry.title}</h3>
                        <p className="text-xs text-text-secondary mt-1 leading-relaxed">{entry.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-text-secondary flex-shrink-0">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[11px]">{formatDate(entry.date)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-background border border-border rounded-xl p-4">
        <p className="text-xs text-text-secondary text-center">{t('generalDisclaimer')}</p>
      </div>
    </div>
  );
}
