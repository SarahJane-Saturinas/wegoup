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

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  attending: number;
  active: boolean;
}

const forbiddenWords = [
  'violence', 'harm', 'kill', 'attack', 'abuse', 'terror', 'weapon', 'fight', 'blood', 'gun', 'bomb', 'shoot', 'murder'
];

const allowedKeywords = [
  'tree', 'plant', 'planting', 'seedling', 'forest', 'garden', 'nature', 'environment', 'green', 'sustainability', 'ecology', 'conservation', 'climate'
];

function validatePostContent(content: string): boolean {
  const contentLower = content.toLowerCase();
  // Check for forbidden words
  for (const word of forbiddenWords) {
    if (contentLower.includes(word)) {
      return false;
    }
  }
  // Check for at least one allowed keyword
  for (const keyword of allowedKeywords) {
    if (contentLower.includes(keyword)) {
      return true;
    }
  }
  return false;
}

export default function CommunityPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

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

  const fetchEvents = async () => {
    setEventsLoading(true);
    setEventsError(null);
    try {
      console.log('Fetching events...');
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      console.log('Events fetched:', data.events);
      setEvents(data.events);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setEventsError(err.message);
    }
    setEventsLoading(false);
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
    if (!validatePostContent(content)) {
      setPostError('Post content must relate to tree planting and not contain violence or harm.');
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

  const onLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
      await fetchPosts();
    } catch (err: any) {
      console.error('Error liking post:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(event => event.active && new Date(event.date) >= new Date());

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">

      <HeroBanner />
      <StatsCards />

      <div className="flex gap-6">
        <main className="flex-1">
          {loading && <p>Loading posts...</p>}
          {!loading && error && <p className="text-red-600">Error loading posts: {error}</p>}
          {!loading && !error && posts.length === 0 && <p>No posts found.</p>}
          {!loading && !error && (
            <CommunityFeed posts={posts} onPostSubmitAction={handlePostSubmit} postingError={postError} onLikePost={onLikePost} />
          )}
        </main>
        <RightSidebar />
      </div>

      <FeaturedPlants />
    </div>
  );
}
