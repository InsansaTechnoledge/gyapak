import { useState, useEffect } from 'react';
import { Bell, BookOpen, Calendar, CheckCircle, ChevronRight, Clock, FileText, Menu, Search, Star, User, X } from 'lucide-react';

export default function TestSeriesLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedExam, setSelectedExam] = useState(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [countdownTime, setCountdownTime] = useState({
    days: 30,
    hours: 12,
    minutes: 45,
    seconds: 10
  });

  // Simulate countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownTime(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const examCategories = [
    { id: 'all', name: 'All Exams' },
    { id: 'upsc', name: 'UPSC' },
    { id: 'banking', name: 'Banking' },
    { id: 'ssc', name: 'SSC' },
    { id: 'railways', name: 'Railways' },
    { id: 'defence', name: 'Defence' },
    { id: 'state', name: 'State PSC' }
  ];

  const featuredExams = [
    {
      id: 1,
      title: 'UPSC Civil Services',
      category: 'upsc',
      tests: 125,
      students: '15,000+',
      rating: 4.8,
      image: "/api/placeholder/100/100",
      price: '₹4,999',
      discount: '₹7,999'
    },
    {
      id: 2,
      title: 'SBI PO',
      category: 'banking',
      tests: 95,
      students: '22,000+',
      rating: 4.9,
      image: "/api/placeholder/100/100",
      price: '₹2,499',
      discount: '₹3,999'
    },
    {
      id: 3,
      title: 'SSC CGL',
      category: 'ssc',
      tests: 110,
      students: '28,000+',
      rating: 4.7,
      image: "/api/placeholder/100/100",
      price: '₹1,999',
      discount: '₹3,499'
    },
    {
      id: 4,
      title: 'RRB NTPC',
      category: 'railways',
      tests: 85,
      students: '19,000+',
      rating: 4.6,
      image: "/api/placeholder/100/100",
      price: '₹1,799',
      discount: '₹2,999'
    },
    {
      id: 5,
      title: 'CDS',
      category: 'defence',
      tests: 75,
      students: '11,000+',
      rating: 4.7,
      image: "/api/placeholder/100/100",
      price: '₹1,499',
      discount: '₹2,499'
    },
    {
      id: 6,
      title: 'BPSC',
      category: 'state',
      tests: 90,
      students: '13,000+',
      rating: 4.5,
      image: "/api/placeholder/100/100",
      price: '₹2,199',
      discount: '₹3,699'
    }
  ];
  
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      exam: "UPSC CSE",
      rank: "AIR 45",
      image: "/api/placeholder/60/60",
      text: "The comprehensive test series was instrumental in my success. The detailed analysis after each test helped me identify my weak areas and work on them."
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      exam: "SBI PO",
      rank: "Selected in first attempt",
      image: "/api/placeholder/60/60",
      text: "The banking test series is exactly what I needed. The questions match the actual exam pattern, and the timed practice improved my speed significantly."
    },
    {
      id: 3,
      name: "Amit Patel",
      exam: "SSC CGL",
      rank: "AIR 123",
      image: "/api/placeholder/60/60",
      text: "I'm grateful for the detailed solutions and video explanations. The difficulty level is perfect, slightly tougher than the actual exam which prepared me well."
    }
  ];

  const features = [
    {
      icon: <FileText size={24} className="text-primary" />,
      title: "Exam-Pattern Tests",
      description: "Designed as per the latest exam patterns & syllabi"
    },
    {
      icon: <CheckCircle size={24} className="text-primary" />,
      title: "Comprehensive Coverage",
      description: "Every topic covered with varying difficulty levels"
    },
    {
      icon: <Search size={24} className="text-primary" />,
      title: "Detailed Analysis",
      description: "AI-powered performance insights and improvement suggestions"
    },
    {
      icon: <BookOpen size={24} className="text-primary" />,
      title: "In-depth Solutions",
      description: "Step-by-step explanations with conceptual clarity"
    },
    {
      icon: <Clock size={24} className="text-primary" />,
      title: "Time Management",
      description: "Section-wise timing to improve your speed & accuracy"
    },
    {
      icon: <User size={24} className="text-primary" />,
      title: "Expert Support",
      description: "Dedicated mentors to resolve your doubts 24/7"
    }
  ];

  const filteredExams = activeTab === 'all' 
    ? featuredExams 
    : featuredExams.filter(exam => exam.category === activeTab);

  const handleExamClick = (exam) => {
    setSelectedExam(exam);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCloseExamDetails = () => {
    setSelectedExam(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary">
              ExamPrep<span className="text-secondary">Pro</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="font-medium text-gray-900 hover:text-primary">Home</a>
            <a href="#exams" className="font-medium text-gray-900 hover:text-primary">Exams</a>
            <a href="#features" className="font-medium text-gray-900 hover:text-primary">Features</a>
            <a href="#testimonials" className="font-medium text-gray-900 hover:text-primary">Success Stories</a>
            <a href="#pricing" className="font-medium text-gray-900 hover:text-primary">Pricing</a>
          </nav>
          
          <div className="hidden md:flex space-x-4 items-center">
            <button className="px-4 py-2 text-gray-600 hover:text-primary font-medium">Login</button>
            <button className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all">Sign Up</button>
          </div>
          
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4 shadow-lg">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="font-medium text-gray-900 hover:text-primary py-2">Home</a>
              <a href="#exams" className="font-medium text-gray-900 hover:text-primary py-2">Exams</a>
              <a href="#features" className="font-medium text-gray-900 hover:text-primary py-2">Features</a>
              <a href="#testimonials" className="font-medium text-gray-900 hover:text-primary py-2">Success Stories</a>
              <a href="#pricing" className="font-medium text-gray-900 hover:text-primary py-2">Pricing</a>
              <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
                <button className="w-full py-2 text-gray-600 hover:text-primary font-medium">Login</button>
                <button className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all">Sign Up</button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {selectedExam ? (
          <div className="container mx-auto px-4 py-8">
            <button 
              onClick={handleCloseExamDetails}
              className="flex items-center text-primary mb-6 hover:underline"
            >
              <ChevronRight className="rotate-180 mr-1" size={16} /> Back to all exams
            </button>
            
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gray-100 p-6 flex justify-center items-center">
                  <img 
                    src={selectedExam.image} 
                    alt={selectedExam.title} 
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedExam.title} Test Series</h2>
                  
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-500 fill-current" />
                      <span className="ml-1 text-gray-700">{selectedExam.rating}/5</span>
                    </div>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-700">{selectedExam.students} students</span>
                  </div>
                  
                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900">What you'll get:</h3>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-start">
                          <CheckCircle size={16} className="text-green-500 mt-1 mr-2" />
                          <span>{selectedExam.tests} Full-length Mock Tests</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={16} className="text-green-500 mt-1 mr-2" />
                          <span>Previous Year Question Papers</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={16} className="text-green-500 mt-1 mr-2" />
                          <span>Topic-wise Practice Tests</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={16} className="text-green-500 mt-1 mr-2" />
                          <span>Detailed Performance Analytics</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-gray-500 line-through text-lg">{selectedExam.discount}</div>
                        <div className="text-3xl font-bold text-gray-900">{selectedExam.price}</div>
                        <div className="text-green-600 mt-1">37% Off</div>
                        
                        <button className="mt-4 w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all">
                          Start Preparing Now
                        </button>
                        
                        <div className="mt-3 text-xs text-gray-500">30-day money-back guarantee</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 p-6">
                <h3 className="font-bold text-lg mb-4">About this test series</h3>
                <p className="text-gray-700">
                  Our comprehensive {selectedExam.title} test series is designed by top educators and 
                  exam experts to give you the best preparation experience. With questions that match the 
                  actual exam pattern and difficulty, you'll be fully prepared for the real challenge.
                </p>
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium">Validity</div>
                    <div className="text-gray-700">1 Year</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium">Medium</div>
                    <div className="text-gray-700">English & Hindi</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium">Instant Access</div>
                    <div className="text-gray-700">Start today</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0">
                    <span className="bg-blue-100 text-primary px-4 py-1 rounded-full text-sm font-medium">
                      #1 Test Series Platform
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 leading-tight">
                      Master Government Exams with Our <span className="text-primary">Premium Test Series</span>
                    </h1>
                    <p className="text-lg text-gray-700 mt-6">
                      Practice with exam-pattern tests designed by experts. Get detailed analysis and improve your score. Join 1M+ successful aspirants.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <button className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all text-lg flex items-center justify-center">
                        Start Free Trial <ChevronRight size={20} className="ml-1" />
                      </button>
                      <button className="px-8 py-3 border-2 border-primary text-primary hover:bg-blue-50 rounded-lg font-medium transition-all text-lg flex items-center justify-center">
                        Explore Exams
                      </button>
                    </div>
                    <div className="mt-6 flex items-center space-x-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white">
                            <img src={`/api/placeholder/32/32`} alt="User" className="rounded-full" />
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-bold text-primary">100,000+</span> active students
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-center mb-6">
                          UPSC Preliminary Test - Starting Soon
                        </h2>

                        <div className="grid grid-cols-4 gap-2 mb-6">
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold">{countdownTime.days}</div>
                            <div className="text-xs text-gray-500">Days</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold">{countdownTime.hours}</div>
                            <div className="text-xs text-gray-500">Hours</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold">{countdownTime.minutes}</div>
                            <div className="text-xs text-gray-500">Minutes</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold">{countdownTime.seconds}</div>
                            <div className="text-xs text-gray-500">Seconds</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm text-gray-600">Regular Price</div>
                              <div className="text-lg font-bold text-gray-900">₹1,499</div>
                            </div>
                            <div>
                              <div className="text-sm text-primary">Limited Offer</div>
                              <div className="text-lg font-bold text-primary">₹999</div>
                            </div>
                          </div>
                        </div>

                        <button className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all">
                          Register Now & Save 33%
                        </button>
                      </div>

                      {/* Floating Feature Badges */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Live Results
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-primary">45+</div>
                    <div className="text-gray-600 mt-2">Exam Categories</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-primary">10,000+</div>
                    <div className="text-gray-600 mt-2">Practice Tests</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-primary">1M+</div>
                    <div className="text-gray-600 mt-2">Success Stories</div>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-primary">4.8/5</div>
                    <div className="text-gray-600 mt-2">User Rating</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Exams Section */}
            <section id="exams" className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Popular Test Series
                  </h2>
                  <p className="text-lg text-gray-700 mt-4">
                    Comprehensive and up-to-date test series for all major government exams
                  </p>
                </div>

                {/* Category Tabs */}
                <div className="flex justify-center mb-8 overflow-x-auto pb-2 space-x-2">
                  {examCategories.map((category) => (
                    <button
                      key={category.id}
                      className={`px-4 py-2 text-sm md:text-base rounded-lg transition-all whitespace-nowrap ${
                        activeTab === category.id 
                          ? 'bg-primary text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Exam Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredExams.map((exam) => (
                    <div 
                      key={exam.id} 
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => handleExamClick(exam)}
                    >
                      <div className="p-6">
                        <div className="flex items-center">
                          <img 
                            src={exam.image} 
                            alt={exam.title} 
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="ml-4">
                            <h3 className="font-bold text-lg text-gray-900">{exam.title}</h3>
                            <div className="flex items-center text-sm">
                              <Star size={14} className="text-yellow-500 fill-current" />
                              <span className="ml-1">{exam.rating}</span>
                              <span className="mx-1 text-gray-400">•</span>
                              <span>{exam.students} students</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-medium">
                            {exam.tests} Tests
                          </div>
                          <div className="text-right">
                            <div className="text-gray-500 line-through text-sm">{exam.discount}</div>
                            <div className="font-bold text-gray-900">{exam.price}</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 flex justify-between items-center">
                        <div className="text-sm text-gray-700">Updated for 2025</div>
                        <div className="flex items-center text-primary font-medium text-sm">
                          View Details <ChevronRight size={16} className="ml-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10 text-center">
                  <button className="px-6 py-3 border-2 border-primary text-primary hover:bg-blue-50 rounded-lg font-medium transition-all">
                    View All Test Series
                  </button>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Why Choose Our Test Series
                  </h2>
                  <p className="text-lg text-gray-700 mt-4">
                    Designed to maximize your preparation and boost your confidence
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all">
                      <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-700">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Success Stories
                  </h2>
                  <p className="text-lg text-gray-700 mt-4">
                    Hear from our students who aced their exams with our test series
                  </p>
                </div>
                
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-xl shadow-md p-6 md:p-8 relative">
                    <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
                      <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                        {testimonials[testimonialIndex].exam}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                        <img 
                          src={testimonials[testimonialIndex].image} 
                          alt={testimonials[testimonialIndex].name} 
                          className="w-16 h-16 rounded-full border-4 border-blue-100"
                        />
                      </div>
                      <div>
                        <div className="text-gray-700 italic">
                          "{testimonials[testimonialIndex].text}"
                        </div>
                        <div className="mt-4">
                          <div className="font-bold text-gray-900">{testimonials[testimonialIndex].name}</div>
                          <div className="text-primary font-medium">{testimonials[testimonialIndex].rank}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-6 space-x-2">
                      {testimonials.map((_, index) => (
                        <button 
                          key={index} 
                          className={`w-2.5 h-2.5 rounded-full ${
                            index === testimonialIndex ? 'bg-primary' : 'bg-gray-300'
                          }`}
                          onClick={() => setTestimonialIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section id="pricing" className="py-16 bg-gradient-to-br from-primary to-secondary">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center text-white">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready to Ace Your Exams?
                  </h2>
                  <p className="text-lg mb-8 opacity-90">
                    Join thousands of successful candidates who have transformed their preparation with our test series.
                  </p>
                  
                  <div className="bg-white rounded-xl p-6 md:p-8 text-left">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">All Access Pass</h3>
                        <p className="text-gray-600 mt-1">Unlimited access to all test series</p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <div className="text-gray-500 line-through text-sm">₹14,999</div>
                        <div className="text-3xl font-bold text-gray-900">₹8,999<span className="text-sm font-normal text-gray-500">/year</span></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-1 mr-2" />
                        <span className="text-gray-700">Access to 45+ exam categories</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-1 mr-2" />
                        <span className="text-gray-700">10,000+ practice tests</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-1 mr-2" />
                        <span className="text-gray-700">Live doubt clearing sessions</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-1 mr-2" />
                        <span className="text-gray-700">Performance analytics dashboard</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-1 mr-2" />
                        <span className="text-gray-700">Personalized study plan</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-1 mr-2" />
                        <span className="text-gray-700">24/7 expert support</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                      <button className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all text-center">
                        Get Started Now
                      </button>
                      <button className="flex-1 py-3 border border-primary text-primary hover:bg-blue-50 rounded-lg font-medium transition-all text-center">
                        View All Plans
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-12 bg-white">
              <div className="container mx-auto px-4">
                <div className="max-w-xl mx-auto bg-blue-50 rounded-xl p-6 md:p-8">
                  <div className="flex items-center justify-center mb-4">
                    <Bell size={24} className="text-primary mr-2" />
                    <h3 className="text-xl font-bold text-gray-900">Stay Updated</h3>
                  </div>
                  <p className="text-center text-gray-700 mb-6">
                    Get notifications about new test series, exam updates, and special offers
                  </p>
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-6">
                ExamPrep<span className="text-blue-400">Pro</span>
              </div>
              <p className="text-gray-400 mb-6">
                India's leading platform for government exam preparation with comprehensive test series and analytics.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Popular Exams</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">UPSC Civil Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">SBI PO & Clerk</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">SSC CGL</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">IBPS PO & Clerk</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">RRB NTPC</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">State PSC Exams</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms & Conditions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Refund Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">support@exampreppro.com</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400">+91 9876543210</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">123 Education Street, New Delhi, India - 110001</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ExamPrepPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}