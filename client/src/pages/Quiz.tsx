import { useState, useMemo } from 'react';
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
  const [search, setSearch] = useState('');
  const filteredQuizzes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return quizzes;
    return quizzes.filter(q =>
      q.title.toLowerCase().includes(term) ||
      q.description.toLowerCase().includes(term) ||
      q.category.toLowerCase().includes(term)
    );
  }, [search, quizzes]);

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
        
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('quiz.search')}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            data-testid="input-quiz-search"
            aria-label={t('quiz.search')}
          />
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-12" data-testid="text-quiz-no-results">
            {t('quiz.no-results')}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {filteredQuizzes.map((quiz) => (
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
                  <Badge variant="outline" data-testid={`badge-quiz-category-${quiz.id}`}>{quiz.category}</Badge>
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