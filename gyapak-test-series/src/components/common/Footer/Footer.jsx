import React from 'react'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight, Send } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top Section with Newsletter */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400 mb-4">Join our newsletter for the latest exam updates, study materials, and preparation tips.</p>
            </div>
            <div>
              <form className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  required
                />
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg px-4 py-2 font-medium flex items-center justify-center hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  Subscribe <Send size={16} className="ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="h-10 w-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">gyapak.in</span>
              </div>
              {/* <span className="ml-2 text-xl font-bold text-white">GTS</span> */}
            </div>
            <p className="text-gray-400 mb-6">
              Helping students achieve success in competitive exams through comprehensive study materials, practice tests, and expert guidance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About Us', 'Test Series', 'Study Material', 'Blog', 'Contact Us'].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center"
                  >
                    <ArrowRight size={14} className="mr-2" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Exam Categories */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Exam Categories</h4>
            <ul className="space-y-2">
              {['UPSC', 'Banking', 'SSC', 'Railways', 'Teaching', 'State PCS', 'Defense'].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center"
                  >
                    <ArrowRight size={14} className="mr-2" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin size={20} className="mr-3 text-indigo-500 flex-shrink-0" />
                <span className="text-gray-400">123 Education Street, Knowledge City, IN 560001</span>
              </li>
              <li className="flex">
                <Phone size={20} className="mr-3 text-indigo-500 flex-shrink-0" />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex">
                <Mail size={20} className="mr-3 text-indigo-500 flex-shrink-0" />
                <span className="text-gray-400">support@prepmaster.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section with Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-sm text-gray-400">
              © {currentYear} PrepMaster. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer