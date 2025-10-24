import React from 'react';
import DesignerCard from './cards/DesignerCard';

const interiorDesigners = [
  {
    id: 1,
    name: 'Sarah Johnson',
    experience: '8 years',
    projects: '45+',
    specialty: 'Modern Interiors',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbOfrjyyzJh22aR-J8RlOzPJHgvFU1n6Pwpg&s',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Michael Chen',
    experience: '12 years',
    projects: '80+',
    specialty: 'Minimalist Design',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbOfrjyyzJh22aR-J8RlOzPJHgvFU1n6Pwpg&s',
    rating: 4.9
  },
  {
    id: 3,
    name: 'Emma Wilson',
    experience: '6 years',
    projects: '35+',
    specialty: 'Scandinavian Style',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbOfrjyyzJh22aR-J8RlOzPJHgvFU1n6Pwpg&s',
    rating: 4.7
  }
];

const InteriorDesigners = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Top Interior Designers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interiorDesigners.map(designer => (
          <DesignerCard key={designer.id} designer={designer} />
        ))}
      </div>
    </div>
  );
};

export default InteriorDesigners;