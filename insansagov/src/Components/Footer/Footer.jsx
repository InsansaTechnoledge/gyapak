import React, { useState } from 'react';
import axios from 'axios';
import { useApi, CheckServer } from '../../Context/ApiContext';

import { FaFacebook, FaInstagram, FaLinkedin, FaTelegram, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";


import { useNavigate } from 'react-router-dom';
import logo4 from '/logo4.png'
import whatsappIcon from '../../assets/Footer/whatsapp.svg';
import metaIcon from '../../assets/Footer/meta.svg';
import whatsappIconSelected from '../../assets/Footer/whatsapp-selected.svg';
import metaIconSelected from '../../assets/Footer/meta-selected.svg';
import { FooterCompanyAboutText, FooterCompanyName, FooterDisclaimerText, FooterServicesText } from '../../constants/Constants';

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
    <footer className="main-footer-color secondary-site-text-color text-gray-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">

        {/* ================= PART 1: 4-COLUMN LAYOUT ================= */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-8 mb-16">

          {/* BRAND / SOCIALS — FULL WIDTH ON MOBILE */}
          <div className="space-y-4 col-span-2 md:col-span-3">
            <div className="h-14 flex items-center">
              <img src={logo4} alt="Gyapak Logo" className="h-full object-contain" />
            </div>

            <div className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors">
              <MdOutlineEmail className="h-5 w-5 text-red-500" />
              <a href="mailto:support@gyapak.in" className="text-sm font-medium">
                support@gyapak.in
              </a>
            </div>

            <div>
              <h4 className="text-white text-sm font-medium mb-3">Social Links</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/company/107316884/"
                  className="group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:bg-blue-600 group-hover:scale-110">
                    <FaLinkedin className="h-5 w-5 text-gray-400 group-hover:text-white" />
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
                    <FaInstagram className="h-5 w-5 text-gray-400 transition-colors duration-300 group-hover:text-white" />
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
                    <FaTelegramPlane className="h-5 w-5 text-gray-400 transition-colors duration-300 group-hover:text-white" />
                  </div>
                </a>

              </div>
            </div>
          </div>

          {/* SERVICES */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <h3 className="text-white text-base font-medium">{FooterServicesText}</h3>
            <div className="w-8 h-0.5 main-site-color opacity-80" />
            <ul className="space-y-3 text-sm">
              {["Exam Dates", "Admit Cards", "Exam Forms", "Result Declaration", "Exam Related Details"].map(item => (
                <li key={item} className="hover:text-white cursor-pointer">{item}</li>
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <h3 className="text-white text-base font-medium">{FooterCompanyAboutText}</h3>
            <div className="w-8 h-0.5 main-site-color opacity-80" />
            <ul className="space-y-3 text-sm">
              <li><a href="/#about" className="hover:text-white">About</a></li>
              <li><a href="/contact-us" className="hover:text-white">Contact</a></li>
              <li><a href="/privacy-policy" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div className="space-y-4 col-span-2 md:col-span-5">
            <h3 className="text-white text-base font-medium">Weekly Newsletter</h3>
            <div className="w-8 h-0.5 main-site-color opacity-80" />
            <p className="text-sm text-gray-400">Get the latest updates delivered explicitly to your inbox.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 text-sm bg-gray-800 text-white rounded focus:outline-none focus:ring-1 focus:ring-purple-500 border border-gray-700 placeholder-gray-500"
                required
              />
              {Error && <p className="text-red-500 text-xs">{Error}</p>}
              <button
                id="subscribe"
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* ================= PART 2: TEXT/DISCLAIMER ================= */}
        <div className="border-t border-gray-800 pt-10 pb-6">
          {/* SEO Content Section - FAQ Style */}
          <div className="mb-10 border-b border-gray-800 pb-10">
            <h3 className="text-center text-white text-xl font-bold mb-8">Gyapak FAQ's</h3>

            <div className="space-y-6 text-xs leading-relaxed text-gray-400 opacity-90">

              <div className="space-y-2">
                <h4 className="text-gray-200 font-semibold text-sm">What is Gyapak & how does it help in Government Exam Preparation?</h4>
                <p>
                  Gyapak is a comprehensive educational platform that provides real-time updates on <strong className="text-gray-300">Sarkari Naukri (Government Jobs)</strong>, <strong className="text-gray-300">Sarkari Results</strong>, <strong className="text-gray-300">Admit Cards</strong>, and <strong className="text-gray-300">Exam Syllabi</strong>. It serves as a one-stop solution for aspirants preparing for <strong className="text-gray-300">UPSC</strong>, <strong className="text-gray-300">SSC</strong>, <strong className="text-gray-300">Banking</strong>, <strong className="text-gray-300">Railways</strong>, and state-level exams.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-gray-200 font-semibold text-sm">How can I download Admit Cards and check Results on Gyapak?</h4>
                <p>
                  You can easily access the dedicated <strong>Admit Card</strong> and <strong>Result</strong> sections on Gyapak. We provide direct links to official websites for downloading <strong>Hall Tickets</strong> and checking <strong>Merit Lists</strong> for exams like <strong>IBPS</strong>, <strong>SBI PO</strong>, <strong>CGL</strong>, <strong>CHSL</strong>, and <strong>RRB NTPC</strong> as soon as they are released.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-gray-200 font-semibold text-sm">Does Gyapak provide Daily Current Affairs for Competitive Exams?</h4>
                <p>
                  Yes, Gyapak offers a curated <strong>Daily Current Affairs</strong> section. Our expert team compiles important national and international news, <strong>General Knowledge (GK)</strong> updates, and quizzes to help students excel in the <strong>General Awareness</strong> section of their competitive exams.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-gray-200 font-semibold text-sm">Is Gyapak a government website?</h4>
                <p>
                  No, Gyapak is a private educational news platform. We collect information from official government notifications and websites to provide accurate and timely updates to students. We are not affiliated with any government body.
                </p>
              </div>

            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-white text-lg font-bold mb-4">Disclaimer & Policy</h3>
          </div>

          <div className="text-justify text-xs leading-relaxed text-gray-400 opacity-80 max-w-5xl mx-auto">
            {FooterDisclaimerText}
            <br /><br />
            Gyapak is a platform for educational updates. We are not a government organization. We just provide information about the exams, results, and other educational updates. We are not responsible for any misinformation. Please check the official website for the latest updates.
          </div>
        </div>

        {/* ================= COPYRIGHT ================= */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-xs">
            Copyright © 2024-{new Date().getFullYear()} <span className="text-white">{FooterCompanyName}</span>. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;