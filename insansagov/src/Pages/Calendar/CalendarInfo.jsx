import { Calendar, CheckCircle, Clock, FileText, MapPin, Search, User, ArrowRight } from 'lucide-react';

export default function GovernmentCalendarIntro() {
  return (
    <section className="max-w-6xl mx-auto mb-16">
      {/* SEO Header - Visually hidden but available for search engines */}
      <div className="sr-only">
        <h1>{`Government Calendar ${new Date().getFullYear()} - Official Exam Schedule and Job Notifications`}</h1>
        <p>Complete Government Calendar with UPSC, SSC, Banking, Railway exam dates and government job notifications across India.</p>
      </div>
      
      {/* Visual Header Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="bg-purple-600 px-8 py-12 md:py-16 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full grid grid-cols-10 gap-2">
              {Array(50).fill(0).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-white rounded-full"></div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-2 bg-purple-500 rounded-xl mb-4">
              <Calendar size={30} className="text-white" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Government Calendar
            </h2>
            
            <p className="text-lg md:text-xl text-gray-50 mb-8">
              Your comprehensive source for government exam schedules, job notifications, and important deadlines across India.
            </p>
            
            {/* <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-500" />
              </div>
              <input 
                type="text" 
                placeholder="Search government exams, jobs, and notifications..." 
                className="w-full pl-10 pr-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-indigo-300 outline-none text-gray-800"
                aria-label="Search government calendar events"
              />
            </div> */}
          </div>
        </div>
        
        {/* Features Section */}
        <div className="px-6 py-10 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Clock size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Time-Based Planning</h3>
              <p className="text-gray-600">Navigate the <strong>government calendar</strong> in daily, weekly, or monthly views</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <MapPin size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Location Filtering</h3>
              <p className="text-gray-600">Filter your <strong>government calendar</strong> by state or nationwide events</p>
            </div>
            
            {/* <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <User size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalized Alerts</h3>
              <p className="text-gray-600">Get custom notifications for your selected <strong>government calendar</strong> events</p>
            </div> */}
          </div>
        </div>
      </div>
      
      {/* Upcoming Events Preview */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-2xl font-bold text-gray-800">
              Upcoming Government Calendar Events
            </h3>
            
           
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                    activeTab === category.id
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div> */}
        
        {/* Event Cards */}
        {/* <div className="divide-y divide-gray-200">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} className="flex items-center p-6 hover:bg-gray-50 transition">
                <div className="h-12 w-12 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center">
                  <event.icon size={20} className="text-indigo-600" />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-lg font-medium text-gray-800">{event.title}</h4>
                  <div className="flex items-center mt-1">
                    <Clock size={16} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{event.date}</span>
                  </div>
                </div>
                <button className="ml-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition">
                  Details
                  <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No events found in this category.
            </div>
          )}
        </div>
         */}
        
        <div className="px-6 py-6 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <CheckCircle size={18} className="text-green-500" />
            <span className="text-sm text-gray-600">Updated daily with official government announcements</span>
          </div>
          {/* <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition shadow-sm">
            View Full Government Calendar
          </button> */}
        </div>
      </div>
      
      {/* Additional SEO Content (Visually Hidden) */}
      <div className="sr-only">
        <h2>Official Government Calendar for All India Exams and Jobs</h2>
        <p>
          The most comprehensive government calendar featuring UPSC exam dates, 
          SSC notification timeline, Railway recruitment schedule, banking exam calendar, 
          defense job postings, and all central and state government notifications.
        </p>
        <h3>Government Calendar Features</h3>
        <ul>
          <li>Complete exam schedules for all government sectors</li>
          <li>State-wise government job notifications</li>
          <li>Important application deadlines</li>
          <li>Result announcement dates</li>
        </ul>
      </div>
    </section>
  );
}