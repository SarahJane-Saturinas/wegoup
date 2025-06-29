import React from 'react';

export default function HeroBanner() {
  return (
    <section className="bg-green-700 text-white rounded-lg p-8 mb-6 relative overflow-hidden">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Plant Today, Grow Tomorrow</h1>
        <p className="mb-4 text-lg max-w-xl">
          Join our community of environmental champions. Discover plants, attend events, and make lasting connections while creating a greener future.
        </p>
        <div className="flex gap-3 max-w-md">
          <button className="bg-white text-green-700 font-semibold rounded-md px-4 py-2 flex items-center gap-2 hover:bg-green-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z" />
            </svg>
            Find Planting Events
          </button>
          <input
            type="text"
            placeholder="Search events..."
            className="flex-grow rounded-md px-3 py-2 text-green-900"
            aria-label="Search events"
          />
        </div>
      </div>
      <div className="absolute top-0 right-0 bottom-0 left-0 opacity-20 bg-[url('/window.svg')] bg-cover bg-center pointer-events-none" />
    </section>
  );
}
