

import React, { useState } from 'react';
import { Mail, ArrowRight, AlertTriangle, Twitter, Linkedin, Instagram, MessageCircle, Send } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useApi, CheckServer } from '../../Context/ApiContext';
import axios from 'axios';
import { RingLoader } from 'react-spinners';
import ErrorAlert from '../Error/ErrorAlert';
import logo4 from '/logo4.png'
import whatsappIcon from '../../assets/Footer/whatsapp.svg';
import metaIcon from '../../assets/Footer/meta.svg';
import whatsappIconSelected from '../../assets/Footer/whatsapp-selected.svg';
import metaIconSelected from '../../assets/Footer/meta-selected.svg';

const Footer = () => {

  const { apiBaseUrl, setApiBaseUrl, setServerError } = useApi();
  const [loading, setLoading] = useState(false);
  const [Error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || email.length > 50 || !emailRegex.test(email)) {
      setError("Invalid Email!!");
      setLoading(false);
      return;
    }
    const name = email.split('@')[0];

    try {

      const response = await axios.post(`${apiBaseUrl}/api/subscriber/create`, { email, name });

      if (response.status === 201) {
        alert(response.data);
        e.target.email.value = "";
      } else {
        alert(response.data);
        e.target.email.value = "";
      }

      setLoading(false);
    } catch (error) {
      console.log("Error", error);
      if (error.response || error.request) {
        if ((error.response && error.response.status >= 500 && error.response.status < 600) || (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND' || error.code === "ERR_NETWORK")) {
          const url = await CheckServer();
          setApiBaseUrl(url),
            setServerError(error.response.status);
          setTimeout(() => document.getElementById("subscribe").click(), 1000);
        }
        else {
          console.error('Error in subscribing !!:', error);
          setError("Error in subscribing !!");
          setLoading(false);

        }
      }
      else {
        console.error('Error in subscribing !!:', error);
        setError("Error in subscribing !!");
        setLoading(false);
      }
    }
  };

  const navigate = useNavigate();



  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      {
        loading
          ?
          <div className='absolute w-full z-50 h-screen flex justify-center'>
            <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
          </div>
          :
          null
      }
      {
        Error
          ?
          <ErrorAlert title={"Error subscribing site!!"} message={Error} setIsErrorVisible={setError} />
          :
          null
      }

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="h-12 w-24 border-2 border-white/30 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-purple-500/20">
                <img
                  src={logo4}
                  alt="Gyapak Logo"
                  className="object-contain p-2"
                />
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
                href="https://www.linkedin.com/company/107316884/"
                className="group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:bg-blue-600 group-hover:scale-110">
                  <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </div>
              </a>

              <a
                href="https://www.instagram.com/gyapak.in/"
                className="group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 
                            group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-pink-500 
                            group-hover:via-red-500 group-hover:to-yellow-500 shadow-md group-hover:shadow-lg"
                >
                  <Instagram className="h-5 w-5 text-gray-400 transition-colors duration-300 group-hover:text-white" />
                </div>
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb5pMSm6buMNuc5uLH1C"
                className="group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="relative w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 
                  group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-green-500 
                  group-hover:via-green-400 group-hover:to-green-300 shadow-md group-hover:shadow-lg">

                  {/* Default Icon */}
                  <img
                    src={whatsappIcon}
                    className="h-5 w-5 transition-opacity duration-100 group-hover:opacity-0"
                    alt="WhatsApp Icon"
                  />

                  {/* Hover Icon */}
                  <img
                    src={whatsappIconSelected}
                    className="h-5 w-5  absolute transition-opacity duration-100 opacity-0 group-hover:opacity-80"
                    alt="WhatsApp Icon Hover"
                  />
                </div>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61576739133116"
                className="group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  className="relative w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 
               group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-blue-500 
               group-hover:via-sky-400 group-hover:to-blue-300 shadow-sm group-hover:shadow-md"
                >
                  {/* Default Meta Icon */}
                  <img
                    src={metaIcon}
                    className="h-5 w-5 transition-opacity duration-300 group-hover:opacity-0"
                    alt="Meta Icon"
                  />

                  {/* Hover Meta Icon */}
                  <img
                    src={metaIconSelected}
                    className="h-5 w-5 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    alt="Meta Icon Hover"
                  />
                </div>
              </a>

              <a
                href="https://t.me/gyapakdaily"
                className="group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 
           group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-sky-500 
           group-hover:via-blue-400 group-hover:to-cyan-300 shadow-sm group-hover:shadow-md"

                >
                  <Send className="h-5 w-5 text-gray-400 transition-colors duration-300 group-hover:text-white" />
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
              id='subscribe'
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
              copyright © {new Date().getFullYear()} gyapak.in, All rights reserved.
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