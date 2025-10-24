import React, { useState } from 'react';
import { FaStar, FaRegStar, FaCheckCircle, FaMapMarkerAlt, FaThumbsUp, FaComment, FaCalendarAlt, FaVideo, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const FreelancerProfile = () => {
  const freelancerData = {
    title: "Website Design",
    price: "$200",
    user: "Shahid Miah",
    location: "Dhaka, Bangladesh",
    rating: 5,
    workImgs: [
      "https://storage.googleapis.com/a1aa/image/e1eae4ac-5b35-4711-66ec-3724a24c56e5.jpg",
      "https://storage.googleapis.com/a1aa/image/a68d7b8f-67c9-4d3a-e3a9-d25cd9296fe2.jpg",
      "https://storage.googleapis.com/a1aa/image/44e135f8-063a-4ed1-cfec-2409536de360.jpg",
      "https://storage.googleapis.com/a1aa/image/e548a035-3de3-4736-c4cb-b68d6de7538f.jpg",
      "https://storage.googleapis.com/a1aa/image/1e54e763-bcb1-427e-3fce-014b6173a37b.jpg",
      "https://storage.googleapis.com/a1aa/image/564e8fca-e825-44a6-51ae-bcdf1dec097b.jpg",
      "https://storage.googleapis.com/a1aa/image/c5db5c1d-24a3-409b-3c38-da5e35f537b0.jpg"
    ],
    profileImg: "https://storage.googleapis.com/a1aa/image/7d2e230a-6980-48a0-7605-adbcfb2d5aec.jpg",
    category: "UI/UX Design",
    isPro: true,
    available: true,
    skills: ["Website Design", "Logo Design", "Branding Services", "App Design", "UI/UX Design"],
    description: "Professional UI/UX designer with 5+ years of experience creating beautiful and functional websites and applications. I specialize in creating user-centered designs that drive engagement and conversions.",
    reviews: [
      {
        id: 1,
        user: "John Smith",
        rating: 5,
        comment: "Shahid did an amazing job on our website redesign. His attention to detail and creative approach exceeded our expectations.",
        date: "2023-05-15",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        likes: 12,
        type: "text"
      },
      {
        id: 2,
        user: "Sarah Johnson",
        rating: 4,
        comment: "Great work overall. The design was modern and clean. Would definitely work with him again.",
        date: "2023-04-02",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        likes: 8,
        type: "text"
      },
      {
        id: 3,
        user: "Michael Brown",
        rating: 5,
        video: "https://storage.googleapis.com/a1aa/video/testimonial.mp4",
        date: "2023-03-18",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg",
        likes: 15,
        type: "video"
      },
      {
        id: 4,
        user: "Emma Wilson",
        rating: 5,
        comment: "Exceptional designer! Delivered beyond what we expected and was very professional throughout the project.",
        date: "2023-02-10",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        likes: 20,
        type: "text"
      }
    ],
    completedProjects: 42,
    responseRate: "98%",
    responseTime: "within 2 hours",
    joinedDate: "2020-01-15"
  };

  const [newComment, setNewComment] = useState('');
  const [reviews, setReviews] = useState(freelancerData.reviews);
  const [newRating, setNewRating] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviewType, setReviewType] = useState('text');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const textReviews = reviews.filter(review => review.type === 'text');
  const videoReviews = reviews.filter(review => review.type === 'video');

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      i < rating ? 
        <FaStar key={i} className="text-[#D26C44] inline-block" /> : 
        <FaRegStar key={i} className="text-gray-300 inline-block" />
    ));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleLike = (id) => {
    setReviews(reviews.map(review => 
      review.id === id ? {...review, likes: review.likes + 1} : review
    ));
  };

  const handleStarClick = (rating) => {
    setNewRating(rating);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (reviewType === 'text') {
      const newReview = {
        id: Date.now(),
        user: 'Current User',
        avatar: '/default-avatar.jpg',
        rating: newRating,
        comment: newComment,
        date: new Date().toLocaleDateString(),
        likes: 0,
        type: 'text'
      };
      setReviews([...reviews, newReview]);
      setNewComment('');
    } else {
      const newReview = {
        id: Date.now(),
        user: 'Current User',
        avatar: '/default-avatar.jpg',
        rating: newRating,
        video: videoPreview,
        date: new Date().toLocaleDateString(),
        likes: 0,
        type: 'video'
      };
      setReviews([...reviews, newReview]);
      setVideoFile(null);
      setVideoPreview(null);
    }
    
    setNewRating(0);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === Math.ceil(freelancerData.workImgs.length / 4) - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? Math.ceil(freelancerData.workImgs.length / 4) - 1 : prev - 1));
  };

  const visibleWorkImgs = freelancerData.workImgs.slice(currentSlide * 4, (currentSlide + 1) * 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-sans">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#D26C44]/10 to-[#8B3F2B]/10 opacity-70"></div>
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="w-full md:w-1/4 flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="relative w-48 h-48 group"
            >
              <img
                src={freelancerData.profileImg}
                alt={freelancerData.user}
                className="w-full h-full rounded-2xl object-cover border-4 border-white shadow-xl"
              />
              {freelancerData.isPro && (
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-3 -right-3 bg-gradient-to-r from-[#D26C44] to-[#8B3F2B] text-white text-sm px-4 py-1.5 rounded-full flex items-center shadow-lg"
                >
                  <FaCheckCircle className="mr-1.5" /> PRO
                </motion.div>
              )}
            </motion.div>
          </div>
          <div className="w-full md:w-3/4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">{freelancerData.user}</h1>
                <p className="text-lg text-gray-600 font-medium mt-1">{freelancerData.title}</p>
                <div className="flex items-center mt-3">
                  <div className="flex mr-4">{renderStars(freelancerData.rating)}</div>
                  <span className="text-gray-600 text-sm font-medium">
                    {freelancerData.rating} ({freelancerData.completedProjects} projects)
                  </span>
                </div>
                <div className="flex items-center mt-3 text-gray-600 text-sm">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{freelancerData.location}</span>
                </div>
                <div className="flex items-center mt-3 text-gray-600 text-sm">
                  <FaCalendarAlt className="mr-2" />
                  <span>Member since {new Date(freelancerData.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                </div>
              </div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl shadow-xl min-w-[200px] text-center"
                style={{
                  background: 'linear-gradient(135deg, #D26C44 0%, #8B3F2B 100%)'
                }}
              >
                <p className="text-3xl font-extrabold text-white">{freelancerData.price}</p>
                <p className="text-sm text-orange-100 mt-1">Starting Price</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-4 bg-white text-[#D26C44] hover:bg-orange-50 px-6 py-2.5 rounded-lg font-semibold text-sm shadow-md transition-all"
                >
                  Hire Now
                </motion.button>
                <button 
                  className="w-full mt-3 border border-white text-white hover:bg-white hover:text-[#D26C44] px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200"
                >
                  Message
                </button>
              </motion.div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {freelancerData.skills.map((skill, index) => (
                <motion.span 
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#D26C44]/10 text-[#8B3F2B] px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#D26C44]/20 transition-colors border border-[#D26C44]/20"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats & About Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:col-span-2"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">About Me</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{freelancerData.description}</p>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-5 rounded-xl border border-gray-100"
            >
              <p className="text-gray-500 text-xs uppercase tracking-wide">Response Rate</p>
              <p className="text-xl font-bold text-gray-900">{freelancerData.responseRate}</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-5 rounded-xl border border-gray-100"
            >
              <p className="text-gray-500 text-xs uppercase tracking-wide">Response Time</p>
              <p className="text-xl font-bold text-gray-900">{freelancerData.responseTime}</p>
            </motion.div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-6">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Projects Completed</p>
              <p className="text-2xl font-bold text-gray-900">{freelancerData.completedProjects}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Availability</p>
              <p className={`font-semibold ${freelancerData.available ? 'text-green-600' : 'text-red-600'}`}>
                {freelancerData.available ? 'Available for new projects' : 'Not available'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Category</p>
              <p className="font-semibold text-gray-900">{freelancerData.category}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Portfolio Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={prevSlide}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <FiChevronLeft />
            </button>
            <button 
              onClick={nextSlide}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {visibleWorkImgs.map((img, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-square relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl"
            >
              <img
                src={img}
                alt={`Work sample ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-sm font-semibold">Project #{index + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Reviews Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Client Reviews</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'all' ? 'bg-[#D26C44] text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              All Reviews
            </button>
            <button 
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'text' ? 'bg-[#D26C44] text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Text Reviews
            </button>
            <button 
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'video' ? 'bg-[#D26C44] text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Video Reviews
            </button>
          </div>
        </div>

        {/* Add Review Form */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Your Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <div className="flex items-center mb-4">
              <span className="mr-3 text-gray-600 font-medium">Rating:</span>
              {Array(5).fill(0).map((_, i) => (
                <motion.button
                  type="button"
                  key={i}
                  onClick={() => handleStarClick(i + 1)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="focus:outline-none"
                >
                  {i < newRating ? (
                    <FaStar className="text-[#D26C44] text-xl" />
                  ) : (
                    <FaRegStar className="text-gray-300 text-xl" />
                  )}
                </motion.button>
              ))}
            </div>
            
            {/* Review Type Toggle */}
            <div className="flex items-center mb-4">
              <span className="mr-3 text-gray-600 font-medium">Review Type:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setReviewType('text')}
                  className={`px-4 py-2 rounded-md ${reviewType === 'text' ? 'bg-white shadow-sm text-[#D26C44]' : 'text-gray-500'}`}
                >
                  Text
                </button>
                <button
                  type="button"
                  onClick={() => setReviewType('video')}
                  className={`px-4 py-2 rounded-md ${reviewType === 'video' ? 'bg-white shadow-sm text-[#D26C44]' : 'text-gray-500'}`}
                >
                  Video
                </button>
              </div>
            </div>

            {reviewType === 'text' ? (
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your review here..."
                className="w-full p-4 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#D26C44] transition-all duration-200"
                rows="4"
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    {!videoFile ? (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaVideo className="text-gray-400 text-2xl mb-2" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">MP4, WEBM or MOV (MAX. 100MB)</p>
                      </div>
                    ) : (
                      <div className="p-2 w-full">
                        <p className="text-sm text-gray-600 truncate">{videoFile.name}</p>
                        <p className="text-xs text-gray-500">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleVideoUpload}
                    />
                  </label>
                </div>
                {videoPreview && (
                  <div className="relative">
                    <video 
                      src={videoPreview} 
                      controls 
                      className="w-full rounded-lg"
                      style={{ maxHeight: '200px' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setVideoPreview(null);
                        setVideoFile(null);
                      }}
                      className="absolute top-2 right-2 bg-[#D26C44] text-white rounded-full p-1 hover:bg-[#8B3F2B]"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 bg-[#D26C44] hover:bg-[#8B3F2B] text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                (reviewType === 'text' && (!newComment.trim() || newRating === 0)) ||
                (reviewType === 'video' && (!videoFile || newRating === 0))
              }
            >
              Submit Review
            </motion.button>
          </form>
        </motion.div>

        {/* Reviews Tabs */}
        <AnimatePresence mode="wait">
          {(activeTab === 'all' || activeTab === 'text') && (
            <motion.div
              key="text-reviews"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Text Reviews</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {textReviews.map((review) => (
                  <motion.div 
                    key={review.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex items-start gap-4">
                      <img 
                        src={review.avatar} 
                        alt={review.user} 
                        className="w-12 h-12 rounded-full object-cover" 
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.user}</h4>
                            <div className="flex items-center mt-2">
                              {renderStars(review.rating)}
                              <span className="text-gray-500 text-xs ml-2">{review.date}</span>
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <button 
                              onClick={() => handleLike(review.id)}
                              className="text-gray-400 hover:text-[#D26C44] text-sm flex items-center transition-colors"
                            >
                              <FaThumbsUp className="mr-1" />
                              <span>{review.likes}</span>
                            </button>
                            <button className="text-gray-400 hover:text-[#D26C44] text-sm">
                              <FaComment />
                            </button>
                          </div>
                        </div>
                        <p className="mt-3 text-gray-600 text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {(activeTab === 'all' || activeTab === 'video') && (
            <motion.div
              key="video-reviews"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Video Reviews</h3>
              {videoReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videoReviews.map((review) => (
                    <motion.div 
                      key={review.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl shadow-lg p-6"
                    >
                      <div className="flex items-start gap-4">
                        <img 
                          src={review.avatar} 
                          alt={review.user} 
                          className="w-12 h-12 rounded-full object-cover" 
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.user}</h4>
                              <div className="flex items-center mt-2">
                                {renderStars(review.rating)}
                                <span className="text-gray-500 text-xs ml-2">{review.date}</span>
                              </div>
                            </div>
                            <div className="flex space-x-3">
                              <button 
                                onClick={() => handleLike(review.id)}
                                className="text-gray-400 hover:text-[#D26C44] text-sm flex items-center transition-colors"
                              >
                                <FaThumbsUp className="mr-1" />
                                <span>{review.likes}</span>
                              </button>
                            </div>
                          </div>
                          <div className="mt-3">
                            <video
                              src={review.video}
                              controls
                              className="w-full rounded-xl shadow-md"
                              style={{ maxHeight: '200px' }}
                            />
                            <div className="flex items-center mt-2">
                              <FaVideo className="text-[#D26C44] mr-2" />
                              <span className="text-gray-500 text-xs">Video Testimonial</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 text-center">
                  <FaVideo className="mx-auto text-gray-300 text-4xl mb-3" />
                  <p className="text-gray-500">No video reviews yet. Be the first to submit one!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Contact Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl shadow-2xl p-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #D26C44 0%, #8B3F2B 100%)'
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready to start your project?</h3>
            <p className="text-orange-100 text-sm">Get in touch today and let's create something amazing together.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#D26C44] hover:bg-orange-50 px-8 py-3 rounded-xl font-semibold text-sm shadow-lg"
            >
              Contact Me
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white hover:bg-[#8B3F2B] px-8 py-3 rounded-xl font-semibold text-sm"
            >
              View Packages
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FreelancerProfile;