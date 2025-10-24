// SocialSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import Video from '../../assets/video/social.mp4';

const videos = [
  {
    title: 'After Hours with chef Rahul Akerkar',
    subtitle: 'A slow adventure of flavours and memories at Ode in Mumbai',
    src: Video,
    showText: true
  },
  {
    title: 'After Hours with chef Amninder Sandhu',
    subtitle: 'An evening at Palash, a restaurant inside Tipai Wildlife Luxuries',
    src: Video,
    showText: true
  },
  {
    title: 'Before and After: A Bengaluru home',
    subtitle: 'Vinita Chaitanya\'s newest home transformation is one for the books',
    src: Video,
    showText: true
  },
  {
    title: 'Masoom Minawala\'s Dubai home',
    subtitle: 'Poised, confident, dynamic. Her residence is as spirited as her',
    src: Video,
    showText: true
  },
  {
    title: 'Modern Architecture in Goa',
    subtitle: 'Exploring contemporary beachside villas and their unique designs',
    src: Video,
    showText: true
  },
];

export default function SocialSection() {
  const [modalVideo, setModalVideo] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const videoRefs = useRef([]);
  const sliderRef = useRef(null);

  // Auto-play on hover
  useEffect(() => {
    if (hoveredIndex !== null) {
      const videoEl = videoRefs.current[hoveredIndex];
      if (videoEl && videoEl.paused) {
        videoEl.play();
        setPlayingIndex(hoveredIndex);
      }
    }
  }, [hoveredIndex]);

  const togglePlay = (index) => {
    const videoEl = videoRefs.current[index];
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.play();
      setPlayingIndex(index);
    } else {
      videoEl.pause();
      setPlayingIndex(null);
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-8 pb-8">

 <div className="text-center mb-12 px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          Featured Stories
        </h2>
        <h3 className="text-xl md:text-2xl font-medium text-gray-700">
          Discover our latest video collections
        </h3>
        <div className="flex justify-center mt-4">
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"></div>
        </div>
      </div>

      {/* Slider navigation arrows */}
      <button 
        onClick={scrollLeft}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={scrollRight}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Video slider */}
      <div 
        ref={sliderRef}
        className="flex gap-6 px-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
      >
        {videos.map((video, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-[300px] snap-center"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => {
              setHoveredIndex(null);
              if (playingIndex === index) {
                const videoEl = videoRefs.current[index];
                if (videoEl) videoEl.pause();
                setPlayingIndex(null);
              }
            }}
          >
            <div className="relative group  overflow-hidden shadow-lg">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={video.src}
                className="w-full h-[400px] object-cover cursor-pointer"
                muted
                loop
                onClick={() => setModalVideo(video.src)}
              />

              {/* Play/pause button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay(index);
                }}
                className={`absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 transition-all ${playingIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                {playingIndex === index ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-6.518-3.759A1 1 0 007 8.118v7.764a1 1 0 001.234.97l6.518-1.871a1 1 0 000-1.883z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Text below video */}
            {video.showText && (
              <div className="mt-3 px-2">
                <h3 className="text-lg font-bold">{video.title}</h3>
                <p className="text-sm text-gray-600">{video.subtitle}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalVideo && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setModalVideo(null)}
        >
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={() => setModalVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <video
              src={modalVideo}
              className="w-full rounded-lg shadow-xl"
              controls
              autoPlay
            />
          </div>
        </div>
      )}
    </div>
  );
}