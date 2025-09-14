import QuizCard from '../QuizCard';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import type { QuizQuestion } from '@shared/quizContent';

const sampleQuestions: QuizQuestion[] = [
  {
    id: 'sample-1',
    question: "What year was Nepal's current Constitution adopted?",
    type: 'multiple-choice',
    options: ['2015', '2016', '2017', '2018'],
    correctAnswer: 0,
    explanation: 'Nepal\'s Constitution was adopted in 2015.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'sample-2',
    question: 'How many provinces does Nepal have according to the Constitution?',
    type: 'multiple-choice',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    explanation: 'There are 7 provinces.',
    difficulty: 'easy',
    points: 10
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