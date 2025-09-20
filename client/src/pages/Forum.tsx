
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

interface Post {
  id: number;
  author: string;
  content: string;
}

const initialPosts: Post[] = [
  { id: 1, author: 'Admin', content: 'Welcome to the Constitution Forum! Ask questions, share ideas, and discuss.' }
];

export default function Forum() {
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('forum-posts');
      return saved ? JSON.parse(saved) : initialPosts;
    } catch {
      return initialPosts;
    }
  });
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      setError('Please enter your name and a message.');
      return;
    }
    setError(null);
    const newPosts = [...posts, { id: posts.length + 1, author, content }];
    setPosts(newPosts);
    try {
      localStorage.setItem('forum-posts', JSON.stringify(newPosts));
    } catch {}
  setAuthor('');
  setContent('');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">Constitution Forum</h1>
      </div>
      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3 max-w-md">
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          className="border rounded px-3 py-2 focus:ring focus:ring-primary"
        />
        <textarea
          placeholder="Share your question or idea..."
          value={content}
          onChange={e => setContent(e.target.value)}
          className="border rounded px-3 py-2 focus:ring focus:ring-primary"
        />
        <button type="submit" className="bg-primary text-white rounded px-4 py-2 hover:bg-primary/90 transition">Post</button>
      </form>
      <div className="space-y-4 max-w-2xl">
        {posts.map(post => (
          <Card key={post.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="font-semibold text-primary mb-1">{post.author}</div>
              <div className="mt-1 text-base">{post.content}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
