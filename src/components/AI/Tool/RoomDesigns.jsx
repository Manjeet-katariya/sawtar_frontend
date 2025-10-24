
import React from 'react';

const RoomDesigns = () => {
  const designs = [
    {
      id: 1,
      name: 'Modern Minimalist',
      image: 'https://example.com/modern-minimalist.jpg',
      description: 'A clean and airy design with neutral tones.',
    },
    {
      id: 2,
      name: 'Cozy Scandinavian',
      image: 'https://example.com/scandinavian.jpg',
      description: 'Warm textures with a Nordic aesthetic.',
    },
    {
      id: 3,
      name: 'Industrial Loft',
      image: 'https://example.com/industrial-loft.jpg',
      description: 'Bold and raw with exposed materials.',
    },
  ];

  return (
    <div className="p-4 flex-1 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Room Designs</h2>
      <div className="grid grid-cols-2 gap-4">
        {designs.map((design) => (
          <div key={design.id} className="relative group cursor-pointer">
            <img
              src={design.image}
              alt={design.name}
              className="w-full h-40 object-cover rounded-lg group-hover:opacity-90 transition"
            />
            <div className="mt-2 text-sm font-semibold text-gray-800">{design.name}</div>
            <p className="text-xs text-gray-500">{design.description}</p>
            <button className="mt-2 w-full bg-indigo-600 text-white py-1 rounded-lg text-sm hover:bg-indigo-700 transition">
              Apply Design
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomDesigns;
