import React, { useState, useEffect } from 'react';

const GovCalendar = () => {
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockEvents = [
        { id: 1, title: "UPSC Civil Services Exam", time: "9:00 AM" },
        { id: 2, title: "Railway Recruitment Interview", time: "10:30 AM" },
        { id: 3, title: "SSC Phase II", time: "2:00 PM" }
      ];
      setTodaysEvents(mockEvents);
      setIsLoading(false);
    }, 500);
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white mb-16">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-purple-800 sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-purple-600">View upcoming government exams:</span>
            <span className="block text-purple-600">Latest for 2025 at Gyapak.</span>
          </h2>
          <div className="mt-6 lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/government-calendar"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Government Calendar
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden border border-purple-200">
          <div className="bg-purple-600 px-4 py-2 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Today's Events - {today}</h3>
            <a href="/government-calendar" className="text-xs text-purple-200 hover:text-white">
              View All →
            </a>
          </div>
          
          {isLoading ? (
            <div className="p-4 text-center text-purple-600">Loading events...</div>
          ) : todaysEvents.length > 0 ? (
            <ul className="divide-y divide-purple-100">
              {todaysEvents.map(event => (
                <li key={event.id} className="px-4 py-3 flex justify-between items-center hover:bg-purple-50">
                  <span className="font-medium text-gray-800">{event.title}</span>
                  <span className="text-sm text-purple-600">{event.time}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">No events today</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovCalendar;