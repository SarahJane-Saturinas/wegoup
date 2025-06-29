'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface StatCardProps {
  label: string;
  value: number | string;
  colorClass: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, colorClass, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow`}
  >
    <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
    <span className="text-sm text-gray-600">{label}</span>
  </div>
);

export default function StatsCards() {
  const [treesPlanted, setTreesPlanted] = useState<number | string>('...');
  const [activeMembers, setActiveMembers] = useState<number | string>('...');
  const [eventsThisMonth, setEventsThisMonth] = useState<number | string>('...');
  const [plantSpecies, setPlantSpecies] = useState<number | string>(456); // Hardcoded as per user preference

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch trees planted and active members from stats API
        const res = await fetch('/api/stats');
        const data = await res.json();
        setTreesPlanted(data.treesPlanted ?? 'N/A');
        setActiveMembers(data.activeMembers ?? 'N/A');

        // Fetch events this month count from events API
        const eventsRes = await fetch('/api/events');
        const eventsData = await eventsRes.json();
        setEventsThisMonth(eventsData.length ?? 'N/A');
      } catch (error) {
        setTreesPlanted('N/A');
        setActiveMembers('N/A');
        setEventsThisMonth('N/A');
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 max-w-7xl mx-auto px-4">
      <StatCard label="Trees Planted" value={treesPlanted} colorClass="text-green-700" />
      <Link href="/community/friends" className="contents">
        <StatCard label="Active Members" value={activeMembers} colorClass="text-blue-600" />
      </Link>
      <StatCard label="Events This Month" value={eventsThisMonth} colorClass="text-yellow-500" />
      <StatCard label="Plant Species" value={plantSpecies} colorClass="text-orange-700" />
    </section>
  );
}
