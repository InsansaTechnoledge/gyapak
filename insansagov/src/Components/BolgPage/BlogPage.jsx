// BlogPage.jsx
import React, { useState, useEffect } from 'react';
import BlogHeader from './components/BlogHeader';
import BlogList from './components/BlogList';
import FeaturedPostCarousel from './components/FeaturePost';
import Sidebar from './components/SideBar';
// import { fetchBlogPosts } from './components/BlogFeature';
import { getAllBlogs } from '../../Service/Service';
import { RingLoader } from 'react-spinners';
import { Helmet } from 'react-helmet';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllBlogs();
        // console.log('📦 Blog posts fetched:', data);
        setPosts(data);
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);


  // Filter featured posts
  const featuredPosts = posts.filter(post => post.featuredPost === true);

  // Remaining posts
  const regularPosts = posts.filter(post => !post.featuredPost);


  // take blog author to buttom

  const Loading = () => (
    <div className='w-full h-screen flex justify-center'>
      <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
    </div>
  );


  if (isLoading || !posts) {
    return (
      <Loading />
    )
  }

  return (
    <>
      <Helmet>
        <title>Gyapak Blogs</title>
        <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
        <meta name="keywords" content="government competitive exams after 12th,government organisations, exam sarkari results, government calendar,current affairs,top exams for government jobs in india,Upcoming Government Exams" />
        <meta property="og:title" content="gyapak" />
        <meta property="og:description" content="Find the latest blogs on government exams, jobs, and any current updates in the government job domain" />
      </Helmet>
      <div className="min-h-screen pt-24 ">
        <BlogHeader />
        <main className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-xl text-gray-600">Loading posts...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <>
              {featuredPosts.length > 0 && <FeaturedPostCarousel posts={featuredPosts} />}
              <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <BlogList posts={regularPosts} />
                
                </div>
                <Sidebar />
              </div>
            </>
          )}
        </main>
      </div>
    </>

  );
};

export default BlogPage;