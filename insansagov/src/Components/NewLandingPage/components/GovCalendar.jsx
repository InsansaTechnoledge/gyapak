import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTodaysEvents } from '../../../Service/calendar';
import { useApi } from '../../../Context/ApiContext';

const GovCalendar = () => {
  const { apiBaseUrl } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const {
    data: todayEvents = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['todaysEvents'],
    queryFn: () => fetchTodaysEvents(apiBaseUrl),
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const filteredEvents = todayEvents.filter(event => 
    event.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  console.log(filteredEvents)

  const slugGenerator = (title) => {
    return title.
    toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
  }


  
  return (
    <div className="bg-white mt-16 mb-16">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-purple-800 sm:text-4xl">
            <span className="block">upcoming government exams</span>
            <span className="block text-purple-600 text-2xl mt-2">Latest for 2025 at Gyapak with government calendar</span>
          </h2>
          <div className="mt-6 lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/government-calendar"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Full Calendar View
              </a>
            </div>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search exams, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        
        {/* Main content area */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-purple-200">
          <div className="bg-purple-600 px-4 py-3 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Today's government events - {today}</h3>
            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}
            </span>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-2 text-purple-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p>Failed to load events. Please try again later.</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {filteredEvents.map(event => (
                    <a 
                      key={event._id} 
                      href={`/top-exams-for-government-jobs-in-india/${slugGenerator(event.name)}?id=${event._id}`}
                      className="block p-4 bg-white border border-purple-100 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <h4 className="font-medium text-purple-800 mb-2">{event.name}</h4>
                      {event.date && <p className="text-sm text-gray-600 mb-2">{event.date}</p>}
                      {event.status && (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          {event.status}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-purple-100">
                  {filteredEvents.map(event => (
                    <a 
                      key={event._id}
                      href={`/top-exams-for-government-jobs-in-india/${slugGenerator(event.name)}?id=${event._id}`}
                      className="px-4 py-3 flex justify-between items-center hover:bg-purple-50 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-purple-800">{event.name}</h4>
                        {event.date && <p className="text-sm text-gray-600">{event.date}</p>}
                      </div>
                      {event.status && (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 whitespace-nowrap">
                          {event.status}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M19 21a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="mt-2">No events found</p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="mt-2 text-purple-600 hover:text-purple-800"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
          
          {filteredEvents.length > 0 && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-center">
              <a href="/government-calendar" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                View all upcoming exams and events →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovCalendar;