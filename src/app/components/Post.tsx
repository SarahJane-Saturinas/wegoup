import React from 'react';

interface PostProps {
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

export default function Post({
  id,
  userName,
  userInitial,
  content,
  createdAt,
  location,
  imageUrl,
  likes,
  comments,
  shares,
  badge,
}: PostProps) {
  return (
    <article className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200" aria-label={`Post by ${userName}`}>
      <header className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-green-700 font-bold text-lg">
          {userInitial}
        </div>
        <div>
          <div className="font-semibold flex items-center gap-2">
            {userName}
            {badge && (
              <span className="bg-green-200 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <time className="text-xs text-gray-500">{new Date(createdAt).toLocaleString()}</time>
        </div>
      </header>
      <p className="text-sm mb-2 whitespace-pre-wrap">{content}</p>
      {location && <div className="text-xs text-gray-500 mb-2">📍 {location}</div>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Post related"
          className="w-full rounded-lg mb-2 object-cover max-h-60"
          loading="lazy"
        />
      )}
      <footer className="flex gap-6 text-sm text-gray-600 mt-2">
        <button aria-label="Like post" className="hover:text-green-700 flex items-center gap-1">
          👍 {likes}
        </button>
        <button aria-label="Comment on post" className="hover:text-green-700 flex items-center gap-1">
          💬 {comments}
        </button>
        <button aria-label="Share post" className="hover:text-green-700 flex items-center gap-1">
          ↗ {shares}
        </button>
      </footer>
    </article>
  );
}
