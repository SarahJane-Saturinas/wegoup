import React from 'react';

interface Plant {
  id: number;
  name: string;
  scientificName: string;
  climate: string;
  imageUrl: string;
  tags: string[];
  isNative?: boolean;
}

const plants: Plant[] = [
  {
    id: 1,
    name: 'California Oak',
    scientificName: 'Quercus agrifolia',
    climate: 'Mediterranean climate',
    imageUrl: '/quercusagrifolia.png',
    tags: ['easy care', 'slow growing'],
    isNative: true,
  },
  {
    id: 2,
    name: 'Jade Plant',
    scientificName: 'Crassula ovata',
    climate: 'Arid regions',
    imageUrl: '/jadeplant.webp',
    tags: ['easy care', 'slow growing'],
  },
  {
    id: 3,
    name: 'Lavender',
    scientificName: 'Lavandula angustifolia',
    climate: 'Mediterranean',
    imageUrl: '/lavender.jpg',
    tags: ['medium care', 'medium growing'],
  },
];

export default function FeaturedPlants() {
  return (
    <section className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto mt-8 mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <span>🌿</span> Featured Plants
        </h2>
        <a
          href="/plants"
          className="text-green-700 hover:underline font-semibold text-sm"
          aria-label="Browse all plants"
        >
          Browse All Plants &rarr;
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {plants.map((plant) => (
          <div
            key={plant.id}
            className="rounded-lg overflow-hidden border border-gray-200 shadow-sm"
          >
            <div className="relative">
              <img
                src={plant.imageUrl}
                alt={plant.name}
                className="w-full h-40 object-cover"
                loading="lazy"
              />
              {plant.isNative && (
                <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  Native
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{plant.name}</h3>
              <p className="text-xs italic text-gray-600">{plant.scientificName}</p>
              <p className="text-xs text-gray-500 mb-2">{plant.climate}</p>
              <div className="flex flex-wrap gap-2">
                {plant.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-gray-700 text-xs rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
