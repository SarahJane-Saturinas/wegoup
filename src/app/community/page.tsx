'use client';

import React, { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';

import HeroBanner from '@/app/components/HeroBanner';
import StatsCards from '@/app/components/StatsCards';
import CommunityFeed from '@/app/components/CommunityFeed';
import RightSidebar from '@/app/components/RightSidebar';
import FeaturedPlants from '@/app/components/FeaturedPlants';

interface Post {
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

export default function CommunityPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handlePostSubmit = async (content: string) => {
    if (!user) {
      alert('You must be logged in to post.');
      return;
    }
    if (content.trim() === '') {
      setPostError('Post content cannot be empty.');
      return;
    }
    setPostError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }
      await fetchPosts();
    } catch (err: any) {
      setPostError(err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <header className="flex items-center justify-between mb-6">
        <a href="/dashboard" className="text-2xl font-bold text-green-700 hover:text-green-800 transition-colors">
          🌱 WEGOUP
        </a>
        <nav className="hidden md:flex gap-4 text-sm font-medium">
          <a href="/dashboard" className="hover:text-green-700">Dashboard</a>
          <a href="/plants" className="hover:text-green-700">Plants</a>
          <a href="/events" className="hover:text-green-700">Events</a>
          <a href="/community" className="text-green-700 font-semibold">Community</a>
          <a href="/profile" className="hover:text-green-700">Profile</a>
        </nav>
        <UserButton afterSignOutUrl="/sign-in" />
      </header>

      <HeroBanner />
      <StatsCards />

      <div className="flex gap-6">
        <main className="flex-1">
          {loading && <p>Loading posts...</p>}
          {!loading && error && <p className="text-red-600">Error loading posts: {error}</p>}
          {!loading && !error && posts.length === 0 && <p>No posts found.</p>}
          {!loading && !error && (
            <CommunityFeed posts={posts} onPostSubmitAction={handlePostSubmit} postingError={postError} />
          )}
        </main>
        <RightSidebar />
      </div>

      <FeaturedPlants />
    </div>
  );
}
