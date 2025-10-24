import React from 'react';

const DeveloperCard = ({ developer }) => {
  const handleHireClick = () => {
    // Implement hire functionality
    console.log(`Hiring ${developer.name}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img 
          src={developer.image} 
          alt={developer.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{developer.name}</h3>
            <p className="text-gray-600">{developer.specialty}</p>
          </div>
          <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
            <span className="font-bold">{developer.rating}</span>
            <svg className="w-4 h-4 ml-1 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <span>Experience: {developer.experience}</span>
          <span>Projects: {developer.projects}</span>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-600">Software:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {developer.software.map((tool, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                {tool}
              </span>
            ))}
          </div>
        </div>
        
        <button 
          onClick={handleHireClick}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
        >
          Hire Now
        </button>
      </div>
    </div>
  );
};

export default DeveloperCard;