import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.lessons': 'Lessons',
    'nav.quiz': 'Quiz',
    'nav.progress': 'Progress',
    
    // Hero Section
    'hero.title': 'Learn Nepal\'s Constitution',
    'hero.subtitle': 'Master civic knowledge through interactive lessons and quizzes',
    'hero.cta': 'Start Learning',
    
    // Features
    'features.title': 'Why Choose DemocracyEdu?',
    'features.gamified.title': 'Gamified Learning',
    'features.gamified.desc': 'Earn points and unlock achievements as you learn',
    'features.bilingual.title': 'Bilingual Support',
    'features.bilingual.desc': 'Learn in both English and Nepali',
    'features.progress.title': 'Track Progress',
    'features.progress.desc': 'Monitor your learning journey and scores',
    
    // Lessons
    'lessons.title': 'Constitution Lessons',
    'lessons.fundamental-rights': 'Fundamental Rights',
    'lessons.government-structure': 'Government Structure',
    'lessons.federal-system': 'Federal System',
    'lessons.start': 'Start Lesson',
    'lessons.completed': 'Completed',
    
    // Quiz
    'quiz.title': 'Test Your Knowledge',
    'quiz.question': 'Question',
    'quiz.submit': 'Submit Answer',
    'quiz.correct': 'Correct! +10 points',
    'quiz.incorrect': 'Incorrect. Try again!',
    'quiz.next': 'Next Question',
    
    // Progress
    'progress.title': 'Your Progress',
    'progress.points': 'Total Points',
    'progress.lessons-completed': 'Lessons Completed',
    'progress.quiz-accuracy': 'Quiz Accuracy',
  },
  ne: {
    // Navigation  
    'nav.home': 'गृहपृष्ठ',
    'nav.lessons': 'पाठहरू',
    'nav.quiz': 'क्विज',
    'nav.progress': 'प्रगति',
    
    // Hero Section
    'hero.title': 'नेपालको संविधान सिक्नुहोस्',
    'hero.subtitle': 'अन्तर्क्रियात्मक पाठ र क्विजको माध्यमबाट नागरिक ज्ञानमा दक्षता हासिल गर्नुहोस्',
    'hero.cta': 'सिक्न सुरु गर्नुहोस्',
    
    // Features
    'features.title': 'किन DemocracyEdu छनोट गर्ने?',
    'features.gamified.title': 'खेलकुद शैली',
    'features.gamified.desc': 'सिक्दै अंक कमाउनुहोस् र उपलब्धिहरू अनलक गर्नुहोस्',
    'features.bilingual.title': 'द्विभाषिक समर्थन',
    'features.bilingual.desc': 'अंग्रेजी र नेपाली दुवैमा सिक्नुहोस्',
    'features.progress.title': 'प्रगति ट्र्याक गर्नुहोस्',
    'features.progress.desc': 'आफ्नो सिकाइ यात्रा र स्कोर निगरानी गर्नुहोस्',
    
    // Lessons
    'lessons.title': 'संविधानका पाठहरू',
    'lessons.fundamental-rights': 'मौलिक अधिकारहरू',
    'lessons.government-structure': 'सरकारी संरचना',
    'lessons.federal-system': 'संघीय प्रणाली',
    'lessons.start': 'पाठ सुरु गर्नुहोस्',
    'lessons.completed': 'पूरा भएको',
    
    // Quiz
    'quiz.title': 'आफ्नो ज्ञान परीक्षण गर्नुहोस्',
    'quiz.question': 'प्रश्न',
    'quiz.submit': 'उत्तर पेश गर्नुहोस्',
    'quiz.correct': 'सहि! +१० अंक',
    'quiz.incorrect': 'गलत। फेरि प्रयास गर्नुहोस्!',
    'quiz.next': 'अर्को प्रश्न',
    
    // Progress
    'progress.title': 'तपाईंको प्रगति',
    'progress.points': 'कुल अंकहरू',
    'progress.lessons-completed': 'पूरा भएका पाठहरू',
    'progress.quiz-accuracy': 'क्विज सटीकता',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('democracyedu-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('democracyedu-language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ne' : 'en');
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}