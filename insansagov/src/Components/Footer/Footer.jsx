

import React from 'react';
import { Mail, ArrowRight, AlertTriangle, Twitter, Linkedin } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Footer = () => {

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = e.target.email.value;
      const name = email.split('@')[0];
      const response = await axios.post(`${API_BASE_URL}/api/subscriber/create`, { email, name });

      if (response.status === 201) {
        alert(response.data);
        e.target.email.value = "";
      } else {
        alert(response.data);
        e.target.email.value = "";
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="h-12 w-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-purple-500/20">
                <span className="text-white text-2xl font-bold">gyapak</span>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                Developed and brought to you by
              </p>

              <a
                href="https://insansa.com"
                className="group"
                target="_blank"
                rel="noopener noreferrer"
              >
              <p className="text-lg text-gray-200 font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Insansa Techknowledge Pvt. Ltd.
              </p>
              </a>

            </div>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/insansa-technologies/"
                className="group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:bg-blue-600 group-hover:scale-110">
                  <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </div>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-6 relative">
              What We Serve
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-purple-600"></span>
            </h3>
            <ul className="space-y-4">
              {[
                "Exam Dates",
                "Admit Cards",
                "Exam Forms",
                "Result Declaration",
                "Exam Related Details"
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={``}
                    className="text-gray-400  transition-all duration-300 flex items-center group hover:cursor-default"
                  >
                    <span className="w-0  overflow-hidden transition-all duration-300 flex items-center">
                      <ArrowRight className="h-4 w-4 text-purple-500" />
                    </span>
                    <span className=" transition-transform duration-300">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-6 relative">
              Company
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-purple-600"></span>
            </h3>
            <ul className="space-y-4">
              {[
                { name: "About", href: "/#about" },
                { name: "Contact", href: "/#contact" }
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 flex items-center">
                      <ArrowRight className="h-4 w-4 text-purple-500" />
                    </span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Subscribe - in 2nd update  */}
        <div>
          <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-6">
            Stay Updated
          </h3>
          <p className="text-gray-400 mb-4 text-sm">
            Subscribe to our newsletter for the latest updates and insights.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="youremail@gmail.com"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 pl-10"
              />
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 group"
            >
              <span>Subscribe</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex items-start space-x-3 bg-gray-800/50 p-4 rounded-lg border border-amber-500/50 hover:border-amber-500 transition-colors duration-300 backdrop-blur-sm">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1 animate-pulse" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Please note: All information provided on this website has been collected from original documents from respective Websites. While we strive for accuracy, there might be discrepancies. For the most accurate and up-to-date information, please visit the official government websites.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} gyapak.in, All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <div
                onClick={() => navigate("/privacy-policy")}
                className="text-gray-400 hover:text-white text-sm transition-colors hover:cursor-pointer relative group"
              >
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;