import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart2 } from 'lucide-react';

const pollQuestion = 'Should the constitution be amended to include more rights?';
const options = ['Yes', 'No', 'Not Sure'];

export default function Polls() {
  const [error, setError] = useState<string | null>(null);
  const [votes, setVotes] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('poll-votes');
      return saved ? JSON.parse(saved) : [0, 0, 0];
    } catch {
      return [0, 0, 0];
    }
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [voted, setVoted] = useState(false);

  function handleVote() {
    if (selected === null) {
      setError('Please select an option before voting.');
      return;
    }
    setError(null);
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
    try {
      localStorage.setItem('poll-votes', JSON.stringify(newVotes));
    } catch {}
    setVoted(true);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">Constitution Polls</h1>
      </div>
      <Card className="max-w-xl mb-8 shadow-sm">
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <CardContent className="p-6">
          <div className="mb-4 font-semibold text-lg">{pollQuestion}</div>
          <div className="flex flex-col gap-2 mb-4">
            {options.map((opt, idx) => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="poll"
                  checked={selected === idx}
                  onChange={() => setSelected(idx)}
                  disabled={voted}
                />
                {opt}
              </label>
            ))}
          </div>
          <button
            className="bg-primary text-white rounded px-4 py-2 mb-4 hover:bg-primary/90 transition"
            onClick={handleVote}
            disabled={voted || selected === null}
          >
            Vote
          </button>
          <div className="mt-4">
            <div className="font-semibold mb-2">Results:</div>
            {options.map((opt, idx) => (
              <div key={opt} className="text-base">
                {opt}: {votes[idx]} votes
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
