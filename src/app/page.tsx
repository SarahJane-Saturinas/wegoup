'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import SignInContent from './auth/sign-in/SignInContent';

const quotes = [
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "A society grows great when old men plant trees whose shade they know they shall never sit in.",
  "The creation of a thousand forests is in one acorn.",
  "He who plants a tree plants hope.",
  "To plant a garden is to believe in tomorrow.",
  "The earth laughs in flowers.",
];

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user]);

  useEffect(() => {
    setRandomIndex(Math.floor(Math.random() * quotes.length));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 p-6">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center bg-amber-50 rounded-lg p-6 md:p-12">
        <div className="flex-1 text-center md:text-left mb-8 md:mb-0">
          <div className="flex items-center justify-center md:justify-start mb-6">          </div>
          <h2 className="text-4xl font-extrabold text-green-900 mb-4">
            Join Our Tree Planting Community
          </h2>
          <p className="text-green-900 mb-8">
            Connect with others, track your impact, and help reforest the planet.
          </p>
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto md:mx-0 text-green-900">
            {quotes.length > 0 && (
              <blockquote className="italic mb-4">
                "{quotes[randomIndex]}"
              </blockquote>
            )}
          </div>
        </div>
          <div className="flex-1 flex justify-center">
          <SignInContent hideBackground={true} hideHeading={true} />
        </div>
      </div>
    </div>
  );
}
