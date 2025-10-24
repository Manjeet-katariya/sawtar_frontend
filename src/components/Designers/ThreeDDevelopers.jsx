import React from 'react';
import DeveloperCard from './cards/DeveloperCard';

const developers = [
  {
    id: 1,
    name: 'Alex Rodriguez',
    experience: '5 years',
    projects: '30+',
    specialty: '3D Modeling',
    image: '/developers/alex.jpg',
    rating: 4.7,
    software: ['Blender', '3DS Max']
  },
  {
    id: 2,
    name: 'Emma Wilson',
    experience: '7 years',
    projects: '50+',
    specialty: 'VR Environments',
    image: '/developers/emma.jpg',
    rating: 4.9,
    software: ['Unity', 'Unreal Engine']
  },
  {
    id: 3,
    name: 'Ryan Park',
    experience: '4 years',
    projects: '25+',
    specialty: 'Architectural Visualization',
    image: '/developers/ryan.jpg',
    rating: 4.6,
    software: ['SketchUp', 'Lumion']
  }
];

const ThreeDDevelopers = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">3D Visualization Experts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developers.map(developer => (
          <DeveloperCard key={developer.id} developer={developer} />
        ))}
      </div>
    </div>
  );
};

export default ThreeDDevelopers;