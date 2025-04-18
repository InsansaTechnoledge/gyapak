// // services/blogService.js
// export const fetchBlogPosts = async () => {
//     // In a real application, this would fetch from an API
//     // For demonstration, we'll return mock data
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve(MOCK_POSTS);
//       }, 500);
//     });
//   };
  
//   // Sample mock data
//   const MOCK_POSTS = [
//     {
//       id: 1,
//       title: "The Future of React: What's Coming in 2025",
//       slug: "future-of-react-2025",
//       excerpt: "React continues to evolve with exciting new features on the horizon. Let's explore what's coming next and how it will change frontend development.",
//       content: "Full article content would go here...",
//       imageUrl: "/api/placeholder/800/600",
//       category: "Technology",
//       date: "Apr 15, 2025",
//       readTime: 8,
//       author: {
//         name: "Jane Smith",
//         avatar: "/api/placeholder/64/64",
//         bio: "Frontend Developer & React Enthusiast"
//       },
//       tags: ["React", "JavaScript", "Frontend"]
//     },
//     {
//       id: 2,
//       title: "Building Accessible UI Components from Scratch",
//       slug: "building-accessible-ui-components",
//       excerpt: "Learn how to create fully accessible UI components that comply with WCAG guidelines while maintaining a beautiful design.",
//       content: "Full article content would go here...",
//       imageUrl: "/api/placeholder/800/600",
//       category: "Design",
//       date: "Apr 12, 2025",
//       readTime: 12,
//       author: {
//         name: "Alex Johnson",
//         avatar: "/api/placeholder/64/64",
//         bio: "UX Designer & Accessibility Advocate"
//       },
//       tags: ["Accessibility", "UI/UX", "Design"]
//     },
//     {
//       id: 3,
//       title: "Performance Optimization Techniques for Modern Web Apps",
//       slug: "performance-optimization-web-apps",
//       excerpt: "Discover advanced strategies to significantly improve the performance of your web applications and deliver a better user experience.",
//       content: "Full article content would go here...",
//       imageUrl: "/api/placeholder/800/600",
//       category: "Tutorials",
//       date: "Apr 10, 2025",
//       readTime: 10,
//       author: {
//         name: "Michael Chen",
//         avatar: "/api/placeholder/64/64",
//         bio: "Performance Engineer at TechCorp"
//       },
//       tags: ["Performance", "Web Development", "Optimization"]
//     },
//     {
//       id: 4,
//       title: "The Role of AI in Modern Web Development",
//       slug: "ai-in-web-development",
//       excerpt: "Explore how artificial intelligence is transforming web development workflows and enabling new possibilities for developers.",
//       content: "Full article content would go here...",
//       imageUrl: "/api/placeholder/800/600",
//       category: "Technology",
//       date: "Apr 8, 2025",
//       readTime: 6,
//       author: {
//         name: "Sarah Williams",
//         avatar: "/api/placeholder/64/64",
//         bio: "AI Researcher & Web Developer"
//       },
//       tags: ["AI", "Web Development", "Future Tech"]
//     },
//     {
//       id: 5,
//       title: "Creating a Design System That Scales",
//       slug: "scalable-design-system",
//       excerpt: "Learn the principles behind building a comprehensive design system that can grow with your product and maintain consistency.",
//       content: "Full article content would go here...",
//       imageUrl: "/api/placeholder/800/600",
//       category: "Design",
//       date: "Apr 5, 2025",
//       readTime: 9,
//       author: {
//         name: "David Lee",
//         avatar: "/api/placeholder/64/64",
//         bio: "Senior Design Systems Engineer"
//       },
//       tags: ["Design Systems", "UI/UX", "Frontend"]
//     },
//     {
//       id: 6,
//       title: "Mastering CSS Grid and Flexbox for Modern Layouts",
//       slug: "mastering-css-grid-flexbox",
//       excerpt: "A comprehensive guide to using CSS Grid and Flexbox together to create responsive, flexible, and complex web layouts.",
//       content: "Full article content would go here...",
//       imageUrl: "/api/placeholder/800/600",
//       category: "Tutorials",
//       date: "Apr 2, 2025",
//       readTime: 11,
//       author: {
//         name: "Emma Wilson",
//         avatar: "/api/placeholder/64/64",
//         bio: "CSS Specialist & Frontend Developer"
//       },
//       tags: ["CSS", "Web Design", "Frontend"]
//     }
//   ];