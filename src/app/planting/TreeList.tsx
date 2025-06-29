'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface Tree {
  id: string;
  name: string;
  species: string;
  plantedAt: string;
}

export default function TreeList() {
  const { user } = useUser();
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchTrees = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/trees', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.error || 'Failed to fetch trees');
          setTrees([]);
        } else {
          const data = await res.json();
          setTrees(data);
        }
      } catch (err) {
        setError('Failed to fetch trees');
        setTrees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrees();
  }, [user]);

  if (!user) {
    return <p>Please sign in to view your planted trees.</p>;
  }

  if (loading) {
    return <p>Loading trees...</p>;
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  if (trees.length === 0) {
    return <p>No trees planted yet.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-4">Your Planted Trees</h2>
      <ul className="space-y-4">
        {trees.map((tree) => (
          <li key={tree.id} className="border border-gray-300 rounded-xl p-4 shadow-sm">
            <p><strong>Name:</strong> {tree.name}</p>
            <p><strong>Species:</strong> {tree.species}</p>
            <p><strong>Date Planted:</strong> {new Date(tree.plantedAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
