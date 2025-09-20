import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  answer?: string;
}

const initialQuestions: Question[] = [
  { id: 1, question: 'What is the fundamental right to equality?', answer: 'It ensures equal protection under the law for all citizens.' }
];

export default function QnA() {
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('qna-questions');
      return saved ? JSON.parse(saved) : initialQuestions;
    } catch {
      return initialQuestions;
    }
  });
  const [newQ, setNewQ] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newQ.trim()) {
      setError('Please enter a question.');
      return;
    }
    setError(null);
    const newQuestions = [...questions, { id: questions.length + 1, question: newQ }];
    setQuestions(newQuestions);
    try {
      localStorage.setItem('qna-questions', JSON.stringify(newQuestions));
    } catch {}
    setNewQ('');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">Constitution Q&amp;A</h1>
      </div>
      <form onSubmit={handleSubmit} className="mb-8 flex gap-3 max-w-md">
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <input
          type="text"
          placeholder="Ask a question..."
          value={newQ}
          onChange={e => setNewQ(e.target.value)}
          className="border rounded px-3 py-2 flex-1 focus:ring focus:ring-primary"
        />
        <button type="submit" className="bg-primary text-white rounded px-4 py-2 hover:bg-primary/90 transition">Submit</button>
      </form>
      <div className="space-y-4 max-w-2xl">
        {questions.map(q => (
          <Card key={q.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="font-semibold text-primary mb-1">Q: {q.question}</div>
              {q.answer && <div className="mt-1 text-green-700">A: {q.answer}</div>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
