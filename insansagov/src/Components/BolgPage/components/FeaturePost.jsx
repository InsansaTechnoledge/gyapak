// FeaturedPostCarousel.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedPostCarousel = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Ensure we have posts to display
  if (!posts || posts.length === 0) {
    return null;
  }
  
  const goToNext = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };
  
  const goToPrev = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };
  
  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 6000);
    
    return () => clearInterval(timer);
  }, [currentIndex, isTransitioning]);
  
  const currentPost = posts[currentIndex];
  
  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-lg">
      {/* Carousel Navigation Controls */}
      <button 
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition duration-200"
        aria-label="Previous post"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition duration-200"
        aria-label="Next post"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Post Content */}
      <div 
        className={`grid grid-cols-1 md:grid-cols-2 transition-opacity duration-500 ${isTransitioning ? 'opacity-80' : 'opacity-100'}`}
      >
        <div className="h-64 md:h-auto relative">
          <img 
            src={currentPost.imageUrl || "/api/placeholder/800/600"} 
            alt={currentPost.title} 
            className="w-full h-full object-cover"
          />
          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsTransitioning(false), 500);
                  }
                }}
                className={`w-8 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                  ? 'bg-purple-600 w-6' 
                  : 'bg-gray-600 hover:bg-gray-900'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
            {currentPost.category}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{currentPost.title}</h2>
          <p className="text-gray-600 mb-6 line-clamp-3">{currentPost.excerpt}</p>
          
          <div className="flex items-center mb-6">
            <img 
              src={currentPost.author.avatar || "/api/placeholder/40/40"} 
              alt={currentPost.author.name} 
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-medium text-gray-800">{currentPost.author.name}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-3">{currentPost.formattedDate}</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{currentPost.readTime} min read</span>
              </div>
            </div>
          </div>
          
          <a
            href={`/blog/${currentPost.slug}`}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition duration-200 inline-block"
            >
            Read Article
         </a>

        </div>
      </div>
    </div>
  );
};

export default FeaturedPostCarousel;