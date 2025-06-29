'use client';

import React, { useState } from 'react';
import Post from './Post';

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

interface CommunityFeedProps {
  posts: PostData[];
  onPostSubmitAction: (content: string) => void;
  postingError?: string | null;
}

export default function CommunityFeed({ posts, onPostSubmitAction, postingError }: CommunityFeedProps) {
  const [postContent, setPostContent] = useState('');

  const handlePost = () => {
    if (postContent.trim() === '') {
      alert('Post content cannot be empty.');
      return;
    }
    onPostSubmitAction(postContent);
    setPostContent('');
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Share your planting experience, ask questions, or post tips..."
          rows={4}
          maxLength={1000}
          className="w-full border border-gray-300 rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
          aria-label="New post content"
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-500">{postContent.length}/1000</span>
          <button
            onClick={handlePost}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
            aria-label="Post"
          >
            Post
          </button>
        </div>
        {postingError && <div className="text-red-600 text-sm mt-2">{postingError}</div>}
      </div>

      <div className="overflow-y-auto max-h-[600px]">
        {posts.length === 0 && <div className="text-center text-gray-500">No posts yet.</div>}
        {posts.map((p) => (
          <Post
            key={p.id}
            id={p.id}
            userName={p.userName}
            userInitial={p.userInitial}
            content={p.content}
            createdAt={p.createdAt}
            location={p.location}
            imageUrl={p.imageUrl}
            likes={p.likes}
            comments={p.comments}
            shares={p.shares}
            badge={p.badge}
          />
        ))}
      </div>
    </section>
  );
}
