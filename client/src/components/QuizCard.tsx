import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizCardProps {
  questions: QuizQuestion[];
  quizId: string;
}

export default function QuizCard({ questions, quizId }: QuizCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  
  const { addPoints, recordQuizScore } = useProgress();
  const { t } = useLanguage();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      addPoints(10);
    }
    
    setAnswered(true);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Quiz completed
      recordQuizScore(quizId, (score / questions.length) * 100);
      console.log(`Quiz ${quizId} completed with score: ${score}/${questions.length}`);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
    
    setSelectedAnswer(null);
    setAnswered(false);
    setShowResult(false);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswered(false);
  };

  if (isLastQuestion && answered) {
    return (
      <Card className="w-full max-w-2xl mx-auto" data-testid="card-quiz-completed">
        <CardContent className="p-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
          <p className="text-lg text-muted-foreground mb-4">
            Your Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
          </p>
          <Button onClick={resetQuiz} data-testid="button-retake-quiz">
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto" data-testid="card-quiz-question">
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
              className="w-full justify-start text-left h-auto p-4"
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
        
        {showResult && (
          <div className="p-4 rounded-md border">
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <p className="text-green-600 font-medium flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                {t('quiz.correct')}
              </p>
            ) : (
              <p className="text-red-600 font-medium flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                {t('quiz.incorrect')}
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {!answered ? (
          <Button 
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="w-full"
            data-testid="button-submit-answer"
          >
            {t('quiz.submit')}
          </Button>
        ) : (
          <Button 
            onClick={handleNextQuestion}
            className="w-full"
            data-testid="button-next-question"
          >
            {isLastQuestion ? 'Complete Quiz' : t('quiz.next')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}