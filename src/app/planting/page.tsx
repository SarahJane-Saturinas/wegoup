'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/utils/supabase';

export default function PlantingPage() {
  const { user } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    tree_name: '',
    species: '',
    date_planted: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error('No user found');
      return;
    }

    setLoading(true);

    const insertData = {
      name: form.tree_name,
      species: form.species,
      plantedAt: form.date_planted,
    };

    console.log('Sending data to API:', insertData);

    try {
      const res = await fetch('/api/trees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insertData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert('Failed to save: ' + JSON.stringify(errorData));
        console.error('API error:', errorData);
      } else {
        alert('Tree planted successfully! 🌱');
        router.push('/dashboard');
      }
    } catch (error) {
      alert('Failed to save: ' + error);
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <button
        onClick={() => router.push('/dashboard')}
        className="text-sm text-green-700 hover:text-green-900 mb-4 flex items-center gap-1"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white shadow-md rounded-2xl p-8 space-y-6 border border-gray-100">
        <h1 className="text-3xl font-bold text-green-800">🌳 Record a Tree Planting</h1>
        <p className="text-gray-600">Fill in the details below to track your tree planting activity.</p>

        <div className="space-y-4">
          <Input
            label="Tree Name"
            name="tree_name"
            value={form.tree_name}
            onChange={handleChange}
            placeholder="e.g., Hope Tree"
          />
          <Input
            label="Species"
            name="species"
            value={form.species}
            onChange={handleChange}
            placeholder="e.g., Quercus agrifolia"
          />
          <Input
            label="Date Planted"
            type="date"
            name="date_planted"
            value={form.date_planted}
            onChange={handleChange}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-xl shadow-md transition"
          >
            {loading ? 'Saving...' : '🌱 Plant Tree'}
          </button>
        </div>
      </div>
      <TreeList />
    </div>
  );
}

import TreeList from './TreeList';

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
    </div>
  );
}
