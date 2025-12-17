import { Calendar, CheckCircle, Clock, FileText, MapPin, Search, User, ArrowRight } from 'lucide-react';

export default function GovernmentCalendarIntro() {
  return (
    <section className=" mx-auto mb-16">
      {/* SEO Header - Visually hidden but available for search engines */}
      <div className="sr-only">
        <h1>{`Government Calendar ${new Date().getFullYear()} - Official Exam Schedule and Job Notifications`}</h1>
        <p>Complete Government Calendar with UPSC, SSC, Banking, Railway exam dates and government job notifications across India.</p>
      </div>

       {/* Upcoming Events Preview */}
       <div className="bg-white mb-10 rounded-2xl shadow-lg overflow-hidden">
        
        <div className="px-6 py-6 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <CheckCircle size={18} className="text-green-500" />
            <span className="text-sm text-gray-600">Updated daily with official government announcements</span>
          </div>
        </div>
      </div>
      
      {/* Visual Header Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="bg-purple-600 px-8 py-12 md:py-16 relative">
          
          <div className="relative z-10  mx-auto text-center">
           
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Government Calendar
            </h2>
            
            <p className="text-lg md:text-xl text-gray-50 mb-8">
              Your comprehensive source for government exam schedules, job notifications, and important deadlines across India.
            </p>
            
          </div>
        </div>
        
        {/* Features Section */}
        <div className="px-6 py-10 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6  mx-auto">
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

          </div>
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