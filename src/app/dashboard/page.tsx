'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { motion } from 'framer-motion';
import { UserRound, MapPin, Award, TreePalm, Bot, Rocket } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useUser();
  const [treeCount, setTreeCount] = useState<number | null>(null);
  const [locationCount, setLocationCount] = useState<number | null>(null);
  const [badgeCount, setBadgeCount] = useState(2); // placeholder

  // Array of tips to cycle through
  const tips = [
    "Don't forget to water your new trees regularly to help them thrive!",
    "Planting native species helps support local wildlife.",
    "Mulching around trees retains moisture and reduces weeds.",
    "Regularly check your trees for pests and diseases.",
    "Celebrate your progress by sharing your tree planting journey!",
    "Use compost to enrich your soil naturally.",
    "Prune your trees to encourage healthy growth.",
    "Protect young trees from strong winds with stakes.",
    "Keep an eye out for invasive species in your area.",
    "Join community planting events to make a bigger impact.",
    "Water trees early in the morning or late in the evening.",
    "Use rainwater harvesting to conserve water for your plants.",
    "Plant a variety of species to increase biodiversity.",
    "Share your tree planting stories on social media to inspire others.",
    "Mulch helps regulate soil temperature and retain moisture.",
    "Avoid damaging roots when planting or digging nearby.",
    "Support local nurseries by purchasing native plants.",
    "Keep your tools clean to prevent spreading diseases.",
    "Consider the mature size of trees when planting near structures.",
    "Celebrate milestones to stay motivated in your planting journey!",
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    if (!user) return;

      const fetchData = async () => {
        const { data, error } = await supabase
          .from('tree')
          .select('id, name, species, plantedAt')
          .eq('userId', user.id);

        if (error) {
          console.error('Error fetching trees:', error.message);
          return;
        }

        // Since location is not a field, we can count unique species or just count trees
        const uniqueSpecies = new Set(data.map((t) => t.species));
        setTreeCount(data.length);
        setLocationCount(uniqueSpecies.size);
      };

    fetchData();
  }, [user]);

  // Effect to cycle through tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [tips.length]);

  const isLoading = treeCount === null || locationCount === null;

  return (
    <div className="space-y-12 px-6 py-10 max-w-6xl mx-auto bg-gradient-to-br from-green-50 via-white to-green-100 min-h-screen">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/60 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center border border-green-100"
      >
        <div className="absolute left-8 top-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-300 to-green-500 flex items-center justify-center shadow-lg border-4 border-white">
            <UserRound className="text-white w-8 h-8" />
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-green-800 tracking-tight">
          Welcome back, {user?.firstName || 'Planter'}! 🌿
        </h2>
        <p className="text-gray-700 mt-4 text-lg font-medium">
          Let's grow something great today.
        </p>
      </motion.div>

      {/* Tip Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-yellow-50/80 backdrop-blur rounded-xl shadow border-l-4 border-yellow-400 flex items-center gap-3 px-6 py-4"
      >
        <span className="text-yellow-500 text-2xl">💡</span>
        <p className="text-base text-yellow-800 font-medium">
          Tip: {tips[currentTipIndex]}
        </p>
      </motion.div>

      {/* About Us */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-green-100"
      >
        <h3 className="text-2xl font-bold mb-4 text-green-700">🌍 About WEGOUP</h3>
        <p className="text-gray-600 text-lg leading-relaxed">
          WEGOUP is a community-driven platform focused on reforestation and
          environmental sustainability. We empower individuals to track, share,
          and celebrate their tree planting efforts with the world.
        </p>
      </motion.section>

      {/* Your Tree Stats */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-green-100"
      >
        <h3 className="text-2xl font-bold mb-6 text-green-700">🌱 Your Impact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[treeCount, locationCount, badgeCount].some(val => val === null) ? (
            <SkeletonCards />
          ) : (
            <>
              <StatCard label="Trees Planted" value={treeCount ?? 0} icon={<TreePalm className="w-8 h-8 text-green-500 mx-auto" />} />
              <StatCard label="Locations" value={locationCount ?? 0} icon={<MapPin className="w-8 h-8 text-blue-400 mx-auto" />} />
              <StatCard label="Badges Earned" value={badgeCount} icon={<Award className="w-8 h-8 text-yellow-500 mx-auto" />} />
            </>
          )}
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-green-100"
      >
        <h3 className="text-2xl font-bold mb-6 text-green-700">⚡ Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ActionCard
            title="Start Planting"
            description="Log your new tree planting."
            icon={<TreePalm className="w-7 h-7 text-green-600" />}
            href="/planting"
            color="bg-gradient-to-br from-green-100 to-green-200"
          />
          <ActionCard
            title="Ask the AI"
            description="Get plant advice from our bot."
            icon={<Bot className="w-7 h-7 text-blue-500" />}
            href="/chat"
            color="bg-gradient-to-br from-blue-100 to-blue-200"
          />
          <ActionCard
            title="Emerging Tech"
            description="Explore sustainable tech trends."
            icon={<Rocket className="w-7 h-7 text-purple-500" />}
            href="/chat"
            color="bg-gradient-to-br from-purple-100 to-purple-200"
          />
        </div>
      </motion.section>

      {/* Community Goal Progress */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-green-100"
      >
        <h3 className="text-2xl font-bold mb-2 text-green-700">🎯 Community Goal</h3>
        <p className="text-gray-600 mb-4">
          Help us plant 10,000 trees by the end of the year!
        </p>
        <div className="w-full bg-gradient-to-r from-green-200 to-green-100 rounded-full h-6 shadow-inner relative overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-green-400 h-6 rounded-full absolute left-0 top-0"
            style={{ width: `${Math.min(((treeCount || 0) / 10000) * 100, 100)}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(((treeCount || 0) / 10000) * 100, 100)}%` }}
            transition={{ duration: 1 }}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-800 font-bold text-sm drop-shadow">
            {Math.min(((treeCount || 0) / 10000) * 100, 100).toFixed(1)}%
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2 text-right">
          {treeCount || 0} trees planted so far
        </p>
      </motion.section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(34,197,94,0.15)" }}
      className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-md border border-green-100 transition-all duration-200 cursor-pointer"
    >
      <div className="mb-2">{icon}</div>
      <p className="text-4xl font-extrabold text-green-600">{value}</p>
      <p className="text-gray-600 mt-2 font-medium">{label}</p>
    </motion.div>
  );
}

function SkeletonCards() {
  return Array.from({ length: 3 }).map((_, idx) => (
    <div
      key={idx}
      className="animate-pulse bg-gray-100/80 p-6 rounded-xl shadow-sm h-[100px]"
    >
      <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
    </div>
  ));
}

function ActionCard({
  title,
  description,
  icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}) {
  return (
    <motion.a
      whileHover={{ scale: 1.05, boxShadow: "0 8px 32px 0 rgba(34,197,94,0.12)" }}
      whileTap={{ scale: 0.97 }}
      href={href}
      className={`group block rounded-xl p-6 shadow-md border border-gray-100 hover:border-green-300 transition duration-200 ${color} backdrop-blur-lg`}
    >
      <div className="mb-3">{icon}</div>
      <h4 className="text-lg font-bold text-gray-800 group-hover:text-green-700 transition">
        {title}
      </h4>
          <p className="text-sm text-gray-600 mt-1">
            {description}
          </p>
        </motion.a>
      );
    }