// components/layout/Navbar/NavItems.js

// Navigation items with dropdowns
export const navItems = [
    { 
      name: 'Home', 
      link: '/' 
    },
    { 
      name: 'Test Series', 
      link: '/exam'
      // dropdown: [
      //   { name: 'UPSC', link: '/test-series/upsc' },
      //   { name: 'Banking', link: '/test-series/banking' },
      //   { name: 'SSC', link: '/test-series/ssc' },
      //   { name: 'Railways', link: '/test-series/railways' }
      // ]
    },
    { 
      name: 'Study Material', 
      link: '#',
      dropdown: [
        { name: 'PDF Notes', link: '/study/pdf' },
        { name: 'Video Lectures', link: '/study/video' },
        { name: 'Mock Tests', link: '/study/mock' }
      ]
    },
    { 
      name: 'About Us', 
      link: '/about' 
    },
    { 
      name: 'Contact', 
      link: '/contact' 
    }
  ];
  
  export default navItems;