import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, MessageSquare, Heart } from 'lucide-react';
import { getBlogBySlug, getRelatedBlogs } from '../../../Service/Service';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);


  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogBySlug(slug);
        setBlog(data);
        window.scrollTo(0, 0);
  
        const related = await getRelatedBlogs(slug);
        setRelatedBlogs(related);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBlog();
  }, [slug]);

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-purple-200 mb-4"></div>
          <div className="h-4 bg-purple-100 rounded w-32"></div>
        </div>
      </div>
    );
  }
  
  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto pt-24 pb-16 px-4 text-center">
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-red-500 text-xl font-semibold mb-2">Blog Not Found</h2>
          <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="inline-flex items-center text-purple-600 hover:text-purple-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all blogs
          </Link>
        </div>
      </div>
    );
  }

  const { data } = blog;

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      {/* Back button navigation */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <Link to="/blog" className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-200">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to all blogs
        </Link>
      </div>
      
      {/* Featured image */}
      <div className="relative h-96 max-w-5xl mx-auto mb-12 px-4">
        <img
          src={data.imageUrl || "/api/placeholder/1000/500"}
          alt={data.title}
          className="w-full h-full object-cover rounded-xl shadow-lg"
        />
        
        <div className="absolute left-8 bottom-0 transform translate-y-1/2 bg-white py-2 px-4 rounded-full shadow-md text-sm font-medium text-purple-700">
          {data.category}
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">{data.title}</h1>
          
          <div className="flex flex-wrap items-center text-gray-500 text-sm mb-6">
            <div className="flex items-center mr-6">
              <Calendar className="h-4 w-4 mr-1 text-purple-500" />
              <span>{data.formattedDate}</span>
            </div>
            <div className="flex items-center mr-6">
              <Clock className="h-4 w-4 mr-1 text-purple-500" />
              <span>{data.readTime} min read</span>
            </div>
            {data.tags && data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                {data.tags.map(tag => (
                  <span key={tag} className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
         
        </div>
        
        {/* Blog content */}
        <div className="prose max-w-none prose-purple prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-purple-600 mb-10">
          <div dangerouslySetInnerHTML={{ __html: data.content?.replace(/\n/g, '<br/>') }} />
        </div>

         {/* Author info */}
         <div className="flex items-center mb-8 p-4 bg-purple-50 rounded-lg">
            <img
              src={data.author?.avatar || "/api/placeholder/64/64"}
              alt={data.author?.name}
              className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow"
            />
            <div>
              <p className="text-gray-800 font-medium">{data.author?.name}</p>
              <p className="text-sm text-gray-500">{data.author?.bio}</p>
            </div>
          </div>
        
        {/* Action buttons */}
        <div className="mt-12 mb-8 py-6 border-t border-b border-gray-100 flex flex-wrap justify-between items-center">
         
          <div className="flex items-center space-x-3 mt-3 sm:mt-0">
        
            <button
            className="flex items-center text-gray-500 hover:text-purple-600 transition-colors"
            onClick={() => {
                const shareUrl = window.location.href;
                const shareTitle = blog?.data?.title || 'Check out this blog on Gyapak';

                if (navigator.share) {
                navigator.share({
                    title: shareTitle,
                    url: shareUrl
                })
                .then(() => console.log('Shared successfully!'))
                .catch(err => console.error('Error sharing:', err));
                } else {
                navigator.clipboard.writeText(shareUrl);
                alert("Link copied to clipboard!");
                }
            }}
            >
            <Share2 className="h-7 w-7 mr-1" />
            <span title="Share this blog">Share</span>
            </button>

          </div>
        </div>
        
        {/* Related articles section - if we had them */}
        <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h3>

  {relatedBlogs.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {relatedBlogs.map(blog => (
        <Link
          key={blog._id}
          to={`/blog/${blog.slug}`}
          className="group flex gap-4 p-4 border rounded-lg hover:shadow-md transition duration-300"
        >
          <img
            src={blog.imageUrl || "/api/placeholder/300/180"}
            alt={blog.title}
            className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition duration-200">
                {blog.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{blog.excerpt}</p>
            </div>
            <span className="text-xs text-gray-400 mt-2">
              {blog.formattedDate} • {blog.readTime} min read
            </span>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      <p>No related articles available at the moment.</p>
    </div>
  )}
</div>


      </div>
    </div>
  );
};

export default BlogDetailPage;