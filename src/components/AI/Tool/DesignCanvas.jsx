
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiMaximize, FiMinimize, FiTrash2 } from 'react-icons/fi';

const DesignCanvas = ({
  houseType,
  selectedRoom,
  wallColor,
  floorColor,
  furnitureItems,
  setFurnitureItems,
  selectedItem,
  setSelectedItem,
  roomDimensions,
  snapToGrid,
  roomRef,
  dragItemRef,
  isFullscreen,
  toggleFullscreen,
}) => {
  const readyRoomImage = 'https://via.placeholder.com/600x400.png?text=Ready+Living+Room+Design';

  useEffect(() => {
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e) => {
      e.preventDefault();
      if (dragItemRef.current) {
        const roomRect = roomRef.current.getBoundingClientRect();
        let x = e.clientX - roomRect.left - (dragItemRef.current.size.width / 2);
        let y = e.clientY - roomRect.top - (dragItemRef.current.size.height / 2);
        if (snapToGrid) {
          x = Math.round(x / 20) * 20;
          y = Math.round(y / 20) * 20;
        }
        x = Math.max(0, Math.min(x, roomDimensions.width - dragItemRef.current.size.width));
        y = Math.max(0, Math.min(y, roomDimensions.height - dragItemRef.current.size.height));
        const newItem = {
          ...dragItemRef.current,
          id: `${dragItemRef.current.id}-${Date.now()}`,
          x,
          y,
          rotation: 0,
          scale: 1,
        };
        setFurnitureItems([...furnitureItems, newItem]);
        dragItemRef.current = null;
      }
    };
    const roomElement = roomRef.current;
    roomElement.addEventListener('dragover', handleDragOver);
    roomElement.addEventListener('drop', handleDrop);
    return () => {
      roomElement.removeEventListener('dragover', handleDragOver);
      roomElement.removeEventListener('drop', handleDrop);
    };
  }, [furnitureItems, roomDimensions, snapToGrid, dragItemRef, setFurnitureItems]);

  const handleItemMove = (item, e) => {
    if (selectedItem && selectedItem.id === item.id) {
      const roomRect = roomRef.current.getBoundingClientRect();
      let x = e.clientX - roomRect.left - (item.size.width / 2);
      let y = e.clientY - roomRect.top - (item.size.height / 2);
      if (snapToGrid) {
        x = Math.round(x / 20) * 20;
        y = Math.round(y / 20) * 20;
      }
      x = Math.max(0, Math.min(x, roomDimensions.width - item.size.width));
      y = Math.max(0, Math.min(y, roomDimensions.height - item.size.height));
      setFurnitureItems(furnitureItems.map(i => i.id === item.id ? { ...i, x, y } : i));
    }
  };

  const handleRotate = () => {
    if (selectedItem) {
      setFurnitureItems(furnitureItems.map(i =>
        i.id === selectedItem.id ? { ...i, rotation: (i.rotation + 90) % 360 } : i
      ));
      toast.success(`${selectedItem.name} rotated!`);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      setFurnitureItems(furnitureItems.filter(i => i.id !== selectedItem.id));
      setSelectedItem(null);
      toast.success(`${selectedItem.name} removed!`);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-center items-center p-6">
      <div className="absolute top-6 left-6 flex items-center space-x-4 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#fcd34d] text-black text-sm font-medium rounded-lg px-4 py-2 flex items-center space-x-2 shadow-md"
        >
          <span>All Rooms</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white bg-opacity-90 text-black text-sm font-medium rounded-lg px-4 py-2 flex items-center space-x-2 shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 9.75V19a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 19v-9.25M16.5 3.75L12 7.5m0 0L7.5 3.75M12 7.5v13.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Try in 3D</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex justify-center items-center shadow-lg z-20"
      >
        <FiChevronLeft className="w-5 h-5 text-black" />
      </motion.button>
      <motion.div
        ref={roomRef}
        className="relative border-2 border-[#FFD1D1] rounded-xl shadow-xl overflow-hidden bg-gray-100"
        style={{
          width: `${roomDimensions.width}px`,
          height: `${roomDimensions.height}px`,
          backgroundColor: wallColor,
        }}
      >
        <img
          src={readyRoomImage}
          alt="Ready Room Design"
          className="w-full h-full object-cover"
          style={{ backgroundColor: floorColor }}
        />
        {furnitureItems.map(item => (
          <motion.div
            key={item.id}
            className={`absolute flex items-center justify-center ${selectedItem?.id === item.id ? 'ring-2 ring-[#CD673F]' : ''}`}
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
              width: `${item.size.width}px`,
              height: `${item.size.height}px`,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
            }}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', item.id);
              setSelectedItem(item);
            }}
            onDragEnd={(e) => handleItemMove(item, e)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(item);
            }}
          >
            {item.icon}
          </motion.div>
        ))}
        {selectedItem && (
          <motion.div
            className="absolute bg-white p-3 rounded-lg shadow-lg flex flex-col items-center space-y-2"
            style={{
              left: `${selectedItem.x + selectedItem.size.width + 10}px`,
              top: `${selectedItem.y}px`,
              zIndex: 100,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRotate}
              className="p-2 bg-[#F4F1DE] rounded-full text-[#1A132F] hover:bg-[#E9D8A6]"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
            >
              <FiTrash2 className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleFullscreen}
        className="absolute top-20 right-6 bg-white rounded-full w-12 h-12 flex justify-center items-center shadow-lg z-20"
      >
        {isFullscreen ? <FiMinimize className="w-6 h-6 text-black" /> : <FiMaximize className="w-6 h-6 text-black" />}
      </motion.button>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fcd34d] via-[#fcd34d] to-[#fcd34d] opacity-80" />
    </div>
  );
};

export default DesignCanvas;