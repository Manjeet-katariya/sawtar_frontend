import React, { useState, useEffect } from 'react';
import { 
  FiCheckCircle, FiAlertCircle, FiClock, FiUpload, 
  FiExternalLink, FiMapPin, FiPhone, FiCalendar, 
  FiImage, FiGlobe, FiStar, FiTrendingUp, FiAward, FiUsers 
} from 'react-icons/fi';

const Businesspage = () => {
  // Primary colors from your palette
  const primaryColor = '#1A132F'; // Dark purple
  const accentColor = '#D26C44'; // Terracotta orange
  const lightAccent = 'rgba(210, 108, 68, 0.1)';
  
  const [profileScore, setProfileScore] = useState(40);
  const [kycStatus, setKycStatus] = useState('Pending');
  const [documents, setDocuments] = useState([
    { id: 1, name: 'PAN Card', status: 'Uploaded' }, 
    { id: 2, name: 'Bank Details', status: 'Pending' }
  ]);
  const [activeTab, setActiveTab] = useState('profile');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Add 2 or More Contact Numbers', completed: true },
    { id: 2, title: 'Add Complete Store Address', completed: false },
    { id: 3, title: 'Add Map Location', completed: true },
    { id: 4, title: 'Add 10 or More Business Categories', completed: false },
    { id: 5, title: 'Add Business Timings', completed: true },
    { id: 6, title: 'Add 10 or More High Quality Photos', completed: false },
    { id: 7, title: 'Get up to 20 Reviews', completed: true },
    { id: 8, title: 'Add Social Media Channels', completed: false },
    { id: 9, title: 'Add Business Website', completed: true },
    { id: 10, title: 'Add Year of Establishment', completed: false },
    { id: 11, title: 'Complete KYC', completed: false },
  ]);

  // Calculate completion percentage
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionPercentage = Math.round((completedTasks / tasks.length) * 100);

  const updateKycStatus = (docId, newStatus) => {
    setDocuments(documents.map(doc => 
      doc.id === docId ? { ...doc, status: newStatus } : doc
    ));
    
    if (newStatus === 'Verified' && documents.every(d => d.status === 'Verified' || d.id === docId)) {
      setKycStatus('Verified');
      setTasks(tasks.map(t => t.id === 11 ? { ...t, completed: true } : t));
    } else {
      setKycStatus('Pending');
    }
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Update profile score based on completed tasks
  useEffect(() => {
    const newScore = Math.min(40 + (completedTasks * 5), 100);
    setProfileScore(newScore);
  }, [tasks]);

  const renderIconForTask = (title) => {
    const iconProps = { className: "mr-2", size: 18 };
    if (title.includes('Contact')) return <FiPhone {...iconProps} />;
    if (title.includes('Address') || title.includes('Map')) return <FiMapPin {...iconProps} />;
    if (title.includes('Categories')) return <FiGlobe {...iconProps} />;
    if (title.includes('Timings')) return <FiClock {...iconProps} />;
    if (title.includes('Photos')) return <FiImage {...iconProps} />;
    if (title.includes('Reviews')) return <FiStar {...iconProps} />;
    if (title.includes('Social Media') || title.includes('Website')) return <FiExternalLink {...iconProps} />;
    if (title.includes('Establishment')) return <FiCalendar {...iconProps} />;
    return <FiCheckCircle {...iconProps} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header with custom color */}
      <header className="text-white p-6 shadow-md" style={{ backgroundColor: primaryColor }}>
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Business Profile</h1>
              <p className="text-gray-300">Optimize your business presence</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: accentColor }}>{profileScore}</div>
                <div className="text-xs text-gray-300">PROFILE SCORE</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="p-3 rounded-full mr-4" style={{ backgroundColor: lightAccent }}>
              <FiTrendingUp size={24} style={{ color: accentColor }} />
            </div>
            <div>
              <div className="text-gray-500 text-sm">Completion</div>
              <div className="text-xl font-bold" style={{ color: primaryColor }}>
                {completionPercentage}%
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="p-3 rounded-full mr-4" style={{ backgroundColor: lightAccent }}>
              <FiAward size={24} style={{ color: accentColor }} />
            </div>
            <div>
              <div className="text-gray-500 text-sm">Completed Tasks</div>
              <div className="text-xl font-bold" style={{ color: primaryColor }}>
                {completedTasks}/{tasks.length}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="p-3 rounded-full mr-4" style={{ backgroundColor: lightAccent }}>
              <FiUsers size={24} style={{ color: accentColor }} />
            </div>
            <div>
              <div className="text-gray-500 text-sm">KYC Status</div>
              <div className="text-xl font-bold" style={{ color: kycStatus === 'Verified' ? '#10B981' : primaryColor }}>
                {kycStatus}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold" style={{ color: primaryColor }}>Profile Completion</h2>
            <span className="text-sm font-medium" style={{ color: accentColor }}>
              {profileScore}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-in-out" 
              style={{ 
                width: `${profileScore}%`,
                background: `linear-gradient(90deg, ${accentColor}, ${primaryColor})`
              }}
            ></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 font-medium text-sm uppercase tracking-wider ${activeTab === 'profile' ? 'text-white' : 'text-gray-500'}`}
            style={{
              backgroundColor: activeTab === 'profile' ? primaryColor : 'transparent',
              borderBottom: activeTab === 'profile' ? `3px solid ${accentColor}` : 'none'
            }}
            onClick={() => setActiveTab('profile')}
          >
            Profile Tasks
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm uppercase tracking-wider ${activeTab === 'kyc' ? 'text-white' : 'text-gray-500'}`}
            style={{
              backgroundColor: activeTab === 'kyc' ? primaryColor : 'transparent',
              borderBottom: activeTab === 'kyc' ? `3px solid ${accentColor}` : 'none'
            }}
            onClick={() => setActiveTab('kyc')}
          >
            KYC Verification
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'profile' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md ${task.completed ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className={`mt-1 mr-3 ${task.completed ? 'text-green-500' : 'text-yellow-500'}`}>
                      {task.completed ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
                    </div>
                    <div>
                      <h3 className={`font-medium ${task.completed ? 'text-gray-600' : 'text-gray-800'}`}>
                        {task.title}
                      </h3>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {task.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`p-2 rounded-full hover:bg-opacity-20 ${task.completed ? 'hover:bg-green-500' : 'hover:bg-yellow-500'}`}
                    style={{ color: task.completed ? '#10B981' : accentColor }}
                  >
                    {task.completed ? <FiCheckCircle size={18} /> : <FiClock size={18} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6" style={{ backgroundColor: primaryColor, color: 'white' }}>
              <h3 className="text-xl font-semibold flex items-center">
                <FiCheckCircle className={`mr-2 ${kycStatus === 'Verified' ? 'text-green-400' : 'text-yellow-400'}`} />
                KYC Verification
              </h3>
              <p className="text-sm opacity-80 mt-1">
                {kycStatus === 'Verified' ? 
                  'Your documents have been verified' : 
                  'Complete verification to unlock all features'}
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${doc.status === 'Verified' ? 'bg-green-500' : doc.status === 'Uploaded' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                      <span className="font-medium">{doc.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        doc.status === 'Verified' ? 'bg-green-100 text-green-800' : 
                        doc.status === 'Uploaded' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {doc.status}
                      </span>
                      {doc.status === 'Uploaded' && (
                        <button 
                          onClick={() => updateKycStatus(doc.id, 'Verified')}
                          className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition flex items-center"
                        >
                          <FiCheckCircle className="mr-1" /> Verify
                        </button>
                      )}
                      {doc.status === 'Pending' && (
                        <button 
                          onClick={() => updateKycStatus(doc.id, 'Uploaded')}
                          className="text-xs text-white px-3 py-1 rounded-full hover:bg-opacity-90 transition flex items-center"
                          style={{ backgroundColor: accentColor }}
                        >
                          <FiUpload className="mr-1" /> Upload
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: lightAccent, borderColor: accentColor }}>
                <h4 className="font-medium mb-2" style={{ color: primaryColor }}>Why complete KYC?</h4>
                <p className="text-sm" style={{ color: primaryColor }}>
                  Verified businesses receive higher visibility and customer trust. Complete your KYC to unlock:
                </p>
                <ul className="mt-2 text-sm space-y-1" style={{ color: primaryColor }}>
                  <li className="flex items-center"><FiCheckCircle className="mr-2 text-green-500" /> Premium profile badge</li>
                  <li className="flex items-center"><FiCheckCircle className="mr-2 text-green-500" /> Higher search rankings</li>
                  <li className="flex items-center"><FiCheckCircle className="mr-2 text-green-500" /> Full access to all features</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="rounded-xl p-6 text-center mb-8 shadow-lg" style={{ 
          backgroundColor: primaryColor,
          backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`
        }}>
          <h3 className="text-xl font-bold text-white mb-2">Boost Your Business Profile</h3>
          <p className="text-white opacity-90 mb-4">Complete your profile to attract more customers and increase visibility</p>
          <button 
            className="bg-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition"
            style={{ color: primaryColor }}
            onClick={() => {
              const tasksToComplete = tasks.filter(t => !t.completed).slice(0, 2);
              setTasks(tasks.map(task => 
                tasksToComplete.some(t => t.id === task.id) ? { ...task, completed: true } : task
              ));
            }}
          >
            Complete Tasks Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Businesspage;