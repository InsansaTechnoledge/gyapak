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
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-bold">gyapak</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Developed and brought to you by
            </p>
            <p className="text-base text-gray-200 max-w-md font-semibold">
              Insansa Techknowledge Pvt. Ltd.
            </p>
            <div className="flex space-x-6">
                <span className="sr-only">LinkedIn</span>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                  <a href="https://www.linkedin.com/company/insansa-technologies/"><Linkedin className="h-5 w-5 text-gray-400 hover:text-white" /></a>
                </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-6">
              What We Serve
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Exam Dates" },
                { name: "Admit Cards" },
                { name: "Exam Forms"},
                { name: "Result Declaration" },
                { name: "Exam Related Details" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="/#about" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
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
        </div>

        {/* Disclaimer */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex items-start space-x-3 bg-gray-800 p-4 rounded-lg border border-amber-500">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
            <p className="text-gray-300 text-sm">
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
              <a href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;