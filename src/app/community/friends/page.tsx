'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface User {
  id: string;
  fullName: string;
  profileImageUrl?: string | null;
  isFriend: boolean;
}

export default function FriendsPage() {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersAndFriends = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!user) {
          setUsers([]);
          setFriends([]);
          setLoading(false);
          return;
        }

        // Fetch users from Clerk API
        const usersRes = await fetch('/api/clerk-users');
        const usersData = await usersRes.json();

        // Fetch friends from backend
        const friendsRes = await fetch('/api/friends');
        const friendsData = await friendsRes.json();

        const friendIds = friendsData.friends ? friendsData.friends.map((f: any) => f.id) : [];

        // Filter out current user and map friend status
        const filteredUsers = usersData.users
          .filter((u: any) => u.id !== user.id)
          .map((u: any) => ({
            id: u.id,
            fullName: u.fullName,
            profileImageUrl: u.profileImageUrl,
            isFriend: friendIds.includes(u.id),
          }));

        setUsers(filteredUsers);
        setFriends(friendIds);
      } catch (err) {
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndFriends();
  }, [user]);

  const toggleFriend = async (id: string) => {
    try {
      if (friends.includes(id)) {
        // Unfriend API call
        await fetch(`/api/friends/${id}`, { method: 'DELETE' });
        setFriends((prev) => prev.filter((fid) => fid !== id));
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, isFriend: false } : u))
        );
      } else {
        // Add friend API call
        await fetch(`/api/friends/${id}`, { method: 'POST' });
        setFriends((prev) => [...prev, id]);
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, isFriend: true } : u))
        );
      }
    } catch (err) {
      console.error('Failed to update friend status', err);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Welcome to the Community!</h2>
          <p className="mb-4 text-gray-600">Please sign in to see and interact with community members.</p>
          <Link href="/sign-in" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Community Friends</h1>
        <Link
          href="/community"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 transition"
        >
          Back to Community
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {loading && (
          <div className="flex items-center justify-center py-10">
            <svg className="animate-spin h-6 w-6 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-gray-600">Loading users...</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        {!loading && !error && (
          <>
            {users.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No other users found in the community.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {users.map((u) => (
                  <li key={u.id} className="flex justify-between items-center py-4">
                    <Link
                      href={`/community/friends/${u.id}`}
                      className="flex items-center gap-4 group"
                    >
                      {u.profileImageUrl ? (
                        <img
                          src={u.profileImageUrl}
                          alt={u.fullName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 group-hover:border-blue-400 transition"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600 border-2 border-gray-300">
                          {u.fullName.charAt(0)}
                        </div>
                      )}
                      <span className="text-lg font-medium text-gray-800 group-hover:underline">
                        {u.fullName}
                      </span>
                    </Link>
                    <button
                      onClick={() => toggleFriend(u.id)}
                      className={`px-4 py-2 rounded font-semibold shadow transition ${
                        u.isFriend
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {u.isFriend ? 'Unfriend' : 'Add Friend'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
