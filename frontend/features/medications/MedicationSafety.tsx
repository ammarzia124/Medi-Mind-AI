import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  ArrowLeft,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Shield,
  Pill,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Medication {
  id: string;
  name: string;
  dosage: string;
}

interface Interaction {
  drug1: string;
  drug2: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

const MOCK_INTERACTIONS: Record<string, Interaction[]> = {
  'aspirin+ibuprofen': [
    {
      drug1: 'Aspirin',
      drug2: 'Ibuprofen',
      severity: 'moderate',
      description: 'Taking these together may increase the risk of stomach bleeding. Consult your doctor before combining.',
    },
  ],
  'aspirin+warfarin': [
    {
      drug1: 'Aspirin',
      drug2: 'Warfarin',
      severity: 'severe',
      description: 'Combining these increases bleeding risk significantly. Seek immediate medical advice.',
    },
  ],
  'metformin+alcohol': [
    {
      drug1: 'Metformin',
      drug2: 'Alcohol',
      severity: 'severe',
      description: 'Alcohol increases the risk of lactic acidosis with metformin. Avoid alcohol while taking this medication.',
    },
  ],
  'lisinopril+potassium': [
    {
      drug1: 'Lisinopril',
      drug2: 'Potassium supplements',
      severity: 'moderate',
      description: 'ACE inhibitors like lisinopril can raise potassium levels. Monitor potassium intake.',
    },
  ],
  'omeprazole+clopidogrel': [
    {
      drug1: 'Omeprazole',
      drug2: 'Clopidogrel',
      severity: 'moderate',
      description: 'Omeprazole may reduce the effectiveness of clopidogrel. Discuss alternatives with your doctor.',
    },
  ],
};

function findInteractions(meds: Medication[]): Interaction[] {
  const interactions: Interaction[] = [];
  const names = meds.map((m) => m.name.toLowerCase());

  for (const [key, vals] of Object.entries(MOCK_INTERACTIONS)) {
    const [a, b] = key.split('+');
    if (names.includes(a) && names.includes(b)) {
      interactions.push(...vals);
    }
  }

  if (interactions.length === 0 && meds.length >= 2) {
    interactions.push({
      drug1: meds[0].name,
      drug2: meds[1].name,
      severity: 'mild',
      description: 'No significant interactions found between these medications. Always consult your pharmacist or doctor for personalized advice.',
    });
  }

  return interactions;
}

const SEVERITY_STYLES = {
  mild: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
  moderate: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  severe: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
};

export default function MedicationSafety() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [interactions, setInteractions] = useState<Interaction[] | null>(null);

  const addMedication = () => {
    if (!newName.trim()) return;
    setMedications((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newName.trim(), dosage: newDosage.trim() || '-' },
    ]);
    setNewName('');
    setNewDosage('');
  };

  const removeMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
    setInteractions(null);
  };

  const checkInteractions = () => {
    if (medications.length < 2) return;
    const results = findInteractions(medications);
    setInteractions(results);
  };

  return (
    <div className="min-h-screen bg-[#F8FFFE]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#CCFBF1] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#134E4A]">
              {language === 'en' ? '💊 Medication Safety' : '💊 ادویات کی حفاظت'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'Check for drug interactions' : 'ڈرگ تعاملات چیک کریں'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Add medication form */}
        <div className="bg-white border border-[#CCFBF1] rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#134E4A] mb-3 flex items-center gap-2">
            <Pill className="w-4 h-4 text-[#0D9488]" />
            {language === 'en' ? 'Add a medication' : 'دوا شامل کریں'}
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMedication()}
              placeholder={language === 'en' ? 'Medication name' : 'دوا کا نام'}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-[#134E4A] placeholder:text-gray-400 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
            />
            <input
              type="text"
              value={newDosage}
              onChange={(e) => setNewDosage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMedication()}
              placeholder={language === 'en' ? 'Dosage' : 'خوراک'}
              className="w-28 px-4 py-3 rounded-xl border-2 border-gray-200 text-[#134E4A] placeholder:text-gray-400 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
            />
            <button
              onClick={addMedication}
              disabled={!newName.trim()}
              className="px-4 py-3 rounded-xl bg-[#0D9488] text-white hover:bg-[#0F766E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Medication list */}
        {medications.length > 0 && (
          <div className="bg-white border border-[#CCFBF1] rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#134E4A] mb-3">
              {language === 'en' ? 'Your medications' : 'آپ کی ادویات'} ({medications.length})
            </h3>
            <div className="space-y-2">
              <AnimatePresence>
                {medications.map((med) => (
                  <motion.div
                    key={med.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between p-3 bg-[#F8FFFE] rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
                        <Pill className="w-4 h-4 text-[#8B5CF6]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#134E4A] text-sm">{med.name}</p>
                        <p className="text-xs text-gray-500">{med.dosage}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeMedication(med.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              onClick={checkInteractions}
              disabled={medications.length < 2}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#0D9488] text-white py-3 rounded-xl font-semibold hover:bg-[#0F766E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shield className="w-5 h-5" />
              {language === 'en' ? 'Check Interactions' : 'تعاملات چیک کریں'}
            </button>
          </div>
        )}

        {/* Interaction results */}
        <AnimatePresence>
          {interactions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-semibold text-[#134E4A]">
                {language === 'en' ? 'Interaction Results' : 'تبادلے کے نتائج'}
              </h3>
              {interactions.map((interaction, idx) => (
                <div
                  key={idx}
                  className={`border rounded-2xl p-5 shadow-sm ${SEVERITY_STYLES[interaction.severity]}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {interaction.severity === 'severe' ? (
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-sm">
                        {interaction.drug1} + {interaction.drug2}
                      </p>
                      <span className="text-xs font-medium uppercase">
                        {interaction.severity}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed opacity-90">{interaction.description}</p>
                </div>
              ))}
              <button
                onClick={() => setInteractions(null)}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                {language === 'en' ? 'Clear results' : 'نتائج صاف کریں'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {medications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#F0FDFA] rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill className="w-8 h-8 text-[#0D9488]" />
            </div>
            <h3 className="text-lg font-semibold text-[#134E4A] mb-2">
              {language === 'en' ? 'Add your medications' : 'اپنی ادویات شامل کریں'}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {language === 'en'
                ? 'Enter your medications above to check for potential interactions and safety concerns.'
                : 'اپنی ادویات اوپر درج کریں تا ممکنہ تعاملات اور حفاظت کے معاملات چیک ہو سکیں۔'}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-[#F8FFFE] border border-[#CCFBF1] rounded-xl p-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">
              {language === 'en'
                ? 'This tool is for informational purposes only. Always consult your doctor or pharmacist before making any changes to your medications.'
                : 'یہ صرف معلوماتی مقاصد کے لیے ہے۔ اپنی ادویات میں کوئی تبدیلی کرنے سے پہلے ہمیشہ اپنے ڈاکٹر یا فارماسسٹ سے مشورہ کریں۔'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
