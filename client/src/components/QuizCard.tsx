import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { QuizQuestion } from '@shared/quizContent';

interface QuizCardProps {
  questions: QuizQuestion[];
  quizId: string;
}

export default function QuizCard({ questions, quizId }: QuizCardProps) {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | number[] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  const { addPoints, recordQuizScore } = useProgress();
  const { t } = useLanguage();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;
    
    if (currentQuestion.type === 'multiple-select') {
      const currentAnswers = Array.isArray(selectedAnswer) ? selectedAnswer : [];
      if (currentAnswers.includes(answerIndex)) {
        setSelectedAnswer(currentAnswers.filter(a => a !== answerIndex));
      } else {
        setSelectedAnswer([...currentAnswers, answerIndex]);
      }
    } else {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    let isCorrect = false;
    
    if (currentQuestion.type === 'multiple-select') {
      const correctAnswers = Array.isArray(currentQuestion.correctAnswer) 
        ? currentQuestion.correctAnswer 
        : [currentQuestion.correctAnswer];
      const userAnswers = Array.isArray(selectedAnswer) ? selectedAnswer : [];
      isCorrect = correctAnswers.length === userAnswers.length && 
                  correctAnswers.every(answer => userAnswers.includes(answer));
    } else {
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    }
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      const questionPoints = currentQuestion.points || 10;
      setEarnedPoints(prev => prev + questionPoints);
      addPoints(questionPoints);
    }
    
    setAnswered(true);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Quiz completed
      recordQuizScore(quizId, (score / questions.length) * 100);
      toast({
        title: 'Quiz Completed!',
        description: `You scored ${score} out of ${questions.length}.`,
        duration: 4000,
      });
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
    
    setSelectedAnswer(null);
    setAnswered(false);
    setShowResult(false);
    setShowHint(false);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setEarnedPoints(0);
    setAnswered(false);
  };

  if (isLastQuestion && answered) {
    return (
      <Card className="w-full max-w-2xl mx-auto" data-testid="card-quiz-completed">
        <CardContent className="p-6 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h3 className="text-2xl font-bold mb-2">{t('quiz.excellent')}</h3>
          <p className="text-lg text-muted-foreground mb-4">
            {t('quiz.score')}: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
          </p>
          <div className="mb-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('quiz.total-questions')}: {questions.length} | {t('quiz.correct-answers')}: {score}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('achievements.points-earned')}: {earnedPoints} / {questions.reduce((sum, q) => sum + (q.points || 10), 0)}
            </p>
          </div>
          <Button onClick={resetQuiz} data-testid="button-retake-quiz">
            {t('quiz.try-again')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
  <Card className="w-full max-w-2xl mx-auto transition-base" data-testid="card-quiz-question">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('quiz.title')}</CardTitle>
          <Badge variant="secondary" data-testid="text-question-counter">
            {t('quiz.question')} {currentQuestionIndex + 1}/{questions.length}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <h3 className="text-lg font-medium" data-testid="text-question">
          {currentQuestion.question}
        </h3>
        
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant={
                answered && index === currentQuestion.correctAnswer
                  ? "default"
                  : selectedAnswer === index
                  ? answered && selectedAnswer !== currentQuestion.correctAnswer
                    ? "destructive"
                    : "secondary"
                  : "outline"
              }
              className="w-full justify-start text-left h-auto p-4 transition-base"
              onClick={() => handleAnswerSelect(index)}
              disabled={answered}
              data-testid={`button-answer-${index}`}
            >
              <div className="flex items-center w-full">
                <span className="flex-1">{option}</span>
                {answered && index === currentQuestion.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                )}
                {answered && selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer && (
                  <XCircle className="w-5 h-5 text-red-600 ml-2" />
                )}
              </div>
            </Button>
          ))}
        </div>
        
        {/* Hint Button */}
        {!answered && currentQuestion.hint && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(!showHint)}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-hint"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHint ? t('quiz.hide-hint') : t('quiz.show-hint')}
            </Button>
          </div>
        )}
        
        {showHint && currentQuestion.hint && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start">
              <Lightbulb className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              {currentQuestion.hint}
            </p>
          </div>
        )}
        
        {showResult && (
          <div className="p-4 rounded-md border">
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <div className="space-y-2">
                <p className="text-green-600 font-medium flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('quiz.correct')} +{currentQuestion.points || 10} {t('quiz.points-earned')}
                </p>
                {currentQuestion.explanation && (
                  <p className="text-sm text-muted-foreground">
                    {currentQuestion.explanation}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-600 font-medium flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  {t('quiz.incorrect')}
                </p>
                {currentQuestion.explanation && (
                  <p className="text-sm text-muted-foreground">
                    {currentQuestion.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {!answered ? (
          <Button 
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="w-full transition-base"
            data-testid="button-submit-answer"
          >
            {t('quiz.submit')}
          </Button>
        ) : (
          <Button 
            onClick={handleNextQuestion}
            className="w-full transition-base"
            data-testid="button-next-question"
          >
            {isLastQuestion ? t('quiz.complete-quiz') : t('quiz.next')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}