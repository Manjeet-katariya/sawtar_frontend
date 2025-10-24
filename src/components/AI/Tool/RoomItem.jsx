import React from 'react';
import { FiArrowLeft, FiArrowRight, FiMaximize, FiMinimize, FiX } from 'react-icons/fi';

const RoomItem = ({ item, isSelected, onSelect, onRotate, onScale, onRemove }) => {
  return (
    <div
      className={`absolute cursor-move transition-transform duration-100 ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
      style={{
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.width * item.scale}px`,
        height: `${item.height * item.scale}px`,
        zIndex: item.zIndex,
        transform: `rotate(${item.rotation}deg)`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
    >
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-full h-full object-contain pointer-events-none" 
      />
      {isSelected && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex space-x-1 bg-white rounded-lg p-1 shadow-md">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRotate(item.id, 'left');
            }}
            className="hover:bg-gray-100 rounded p-1"
            title="Rotate Left"
          >
            <FiArrowLeft size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRotate(item.id, 'right');
            }}
            className="hover:bg-gray-100 rounded p-1"
            title="Rotate Right"
          >
            <FiArrowRight size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onScale(item.id, 'up');
            }}
            className="hover:bg-gray-100 rounded p-1"
            title="Scale Up"
          >
            <FiMaximize size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onScale(item.id, 'down');
            }}
            className="hover:bg-gray-100 rounded p-1"
            title="Scale Down"
          >
            <FiMinimize size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id);
            }}
            className="hover:bg-red-100 text-red-500 rounded p-1"
            title="Remove"
          >
            <FiX size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomItem;