"use client";

import React, { useEffect, useState } from 'react';
import Post from '@/app/components/Post';

interface PostType {
  id: string;
  userName: string;
  userInitial: string;
  content: string;
  createdAt: string;
  location?: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  badge?: string;
}

export default function NewsfeedPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: PostType[] = await res.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading posts...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600">Error: {error}</div>;
  }

  return (
    <main className="max-w-2xl mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Newsfeed</h1>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        posts.map((post) => <Post key={post.id} {...post} />)
      )}
    </main>
  );
}
