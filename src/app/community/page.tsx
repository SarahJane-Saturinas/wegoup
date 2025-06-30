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

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    active: true,
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

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
  const [showUpcoming, setShowUpcoming] = React.useState(true);

  const handleShowUpcoming = () => setShowUpcoming(true);
  const handleShowAll = () => setShowUpcoming(false);

  const filteredEvents = events.filter(event => {
    if (showUpcoming) {
      return event.active && new Date(event.date) >= new Date();
    }
    return true;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!newEvent.title.trim() || !newEvent.date || !newEvent.location.trim()) {
      setCreateError('Please fill in all required fields.');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }
      // Refresh events list
      await fetchEvents();
      setShowCreateForm(false);
      setNewEvent({
        title: '',
        date: '',
        location: '',
        active: true,
      });
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

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

          {/* Events Section */}
          <section className="mt-12 bg-white rounded-md shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Upcoming Events</h2>
              <button
                className="text-green-600 hover:text-green-800 font-semibold"
                onClick={() => alert('Navigate to full events page')}
              >
                View All →
              </button>
            </div>

            <div className="flex gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded-md font-semibold ${
                  showUpcoming ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
                onClick={handleShowUpcoming}
              >
                Upcoming
              </button>
              <button
                className={`px-4 py-2 rounded-md font-semibold ${
                  !showUpcoming ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
                onClick={handleShowAll}
              >
                All
              </button>
              <button
                className="ml-auto px-4 py-2 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                + Create Event
              </button>
            </div>

            {showCreateForm && (
              <form
                onSubmit={handleCreateEvent}
                className="mb-6 p-4 border border-gray-300 rounded-md bg-gray-50"
              >
                <div className="mb-4">
                  <label htmlFor="title" className="block text-gray-700 font-semibold mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="date" className="block text-gray-700 font-semibold mb-1">
                    Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={newEvent.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="location" className="block text-gray-700 font-semibold mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={newEvent.active}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="active" className="text-gray-700 font-semibold">
                    Active
                  </label>
                </div>
                {createError && (
                  <p className="text-red-600 mb-4">{createError}</p>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Event'}
                </button>
              </form>
            )}

            {eventsLoading ? (
              <p className="text-gray-500">Loading events...</p>
            ) : filteredEvents.length === 0 ? (
              <p className="text-gray-500">No {showUpcoming ? 'upcoming' : ''} events found.</p>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-4 border border-gray-200 rounded-md p-4">
                    <span role="img" aria-label="plant" className="text-green-600 text-3xl">🌱</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-gray-700">📅 {new Date(event.date).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</p>
                      <p className="text-gray-700">📍 {event.location}</p>
                      <p className="text-gray-700">👥 {event.attending} attending</p>
                      <p className="text-gray-700">Status: {event.active ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
        <RightSidebar />
      </div>

      <FeaturedPlants />
    </div>
  );
}
