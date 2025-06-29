'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import CommunityFeed from '@/app/components/CommunityFeed';
import { supabase } from '@/lib/supabase';
import { useChat } from '@/app/components/ChatModal';

interface UserProfile {
  id: string;
  fullName: string;
  isFriend: boolean;
  profileImageUrl?: string;
  coverImageUrl?: string;
  friendsCount: number;
  mutualFriendsCount: number;
  friendsList: { id: string; profileImageUrl?: string }[];
}

interface PostData {
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

type Tab = 'Posts' | 'About' | 'Friends' | 'Photos' | 'Videos' | 'Check-ins' | 'More';

import { ChatProvider } from '@/app/components/ChatModal';

export default function UserProfilePage() {
  const { user } = useUser();
  const params = useParams();
  const userId = params.userId;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);

  const [posts, setPosts] = useState<PostData[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>('Posts');

  // Fetch user profile from Clerk users API and additional data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setErrorProfile(null);
      try {
        const res = await fetch('/api/clerk-users');
        const data = await res.json();
        if (data.error) {
          setErrorProfile('Failed to load user profile.');
          setProfile(null);
        } else {
          const found = data.users.find((u: UserProfile) => u.id === userId) || null;
          // Mock friends count and mutual friends for demo
          if (found) {
            found.friendsCount = 580;
            found.mutualFriendsCount = 16;
            found.friendsList = [
              { id: '1', profileImageUrl: '/path/to/image1.jpg' },
              { id: '2', profileImageUrl: '/path/to/image2.jpg' },
              { id: '3', profileImageUrl: '/path/to/image3.jpg' },
              { id: '4', profileImageUrl: '/path/to/image4.jpg' },
              { id: '5', profileImageUrl: '/path/to/image5.jpg' },
              { id: '6', profileImageUrl: '/path/to/image6.jpg' },
              { id: '7', profileImageUrl: '/path/to/image7.jpg' },
              { id: '8', profileImageUrl: '/path/to/image8.jpg' },
            ];
            found.coverImageUrl = '/path/to/cover-image.jpg'; // Placeholder cover image
          }
          setProfile(found);
        }
      } catch (err) {
        setErrorProfile('Failed to load user profile.');
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [userId]);

  // Fetch posts for the user
  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      setErrorPosts(null);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          setErrorPosts(error.message);
          setPosts([]);
        } else {
          const formattedPosts = data.map((p: any) => ({
            id: p.id,
            userName: profile?.fullName || 'Unknown',
            userInitial: profile?.fullName ? profile.fullName.charAt(0) : 'U',
            content: p.content,
            createdAt: p.created_at,
            likes: 0,
            comments: 0,
            shares: 0,
            badge: 'Plant Expert',
          }));
          setPosts(formattedPosts);
        }
      } catch (err) {
        setErrorPosts('Failed to load posts.');
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };
    if (profile) {
      fetchPosts();
    }
  }, [userId, profile]);

  const toggleFriend = () => {
    if (!profile) return;
    if (profile.isFriend) {
      if (!confirm(`Are you sure you want to remove ${profile.fullName} as a friend?`)) {
        return;
      }
    }
    setProfile({ ...profile, isFriend: !profile.isFriend });
  };

  const { openChat } = useChat();

  const handlePostSubmit = (content: string) => {
    const newPost: PostData = {
      id: `p${posts.length + 1}`,
      userName: profile?.fullName || 'Unknown',
      userInitial: profile?.fullName ? profile.fullName.charAt(0) : 'U',
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      badge: 'Plant Expert',
    };
    setPosts([newPost, ...posts]);
  };

  if (loadingProfile) {
    return <div className="max-w-4xl mx-auto p-4">Loading profile...</div>;
  }

  if (errorProfile || !profile) {
    return <div className="max-w-4xl mx-auto p-4 text-red-600">{errorProfile || 'User not found.'}</div>;
  }

  return (
    <ChatProvider>
      <div className="max-w-4xl mx-auto h-screen overflow-auto px-4 bg-green-100">
        {/* Removed cover photo, replaced with light green card */} 
        <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-green-100">
          {/* Profile header */} 
          <div className="flex items-center gap-6">
            {profile.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt={`${profile.fullName} profile`}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-green-400 flex items-center justify-center text-5xl text-white">
                {profile.fullName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold">{profile.fullName}</h1>
              <div className="flex items-center gap-4 mt-2">
                {/* Removed friends count and mutual friends */}
                {/* Removed friends list avatars */}
              </div>
            </div>
            <div className="ml-auto flex gap-4">
              <button
                onClick={toggleFriend}
                className={`px-4 py-2 rounded text-white ${
                  profile.isFriend ? 'bg-gray-400 hover:bg-gray-500' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {profile.isFriend ? 'Friends' : 'Add Friend'}
              </button>
            </div>
            <button
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
              onClick={() => openChat(profile.id, profile.fullName)}
            >
              Message
            </button>
          </div>
        </div>

        {/* Removed local chat modal */}

        {/* Tabs */}
        <nav className="border-b border-green-700 mt-6">
          <ul className="flex space-x-8 px-6">
            {['Posts', 'Friends'].map((tab) => (
              <li
                key={tab}
                className={`cursor-pointer py-4 border-b-4 ${
                  activeTab === tab ? 'border-green-700 text-green-700 font-semibold' : 'border-transparent text-gray-600'
                }`}
                onClick={() => setActiveTab(tab as Tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </nav>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'Posts' && (
            <>
              {loadingPosts && <p>Loading posts...</p>}
              {errorPosts && <p className="text-red-600">{errorPosts}</p>}
              {!loadingPosts && !errorPosts && (
                <CommunityFeed posts={posts} onPostSubmitAction={handlePostSubmit} />
              )}
            </>
          )}
          {activeTab === 'Friends' && (
            <p className="text-gray-500">Friends list coming soon.</p>
          )}
        </div>
      </div>
    </ChatProvider>
  );
