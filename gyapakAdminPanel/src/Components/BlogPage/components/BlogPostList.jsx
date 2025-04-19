// components/admin/BlogPostList.jsx

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Eye, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { getAllBlogsForAdmin, deleteBlog } from '../../../Services/service';
import { href } from 'react-router-dom';

const BlogPostList = ({ onEdit }) => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [selectedCategory, setSelectedCategory] = useState('All');
  
    const fetchPosts = async () => {
      try {
        const res = await getAllBlogsForAdmin();
        setPosts(res.data || res);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      }
    };
  
    useEffect(() => {
      fetchPosts();
    }, []);
  
    const handleDelete = async (id) => {
      const confirm = window.confirm('Are you sure you want to delete this post?');
      if (!confirm) return;
  
      try {
        await deleteBlog(id);
        fetchPosts(); // Refresh list after deletion
      } catch (err) {
        console.error('Failed to delete post:', err);
        alert('Failed to delete post');
      }
    };
  
    // const categories = ['All', ...new Set(posts.map(post => post.category))];
  
    const filteredPosts = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  
    const sortedPosts = [...filteredPosts].sort((a, b) => {
      let compareValue = 0;
  
      if (sortField === 'title') {
        compareValue = a.title.localeCompare(b.title);
      } else if (sortField === 'date') {
        compareValue = new Date(b.date) - new Date(a.date);
      } else if (sortField === 'category') {
        compareValue = a.category.localeCompare(b.category);
      }
  
      return sortDirection === 'asc' ? compareValue : -compareValue;
    });
  
    const handleSort = (field) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };
  
    const getSortIcon = (field) => {
      if (sortField !== field) return null;
      return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
    };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {/* <div className="flex gap-4">
            <select 
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div> */}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center space-x-1 focus:outline-none"
                  onClick={() => handleSort('title')}
                >
                  <span>Title</span>
                  {getSortIcon('title')}
                </button>
              </th>
             
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center space-x-1 focus:outline-none"
                  onClick={() => handleSort('date')}
                >
                  <span>Date</span>
                  {getSortIcon('createdAt')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPosts.length > 0 ? (
              sortedPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded object-cover" src={post.imageUrl || "/api/placeholder/40/40"} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">{post.slug}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.formattedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.author.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => window.open(`https://gyapak.in/blog/${post.slug}`, '_blank')}
                        className="text-gray-500 hover:text-gray-700 transition duration-200"
                        title="View post"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => onEdit(post)}
                        className="text-blue-600 hover:text-blue-800 transition duration-200"
                        title="Edit post"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:text-red-700 transition duration-200"
                        title="Delete post"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No posts found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogPostList;
