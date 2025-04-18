import React, { useState, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { createBlog, updateBlog } from '../../../Services/service'



const BlogPostForm = ({ post, onSave, onCancel, isSaving }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    category: 'Technology',
    readTime: 5,
    author: {
      name: '',
      avatar: '',
      bio: ''
    },
    tags: [],
    featuredPost: false,

  });
  
  const [currentTag, setCurrentTag] = useState('');
  
  // Available categories
  const categories = ['Technology', 'Design', 'Business', 'Lifestyle', 'Tutorials'];
  
  // Initialize form if editing
  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        // Ensure tags is an array even if the post doesn't have it
        tags: post.tags || []
      });
    }
  }, [post]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('author.')) {
      const authorField = name.split('.')[1];
      setFormData({
        ...formData,
        author: {
          ...formData.author,
          [authorField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, currentTag.trim()]
        });
      }
      setCurrentTag('');
    }
  };
  
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let submitData = { ...formData };
  
    if (!submitData.slug.trim()) {
      submitData.slug = submitData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
  
    try {
      if (post) {
        await updateBlog(post._id, submitData);
      } else {
        await createBlog(submitData);
      }
      onSave(); // notify parent to refresh or redirect
    } catch (error) {
      console.error("❌ Blog submission failed", error);
      alert("There was an error saving the blog post.");
    }
  };
  
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          {post ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title *</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              required
              value={formData.title} 
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug (leave empty to generate from title)
            </label>
            <input 
              type="text" 
              id="slug" 
              name="slug" 
              value={formData.slug} 
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          {/* Featured image */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Featured Image URL</label>
            <div className="mt-1 flex items-center">
              <input 
                type="text" 
                id="imageUrl" 
                name="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              <button 
                type="button"
                className="ml-2 p-2 border border-gray-300 rounded-md shadow-sm text-gray-500 hover:text-gray-700"
              >
                <Upload className="h-5 w-5" />
              </button>
            </div>
            {formData.imageUrl && (
              <div className="mt-2">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="h-32 w-auto object-cover rounded"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/300/200";
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Category and Read Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
              <select 
                id="category" 
                name="category" 
                required
                value={formData.category} 
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="readTime" className="block text-sm font-medium text-gray-700">Read Time (minutes) *</label>
              <input 
                type="number" 
                id="readTime" 
                name="readTime" 
                required
                min="1"
                value={formData.readTime} 
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          
          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt *</label>
            <textarea 
              id="excerpt" 
              name="excerpt" 
              required
              rows="3"
              value={formData.excerpt} 
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content *</label>
            <textarea 
              id="content" 
              name="content" 
              required
              rows="10"
              value={formData.content} 
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="mt-1">
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-purple-600 hover:text-purple-900 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input 
                  type="text" 
                  id="currentTag" 
                  value={currentTag} 
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag and press Enter"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
                <button 
                  type="button"
                  onClick={() => {
                    if (currentTag.trim()) {
                      if (!formData.tags.includes(currentTag.trim())) {
                        setFormData({
                          ...formData,
                          tags: [...formData.tags, currentTag.trim()]
                        });
                      }
                      setCurrentTag('');
                    }
                  }}
                  className="ml-2 p-2 border border-gray-300 rounded-md shadow-sm text-gray-500 hover:text-gray-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Author Information */}
          <fieldset className="border border-gray-300 rounded-md p-4">
            <legend className="text-sm font-medium text-gray-700 px-2">Author Information</legend>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="author.name" className="block text-sm font-medium text-gray-700">Name *</label>
                <input 
                  type="text" 
                  id="author.name" 
                  name="author.name" 
                  required
                  value={formData.author.name} 
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="author.avatar" className="block text-sm font-medium text-gray-700">Avatar URL</label>
                <input 
                  type="text" 
                  id="author.avatar" 
                  name="author.avatar" 
                  value={formData.author.avatar} 
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="author.bio" className="block text-sm font-medium text-gray-700">Bio</label>
                <input 
                  type="text" 
                  id="author.bio" 
                  name="author.bio" 
                  value={formData.author.bio} 
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex items-center">
        
        {/** for adding in feature collumn */}
        <input
            type="checkbox"
            id="featuredPost"
            name="featuredPost"
            checked={formData.featuredPost}
            onChange={(e) => setFormData({ ...formData, featuredPost: e.target.checked })}
            className="h-4 w-4 text-purple-600 border-gray-300 rounded"
        />
        <label htmlFor="featuredPost" className="ml-2 block text-sm text-gray-700">
            Mark as Featured
        </label>
        </div>

          
          {/* Submit buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {isSaving ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;