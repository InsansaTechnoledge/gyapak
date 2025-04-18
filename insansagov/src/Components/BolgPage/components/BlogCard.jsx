import React from 'react';
import { Calendar, User } from 'lucide-react';

const BlogCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-xl">
      <div className="h-48 overflow-hidden">
        <img 
          src={post.imageUrl || "/api/placeholder/600/400"} 
          alt={post.title} 
          className="w-full h-full object-cover transition duration-300 hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
            {post.category}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{post.formattedDate}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={post.author.avatar || "/api/placeholder/32/32"} 
              alt={post.author.name} 
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700">{post.author.name}</span>
          </div>
          <a 
            href={`/blog/${post.slug}`} 
            className="text-purple-600 hover:text-purple-800 font-medium text-sm transition duration-200"
          >
            Read More →
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
