import React from 'react';
import SocialSection from '../social/Index';

// Dummy images
const magazineCover = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
const trendingImage = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
const interviewImage = 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
const guideImage = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
const teamImage = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

// New event images
const event1 = 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
const event2 = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
const event3 = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
const event4 = 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
const event5 = 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

// ArticleCard Component
const ArticleCard = ({ title, content, image, category, date }) => (
  <article className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover rounded-lg shadow"
        />
      </div>
      <div className="md:w-2/3">
        <div className="flex justify-between items-center mb-2">
          <span className="bg-black text-white px-2 py-1 text-xs font-bold">{category}</span>
          <span className="text-sm text-gray-500">{date}</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700">{content}</p>
        <button className="mt-3 text-red-600 font-bold hover:underline">
          Continue Reading →
        </button>
      </div>
    </div>
  </article>
);

// StatBlock Component
const StatBlock = ({ number, label }) => (
  <div className="text-center p-2 border border-gray-200 rounded">
    <p className="text-2xl font-bold">{number}</p>
    <p className="text-sm">{label}</p>
  </div>
);

// Masthead Component
const Masthead = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 border-b-2 mb-3 border-black">
    <div className="text-center">
      <h1 className="text-5xl font-bold italic">Design Innovator</h1>
      <p className="text-lg mt-2">Est. 2023 | Pioneering 3D Interior Design Solutions</p>
    </div>
  </div>
);

// HeroCover Component
const HeroCover = () => (
  <div className="max-w-7xl mx-auto px-4 mb-12">
    <div className="relative rounded-lg overflow-hidden shadow-xl">
      <img 
        src={magazineCover} 
        alt="Magazine Cover" 
        className="w-full h-96 object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
        <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold">INNOVATION SPOTLIGHT</span>
        <h2 className="text-4xl font-bold text-white mt-2">Transforming Spaces with 3D Technology</h2>
        <p className="text-white text-lg mt-2">How our platform is revolutionizing interior design in India</p>
      </div>
    </div>
  </div>
);

// MainContent Component
const MainContent = () => (
  <div className="max-w-7xl mx-auto px-4 mb-12">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Featured Articles Column */}
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-black">Featured Innovations</h2>
        <div className="space-y-8">
          <ArticleCard 
            title="3D Design Trends 2023" 
            content="Explore the cutting-edge 3D design trends transforming Indian homes and offices this year, with insights from top designers."
            image={trendingImage}
            category="DESIGN"
            date="June 15, 2023"
          />
          <ArticleCard 
            title="Founder Interview: The Vision" 
            content="An exclusive conversation with our founder about creating India's first integrated 3D design and shopping platform."
            image={interviewImage}
            category="LEADERSHIP"
            date="June 10, 2023"
          />
          <ArticleCard 
            title="Beginner's Guide to 3D Design" 
            content="New to 3D interior design? Our step-by-step guide helps you create professional designs in minutes."
            image={guideImage}
            category="TUTORIAL"
            date="June 5, 2023"
          />
        </div>
      </div>

      {/* Sidebar - Company Culture */}
      <CompanyCultureSidebar />
    </div>
  </div>
);

// CompanyCultureSidebar Component
const CompanyCultureSidebar = () => (
  <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
    <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-black">DesignSphere Updates</h2>
    <div className="mb-6">
      <img 
        src={teamImage} 
        alt="Design team working" 
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-xl font-bold mb-2">Our Design Philosophy</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>Launched India's first real-time 3D design marketplace</li>
        <li>Added 200+ new products to our curated collection</li>
        <li>Mobile AR preview feature now available for all users</li>
        <li>New collaboration tools for designers launching next month</li>
        <li>Partnership with top Indian furniture manufacturers</li>
      </ul>
    </div>
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold text-lg mb-2">Platform Milestones</h3>
      <div className="grid grid-cols-2 gap-4">
        <StatBlock number="10K+" label="Designs Created" />
        <StatBlock number="500+" label="Products Available" />
        <StatBlock number="25" label="Design Partners" />
        <StatBlock number="4.9★" label="User Rating" />
      </div>
    </div>
  </div>
);

