export type Language = 'en' | 'ur';

export const translations = {
  en: {
    // Navigation
    appName: 'MediMind AI',
    home: 'Home',
    symptoms: 'Symptoms',
    labReports: 'Lab Reports',
    timeline: 'Timeline',
    
    // Home page
    welcomeTitle: 'Your Health, Simplified',
    welcomeSubtitle: 'MediMind doesn\'t replace your doctor. It helps you understand your health and decide what to do next.',
    quickActions: 'Quick Actions',
    checkSymptoms: 'Check Symptoms',
    checkSymptomsDesc: 'Tell me what you\'re feeling',
    analyzeLab: 'Analyze Lab Report',
    analyzeLabDesc: 'Upload or describe your results',
    healthTimeline: 'Health Timeline',
    healthTimelineDesc: 'View your health journey',
    recentActivity: 'Recent Activity',
    noRecentActivity: 'No recent activity yet',
    startExploring: 'Start by checking your symptoms or analyzing a lab report.',
    
    // Symptom Checker
    symptomTitle: 'Symptom Checker',
    symptomSubtitle: 'Tell me how you\'re feeling. I\'ll help you understand what might be going on.',
    symptomPlaceholder: 'Describe what you\'re feeling... (e.g., "I have a headache and feel tired")',
    analyzeBtn: 'Analyze',
    analyzing: 'Analyzing...',
    possibleCauses: 'Possible Causes',
    severityLevel: 'Severity Level',
    recommendation: 'Recommendation',
    whenToSeeDoctor: 'When to See a Doctor',
    selfCareTips: 'Self-Care Tips',
    disclaimer: 'This is not medical advice. Always consult a healthcare professional for proper diagnosis.',
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    seeDoctorNow: 'Please see a doctor as soon as possible',
    scheduleVisit: 'Consider scheduling a visit within a few days',
    monitorAtHome: 'Monitor at home and seek help if symptoms worsen',
    
    // Lab Reports
    labTitle: 'Lab Report Analyzer',
    labSubtitle: 'Upload or describe your lab results. I\'ll explain them in simple language.',
    labPlaceholder: 'Describe your lab results or paste them here... (e.g., "My hemoglobin is 12.5 g/dL")',
    uploadReport: 'Upload Report',
    orDescribe: 'or describe your results below',
    results: 'Results',
    normal: 'Normal',
    abnormal: 'Needs Attention',
    critical: 'Critical',
    whatItMeans: 'What This Means',
    nextSteps: 'Recommended Next Steps',
    
    // Timeline
    timelineTitle: 'Health Timeline',
    timelineSubtitle: 'Your health journey, organized and easy to understand.',
    addEntry: 'Add Entry',
    noEntries: 'No health entries yet',
    noEntriesDesc: 'Start tracking your health by adding symptoms, lab results, or notes.',
    today: 'Today',
    yesterday: 'Yesterday',
    
    // Common
    back: 'Back',
    submit: 'Submit',
    cancel: 'Cancel',
    close: 'Close',
    learnMore: 'Learn More',
    generalDisclaimer: '⚕️ This is for informational purposes only. Always consult a qualified healthcare professional.',
    language: 'Language',
    english: 'English',
    urdu: 'اردو',
    
    // Care Navigation
    emergency: 'Emergency',
    urgent: 'Urgent Care',
    routine: 'Routine Check',
    selfCare: 'Self-Care',
    visitER: 'Visit Emergency Room immediately',
    visitUrgent: 'Visit urgent care within 24 hours',
    visitDoctor: 'Schedule a doctor visit this week',
    homeRemedy: 'Try home remedies and monitor',
  },
  ur: {
    // Navigation
    appName: 'میڈی مائنڈ اے آئی',
    home: 'ہوم',
    symptoms: 'علامات',
    labReports: 'لیب رپورٹ',
    timeline: 'ٹائم لائن',
    
    // Home page
    welcomeTitle: 'آپ کی صحت، آسان زبان میں',
    welcomeSubtitle: 'میڈی مائنڈ آپ کے ڈاکٹر کی جگہ نہیں لیتا۔ یہ آپ کو اپنی صحت سمجھنے اور اگلا قدم طے کرنے میں مدد کرتا ہے۔',
    quickActions: 'فوری اقدامات',
    checkSymptoms: 'علامات چیک کریں',
    checkSymptomsDesc: 'مجھے بتائیں آپ کو کیا محسوس ہو رہا ہے',
    analyzeLab: 'لیب رپورٹ تجزیہ',
    analyzeLabDesc: 'اپنے نتائج اپ لوڈ کریں یا بیان کریں',
    healthTimeline: 'صحت ٹائم لائن',
    healthTimelineDesc: 'اپنا صحت کا سفر دیکھیں',
    recentActivity: 'حالیہ سرگرمی',
    noRecentActivity: 'ابھی تک کوئی حالیہ سرگرمی نہیں',
    startExploring: 'اپنی علامات چیک کریں یا لیب رپورٹ کا تجزیہ کریں۔',
    
    // Symptom Checker
    symptomTitle: 'علامات چیکر',
    symptomSubtitle: 'مجھے بتائیں آپ کو کیسا محسوس ہو رہا ہے۔ میں آپ کو سمجھنے میں مدد کروں گا۔',
    symptomPlaceholder: 'بتائیں آپ کو کیا محسوس ہو رہا ہے... (مثلاً "مجھے سر درد ہے اور تھکاوٹ محسوس ہو رہی ہے")',
    analyzeBtn: 'تجزیہ کریں',
    analyzing: 'تجزیہ ہو رہا ہے...',
    possibleCauses: 'ممکنہ وجوہات',
    severityLevel: 'شدت کی سطح',
    recommendation: 'سفارش',
    whenToSeeDoctor: 'ڈاکٹر کو کب دکھائیں',
    selfCareTips: 'گھریلو علاج',
    disclaimer: 'یہ طبی مشورہ نہیں ہے۔ ہمیشہ مناسب تشخیص کے لیے صحت کے پیشہ ور سے مشورہ کریں۔',
    low: 'کم',
    moderate: 'درمیانہ',
    high: 'زیادہ',
    seeDoctorNow: 'براہ کرم جلد از جلد ڈاکٹر سے ملیں',
    scheduleVisit: 'چند دنوں میں وزٹ شیڈول کریں',
    monitorAtHome: 'گھر پر نگرانی کریں اور علامات بڑھنے پر مدد لیں',
    
    // Lab Reports
    labTitle: 'لیب رپورٹ تجزیہ کار',
    labSubtitle: 'اپنے لیب نتائج اپ لوڈ کریں یا بیان کریں۔ میں انہیں آسان زبان میں سمجھاؤں گا۔',
    labPlaceholder: 'اپنے لیب نتائج بیان کریں یا یہاں پیسٹ کریں... (مثلاً "میرا ہیموگلوبن 12.5 g/dL ہے")',
    uploadReport: 'رپورٹ اپ لوڈ کریں',
    orDescribe: 'یا نیچے اپنے نتائج بیان کریں',
    results: 'نتائج',
    normal: 'نارمل',
    abnormal: 'توجہ کی ضرورت',
    critical: 'سنجیدہ',
    whatItMeans: 'اس کا مطلب',
    nextSteps: 'تجویز کردہ اگلے اقدامات',
    
    // Timeline
    timelineTitle: 'صحت ٹائم لائن',
    timelineSubtitle: 'آپ کا صحت کا سفر، منظم اور آسان۔',
    addEntry: 'اندراج شامل کریں',
    noEntries: 'ابھی تک کوئی صحت اندراج نہیں',
    noEntriesDesc: 'علامات، لیب نتائج، یا نوٹس شامل کرکے اپنی صحت ٹریک کریں۔',
    today: 'آج',
    yesterday: 'کل',
    
    // Common
    back: 'واپس',
    submit: 'جمع کریں',
    cancel: 'منسوخ',
    close: 'بند کریں',
    learnMore: 'مزید جانیں',
    generalDisclaimer: '⚕️ یہ صرف معلوماتی مقاصد کے لیے ہے۔ ہمیشہ قابل صحت پیشہ ور سے مشورہ کریں۔',
    language: 'زبان',
    english: 'English',
    urdu: 'اردو',
    
    // Care Navigation
    emergency: 'ایمرجنسی',
    urgent: 'فوری دیکھ بھال',
    routine: 'معمول کی جانچ',
    selfCare: 'گھریلو علاج',
    visitER: 'فوری طور پر ایمرجنسی روم جائیں',
    visitUrgent: '24 گھنٹے کے اندر فوری دیکھ بھال لیں',
    visitDoctor: 'اس ہفتے ڈاکٹر سے ملاقات شیڈول کریں',
    homeRemedy: 'گھریلو علاج آزمائیں اور نگرانی کریں',
  }
};

export function t(key: keyof typeof translations.en, lang: Language): string {
  return translations[lang][key] || translations.en[key] || key;
}
