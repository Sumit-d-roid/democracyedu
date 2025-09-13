import { useState } from 'react';
import QuizCard from '@/components/QuizCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Quiz() {
  const { t } = useLanguage();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);

  // todo: remove mock functionality - replace with real quiz data
  const quizzes = [
    {
      id: 'constitution-basics',
      title: 'Constitution Basics',
      description: 'Test your knowledge of Nepal\'s Constitution fundamentals',
      questions: [
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
        },
        {
          id: '3',
          question: 'What is the highest court in Nepal?',
          options: ['High Court', 'Supreme Court', 'Constitutional Court', 'Federal Court'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 'fundamental-rights',
      title: 'Fundamental Rights',
      description: 'Quiz on fundamental rights guaranteed by the Constitution',
      questions: [
        {
          id: '1',
          question: 'Which article deals with the Right to Equality?',
          options: ['Article 15', 'Article 16', 'Article 17', 'Article 18'],
          correctAnswer: 3
        },
        {
          id: '2',
          question: 'The Right to Information is guaranteed under which article?',
          options: ['Article 27', 'Article 28', 'Article 29', 'Article 30'],
          correctAnswer: 0
        }
      ]
    }
  ];

  const selectedQuizData = quizzes.find(quiz => quiz.id === selectedQuiz);

  if (selectedQuiz && selectedQuizData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => setSelectedQuiz(null)}
            className="mb-6"
            data-testid="button-back-to-quizzes"
          >
            ← Back to Quizzes
          </Button>
          <QuizCard questions={selectedQuizData.questions} quizId={selectedQuiz} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center" data-testid="text-quiz-title">
          {t('quiz.title')}
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover-elevate cursor-pointer" data-testid={`card-quiz-${quiz.id}`}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{quiz.description}</p>
                <p className="text-sm text-muted-foreground">
                  {quiz.questions.length} questions
                </p>
                <Button 
                  onClick={() => setSelectedQuiz(quiz.id)}
                  className="w-full"
                  data-testid={`button-start-quiz-${quiz.id}`}
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}