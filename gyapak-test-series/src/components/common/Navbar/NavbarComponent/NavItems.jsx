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
      name: 'for educators ->', 
      link: '/institute',
      
    },
    // { 
    //   name: 'About Us', 
    //   link: '/about' 
    // },
    // { 
    //   name: 'Contact', 
    //   link: '/contact' 
    // }
  ];
  
  export default navItems;