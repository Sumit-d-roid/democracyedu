import type {
  Assessment,
  Question,
  AssessmentResult
} from '../types/learning';

// Question evaluation functions
export const evaluateQuestion = {
  'multiple-choice': (answer: string | string[], correctAnswer: string | string[]): boolean => {
    return Array.isArray(answer) 
      ? answer.sort().join(',') === (correctAnswer as string[]).sort().join(',')
      : answer === correctAnswer;
  },
  
  'true-false': (answer: string, correctAnswer: string): boolean => {
    return answer.toLowerCase() === correctAnswer.toLowerCase();
  },
  
  'essay': (answer: string, rubric: string[]): number => {
    // Basic keyword matching - could be enhanced with NLP
    const keywords = rubric.map(k => k.toLowerCase());
    const answerLower = answer.toLowerCase();
    const matchedKeywords = keywords.filter(k => answerLower.includes(k));
    return (matchedKeywords.length / keywords.length) * 100;
  },
  
  'matching': (answer: Record<string, string>, correctAnswer: Record<string, string>): boolean => {
    return Object.entries(answer).every(([key, value]) => correctAnswer[key] === value);
  },
  
  'fill-blank': (answer: string, correctAnswer: string): boolean => {
    return answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
  }
};

// Assessment scoring
export function scoreAssessment(
  assessment: Assessment,
  answers: Record<string, string | string[]>
): AssessmentResult {
  const results = assessment.questions.map(question => {
    const answer = answers[question.id];
    let correct = false;
    let points = 0;

    if (question.type === 'essay') {
      points = evaluateQuestion[question.type](answer as string, question.correctAnswer as string[]);
      correct = points >= 70; // Consider essay correct if it scores 70% or higher
    } else {
      correct = evaluateQuestion[question.type](answer, question.correctAnswer);
      points = correct ? question.points : 0;
    }

    return {
      questionId: question.id,
      answer,
      correct,
      points
    };
  });

  const totalPoints = results.reduce((sum, result) => sum + result.points, 0);
  const maxPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);
  const score = Math.round((totalPoints / maxPoints) * 100);

  return {
    assessmentId: assessment.id,
    score,
    answers: results,
    feedback: generateFeedback(score, results),
    completedAt: new Date(),
    timeSpent: 0, // Should be calculated from start time
    attempt: 1, // Should be incremented based on previous attempts
  };
}

// Generate feedback based on assessment results
function generateFeedback(
  score: number,
  answers: AssessmentResult['answers']
): string {
  const incorrectAnswers = answers.filter(a => !a.correct);
  
  let feedback = `You scored ${score}%. `;
  
  if (score >= 90) {
    feedback += 'Excellent work! You have a strong understanding of the material.';
  } else if (score >= 70) {
    feedback += 'Good job! You grasp most of the concepts, but there\'s room for improvement.';
  } else if (score >= 50) {
    feedback += 'You\'re on the right track, but you might want to review some topics.';
  } else {
    feedback += 'It seems you need more practice with this material. Consider reviewing the lessons.';
  }

  if (incorrectAnswers.length > 0) {
    feedback += '\n\nTopics to review:';
    incorrectAnswers.forEach(answer => {
      feedback += `\n- Question ${answer.questionId}`;
    });
  }

  return feedback;
}

// Format question for display
export function formatQuestion(question: Question): {
  text: string;
  options?: string[];
  type: Question['type'];
} {
  switch (question.type) {
    case 'multiple-choice':
    case 'true-false':
      return {
        text: question.question,
        options: question.options || [],
        type: question.type
      };
    
    case 'matching':
      return {
        text: question.question,
        options: question.options || [],
        type: 'matching'
      };
    
    case 'fill-blank':
      // Replace blank markers with underscores
      return {
        text: question.question.replace(/\{\{blank\}\}/g, '_____'),
        type: 'fill-blank'
      };
    
    default:
      return {
        text: question.question,
        type: question.type
      };
  }
}

// Check if user can retake assessment
export function canRetakeAssessment(
  assessment: Assessment,
  previousAttempts: AssessmentResult[]
): boolean {
  if (!assessment.maxAttempts) return true;
  return previousAttempts.length < assessment.maxAttempts;
}

// Generate practice questions based on user performance
export function generatePracticeQuestions(
  assessment: Assessment,
  previousResults: AssessmentResult[]
): Question[] {
  // Find questions that user struggled with
  const questionStats = assessment.questions.map(question => {
    const attempts = previousResults.flatMap(result => 
      result.answers.filter(a => a.questionId === question.id)
    );
    
    const correctCount = attempts.filter(a => a.correct).length;
    const accuracy = attempts.length > 0 ? correctCount / attempts.length : 0;
    
    return {
      question,
      accuracy
    };
  });

  // Sort by accuracy (lowest first) and take top 5
  return questionStats
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5)
    .map(stat => stat.question);
}

// Analyze assessment results for learning patterns
export function analyzeResults(results: AssessmentResult[]): {
  strengths: string[];
  weaknesses: string[];
  improvement: number;
} {
  const firstAttempt = results[0];
  const lastAttempt = results[results.length - 1];
  const improvement = lastAttempt.score - firstAttempt.score;

  // Analyze performance by question
  const questionStats = new Map<string, { correct: number; total: number }>();
  
  results.forEach(result => {
    result.answers.forEach(answer => {
      const stats = questionStats.get(answer.questionId) || { correct: 0, total: 0 };
      if (answer.correct) stats.correct++;
      stats.total++;
      questionStats.set(answer.questionId, stats);
    });
  });

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  questionStats.forEach((stats, questionId) => {
    const accuracy = stats.correct / stats.total;
    if (accuracy >= 0.8) {
      strengths.push(questionId);
    } else if (accuracy <= 0.6) {
      weaknesses.push(questionId);
    }
  });

  return {
    strengths,
    weaknesses,
    improvement
  };
}