// EventCard Component
const EventCard = ({ image, title, date, location, description }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="relative h-48 overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <span className="text-white text-sm font-medium">{date}</span>
        <h3 className="text-white font-bold text-lg">{title}</h3>
      </div>
    </div>
    <div className="p-4">
      <div className="flex items-center text-gray-600 text-sm mb-2">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {location}
      </div>
      <p className="text-gray-700 text-sm mb-4">{description}</p>
      <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-300">
        Learn More
      </button>
    </div>
  </div>
);

// EventsAndPrograms Component
const EventsAndPrograms = () => {
  const events = [
    {
      id: 1,
      title: "Design Innovators Summit 2023",
      date: "July 15-17, 2023",
      location: "Bangalore Convention Center",
      description: "Annual gathering of India's top design thinkers and innovators featuring workshops and keynote sessions.",
      image: event1
    },
    {
      id: 2,
      title: "3D Design Masterclass Series",
      date: "Every Saturday in August",
      location: "Online & Mumbai Studio",
      description: "Hands-on training sessions for professionals looking to master advanced 3D design techniques.",
      image: event2
    },
    {
      id: 3,
      title: "Design for Social Impact",
      date: "September 5, 2023",
      location: "Delhi Design Hub",
      description: "Exploring how design can solve pressing social challenges in urban Indian contexts.",
      image: event3
    },
    {
      id: 4,
      title: "Student Design Challenge",
      date: "October 10-12, 2023",
      location: "Multiple Cities",
      description: "National competition for design students to showcase their innovative solutions.",
      image: event4
    },
    {
      id: 5,
      title: "Design Leadership Forum",
      date: "November 8, 2023",
      location: "Hyderabad Grand Hotel",
      description: "Exclusive event for design firm leaders to discuss industry trends and collaboration.",
      image: event5
    }
  ];

  const programs = [
    {
      title: "Design Mentorship Program",
      description: "6-month mentorship pairing emerging designers with industry veterans",
      icon: "👨‍🏫"
    },
    {
      title: "Rural Design Initiative",
      description: "Bringing design solutions to India's rural communities",
      icon: "🏡"
    },
    {
      title: "Startup Design Lab",
      description: "Supporting early-stage design-focused startups",
      icon: "🚀"
    },
    {
      title: "Design Education Grants",
      description: "Funding for innovative design education programs",
      icon: "🎓"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 mb-12">
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-black">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard 
              key={event.id}
              image={event.image}
              title={event.title}
              date={event.date}
              location={event.location}
              description={event.description}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-black">Our Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded-lg hover:bg-gray-200 transition-colors duration-300">
              <div className="text-4xl mb-4">{program.icon}</div>
              <h3 className="text-xl font-bold mb-2">{program.title}</h3>
              <p className="text-gray-700">{program.description}</p>
              <button className="mt-4 text-red-600 font-bold hover:underline text-sm">
                Explore Program →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// NewsletterSubscription Component
const NewsletterSubscription = () => (
  <div className="max-w-7xl mx-auto px-4 mt-8">
    <div className="bg-gray-800 text-white p-8 rounded-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold mb-2">Join the Design Revolution</h2>
            <p className="text-lg mb-4">Subscribe for weekly design inspiration, tips, and exclusive platform updates.</p>
            <p className="text-sm italic">"This platform changed how I design spaces forever" - Rahul T., Interior Designer</p>
          </div>
          <div className="md:w-1/3 w-full">
           
              <button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-bold transition duration-300"
              >
                Get Started
              </button>
           
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main Magazine Component
const Magazine = () => {
  return (
    <div className="font-serif pb-12">
      <Masthead />
      <HeroCover />
      <MainContent />
      <EventsAndPrograms />
      <div className="max-w-7xl mx-auto mb-12">
        <SocialSection/>
      </div>
      <NewsletterSubscription />
    </div>
  );
};

export default Magazine;