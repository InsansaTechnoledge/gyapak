// services/blogService.js

/**
 * Mock blog posts data for demonstration
 * In a real application, this would be fetched from an API
 */
let mockBlogPosts = [
    {
      id: '1',
      title: 'Getting Started with React',
      slug: 'getting-started-with-react',
      excerpt: 'Learn the basics of React and how to set up your first React application.',
      content: 'React is a JavaScript library for building user interfaces. It was developed by Facebook and is widely used for building single-page applications.',
      imageUrl: 'https://example.com/images/react-intro.jpg',
      category: 'Technology',
      readTime: 5,
      date: 'Apr 10, 2025',
      author: {
        name: 'Jane Smith',
        avatar: 'https://example.com/avatars/jane.jpg',
        bio: 'Frontend Developer & React Enthusiast'
      },
      tags: ['React', 'JavaScript', 'Frontend']
    },
    {
      id: '2',
      title: 'Advanced CSS Techniques',
      slug: 'advanced-css-techniques',
      excerpt: 'Discover powerful CSS techniques to take your styling to the next level.',
      content: 'CSS has evolved significantly over the years. In this post, we explore some advanced techniques that can help you write more maintainable and efficient CSS.',
      imageUrl: 'https://example.com/images/css-advanced.jpg',
      category: 'Design',
      readTime: 8,
      date: 'Apr 5, 2025',
      author: {
        name: 'Alex Johnson',
        avatar: 'https://example.com/avatars/alex.jpg',
        bio: 'UI Designer & CSS Expert'
      },
      tags: ['CSS', 'Web Design', 'Frontend']
    }
  ];
  
  /**
   * Fetch all blog posts
   * @returns {Promise} Promise resolving to array of blog posts
   */
  export const fetchBlogPosts = () => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve(mockBlogPosts);
      }, 500);
    });
  };
  
  /**
   * Fetch a single blog post by ID
   * @param {string} id - The blog post ID
   * @returns {Promise} Promise resolving to a blog post object
   */
  export const fetchBlogPostById = (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const post = mockBlogPosts.find(post => post.id === id);
        if (post) {
          resolve(post);
        } else {
          reject(new Error('Blog post not found'));
        }
      }, 300);
    });
  };
  
  /**
   * Create a new blog post
   * @param {Object} postData - The blog post data
   * @returns {Promise} Promise resolving to the created blog post
   */
  export const createBlogPost = (postData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPost = {
          ...postData,
          id: String(mockBlogPosts.length + 1)
        };
        mockBlogPosts = [...mockBlogPosts, newPost];
        resolve(newPost);
      }, 700);
    });
  };
  
  /**
   * Update an existing blog post
   * @param {string} id - The blog post ID
   * @param {Object} postData - The updated blog post data
   * @returns {Promise} Promise resolving to the updated blog post
   */
  export const updateBlogPost = (id, postData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBlogPosts.findIndex(post => post.id === id);
        if (index !== -1) {
          const updatedPost = { ...postData, id };
          mockBlogPosts = [
            ...mockBlogPosts.slice(0, index),
            updatedPost,
            ...mockBlogPosts.slice(index + 1)
          ];
          resolve(updatedPost);
        } else {
          reject(new Error('Blog post not found'));
        }
      }, 700);
    });
  };
  
  /**
   * Delete a blog post
   * @param {string} id - The blog post ID
   * @returns {Promise} Promise resolving to true if successful
   */
  export const deleteBlogPost = (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBlogPosts.findIndex(post => post.id === id);
        if (index !== -1) {
          mockBlogPosts = [
            ...mockBlogPosts.slice(0, index),
            ...mockBlogPosts.slice(index + 1)
          ];
          resolve(true);
        } else {
          reject(new Error('Blog post not found'));
        }
      }, 500);
    });
  };
  
  export default {
    fetchBlogPosts,
    fetchBlogPostById,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost
  };