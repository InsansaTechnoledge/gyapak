import React from 'react';
import { Home, FileText, Settings, Users, BarChart, LogOut, Plus, Trash, Eye } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const recentPosts = [
    { id: 1, title: 'How to Improve Your Design Skills', status: 'published' },
    { id: 2, title: '10 Tips for Better React Performance', status: 'draft' },
    { id: 3, title: 'The Future of Web Development', status: 'published' }
  ];
  
  const quickStats = [
    { label: 'Total Posts', value: 42 },
    { label: 'Published', value: 36 },
    { label: 'Drafts', value: 6 },
  ];

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/admin' },
    { name: 'All Posts', icon: FileText, path: '/admin/posts' },
    { name: 'New Post', icon: Plus, path: '/admin/posts/new' },
    { name: 'Comments', icon: Users, path: '/admin/comments' },
    { name: 'Analytics', icon: BarChart, path: '/admin/analytics' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-200 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Gyapak Admin</h2>
        <p className="text-gray-500 text-sm">Manage your content</p>
      </div>
      
      {/* Navigation */}
      {/* <nav className="mb-8">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Navigation</h3>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  currentPath === item.path 
                    ? 'bg-purple-50 text-purple-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav> */}
      
      {/* Quick Stats */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          {quickStats.map((stat) => (
            <div key={stat.label} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
              <p className="text-gray-800 font-bold text-xl">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Posts */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent Posts</h3>
        <ul className="space-y-3">
          {recentPosts.map((post) => (
            <li key={post.id} className="border-b border-gray-100 pb-2 last:border-0">
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
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Trash className="h-4 w-4" />
                  </button>
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