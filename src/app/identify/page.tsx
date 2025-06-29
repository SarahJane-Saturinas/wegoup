'use client';

import React, { useState } from 'react';

export default function IdentifyPage() {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (description.trim() === '') {
      setError('Please enter a description.');
      setResult(null);
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/identify-openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to identify plant.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data.result);
      }
    } catch (err) {
      setError('Failed to identify plant. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => window.history.back()}
        className="mb-4 text-green-600 hover:text-green-800 font-semibold"
        aria-label="Back to dashboard"
      >
        &larr; Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-4">Identify Plant with AI</h1>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Enter Description</label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          rows={6}
          className="w-full border rounded p-2"
          placeholder="Describe the plant..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Identifying...' : 'Identify Plant'}
      </button>

      {error && (
        <div className="mt-4 text-red-600 font-semibold whitespace-pre-wrap">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded whitespace-pre-wrap">
          <h2 className="font-semibold mb-2">Identification Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
