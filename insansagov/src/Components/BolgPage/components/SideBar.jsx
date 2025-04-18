import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getAllBlogs } from '../../../Service/Service';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [popularPosts, setPopularPosts] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const data = await getAllBlogs(); // returns array of blog posts

        // Sort by date (or any logic for popularity)
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const topPosts = sorted.slice(0, 4);

        // Get unique tags
        const allTags = data.flatMap(post => post.tags || []);
        const uniqueTags = [...new Set(allTags)];

        setPopularPosts(topPosts);
        setTags(uniqueTags);
      } catch (error) {
        console.error('Failed to load sidebar data', error);
      }
    };

    fetchSidebarData();
  }, []);

  
  return (
    <aside>
      {/* Search Box */}
      {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Search</h3>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div> */}

      {/* Categories */}
      {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
        <ul className="space-y-3">
          {categories.map(category => (
            <li key={category.name}>
              <a href="#" className="flex justify-between items-center text-gray-700 hover:text-purple-600 transition duration-200">
                <span>{category.name}</span>
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div> */}

      {/* Popular Posts */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Posts</h3>
        <ul className="space-y-4">
        {popularPosts.map(post => (
        <li key={post._id}>
            <Link to={`/blog/${post.slug}`} className="group">
            <h4 className="text-gray-800 group-hover:text-purple-600 font-medium transition duration-200">
                {post.title}
            </h4>
            <p className="text-gray-500 text-sm">{post.formattedDate}</p>
            </Link>
        </li>
        ))}
        </ul>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Tags used</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <a 
              key={tag} 
              className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-purple-100 hover:text-purple-700 transition duration-200"
            >
              {tag}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
