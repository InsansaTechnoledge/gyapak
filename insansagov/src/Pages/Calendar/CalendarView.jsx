import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Filter, 
  Calendar as CalendarIcon, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

// Import components from original code
import EventComponent from './EventComponent';
import EventModal from './EventModal';
import { fetchCategories, fetchStates, fetchEventTypes, fetchEventsForCalendar } from '../../Service/calendar'
import { useApi } from '../../Context/ApiContext';
import GovernmentCalendarIntro from './CalendarInfo';

const localizer = momentLocalizer(moment);

export default function CalendarView() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentOrganizationSlug, setCurrentOrganizationSlug] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('month');
  const { apiBaseUrl } = useApi();
  const [selectedEventType, setSelectedEventType] = useState(null);

  const month = currentMonth.month() + 1;
  const year = currentMonth.year();

  const { data: categories = [], isLoading: isCategoryLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(apiBaseUrl),
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: states = [], isLoading: isStateLoading } = useQuery({
    queryKey: ['navbarStates'],
    queryFn: () => fetchStates(apiBaseUrl),
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: eventTypes = [], isLoading: isEventTypeLoading } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: () => fetchEventTypes(apiBaseUrl),
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  const { data: events, isLoading, error: eventError, refetch } = useQuery({
    queryKey: ['events', selectedCategory?._id, selectedState?._id,selectedEventType?._id, month, year],
    queryFn: () => fetchEventsForCalendar(apiBaseUrl, selectedCategory?._id, selectedState?._id,selectedEventType?.type, month, year),
    enabled: !!selectedCategory?._id || !!selectedState?._id || !!selectedEventType?._id,
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (events) setCalendarEvents(events);
  }, [events]);

  const handleNavigate = useCallback((newDate) => {
    setCurrentMonth(moment(newDate));
  }, []);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.category?.color || '#8b5cf6',
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontWeight: '500',
        fontSize: '13px',
        padding: '4px 8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    };
  };

  const renderToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToToday = () => {
      toolbar.onNavigate('TODAY');
    };

    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span className="text-lg font-semibold text-purple-900">
          {date.format('MMMM YYYY')}
        </span>
      );
    };

    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          {label()}
          <div className="ml-4 flex items-center space-x-1">
            <button
              onClick={goToBack}
              className="p-2 rounded-full hover:bg-purple-100 text-purple-700 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Today
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-full hover:bg-purple-100 text-purple-700 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-lg">
          {['month', 'week', 'day', 'agenda'].map(viewOption => (
            <button
              key={viewOption}
              onClick={() => toolbar.onView(viewOption)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === viewOption 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-purple-100'
              }`}
            >
              {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 md:px-6">
      {/* Hero Section */}
      <GovernmentCalendarIntro/>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto">
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-purple-900">Filter Events</h2>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors font-medium"
            >
              <Filter size={18} />
              Filters
              <ChevronDown size={18} className={`transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="md:flex gap-6">
              <div className="mb-4 md:mb-0 md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
                <div className="relative">
                  <select 
                    value={selectedCategory?._id || ""} 
                    onChange={(e) => {
                      const selected = categories.find(c => c._id === e.target.value);
                      setSelectedCategory(selected || null);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 appearance-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                </div>
              </div>
              
              <div className="md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select State</label>
                <div className="relative">
                  <select 
                    value={selectedState?._id || ""} 
                    onChange={(e) => {
                      const selected = states.find(s => s._id === e.target.value);
                      setSelectedState(selected || null);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 appearance-none"
                  >
                    <option value="">All States</option>
                    {states.map(state => <option key={state._id} value={state._id}>{state.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                </div>
              </div>


              <div className="mb-4 md:mb-0 md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Type of event</label>
                <div className="relative">
                  <select 
                    value={selectedEventType?._id || ""} 
                    onChange={(e) => {
                      const selected = eventTypes.find(c => c._id === e.target.value);
                      setSelectedEventType(selected || null);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700 appearance-none"
                  >
                    <option value="">All Event</option>
                    {eventTypes.map(e => <option key={e._id} value={e._id}>{e.type}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                </div>
              </div>


            </div>
          )}

          {(selectedCategory || selectedState || selectedEventType) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategory && (
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm">
                  <span>Category: {selectedCategory.name}</span>
                  <button 
                    onClick={() => setSelectedCategory(null)} 
                    className="text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </div>
              )}
              {selectedState && (
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm">
                  <span>State: {selectedState.name}</span>
                  <button 
                    onClick={() => setSelectedState(null)} 
                    className="text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </div>
              )}
               {selectedEventType && (
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm">
                  <span>Category: {selectedEventType.type}</span>
                  <button 
                    onClick={() => setSelectedEventType(null)} 
                    className="text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow-md p-6 overflow-hidden">
          {eventError ? (
            <div className="text-center py-20">
              <div className="text-red-500 text-lg mb-4">Failed to load events</div>
              <button 
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center mx-auto gap-2 shadow-md transition-all hover:shadow-lg"
                onClick={() => refetch()}
              >
                <RefreshCw size={18} />
                Try Again
              </button>
            </div>
          ) : (!selectedCategory && !selectedState) ? (
            <div className="text-center py-20">
              <div className="text-gray-500 text-lg mb-4">Please select a category or state to view events</div>
              <button 
                onClick={() => setShowFilters(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center mx-auto gap-2 shadow-md transition-all hover:shadow-lg"
              >
                <Filter size={18} />
                Show Filters
              </button>
            </div>
          ) : isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
              <div className="text-purple-700 text-lg">Loading events...</div>
            </div>
          ) : (
            <div className="calendar-container" style={{ height: 700 }}>
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                view={view}
                onView={handleViewChange}
                date={currentMonth.toDate()}
                onNavigate={handleNavigate}
                popup={true}
                components={{ 
                  event: (props) => (
                    <EventComponent 
                      {...props} 
                      setSelectedDate={setSelectedDate} 
                      setShowEventModal={setShowEventModal} 
                      setCurrentOrganizationSlug={setCurrentOrganizationSlug} 
                    />
                  ),
                  toolbar: renderToolbar
                }}
                selectable={true}
                eventPropGetter={eventStyleGetter}
                className="rounded-lg overflow-hidden calendar-custom"
              />
            </div>
          )}
          {showEventModal && selectedDate && (
            <EventModal
              selectedDate={selectedDate}
              onClose={() => setShowEventModal(false)}
              events={events}
              currentOrganizationSlug={currentOrganizationSlug}
              navigate={navigate}
            />
          )}
        </div>
      </div>

      {/* Custom CSS for calendar */}
      <style jsx>{`
        .calendar-custom .rbc-month-view {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          background-color: white;
        }
        
        .calendar-custom .rbc-header {
          background-color: #8b5cf6;
          color: white;
          padding: 12px 0;
          font-weight: 600;
        }
        
        .calendar-custom .rbc-day-bg.rbc-today {
          background-color: #f3e8ff;
        }
        
        .calendar-custom .rbc-off-range-bg {
          background-color: #f9fafb;
        }
        
        .calendar-custom .rbc-show-more {
          color: #6b21a8;
          font-weight: 500;
          background-color: rgba(139, 92, 246, 0.1);
          border-radius: 4px;
          padding: 2px 4px;
        }
        
        .calendar-custom .rbc-date-cell {
          padding: 8px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .calendar-custom .rbc-event {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .calendar-custom .rbc-agenda-view table {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        
        .calendar-custom .rbc-agenda-view table thead {
          background-color: #8b5cf6;
          color: white;
        }
        
        .calendar-custom .rbc-agenda-view table th {
          padding: 12px;
          font-weight: 600;
        }
        
        .calendar-custom .rbc-agenda-time-cell {
          font-weight: 500;
        }
        
        .calendar-custom .rbc-agenda-date-cell,
        .calendar-custom .rbc-agenda-time-cell,
        .calendar-custom .rbc-agenda-event-cell {
          padding: 10px;
        }
        
        .calendar-custom .rbc-time-view {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        
        .calendar-custom .rbc-time-header {
          background-color: #f9fafb;
        }
        
        .calendar-custom .rbc-time-header-content {
          border-color: #e5e7eb;
        }
        
        .calendar-custom .rbc-time-header-cell {
          padding: 10px 0;
        }
        
        .calendar-custom .rbc-time-slot {
          font-size: 12px;
          color: #6b7280;
        }
        
        .calendar-custom .rbc-day-slot .rbc-event {
          border-radius: 6px;
        }
        
        .calendar-custom .rbc-current-time-indicator {
          background-color: #ef4444;
          height: 2px;
        }
      `}</style>
    </div>
  );
}