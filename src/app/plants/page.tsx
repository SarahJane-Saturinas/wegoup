'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Import router


const plants = [
  {
    name: 'Narra',
    latin: 'Pterocarpus indicus',
    region: 'Philippines (native, Southeast Asia)',
    care: ['low care', 'slow growing'],
    description: 'The national tree of the Philippines, known for its durable hardwood and golden-yellow flowers.',
    image: '/narra.jpg',
    category: 'Native Trees',
  },
  {
    name: 'Molave',
    latin: 'Vitex parviflora',
    region: 'Philippines (endemic)',
    care: ['low care', 'slow growing'],
    description: 'A strong, termite-resistant native tree ideal for long-term reforestation projects.',
    image: '/molave.jpg',
    category: 'Native Trees',
  },
  {
    name: 'Yakal',
    latin: 'Shorea astylosa',
    region: 'Philippines (endemic)',
    care: ['medium care', 'slow growing'],
    description: 'A dense and heavy hardwood species native to Luzon and Mindanao, used in construction.',
    image: 'yakal.jpg',
    category: 'Native Trees',
  },
  {
    name: 'Lauan (Red)',
    latin: 'Shorea negrosensis',
    region: 'Philippines (native)',
    care: ['medium care', 'slow growing'],
    description: 'A group of native trees valuable for their timber and reforestation use.',
    image: 'lauan_red.jpg',
    category: 'Native Trees',
  },
  {
    name: 'Ipil',
    latin: 'Intsia bijuga',
    region: 'Southeast Asia and Pacific (native in PH)',
    care: ['low care', 'slow growing'],
    description: 'A hardwood species used in high-quality furniture and reforestation.',
    image: 'ipil.jpg',
    category: 'Native Trees',
  },
  {
    name: 'Bagras',
    latin: 'Eucalyptus deglupta',
    region: 'Philippines (Mindanao, native)',
    care: ['low care', 'fast growing'],
    description: 'Also known as rainbow eucalyptus, it’s grown for pulpwood and ornamental value.',
    image: 'bagras.jpg',
    category: 'Native Trees',
  },
  {
    name: 'Mango',
    latin: 'Mangifera indica',
    region: 'Tropical Asia (widely grown in PH)',
    care: ['medium care', 'medium growing'],
    description: 'A popular fruit tree producing sweet mangoes; used in agroforestry and backyard planting.',
    image: 'mango.jpg',
    category: 'Fruit-Bearing Trees',
  },
  {
    name: 'Lanzones',
    latin: 'Lansium domesticum',
    region: 'Southeast Asia (cultivated in PH)',
    care: ['medium care', 'medium growing'],
    description: 'A tropical fruit tree producing clusters of sweet fruits; popular in Mindanao.',
    image: 'lanzones.jpg',
    category: 'Fruit-Bearing Trees',
  },
  {
    name: 'Durian',
    latin: 'Durio zibethinus',
    region: 'Southeast Asia (cultivated in PH)',
    care: ['high care', 'medium growing'],
    description: 'Known as the “king of fruits,” durian trees are planted in southern Philippines.',
    image: 'durian.jpg',
    category: 'Fruit-Bearing Trees',
  },
  {
    name: 'Rambutan',
    latin: 'Nephelium lappaceum',
    region: 'Southeast Asia (cultivated in PH)',
    care: ['medium care', 'medium growing'],
    description: 'Produces hairy red fruits with sweet flesh; widely planted in fruit farms.',
    image: 'rambutan.jpg',
    category: 'Fruit-Bearing Trees',
  },
  {
    name: 'Coconut',
    latin: 'Cocos nucifera',
    region: 'Tropical regions (native in PH)',
    care: ['low care', 'slow growing'],
    description: 'A versatile palm tree that produces coconuts; important in Philippine economy.',
    image: 'coconut.jpg',
    category: 'Fruit-Bearing Trees',
  },
  {
    name: 'Calamansi',
    latin: 'Citrus microcarpa',
    region: 'Philippines (widely cultivated)',
    care: ['medium care', 'medium growing'],
    description: 'A small citrus fruit tree valued for its fruit and as an ornamental plant.',
    image: 'calamansi.jpg',
    category: 'Fruit-Bearing Trees',
  },
  {
    name: 'Mahogany',
    latin: 'Swietenia macrophylla',
    region: 'Central/South America (introduced)',
    care: ['low care', 'fast growing'],
    description: 'Popular for timber but controversial for biodiversity impact in native forests.',
    image: 'mahogany.jpg',
    category: 'Fast-Growing Trees',
  },
  {
    name: 'Gmelina',
    latin: 'Gmelina arborea',
    region: 'South/Southeast Asia',
    care: ['low care', 'fast growing'],
    description: 'Fast-growing tree used for timber and reforestation; thrives in lowland areas.',
    image: 'gmelina.jpg',
    category: 'Fast-Growing Trees',
  },
  {
    name: 'Acacia',
    latin: 'Acacia mangium',
    region: 'Australia/Southeast Asia (introduced)',
    care: ['low care', 'fast growing'],
    description: 'Hardy nitrogen-fixing tree used in degraded land rehabilitation and wood production.',
    image: 'acacia.jpg',
    category: 'Fast-Growing Trees',
  },
  {
    name: 'Ipil-ipil',
    latin: 'Leucaena leucocephala',
    region: 'Central America (introduced)',
    care: ['low care', 'very fast growing'],
    description: 'Small tree used for erosion control and fodder, though can be invasive.',
    image: 'ipil_ipil.jpg',
    category: 'Fast-Growing Trees',
  },
  {
    name: 'Bamboo (Kawayang Tinik)',
    latin: 'Bambusa blumeana',
    region: 'Philippines (native)',
    care: ['low care', 'very fast growing'],
    description: 'A native bamboo species used for furniture, construction, and erosion control.',
    image: 'kawayang_tinik.jpg',
    category: 'Fast-Growing Trees',
  },
  {
    name: 'Bakhaw',
    latin: 'Rhizophora mucronata',
    region: 'Coastal Philippines and SE Asia',
    care: ['medium care', 'medium growing'],
    description: 'A mangrove tree used in coastal rehabilitation; supports marine life and prevents erosion.',
    image: 'bakhaw.jpg',
    category: 'Mangrove Species',
  },
  {
    name: 'Pagatpat',
    latin: 'Sonneratia alba',
    region: 'Coastal Philippines',
    care: ['medium care', 'medium growing'],
    description: 'Mangrove species with broad leaves; helps stabilize muddy shorelines.',
    image: 'pagatpat.jpg',
    category: 'Mangrove Species',
  },
  {
    name: 'Nipa Palm',
    latin: 'Nypa fruticans',
    region: 'Coastal Philippines (native)',
    care: ['low care', 'slow growing'],
    description: 'A mangrove palm used in roofing and vinegar production.',
    image: 'nipa.jpg',
    category: 'Mangrove Species',
  },
  {
    name: 'Fire Tree',
    latin: 'Delonix regia',
    region: 'Tropical regions (introduced)',
    care: ['low care', 'fast growing'],
    description: 'Ornamental tree with bright red-orange flowers, popular in urban landscaping.',
    image: 'firetree.jpg',
    category: 'Urban/Ornamental Trees',
  },
  {
    name: 'Balete',
    latin: 'Ficus benjamina',
    region: 'Tropical Asia (native in PH)',
    care: ['medium care', 'medium growing'],
    description: 'Sacred fig tree often found in plazas and parks; has spiritual significance.',
    image: 'balete.jpg',
    category: 'Urban/Ornamental Trees',
  },
  {
    name: 'Neem Tree',
    latin: 'Azadirachta indica',
    region: 'South Asia (introduced)',
    care: ['low care', 'fast growing'],
    description: 'Known for its insect-repelling properties and medicinal uses.',
    image: 'neem.jpg',
    category: 'Urban/Ornamental Trees',
  },
  {
    name: 'Royal Palm',
    latin: 'Roystonea regia',
    region: 'Tropical Americas (introduced)',
    care: ['medium care', 'medium growing'],
    description: 'Tall, stately palm tree often planted along roads and gardens.',
    image: 'royalpalm.jpg',
    category: 'Urban/Ornamental Trees',
  }
];

