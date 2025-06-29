'use client';

import { useState, useEffect } from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  attending: number;
  active: boolean;
}

export default function EventsPage() {
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const handleShowUpcoming = () => setShowUpcoming(true);
  const handleShowAll = () => setShowUpcoming(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const now = new Date();

  const filteredEvents = events.filter(event => {
    if (showUpcoming) {
      // Show only future events that are active
      return event.active && new Date(event.date) > now;
    }
    // Show all events
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Tree Planting Events</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
          onClick={() => alert('Create Event functionality to be implemented')}
        >
          + Create Event
        </button>
      </div>
      <p className="text-gray-600">
        Join community events and make a positive environmental impact.
      </p>

      <div className="mt-6 bg-white rounded-md shadow p-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded-md font-semibold ${
            showUpcoming ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
          }`}
          onClick={handleShowUpcoming}
        >
          Upcoming Events
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold ${
            !showUpcoming ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
          }`}
          onClick={handleShowAll}
        >
          All Events
        </button>
      </div>

      {loading ? (
        <div className="mt-6 bg-white rounded-md shadow p-8 text-center text-gray-500">
          Loading events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="mt-6 bg-white rounded-md shadow p-8 text-center text-gray-500">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">No {showUpcoming ? 'upcoming' : 'events'}</p>
          <p className="mt-1">Be the first to organize a tree planting event in your community!</p>
          <button
            type="button"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            onClick={() => alert('Create Event functionality to be implemented')}
          >
            + Create Event
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {filteredEvents.map(event => (
            <div key={event.id} className="bg-white rounded-md shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 text-green-600 text-2xl">
                <span role="img" aria-label="plant">🌱</span>
                <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
              </div>
              <div className="text-gray-700">
                <p>📅 {new Date(event.date).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</p>
                <p>📍 {event.location}</p>
                <p>👥 {event.attending} attending</p>
                <p>Status: {event.active ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
