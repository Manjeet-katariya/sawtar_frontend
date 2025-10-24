import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import RoomItem from './RoomItem';
import { 
  FiMaximize, 
  FiMinimize, 
  FiArrowLeft, 
  FiArrowRight, 
  FiSave, 
  FiCamera, 
  FiSun,
  FiPlus,
  FiGrid
} from 'react-icons/fi';
import { useState } from 'react';

const LeftRoomEditor = ({ sidebarOpen, roomItems, setRoomItems }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lightMode, setLightMode] = useState('day');
  const [selectedItem, setSelectedItem] = useState(null);
  const roomRef = useRef(null);
  const roomContainerRef = useRef(null);

  const [, drop] = useDrop(() => ({
    accept: 'product',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset && roomContainerRef.current) {
        const rect = roomContainerRef.current.getBoundingClientRect();
        const x = (offset.x - rect.left) / zoomLevel;
        const y = (offset.y - rect.top) / zoomLevel;
        if (item.product) {
          addToRoom(item.product, x, y);
        }
      }
    },
  }));

  const addToRoom = (product, x, y) => {
    const newItem = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      image: product.image,
      x,
      y,
      width: product.dimensions.width / 5,
      height: product.dimensions.height / 5,
      rotation: 0,
      zIndex: roomItems.length,
      scale: 1,
    };
    setRoomItems([...roomItems, newItem]);
  };

  const removeFromRoom = (id) => {
    setRoomItems(roomItems.filter((item) => item.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const handleRotateItem = (id, direction) => {
    setRoomItems(
      roomItems.map((item) =>
        item.id === id
          ? { ...item, rotation: (item.rotation + (direction === 'right' ? 90 : -90)) % 360 }
          : item
      )
    );
  };

  const handleScaleItem = (id, direction) => {
    setRoomItems(
      roomItems.map((item) =>
        item.id === id
          ? {
              ...item,
              scale: direction === 'up' ? Math.min(item.scale + 0.1, 2) : Math.max(item.scale - 0.1, 0.5),
            }
          : item
      )
    );
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      roomRef.current?.requestFullscreen().catch((err) => console.error(`Fullscreen error: ${err.message}`));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={roomRef}
      className={`relative ${sidebarOpen ? 'w-3/5' : 'w-full'} bg-gray-900 flex flex-col transition-all duration-300`}
    >
      {/* Top Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-3">
        <button className="bg-indigo-600 text-white text-sm font-medium rounded-lg px-4 py-2 flex items-center shadow-md hover:bg-indigo-700 transition">
          <FiGrid className="mr-2" /> Bedroom
        </button>
        <button className="bg-white text-gray-800 text-sm font-medium rounded-lg px-4 py-2 flex items-center shadow-md hover:bg-gray-100 transition">
          <FiPlus className="mr-2" /> Add Wall
        </button>
      </div>

      {/* Room Canvas */}
      <div ref={drop} className="flex-1 flex justify-center items-center p-4 relative overflow-hidden">
        <div
          ref={roomContainerRef}
          className="relative w-full h-full bg-gray-800 rounded-lg shadow-xl"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            filter: lightMode === 'night' ? 'brightness(0.7)' : 'none',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1583845112203-4543754ea488?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Room background"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          {roomItems.map((item) => (
            <RoomItem
              key={item.id}
              item={item}
              isSelected={selectedItem?.id === item.id}
              onSelect={setSelectedItem}
              onRotate={handleRotateItem}
              onScale={handleScaleItem}
              onRemove={removeFromRoom}
            />
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-3 z-20">
        <button
          onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 2))}
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100 transition"
          title="Zoom In"
        >
          <FiMaximize size={16} />
        </button>
        <button
          onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))}
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100 transition"
          title="Zoom Out"
        >
          <FiMinimize size={16} />
        </button>
        <button
          onClick={() => setLightMode((prev) => (prev === 'day' ? 'night' : 'day'))}
          className={`rounded-full w-10 h-10 flex items-center justify-center shadow-md transition ${
            lightMode === 'day' ? 'bg-yellow-500 text-white' : 'bg-gray-800 text-white'
          }`}
          title="Toggle Day/Night"
        >
          <FiSun size={16} />
        </button>
        <button
          onClick={toggleFullscreen}
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100 transition"
          title={document.fullscreenElement ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {document.fullscreenElement ? <FiMinimize size={16} /> : <FiMaximize size={16} />}
        </button>
        <button 
          className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-indigo-700 transition"
          title="Save Design"
        >
          <FiSave size={16} />
        </button>
        <button 
          className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-indigo-700 transition"
          title="Take Snapshot"
        >
          <FiCamera size={16} />
        </button>
      </div>
    </div>
  );
};

export default LeftRoomEditor;