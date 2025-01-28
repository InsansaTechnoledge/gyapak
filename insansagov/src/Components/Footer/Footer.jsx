import React from 'react';
import { Mail, ArrowRight, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../Pages/config.js';

const Footer = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{

      const email = e.target.email.value;
      const name = email.split('@')[0];
    const response = await axios.post(`${API_BASE_URL}/api/subscriber/create`, { email: email, name: name });
    if (response.status === 201) {
      alert(response.data);
      e.target.email.value = "";
    }
    else {
      alert(response.data);
      e.target.email.value = "";
    }
    }
    catch(error){
      console.log("Error",error);
    }
  };

  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-36">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">gyapak</span>
              </div>
              {/* <span className="text-white text-xl font-bold">My Website</span> */}
            </div>

            <p className="text-sm text-gray-400 max-w-md ">
              Developed and brought to you by
            </p>
            <p className="text-base text-gray-200 max-w-md  font-semibold">
              Insansa Techknowledge Pvt. Ltd.
            </p>

            {/* <div className="flex space-x-6">
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div> */}
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              What We Serve
            </h3>

            <ul className="space-y-3">
              {[
                { name: "Exam Dates", link: "/exam-dates" },
                { name: "Admit Cards", link: "/admit-card" },
                { name: "Exam Forms", link: "/exam-forms" },
                { name: "Result Declaration", link: "/results" },
                { name: "Exam related details", link: "/exam-details" },
              ].map((item) => (
                <li key={item.name} className='text-gray-400'>
                    {item.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
                <li>
                  <a href="/#about" className="text-gray-400 hover:text-white transition-colors">
                    About 
                  </a>
                </li>
                {/* <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </a>
                </li> */}
                <li>
                  <a href="/#contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                {/* <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </li> */}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  name='email'
                  id='email'
                  placeholder="youremail@gmail.com"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 pl-10"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 group"
              >
                <span>Subscribe</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} gyapak.com. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {/* <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms
              </a> */}
              <a href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              {/* <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
