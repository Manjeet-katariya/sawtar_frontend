import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowsAlt, 
  FaUsers, 
  FaRobot, 
  FaVideo, 
  FaComments,
  FaMagic,
  FaPalette,
  FaLightbulb,
  FaTimes
} from 'react-icons/fa';
import { GiArtificialIntelligence } from 'react-icons/gi';
import { BsFillLightbulbFill } from 'react-icons/bs';
import image from '../../assets/img/3d.png';

const Home = () => {
  const navigate = useNavigate();
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const features = [
    {
      title: "Augmented Reality / Virtual Reality",
      description: "Visualize designs in your actual space using AR or immerse yourself in VR",
      icon: <FaArrowsAlt className="text-4xl text-indigo-400" />,
      action: () => navigate('/sawtar/designs/Tool')
    },
    {
      title: "Real-Time Collaboration",
      description: "Work simultaneously with team members or clients",
      icon: <FaUsers className="text-4xl text-purple-400" />,
      action: () => navigate('/sawtar/designs/Tool')
    },
    {
      title: "AI-Powered Design Assistance",
      description: "Get smart suggestions and automated design help",
      icon: <GiArtificialIntelligence className="text-4xl text-pink-400" />,
      action: () => setShowAIModal(true)
    },
    {
      title: "Live Designer Consultation",
      description: "Connect with professional interior designers",
      icon: <FaVideo className="text-4xl text-blue-400" />,
      action: () => navigate('/sawtar/designs/Tool')
    }
  ];

  const handleAISubmit = (e) => {
    e.preventDefault();
    setIsLoadingAI(true);
    // Simulate AI response
    setTimeout(() => {
      setAiResponse(`Here are some design suggestions based on your query: 
      \n1. Consider using lighter colors to make the space feel larger
      \n2. The layout could benefit from a focal point like a statement piece
      \n3. Try our AR feature to visualize these changes in your space`);
      setIsLoadingAI(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#0A102A] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-[#0A102A]/80 to-[#0A102A]"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <motion.img
            src={image}
            alt="3D Interior Design"
            className="w-[300px] sm:w-[400px] md:w-[600px] object-contain drop-shadow-2xl mb-12"
            whileHover={{ scale: 1.02 }}
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 max-w-4xl leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Transform Your Space with AI-Powered 3D Design
            </span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mb-8 leading-relaxed">
            Create stunning interior designs with our cutting-edge technology and professional tools
          </p>
          <button 
            onClick={() => navigate('/sawtar/designs/Tool')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all"
          >
            Start Designing Now
          </button>
        </motion.div>

        {/* Features Section */}
        <div className="w-full max-w-6xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                onClick={feature.action}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Detailed Feature Sections */}
        <div className="w-full max-w-6xl mt-24 space-y-24">
          {/* AR/VR Section */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex flex-col lg:flex-row items-center gap-12"
          >
            <div className="lg:w-1/2">
              <div className="flex items-center mb-4">
                <FaArrowsAlt className="text-3xl text-indigo-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">AR/VR Experience</h3>
              </div>
              <p className="text-white/70 mb-6">
                Visualize your designs in augmented reality right in your own space, or immerse yourself in a fully interactive virtual reality experience.
              </p>
              <button 
                onClick={() => navigate('/star/designs/ARVR')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Try AR/VR Mode
              </button>
            </div>
            <div className="lg:w-1/2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl p-1">
              <div className="bg-[#0A102A] rounded-lg p-8 flex items-center justify-center">
                <FaArrowsAlt className="text-8xl text-indigo-400/20" />
              </div>
            </div>
          </motion.section>

          {/* Collaboration Section */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex flex-col lg:flex-row-reverse items-center gap-12"
          >
            <div className="lg:w-1/2">
              <div className="flex items-center mb-4">
                <FaUsers className="text-3xl text-purple-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Real-Time Collaboration</h3>
              </div>
              <p className="text-white/70 mb-6">
                Work simultaneously with clients or team members. See changes in real-time, leave comments, and make decisions faster.
              </p>
              <button 
                onClick={() => navigate('/star/designs/Collaboration')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Start Collaborating
              </button>
            </div>
            <div className="lg:w-1/2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl p-1">
              <div className="bg-[#0A102A] rounded-lg p-8 flex items-center justify-center">
                <FaUsers className="text-8xl text-purple-400/20" />
              </div>
            </div>
          </motion.section>

          {/* Live Consultation Section */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex flex-col lg:flex-row items-center gap-12"
          >
            <div className="lg:w-1/2">
              <div className="flex items-center mb-4">
                <FaVideo className="text-3xl text-blue-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Live Designer Consultation</h3>
              </div>
              <p className="text-white/70 mb-6">
                Connect with professional interior designers for real-time advice, custom solutions, and expert feedback on your projects.
              </p>
              <button 
                onClick={() => navigate('/star/designs/Consultation')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Book Consultation
              </button>
            </div>
            <div className="lg:w-1/2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl p-1">
              <div className="bg-[#0A102A] rounded-lg p-8 flex items-center justify-center">
                <FaComments className="text-8xl text-blue-400/20" />
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* AI Assistance Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A102A] border border-white/10 rounded-xl max-w-md w-full p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <GiArtificialIntelligence className="text-xl text-pink-400 mr-2" />
                <h3 className="text-xl font-bold text-white">AI Design Assistant</h3>
              </div>
              <button 
                onClick={() => {
                  setShowAIModal(false);
                  setAiMessage('');
                  setAiResponse('');
                }}
                className="text-white/50 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              {aiResponse ? (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-start mb-3">
                    <BsFillLightbulbFill className="text-yellow-400 mt-1 mr-2 flex-shrink-0" />
                    <p className="text-white whitespace-pre-line">{aiResponse}</p>
                  </div>
                  <button 
                    onClick={() => setAiResponse('')}
                    className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm"
                  >
                    Ask another question
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAISubmit}>
                  <div className="mb-4">
                    <label className="block text-white/70 text-sm mb-2">Describe your design challenge</label>
                    <textarea
                      value={aiMessage}
                      onChange={(e) => setAiMessage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={4}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoadingAI}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoadingAI ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FaMagic className="mr-2" />
                        Get AI Suggestions
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;