'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function RightSidebar() {
  const router = useRouter();
  const [askInput, setAskInput] = useState('');
  const [quickActions, setQuickActions] = useState([
    { label: 'Identify Plant with AI', color: 'bg-green-600', icon: '🌿' },
    { label: 'Find Events Near Me', color: 'bg-blue-600', icon: '📅' },
    { label: 'Browse Plant Database', color: 'bg-yellow-400', icon: '🌐' },
  ]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const eventsRes = await fetch('/api/events');
        const eventsData = await eventsRes.json();
        setUpcomingEvents(eventsData.events || []);

        const progressRes = await fetch('/api/progress');
        const progressData = await progressRes.json();
        setProgressData(progressData.progressData || []);

        // For demo, tags can be static or fetched from an API if available
        setTags([
          'How to care for succulents?',
          'Best plants for beginners',
          'Tree planting season',
          'Indoor plant tips',
        ]);
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      }
    }
    fetchData();
  }, []);

  const handleIdentifyClick = () => {
    router.push('/identify');
  };

  const handleAskSubmit = () => {
    if (askInput.trim() === '') return;
    alert(`You asked: ${askInput}`);
    setAskInput('');
  };

  const handleAskKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAskSubmit();
    }
  };

  return (
    <aside className="w-80 flex flex-col gap-6">
      {/* Quick Actions */}
      <section className="bg-white rounded-lg shadow p-4 space-y-3">
        {quickActions.map((action) => {
          if (action.label === 'Identify Plant with AI') {
            return (
              <button
                key={action.label}
                onClick={handleIdentifyClick}
                className={`${action.color} text-white w-full py-2 rounded flex items-center justify-center gap-2 font-semibold hover:brightness-110 transition`}
                aria-label={action.label}
              >
                <span>{action.icon}</span> {action.label}
              </button>
            );
          }
          return (
            <button
              key={action.label}
              className={`${action.color} text-white w-full py-2 rounded flex items-center justify-center gap-2 font-semibold hover:brightness-110 transition`}
              aria-label={action.label}
            >
              <span>{action.icon}</span> {action.label}
            </button>
          );
        })}
        <button
          className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-3xl font-bold absolute bottom-4 right-4 shadow-lg hover:brightness-110 transition"
          aria-label="Add new"
          style={{ position: 'absolute' }}
        >
          +
        </button>
      </section>

      {/* Upcoming Events */}
      <section className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Upcoming Events</h3>
          <a href="#" className="text-sm text-gray-500 hover:underline">
            View All &rarr;
          </a>
        </div>
        <ul className="space-y-3">
          {upcomingEvents.length === 0 && <li className="text-center text-gray-500">No upcoming events.</li>}
          {upcomingEvents.map((event: any) => (
            <li key={event.id} className="border-b pb-2 last:border-none">
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <span>🌱</span>
                <span>{event.title}</span>
              </div>
              <div className="text-xs text-gray-500">{new Date(event.date).toLocaleString()}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span>📍</span> {event.location}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span>👥</span> {event.attending} attending
              </div>
              <div>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                    event.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {event.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Your Progress */}
      <section className="bg-white rounded-lg shadow p-4 space-y-4">
        <h3 className="font-semibold text-lg mb-2">Your Progress</h3>
        {progressData.length === 0 && <div className="text-center text-gray-500">No progress data.</div>}
        {progressData.map(({ title, progress, goal, description, color }: any) => {
          const percentage = Math.min((progress / goal) * 100, 100);
          return (
            <div key={title}>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>{title}</span>
                <span>
                  {progress}/{goal}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                <div className={`${color} h-3 rounded-full`} style={{ width: `${percentage}%` }} />
              </div>
              <div className="text-xs text-gray-600">{description}</div>
            </div>
          );
        })}
        <div className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-2 rounded">
          Recently Earned Plant Identifier Badge
        </div>
      </section>

      {/* Ask me anything */}
      <section className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg mb-2">Ask me anything about plants!</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <button
              key={tag}
              className="bg-gray-200 text-gray-700 text-xs rounded-full px-3 py-1 hover:bg-gray-300 transition"
              onClick={() => alert(`You clicked tag: ${tag}`)}
              aria-label={`Tag: ${tag}`}
            >
              {tag}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Ask about plants..."
          value={askInput}
          onChange={(e) => setAskInput(e.target.value)}
          onKeyDown={handleAskKeyDown}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          aria-label="Ask about plants"
        />
      </section>
    </aside>
  );
}
