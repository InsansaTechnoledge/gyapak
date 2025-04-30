import React, { useEffect, useState } from 'react';
import { fetchTodaysEvents } from '../../../Service/calendar';

const API_BASE_URL = 'http://localhost:8383/api/event'; 

const GovCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchTodaysEvents(API_BASE_URL);
        console.log(data);
        setEvents(data);
      } catch (err) {
        console.error('Error fetching today’s events:', err);
      }
    };
    loadEvents();
  }, []);

  return (
    <div className="bg-indigo-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-200">View today's government exams:</span>
            <span className="block text-indigo-200">Latest for 2025 at Gyapak.</span>
          </h2>
          <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/government-calendar"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Government Calendar
              </a>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {events.length === 0 ? (
            <p className="text-indigo-200 text-sm">No events today.</p>
          ) : (
            events.map((event, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3">
                  <img src={event.logo} alt={event.orgName} className="h-8 w-8 object-contain rounded-full" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{event.orgName}</h4>
                    <p className="text-xs text-gray-500">{event.abbreviation}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700 font-medium">{event.eventName}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GovCalendar;
