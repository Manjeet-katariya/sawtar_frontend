import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaRegStar, FaStarHalfAlt, FaClock, FaMapMarkerAlt, FaExpand, FaHeart, FaShare } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CompleteProductView = () => {
  const { projectId } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);

  // Sample project data - in a real app this would come from an API
  const project = {
    id: projectId || '1',
    title: 'Modern Luxury Villa Interior Design',
    designer: 'Elite Interior Designs',
    location: 'Beverly Hills, CA',
    duration: '3 months',
    completedDate: 'June 2023',
    priceRange: '$50,000 - $75,000',
    rating: 4.7,
    reviewCount: 28,
    description: 'This modern luxury villa features an open-concept design with high-end finishes, custom cabinetry, and smart home integration. The design focuses on clean lines, natural materials, and a neutral color palette with bold accents.',
    details: [
      'Total Area: 3,500 sq ft',
      'Rooms: 5 bedrooms, 4.5 bathrooms',
      'Style: Contemporary Modern',
      'Materials: Italian marble, American walnut, brushed brass',
      'Special Features: Smart lighting system, custom built-ins, heated floors'
    ],
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    ],
    reviews: [
      {
        id: 1,
        name: 'Sarah Johnson',
        rating: 5,
        date: 'May 15, 2023',
        comment: 'Absolutely stunning work! The designers listened to all our needs and created a space that perfectly reflects our style while being highly functional. The attention to detail is remarkable.',
        images: []
      },
      {
        id: 2,
        name: 'Michael Chen',
        rating: 4,
        date: 'April 2, 2023',
        comment: 'Great experience overall. The project was completed on time and within budget. The only reason Im not giving 5 stars is because of a small delay in getting some custom furniture delivered, but the end result was worth the wait.',
        images: [
          'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        ]
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        rating: 5,
        date: 'March 28, 2023',
        comment: 'Working with this team was a dream. They transformed our outdated home into a modern masterpiece. The space planning is brilliant - we gained so much more usable space without adding square footage!',
        images: []
      }
    ],
    similarProjects: [
      {
        id: '2',
        title: 'Minimalist Apartment Design',
        image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        rating: 4.5
      },
      {
        id: '3',
        title: 'Traditional Home Renovation',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        rating: 4.8
      },
      {
        id: '4',
        title: 'Industrial Loft Conversion',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        rating: 4.3
      }
    ]
  };

  const handlePrevImage = () => {
    setActiveImage((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImage((prev) => (prev === project.images.length - 1 ? 0 : prev + 1));
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Project Images */}
        <div>
          <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[4/3] mb-4">
            <img
              src={project.images[activeImage]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              onClick={handlePrevImage}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              onClick={handleNextImage}
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {project.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${activeImage === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                onClick={() => setFavorite(!favorite)}
              >
                <FaHeart className={`w-5 h-5 ${favorite ? 'text-red-500' : 'text-gray-400'}`} />
              </button>
           
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {project.images.map((image, index) => (
              <button
                key={index}
                className={`rounded-md overflow-hidden aspect-square ${activeImage === index ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setActiveImage(index)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Project Details */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <p className="text-lg text-gray-600 mb-4">by {project.designer}</p>
            </div>
            <div className="flex items-center">
              {renderRatingStars(project.rating)}
              <span className="ml-2 text-gray-600">({project.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="mr-2" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaClock className="mr-2" />
              <span>{project.duration}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Price Range</h3>
            <p className="text-2xl font-bold text-gray-900">{project.priceRange}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Project Description</h3>
            <p className="text-gray-700 mb-4">{project.description}</p>
            <ul className="space-y-2">
              {project.details.map((detail, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 mr-2"></span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-4">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition duration-200">
              Contact Designer
            </button>
            <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg font-medium transition duration-200">
              Request Quote
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Write a Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Overall Rating</h3>
            <div className="flex items-center mb-2">
              <div className="text-4xl font-bold mr-4">{project.rating}</div>
              <div>
                {renderRatingStars(project.rating)}
                <p className="text-gray-600 mt-1">{project.reviewCount} reviews</p>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center">
                  <span className="w-10 text-gray-600">{star} star</span>
                  <div className="flex-1 mx-2 h-2.5 bg-gray-200 rounded-full">
                    <div
                      className="h-2.5 bg-yellow-400 rounded-full"
                      style={{ width: `${(project.reviews.filter(r => Math.floor(r.rating) === star).length / project.reviews.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-10 text-gray-600 text-right">
                    {project.reviews.filter(r => Math.floor(r.rating) === star).length}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            {project.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 py-6">
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold">{review.name}</h4>
                  <span className="text-gray-500 text-sm">{review.date}</span>
                </div>
                <div className="flex mb-3">
                  {renderRatingStars(review.rating)}
                </div>
                <p className="text-gray-700 mb-4">{review.comment}</p>
                {review.images.length > 0 && (
                  <div className="flex space-x-2">
                    {review.images.map((img, idx) => (
                      <button key={idx} className="w-16 h-16 rounded overflow-hidden">
                        <img src={img} alt={`Review ${review.id} image ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Similar Projects */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.similarProjects.map((similar) => (
            <div key={similar.id} className="group cursor-pointer">
              <div className="relative rounded-lg overflow-hidden aspect-[4/3] mb-3">
                <img
                  src={similar.image}
                  alt={similar.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{similar.title}</h3>
                    <div className="flex items-center text-yellow-400">
                      {renderRatingStars(similar.rating)}
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-blue-600">{similar.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompleteProductView;