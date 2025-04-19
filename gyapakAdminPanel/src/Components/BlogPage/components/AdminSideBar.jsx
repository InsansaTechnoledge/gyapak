import React, { useEffect, useState } from 'react';
import { Home, FileText, Settings, Users, BarChart, LogOut, Plus, Trash, Eye } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getAllBlogsForAdmin, deleteBlog } from '../../../Services/service';

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [recentPosts, setRecentPosts] = useState([]);
  const [quickStats, setQuickStats] = useState({
    total: 0,
   
  });

  useEffect(() => {
    const fetchData = async () => {
        try {
          const res = await getAllBlogsForAdmin();
          const blogs = res?.data || []; 
      
          setRecentPosts(blogs.slice(0, 5)); 
          setQuickStats({
            total: blogs.length,
          });
        } catch (err) {
          console.error('Error fetching blogs:', err);
        }
      };
      

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      setRecentPosts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 max-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Gyapak Admin</h2>
        <p className="text-gray-500 text-sm">Manage your content</p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500 text-xs mb-1">Total Posts</p>
            <p className="text-gray-800 font-bold text-xl">{quickStats.total}</p>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent Posts</h3>
        <ul className="space-y-3">
          {recentPosts.map((post) => (
            <li key={post._id} className="border-b border-gray-100 pb-2 last:border-0">
              <h4 className="text-gray-800 font-medium truncate">
                {post.title}
              </h4>
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  post.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.status}
                </span>
                <div className="flex items-center space-x-2">
                  <button 
                  onClick={() => window.open(`https://gyapak.in/blog/${post.slug}`, '_blank')}

                  className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                  {/* <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </button> */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default AdminSidebar;
