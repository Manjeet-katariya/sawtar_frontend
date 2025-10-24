import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LeftRoomEditor from './LeftRoomEditor';
import RightSidebar from './RightSidebar';
import { TutorialModal } from './TutorialModal';

const AITool = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [roomItems, setRoomItems] = useState([]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        {/* Left Room Editor */}
        <LeftRoomEditor 
          sidebarOpen={sidebarOpen} 
          roomItems={roomItems} 
          setRoomItems={setRoomItems} 
        />

        {/* Right Sidebar */}
        <RightSidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          setShowTutorial={setShowTutorial}
        />

        {/* Tutorial Modal */}
        {showTutorial && (
          <TutorialModal onClose={() => setShowTutorial(false)} />
        )}
      </div>
    </DndProvider>
  );
};

export default AITool;