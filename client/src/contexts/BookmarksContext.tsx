import { createContext, useContext, useState, ReactNode } from 'react';

type BookmarksContextType = {
  bookmarks: string[];
  toggleBookmark: (lessonId: string) => void;
  isBookmarked: (lessonId: string) => boolean;
};

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('bookmarked-lessons');
    return saved ? JSON.parse(saved) : [];
  });

  function toggleBookmark(lessonId: string) {
    setBookmarks((prev) => {
      const updated = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      localStorage.setItem('bookmarked-lessons', JSON.stringify(updated));
      return updated;
    });
  }

  function isBookmarked(lessonId: string) {
    return bookmarks.includes(lessonId);
  }

  return (
    <BookmarksContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) throw new Error('useBookmarks must be used within a BookmarksProvider');
  return context;
}
