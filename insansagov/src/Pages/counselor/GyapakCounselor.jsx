import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CounselorChatUI = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hi there! I'm Gyapak AI Counselor. I can help you find the perfect government exam based on your profile. Let's get started! What's your name?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    education: '',
    degree: '',
    specialization: '',
    interests: [],
    stage: 'name'
  });
  const [isTyping, setIsTyping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [typingAnimation, setTypingAnimation] = useState(false);
  
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input field when chat starts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Questions to ask based on current stage
  const nextQuestion = {
    name: "Great! How old are you?",
    age: "Thanks! What's your highest level of education? (12th, Graduate, Post Graduate, PhD)",
    education: "And what was your degree or field of study?",
    degree: "Any specific specialization within that field?",
    specialization: "What career areas are you interested in? You can mention multiple interests separated by commas (e.g., Civil Services, Banking, Defense)",
    interests: "Based on your profile, I've found some great exam matches for you! Would you like to see them now?"
  };
  
  // Simulated AI typing effect
  const simulateTyping = (text, callback) => {
    setTypingAnimation(true);
    setIsTyping(true);
    
    setTimeout(() => {
      setTypingAnimation(false);
      callback();
      setIsTyping(false);
    }, 1000 + Math.min(text.length * 20, 2000)); // Dynamic typing time based on message length
  };
  
  // Process user input and generate responses
  const processUserInput = (input) => {
    const newStage = getNextStage();
    const botResponse = nextQuestion[userProfile.stage] || "Thank you for your information!";
    
    // Update user profile based on current stage
    const updatedProfile = {...userProfile};
    
    switch(userProfile.stage) {
      case 'name':
        updatedProfile.name = input;
        break;
      case 'age':
        updatedProfile.age = input;
        break;
      case 'education':
        updatedProfile.education = input;
        break;
      case 'degree':
        updatedProfile.degree = input;
        break;
      case 'specialization':
        updatedProfile.specialization = input;
        break;
      case 'interests':
        updatedProfile.interests = input.split(',').map(item => item.trim());
        break;
      case 'confirmation':
        if(input.toLowerCase().includes('yes')) {
          simulateTyping("Analyzing your profile...", () => {
            generateResults();
            setShowResults(true);
          });
          return;
        } else {
          simulateTyping("No problem! Feel free to ask if you have any other questions about government exams.", () => {
            setMessages([...messages, {
              id: messages.length + 2,
              sender: 'bot',
              text: "No problem! Feel free to ask if you have any other questions about government exams."
            }]);
          });
          return;
        }
    }
    
    updatedProfile.stage = newStage;
    setUserProfile(updatedProfile);
    
    // Add bot's next question with typing animation
    if(newStage !== 'done') {
      simulateTyping(botResponse, () => {
        setMessages([...messages, {
          id: messages.length + 2,
          sender: 'bot',
          text: botResponse
        }]);
      });
    }
  };
  
  const getNextStage = () => {
    switch(userProfile.stage) {
      case 'name': return 'age';
      case 'age': return 'education';
      case 'education': return 'degree';
      case 'degree': return 'specialization';
      case 'specialization': return 'interests';
      case 'interests': return 'confirmation';
      case 'confirmation': return 'done';
      default: return 'name';
    }
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if(!inputText.trim() || isTyping) return;
    
    // Add user message to chat
    const newMessages = [...messages, {
      id: messages.length + 1,
      sender: 'user',
      text: inputText
    }];
    
    setMessages(newMessages);
    const currentInput = inputText;
    setInputText('');
    processUserInput(currentInput);
  };
  
  const generateResults = () => {
    // This is where you would integrate with your actual AI model
    const mockResults = [
      {
        examName: "UPSC Civil Services",
        matchScore: 94,
        eligibility: "Eligible",
        description: "One of India's most prestigious exams for various administrative positions in government.",
        nextDate: "June 2025",
        preparationTime: "12-18 months"
      },
      {
        examName: "SSC CGL",
        matchScore: 87,
        eligibility: "Eligible",
        description: "Combined Graduate Level exam for various Group B and C posts in government departments.",
        nextDate: "August 2025", 
        preparationTime: "6-8 months"
      },
      {
        examName: "RBI Grade B",
        matchScore: 76,
        eligibility: "Eligible",
        description: "Banking exam for officer positions in the Reserve Bank of India.",
        nextDate: "May 2025",
        preparationTime: "4-6 months"
      }
    ];
    
    setResults(mockResults);
  };
  
  const resetChat = () => {
    setMessages([
      { id: 1, sender: 'bot', text: "Hi there! I'm Gyapak AI Counselor. I can help you find the perfect government exam based on your profile. Let's get started! What's your name?" }
    ]);
    setUserProfile({
      name: '',
      age: '',
      education: '',
      degree: '',
      specialization: '',
      interests: [],
      stage: 'name'
    });
    setShowResults(false);
    setResults([]);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 min-h-screen flex flex-col"
    >
      {/* Navigation Bar */}
      <nav className="bg-indigo-900 text-white px-6 py-4 shadow-lg z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center mt-24">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Gyapak AI Counselor</h1>
              <p className="text-xs text-indigo-200">Your personal guide to government exam selection</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar} className="md:hidden text-white hover:text-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <div className="hidden md:flex space-x-4">
              <a href="#" className="text-indigo-200 hover:text-white">Home</a>
              <a href="#" className="text-indigo-200 hover:text-white">Exams</a>
              <a href="#" className="text-indigo-200 hover:text-white">Resources</a>
              <a href="#" className="text-indigo-200 hover:text-white">About</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Sidebar (hidden on mobile) */}
        <AnimatePresence>
          {(showSidebar || window.innerWidth > 768) && (
            <motion.div 
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`${showSidebar ? 'absolute z-20 w-64' : 'hidden md:block'} w-64 bg-indigo-800 text-white shadow-xl`}
            >
              <div className="p-4 border-b border-indigo-700">
                <h2 className="font-bold text-lg">Exam Categories</h2>
              </div>
              <div className="py-2">
                <a href="#" className="block px-4 py-2 hover:bg-indigo-700 transition-colors duration-200">Civil Services</a>
                <a href="#" className="block px-4 py-2 hover:bg-indigo-700 transition-colors duration-200">Banking & Insurance</a>
                <a href="#" className="block px-4 py-2 hover:bg-indigo-700 transition-colors duration-200">Defense</a>
                <a href="#" className="block px-4 py-2 hover:bg-indigo-700 transition-colors duration-200">Railways</a>
                <a href="#" className="block px-4 py-2 hover:bg-indigo-700 transition-colors duration-200">Teaching & Education</a>
                <a href="#" className="block px-4 py-2 hover:bg-indigo-700 transition-colors duration-200">Engineering Services</a>
                <a href="#" className="block px-4 py-2 hover:bg-indigo-700 transition-colors duration-200">State PSCs</a>
              </div>
              <div className="p-4 border-t border-indigo-700">
                <h2 className="font-bold text-lg">Study Resources</h2>
              </div>
              <div className="py-2">
                <a href="#" className="block px-4 py-2 hover:bg-indigo-700 transition-colors duration-200">Free Mock Tests</a>
                <a href="#" className="block px-4 py-2 hover:bg-indigo-700 transition-colors duration-200">Previous Year Papers</a>
                <a href="#" className="block px-4 py-2 hover:bg-indigo-700 transition-colors duration-200">Study Materials</a>
                <a href="#" className="block px-4 py-2 hover:bg-indigo-700 transition-colors duration-200">Expert Guidance</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
          {/* Chat Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-2">AI Counselor</span>
                  <span className="bg-green-500 h-2 w-2 rounded-full animate-pulse"></span>
                </h1>
                <p className="text-indigo-200 text-sm">Finding your perfect exam match</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={resetChat} className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1 rounded-md transition-all">
                  New Chat
                </button>
                <button className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1 rounded-md flex items-center transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  Export
                </button>
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-indigo-50/50">
              {!showResults ? (
                <>
                  <AnimatePresence>
                    {messages.map(message => (
                      <motion.div 
                        key={message.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender === 'bot' && (
                          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-2 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div 
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.sender === 'user' 
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md' 
                              : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-md'
                          }`}
                        >
                          <div className={message.sender === 'user' ? 'text-white' : 'text-gray-800'}>
                            {message.text}
                          </div>
                          {message.sender === 'bot' && (
                            <div className="mt-1 text-xs text-gray-400 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                        </div>
                        {message.sender === 'user' && (
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-2 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {typingAnimation && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start mb-4"
                    >
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-2 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-5 py-3 text-gray-500 shadow-md">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="results-container space-y-4"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
                    <div className="flex items-center mb-2">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Your Recommended Exams</h2>
                        <p className="text-sm text-gray-600">
                          Based on your profile, {userProfile.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {results.map((exam, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`border rounded-xl p-4 ${
                        index === 0 
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200' 
                          : 'bg-white border-gray-200'
                      } shadow-md transition-all hover:shadow-lg hover:transform hover:scale-[1.02]`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {index === 0 && (
                            <span className="flex-shrink-0 bg-yellow-100 p-1 rounded-md mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                              </svg>
                            </span>
                          )}
                          <h3 className="text-lg font-semibold text-gray-800">{exam.examName}</h3>
                        </div>
                        <div className="flex items-center">
                          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                            exam.matchScore > 90 ? 'bg-green-100 text-green-800' : 
                            exam.matchScore > 80 ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {exam.matchScore}% Match
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-gray-600">{exam.description}</p>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-indigo-50 rounded-lg p-2 flex items-center">
                          <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Eligibility</div>
                            <div className="text-sm font-medium">{exam.eligibility}</div>
                          </div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-2 flex items-center">
                          <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Next Exam Date</div>
                            <div className="text-sm font-medium">{exam.nextDate}</div>
                          </div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-2 flex items-center">
                          <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Prep Time</div>
                            <div className="text-sm font-medium">{exam.preparationTime}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm px-4 py-2 rounded-lg shadow-md transform transition-all hover:shadow-lg flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          View Details
                        </button>
                        <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-sm px-4 py-2 rounded-lg shadow-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Study Material
                        </button>
                        <button className="border border-green-600 text-green-600 hover:bg-green-50 text-sm px-4 py-2 rounded-lg shadow-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          Share Exam
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: results.length * 0.2 + 0.2 }}
                    className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg text-white"
                  >
                    <div className="flex items-start">
                      <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Want personalized expert guidance?</h2>
                        <p className="mt-1 text-white/80">Connect with our counselors who specialize in government exam preparation</p>
                        <div className="mt-4 flex space-x-3">
                          <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg shadow-md font-medium transition-all flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Schedule Call
                          </button>
                          <button className="bg-transparent border border-white text-white hover:bg-white/10 px-4 py-2 rounded-lg shadow-md font-medium transition-all flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Live Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: results.length * 0.2 + 0.4 }}
                    className="flex justify-center mt-4"
                  >
                    <button
                      onClick={resetChat}
                      className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-all text-sm px-4 py-2 rounded-lg flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      Start New Chat
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </div>
            
            {/* Input Area */}
            {!showResults && (
              <motion.form 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSendMessage} 
                className="border-t border-gray-100 p-4 bg-white"
              >
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your answer..."
                    className="flex-1 border border-gray-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-indigo-50"
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={isTyping || !inputText.trim()}
                    className={`${
                      isTyping || !inputText.trim() 
                        ? 'bg-indigo-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                    } text-white rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transform transition-all ${
                      isTyping || !inputText.trim() ? '' : 'hover:scale-105'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex justify-center mt-2">
                  <div className="text-xs text-gray-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Your data is securely protected and never shared without permission
                  </div>
                </div>
              </motion.form>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Feature Cards */}
      {!showResults && (
        <div className="bg-indigo-900 text-white py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Why use Gyapak AI Counselor?</h2>
              <p className="text-indigo-200">Make informed decisions about your exam preparation journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-indigo-800 to-indigo-900 rounded-xl p-6 shadow-lg"
              >
                <div className="h-12 w-12 bg-indigo-700 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Personalized Recommendations</h3>
                <p className="text-indigo-200">Get exam suggestions tailored to your education, interests, and career goals</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-indigo-800 to-indigo-900 rounded-xl p-6 shadow-lg"
              >
                <div className="h-12 w-12 bg-indigo-700 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Detailed Exam Analysis</h3>
                <p className="text-indigo-200">Access comprehensive information about eligibility, dates, and preparation strategies</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-indigo-800 to-indigo-900 rounded-xl p-6 shadow-lg"
              >
                <div className="h-12 w-12 bg-indigo-700 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Expert Counseling</h3>
                <p className="text-indigo-200">Connect with experienced counselors for in-depth guidance and preparation strategies</p>
              </motion.div>
            </div>
          </div>
        </div>
      )}
      
     
    </motion.div>
  );
};

export default CounselorChatUI;