export default function PlantDatabase() {
  const router = useRouter(); // ✅ Initialize router
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Native Trees',
    'Fruit-Bearing Trees',
    'Fast-Growing Trees',
    'Mangrove Species',
    'Urban/Ornamental Trees',
  ];

  const filteredPlants = plants.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.latin.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* ✅ Back Button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="mb-4 inline-flex items-center gap-2 text-sm text-green-700 hover:underline"
      >
        ← Back to Dashboard
      </button>      
      <p className="text-gray-500 mb-6">
        Explore common and native trees in the Philippines with care tips and reforestation value.
      </p>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <input
          type="text"
          placeholder="Search plants by name or scientific name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
          🌱 AI Plant ID
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedCategory === cat
                ? 'bg-green-600 text-white'
                : 'text-gray-700 bg-white hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlants.map((plant, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
            <div className="relative">
              <img
                src={plant.image}
                alt={plant.name}
                className="rounded-lg object-cover h-40 w-full"
              />
            </div>
            <h2 className="text-lg font-semibold">{plant.name}</h2>
            <p className="text-sm italic text-gray-600">{plant.latin}</p>
            <p className="text-sm text-gray-500">{plant.region}</p>
            <div className="flex flex-wrap gap-1">
              {plant.care.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-xs text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-700">{plant.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
