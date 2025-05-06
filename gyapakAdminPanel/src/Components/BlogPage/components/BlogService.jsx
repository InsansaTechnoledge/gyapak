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