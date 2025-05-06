import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Filter, 
  Calendar as CalendarIcon, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  List,
  Grid,
  X,
  Plus
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileView, setMobileView] = useState('calendar'); // 'list' or 'calendar'
  const filterRef = useRef(null);

  const month = currentMonth.month() + 1;
  const year = currentMonth.year();

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setView('month');
        setMobileView('calendar');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterRef]);

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
    queryKey: ['events', selectedCategory?._id, selectedState?._id, selectedEventType?._id, month, year],
    queryFn: () => fetchEventsForCalendar(apiBaseUrl, selectedCategory?._id, selectedState?._id, selectedEventType?.type, month, year),
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

  // Mobile event list component
  const MobileEventList = () => {
    if (!events || events.length === 0) {
      return (
        <div className="text-center py-10">
          <CalendarIcon size={40} className="mx-auto text-purple-300 mb-4" />
          <p className="text-gray-500">No events found for the selected filters</p>
        </div>
      );
    }

    // Group events by date
    const groupedEvents = events.reduce((acc, event) => {
      const dateKey = moment(event.start).format('YYYY-MM-DD');
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(groupedEvents).sort();

    return (
      <div className="space-y-4">
        {sortedDates.map(dateKey => (
          <div key={dateKey} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-purple-100 px-4 py-3">
              <h3 className="font-medium text-purple-800">
                {moment(dateKey).format('dddd, MMMM D, YYYY')}
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {groupedEvents[dateKey].map((event, idx) => (
                <div 
                  key={`${event._id}-${idx}`}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedDate(event);
                    setShowEventModal(true);
                    setCurrentOrganizationSlug(event.organizationSlug);
                  }}
                >
                  <div className="flex items-start">
                    <div 
                      className="w-3 h-3 mt-1.5 rounded-full mr-3 flex-shrink-0" 
                      style={{ backgroundColor: event.category?.color || '#8b5cf6' }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
                      </p>
                      {event.location && (
                        <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderToolbar = (toolbar) => {
    const goToBack = () => toolbar.onNavigate('PREV');
    const goToNext = () => toolbar.onNavigate('NEXT');
    const goToToday = () => toolbar.onNavigate('TODAY');

    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span className="text-lg font-semibold text-purple-900">
          {date.format('MMMM YYYY')}
        </span>
      );
    };

    // Desktop toolbar
    if (!isMobile) {
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
    }
    
    // Mobile toolbar
    return (
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          {label()}
          <div className="flex items-center space-x-1">
            <button
              onClick={goToBack}
              className="p-2 rounded-full hover:bg-purple-100 text-purple-700 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goToToday}
              className="p-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              aria-label="Today"
            >
              <CalendarIcon size={16} />
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-full hover:bg-purple-100 text-purple-700 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        {/* Mobile view toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setMobileView('list')}
            className={`flex-1 flex justify-center items-center py-2 rounded ${
              mobileView === 'list' ? 'bg-white shadow text-purple-700' : 'text-gray-600'
            }`}
          >
            <List size={16} className="mr-1" />
            <span className="text-sm font-medium">List</span>
          </button>
          <button
            onClick={() => setMobileView('calendar')}
            className={`flex-1 flex justify-center items-center py-2 rounded ${
              mobileView === 'calendar' ? 'bg-white shadow text-purple-700' : 'text-gray-600'
            }`}
          >
            <Grid size={16} className="mr-1" />
            <span className="text-sm font-medium">Calendar</span>
          </button>
        </div>
      </div>
    );
  };

  // Mobile filter drawer
  const MobileFilterDrawer = () => {
    return (
      <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex items-end justify-center">
        <div className="bg-white rounded-t-xl w-full max-h-[80vh] overflow-y-auto animate-slide-up">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-purple-900">Filters</h3>
            <button 
              onClick={() => setShowMobileMenu(false)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4 space-y-6">
            {/* Category filter */}
            <div>
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
            
            {/* State filter */}
            <div>
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
            
            {/* Event Type filter */}
            <div>
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
                  <option value="">All Events</option>
                  {eventTypes.map(e => <option key={e._id} value={e._id}>{e.type}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
              </div>
            </div>
            
            {/* Apply button */}
            <button 
              onClick={() => setShowMobileMenu(false)}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 md:px-6">
      {/* Hero Section */}
      <GovernmentCalendarIntro />

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto">
        {/* Mobile Fixed Filter Button */}
        {isMobile && (
          <div className="fixed bottom-6 right-6 z-40">
            <button 
              onClick={() => setShowMobileMenu(true)}
              className="w-14 h-14 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center hover:bg-purple-700 transition-colors"
              aria-label="Open filters"
            >
              <Filter size={24} />
            </button>
          </div>
        )}

        {/* Filters Section - Desktop */}
        {!isMobile && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8" ref={filterRef}>
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
                <div className="mb-4 md:mb-0 md:w-1/3">
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
                
                <div className="mb-4 md:mb-0 md:w-1/3">
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

                <div className="md:w-1/3">
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
                      <option value="">All Events</option>
                      {eventTypes.map(e => <option key={e._id} value={e._id}>{e.type}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {(selectedCategory || selectedState || selectedEventType) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedCategory && (
                  <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm">
                    <span>Category: {selectedCategory.name}</span>
                    <button 
                      onClick={() => setSelectedCategory(null)} 
                      className="text-purple-600 hover:text-purple-800"
                      aria-label={`Remove ${selectedCategory.name} category filter`}
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
                      aria-label={`Remove ${selectedState.name} state filter`}
                    >
                      ×
                    </button>
                  </div>
                )}
                {selectedEventType && (
                  <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm">
                    <span>Event Type: {selectedEventType.type}</span>
                    <button 
                      onClick={() => setSelectedEventType(null)} 
                      className="text-purple-600 hover:text-purple-800"
                      aria-label={`Remove ${selectedEventType.type} event type filter`}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 overflow-hidden">
          {eventError ? (
            <div className="text-center py-16 md:py-20">
              <div className="text-red-500 text-lg mb-4">Failed to load events</div>
              <button 
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center mx-auto gap-2 shadow-md transition-all hover:shadow-lg"
                onClick={() => refetch()}
              >
                <RefreshCw size={18} />
                Try Again
              </button>
            </div>
          ) : (!selectedCategory && !selectedState && !selectedEventType) ? (
            <div className="text-center py-16 md:py-20">
              <div className="text-gray-500 text-lg mb-4">Please select a category, state, or event type to view events</div>
              {isMobile ? (
                <button 
                  onClick={() => setShowMobileMenu(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center mx-auto gap-2 shadow-md transition-all hover:shadow-lg"
                >
                  <Filter size={18} />
                  Show Filters
                </button>
              ) : (
                <button 
                  onClick={() => setShowFilters(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center mx-auto gap-2 shadow-md transition-all hover:shadow-lg"
                >
                  <Filter size={18} />
                  Show Filters
                </button>
              )}
            </div>
          ) : isLoading ? (
            <div className="text-center py-16 md:py-20">
              <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
              <div className="text-purple-700 text-lg">Loading events...</div>
            </div>
          ) : (
            <>
              {/* Mobile Calendar View Toggle */}
              {isMobile ? (
                <>
                <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
      <button
        onClick={() => setMobileView('list')}
        className={`flex-1 flex justify-center items-center py-2 rounded ${
          mobileView === 'list' ? 'bg-white shadow text-purple-700' : 'text-gray-600'
        }`}
      >
        <List size={16} className="mr-1" />
        <span className="text-sm font-medium">List</span>
      </button>
      <button
        onClick={() => setMobileView('calendar')}
        className={`flex-1 flex justify-center items-center py-2 rounded ${
          mobileView === 'calendar' ? 'bg-white shadow text-purple-700' : 'text-gray-600'
        }`}
      >
        <Grid size={16} className="mr-1" />
        <span className="text-sm font-medium">Calendar</span>
      </button>
    </div>
                  {mobileView === 'list' ? (
                    <div className="calendar-mobile-list">
                      <MobileEventList />
                    </div>
                  ) : (
                    <div className="calendar-container h-[500px]">
                      <Calendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        view="month"
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
                        eventPropGetter={eventStyleGetter}
                        className="rounded-lg overflow-hidden calendar-custom"
                      />
                    </div>
                  )}
                </>
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
            </>
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

      {/* Mobile Filter Menu */}
      {showMobileMenu && <MobileFilterDrawer />}

      {/* Custom CSS for calendar and mobile animations */}
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
        
        /* Mobile specific styles */
        @media (max-width: 767px) {
          .calendar-custom .rbc-btn-group {
            white-space: nowrap;
            display: flex;
            overflow-x: auto;
            scrollbar-width: none;
          }
          
          .calendar-custom .rbc-btn-group::-webkit-scrollbar {
            display: none;
          }
          
          .calendar-custom .rbc-header {
            padding: 8px 0;
            font-size: 12px;
          }
          
          .calendar-custom .rbc-date-cell {
            padding: 2px;
            font-size: 12px;
          }
          
          .calendar-custom .rbc-event {
            font-size: 10px;
            padding: 2px 4px;
          }
          
          .calendar-custom .rbc-show-more {
            font-size: 10px;
          }
        }
        
        /* Mobile menu animations */
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        
        /* Mobile list view enhancements */
        .calendar-mobile-list {
          max-height: 70vh;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #8b5cf6 #f3f4f6;
        }
        
        .calendar-mobile-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .calendar-mobile-list::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        
        .calendar-mobile-list::-webkit-scrollbar-thumb {
          background-color: #8b5cf6;
          border-radius: 10px;
        }
        
        /* Better touch input handling for mobile */
        @media (max-width: 767px) {
          .rbc-calendar {
            touch-action: pan-y;
            -webkit-overflow-scrolling: touch;
          }
          
          .rbc-month-view, .rbc-time-view {
            user-select: none;
          }
          
          .rbc-event {
            touch-action: manipulation;
          }
        `}</style>
    </div>
  )
}