import { useState } from 'react';
import QuizCard from '@/components/QuizCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { quizContents } from '@shared/quizContent';

export default function Quiz() {
  const { t } = useLanguage();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);

  const quizzes = Object.values(quizContents);

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
            ← {t('quiz.back-to-quizzes')}
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
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {quiz.questions.length} {t('quiz.questions-count')}
                  </p>
                  <Badge variant="outline">{t(`quiz.category.${quiz.id}`)}</Badge>
                </div>
                <Button 
                  onClick={() => setSelectedQuiz(quiz.id)}
                  className="w-full"
                  data-testid={`button-start-quiz-${quiz.id}`}
                >
                  {t('quiz.start')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}