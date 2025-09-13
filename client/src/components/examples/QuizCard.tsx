import QuizCard from '../QuizCard';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProgressProvider } from '@/contexts/ProgressContext';

const sampleQuestions = [
  {
    id: '1',
    question: 'What year was Nepal\'s current Constitution adopted?',
    options: ['2015', '2016', '2017', '2018'],
    correctAnswer: 0
  },
  {
    id: '2', 
    question: 'How many provinces does Nepal have according to the Constitution?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2
  }
];

export default function QuizCardExample() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <div className="p-8 bg-background">
          <QuizCard questions={sampleQuestions} quizId="constitution-basics" />
        </div>
      </ProgressProvider>
    </LanguageProvider>
  );
}