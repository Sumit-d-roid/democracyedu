import { useEffect, useMemo, useState } from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { useSearch } from '@/contexts/SearchContext';
import { search as runSearch, SearchHit } from '@/lib/searchIndex';
import { useLocation } from 'wouter';

export default function SearchCommand() {
  const { isOpen, setOpen } = useSearch();
  const [, navigate] = useLocation();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const results = useMemo(() => (query.trim() ? runSearch(query, 12) : []), [query]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd+K and '/'
      const isCmdK = (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey));
      const isSlash = e.key === '/';
      if (isCmdK || isSlash) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setOpen]);

  function go(hit: SearchHit) {
    if (hit.kind === 'lesson') navigate(`/lessons/${hit.id}`);
    else if (hit.kind === 'quiz') navigate(`/quiz?id=${encodeURIComponent(hit.id)}`);
    setOpen(false);
    setQuery('');
  }

  // Group results
  const lessons = results.filter((r) => r.kind === 'lesson');
  const quizzes = results.filter((r) => r.kind === 'quiz');

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search lessons and quizzes... (/ or Ctrl/Cmd+K)"
        value={query}
        onValueChange={setQuery}
        autoFocus
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {lessons.length > 0 && (
          <CommandGroup heading="Lessons">
            {lessons.map((hit) => (
              <CommandItem
                key={`lesson-${hit.id}`}
                value={`lesson:${hit.title}`}
                onSelect={() => go(hit)}
                onMouseEnter={() => setSelectedId(hit.id)}
                data-kind="lesson"
              >
                <span className="mr-2" aria-hidden>📘</span>
                <div>
                  <div className="font-medium">{hit.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{hit.description}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {lessons.length > 0 && quizzes.length > 0 && <CommandSeparator />}
        {quizzes.length > 0 && (
          <CommandGroup heading="Quizzes">
            {quizzes.map((hit) => (
              <CommandItem
                key={`quiz-${hit.id}`}
                value={`quiz:${hit.title}`}
                onSelect={() => go(hit)}
                onMouseEnter={() => setSelectedId(hit.id)}
                data-kind="quiz"
              >
                <span className="mr-2" aria-hidden>🧠</span>
                <div>
                  <div className="font-medium">{hit.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{hit.description}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
