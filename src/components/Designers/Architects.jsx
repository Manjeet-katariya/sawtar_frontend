import React from 'react';
import DesignerCard from './cards/DesignerCard';

const architects = [
  {
    id: 1,
    name: 'James Peterson',
    experience: '15 years',
    projects: '60+',
    specialty: 'Sustainable Design',
    image: '/architects/james.jpg',
    rating: 4.9
  },
  {
    id: 2,
    name: 'Lisa Rodriguez',
    experience: '10 years',
    projects: '45+',
    specialty: 'Modern Architecture',
    image: '/architects/lisa.jpg',
    rating: 4.8
  },
  {
    id: 3,
    name: 'David Kim',
    experience: '18 years',
    projects: '90+',
    specialty: 'Commercial Buildings',
    image: '/architects/david.jpg',
    rating: 5.0
  }
];

const Architects = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Professional Architects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {architects.map(architect => (
          <DesignerCard key={architect.id} designer={architect} />
        ))}
      </div>
    </div>
  );
};

export default Architects;