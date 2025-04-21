import React from 'react';
import BlogCard from './BlogCard';

const BlogList = ({ posts }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      
    </div>
  );
};

export default BlogList;