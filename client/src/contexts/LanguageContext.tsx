import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useError } from './ErrorContext';
import { withErrorHandling } from './ErrorContext';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  error: Error | null;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.lessons': 'Lessons',
    'nav.quiz': 'Quiz',
    'nav.progress': 'Progress',
      'nav.glossary': 'Glossary',
    
    // Hero Section
    'hero.title': 'Learn Nepal\'s Constitution',
    'hero.subtitle': 'Master civic knowledge through interactive lessons and quizzes',
    'hero.cta': 'Start Learning',
    
    // Features
  'features.title': 'Why Choose SambhidanX?',
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
  'about.title': 'About SambhidanX',
  'about.description': "SambhidanX is an interactive platform that helps young people learn and understand Nepal’s Constitution. Through bite-sized lessons and engaging activities, users explore their fundamental rights, civic duties, and the structure of government, gaining a deeper understanding of how the Constitution protects citizens and shapes governance.",
      'about.mission': "Our mission is to make constitutional education accessible, engaging, and practical, empowering the next generation to become informed, responsible, and active citizens.",
  // Timeline Section
  'timeline.title': 'Nepal Constitutional Timeline',
  // Glossary Section
  'glossary.title': 'Glossary of Constitutional Terms',
  'glossary.search': 'Search terms...',
  'glossary.noresults': 'No matching terms found.',
  // Contact Section
  'contact.title': 'Contact / Feedback',
  'contact.description': 'Have a suggestion, question, or feedback? Fill out the form below to reach us.',
  'contact.name': 'Your Name',
  'contact.email': 'Your Email',
  'contact.message': 'Your Message',
  'contact.submit': 'Send Message',
  'contact.thankyou': 'Thank you for your feedback! We appreciate your input.',
    'quiz.title': 'Test Your Knowledge',
    'quiz.question': 'Question',
    'quiz.submit': 'Submit Answer',
    'quiz.correct': 'Correct!',
    'quiz.points-earned': 'points earned',
    'quiz.incorrect': 'Incorrect. Try again!',
    'quiz.next': 'Next Question',
    
    // Progress
    'progress.title': 'Your Progress',
    'progress.points': 'Total Points',
    'progress.lessons-completed': 'Lessons Completed',
    'progress.quiz-accuracy': 'Quiz Accuracy',
    
    // Achievements
    'nav.achievements': 'Achievements',
    'achievements.title': '🏆 Achievements',
    'achievements.unlocked': 'Unlocked',
    'achievements.total': 'Total',
    'achievements.completion': 'Completion',
    'achievements.points-earned': 'Points Earned',
    'achievements.guide.title': 'Achievement Guide',
    'achievements.guide.desc': 'Complete lessons, take quizzes, and explore the constitution to earn achievements and points!',
    'achievements.category.learning': 'Learning',
    'achievements.category.progress': 'Progress', 
    'achievements.category.mastery': 'Mastery',
    'achievements.category.dedication': 'Dedication', 
    'achievements.locked': 'Locked',
    'achievements.progress': 'Progress',
    'achievements.category-achievements': 'Achievements',
    'achievements.notification.title': 'Achievement Unlocked!',
    'achievements.notification.points': 'points earned',
    
    // Lesson Details  
    'lesson.section': 'Section',
    'lesson.sections': 'Sections',
    'lesson.of': 'of',
    'lesson.not-found': 'Lesson not found',
    'lesson.sections-count': 'sections',
    'lesson.complete-section': 'Complete Section',
    'lesson.section-completed': 'Section Completed!',
    'lesson.next-section': 'Next Section',
    'lesson.complete-lesson': 'Complete Lesson',
    'lesson.back-to-lessons': 'Back to Lessons',
    'lesson.progress': 'Progress',
    
    // Quiz Details
    'quiz.score': 'Score',
    'quiz.total-questions': 'Total Questions',
    'quiz.correct-answers': 'Correct Answers',
    'quiz.try-again': 'Try Again',
    'quiz.excellent': 'Excellent!',
    'quiz.good-job': 'Good Job!',
    'quiz.keep-trying': 'Keep Trying!',
    
    // General
    'general.loading': 'Loading...',
    'general.error': 'Error',
    'general.close': 'Close',
    'general.continue': 'Continue',
    'general.back': 'Back',
    'general.language.toggle': 'नेपाली',
    'quiz.show-hint': 'Show Hint',
    'quiz.hide-hint': 'Hide Hint',
    'quiz.complete-quiz': 'Complete Quiz',
    'quiz.back-to-quizzes': 'Back to Quizzes',
    'quiz.start': 'Start Quiz',
    'quiz.questions-count': 'questions',
    'quiz.category.constitution-basics': 'Constitution Basics',
    'quiz.category.fundamental-rights': 'Fundamental Rights', 
    'quiz.category.government-structure': 'Government Structure',
    'quiz.category.federal-system': 'Federal System',
  },
  ne: {
    // Navigation  
    'nav.home': 'गृहपृष्ठ',
    'nav.lessons': 'पाठहरू',
    'nav.quiz': 'क्विज',
    'nav.progress': 'प्रगति',
      'nav.glossary': 'शब्दकोश',
    
    // Hero Section
    'hero.title': 'नेपालको संविधान सिक्नुहोस्',
    'hero.subtitle': 'अन्तर्क्रियात्मक पाठ र क्विजको माध्यमबाट नागरिक ज्ञानमा दक्षता हासिल गर्नुहोस्',
    'hero.cta': 'सिक्न सुरु गर्नुहोस्',
    
    // Features
  'features.title': 'किन SambhidanX छनोट गर्ने?',
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
  'about.title': 'SambhidanX बारेमा',
  'about.description': "SambhidanX एक अन्तरक्रियात्मक प्लेटफर्म हो जसले युवाहरूलाई नेपालको संविधान सिक्न र बुझ्न मद्दत गर्छ। छोटो पाठ र आकर्षक गतिविधिहरूको माध्यमबाट, प्रयोगकर्ताहरूले मौलिक अधिकार, नागरिक कर्तव्य, र सरकारको संरचना अन्वेषण गर्छन्, जसले संविधानले नागरिकलाई कसरी संरक्षण गर्छ र शासनलाई कसरी आकार दिन्छ भन्ने गहिरो समझ प्रदान गर्छ।",
      'about.mission': "हाम्रो उद्देश्य संविधानिक शिक्षालाई पहुँचयोग्य, आकर्षक, र व्यवहारिक बनाउनु हो, जसले नयाँ पुस्तालाई जानकार, जिम्मेवार, र सक्रिय नागरिक बन्न सशक्त बनाउँछ।",
  // Timeline Section
  'timeline.title': 'नेपालको संविधानिक समयरेखा',
  // Glossary Section
  'glossary.title': 'संवैधानिक शब्दकोश',
  'glossary.search': 'शब्द खोज्नुहोस्...',
  'glossary.noresults': 'मिल्दो शब्द फेला परेन।',
  // Contact Section
  'contact.title': 'सम्पर्क / प्रतिक्रिया',
  'contact.description': 'के तपाईंको सुझाव, प्रश्न, वा प्रतिक्रिया छ? तलको फारम भरी हामीलाई जानकारी दिनुहोस्।',
  'contact.name': 'तपाईंको नाम',
  'contact.email': 'तपाईंको इमेल',
  'contact.message': 'तपाईंको सन्देश',
  'contact.submit': 'सन्देश पठाउनुहोस्',
  'contact.thankyou': 'तपाईंको प्रतिक्रिया को लागि धन्यवाद! हामी तपाईंको सुझावको कदर गर्छौं।',
    'quiz.submit': 'उत्तर पेश गर्नुहोस्',
    'quiz.correct': 'सहि!',
    'quiz.points-earned': 'अंक कमाइयो',
    'quiz.incorrect': 'गलत। फेरि प्रयास गर्नुहोस्!',
    'quiz.next': 'अर्को प्रश्न',
    
    // Progress
    'progress.title': 'तपाईंको प्रगति',
    'progress.points': 'कुल अंकहरू',
    'progress.lessons-completed': 'पूरा भएका पाठहरू',
    'progress.quiz-accuracy': 'क्विज सटीकता',
    
    // Achievements  
    'nav.achievements': 'उपलब्धिहरू',
    'achievements.title': '🏆 उपलब्धिहरू',
    'achievements.unlocked': 'अनलक भएको',
    'achievements.total': 'कुल',
    'achievements.completion': 'पूर्णता',
    'achievements.points-earned': 'कमाएका अंकहरू',
    'achievements.guide.title': 'उपलब्धि गाइड',
    'achievements.guide.desc': 'पाठहरू पूरा गर्नुहोस्, क्विज लिनुहोस्, र संविधान अन्वेषण गरेर उपलब्धिहरू र अंकहरू कमाउनुहोस्!',
    'achievements.category.learning': 'सिकाइ',
    'achievements.category.progress': 'प्रगति',
    'achievements.category.mastery': 'निपुणता', 
    'achievements.category.dedication': 'समर्पण',
    'achievements.locked': 'बन्द', 
    'achievements.progress': 'प्रगति',
    'achievements.category-achievements': 'उपलब्धिहरू',
    'achievements.notification.title': 'उपलब्धि अनलक भयो!',
    'achievements.notification.points': 'अंक कमाइयो',
    
    // Lesson Details
    'lesson.section': 'खण्ड',
    'lesson.sections': 'खण्डहरू',
    'lesson.of': 'को',
    'lesson.not-found': 'पाठ फेला परेन',
    'lesson.sections-count': 'खण्डहरू',
    'lesson.complete-section': 'खण्ड पूरा गर्नुहोस्',
    'lesson.section-completed': 'खण्ड पूरा भयो!',
    'lesson.next-section': 'अर्को खण्ड',
    'lesson.complete-lesson': 'पाठ पूरा गर्नुहोस्',
    'lesson.back-to-lessons': 'पाठहरूमा फर्कनुहोस्',
    'lesson.progress': 'प्रगति',
    
    // Quiz Details
    'quiz.score': 'स्कोर',
    'quiz.total-questions': 'कुल प्रश्नहरू',
    'quiz.correct-answers': 'सही उत्तरहरू',
    'quiz.try-again': 'फेरि प्रयास गर्नुहोस्',
    'quiz.excellent': 'उत्कृष्ट!',
    'quiz.good-job': 'राम्रो काम!',
    'quiz.keep-trying': 'प्रयास जारी राख्नुहोस्!',
    
    // General
    'general.loading': 'लोड हुँदैछ...',
    'general.error': 'त्रुटि',
    'general.close': 'बन्द गर्नुहोस्',
    'general.continue': 'जारी राख्नुहोस्',
    'general.back': 'पछाडि',
    'general.language.toggle': 'English',
    'quiz.show-hint': 'सहायता देखाउनुहोस्',
    'quiz.hide-hint': 'सहायता लुकाउनुहोस्',
    'quiz.complete-quiz': 'क्विज पूरा गर्नुहोस्',
    'quiz.back-to-quizzes': 'क्विजहरूमा फर्कनुहोस्',
    'quiz.start': 'क्विज सुरु गर्नुहोस्',
    'quiz.questions-count': 'प्रश्नहरू',
    'quiz.category.constitution-basics': 'संविधानका आधारहरू',
    'quiz.category.fundamental-rights': 'मौलिक अधिकारहरू',
    'quiz.category.government-structure': 'सरकारी संरचना',
    'quiz.category.federal-system': 'संघीय प्रणाली',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function BaseLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('education-for-democracy-language');
      return (saved as Language) || 'en';
    } catch (error) {
      console.error('Failed to load language preference:', error);
      return 'en';
    }
  });

  const [error, setError] = useState<Error | null>(null);
  const { addError } = useError();

  useEffect(() => {
    try {
      localStorage.setItem('education-for-democracy-language', language);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to save language preference');
      setError(err);
      addError('LanguageContext', err);
    }
  }, [language, addError]);

  const toggleLanguage = () => {
    try {
      setLanguage(prev => prev === 'en' ? 'ne' : 'en');
      setError(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to toggle language');
      setError(err);
      addError('LanguageContext', err);
    }
  };

  const t = (key: string) => {
    try {
      const translation = translations[language][key as keyof typeof translations['en']];
      if (!translation) {
        console.warn(`Translation missing for key: ${key}`);
      }
      return translation || key;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(`Failed to translate key: ${key}`);
      setError(err);
      addError('LanguageContext', err);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, error }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Apply error handling to the base provider
export const LanguageProvider = withErrorHandling(BaseLanguageProvider, 'LanguageContext');

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}