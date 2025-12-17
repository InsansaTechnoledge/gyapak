import React, { useEffect, useState } from 'react';
import { 
  fetchCategories, 
  fetchEventsForCalendar, 
  fetchEventTypes, 
  fetchStates, 
  fetchTodaysEvents,
  fetchEventsByMonth
} from '../../Service/calendar';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8383';

// const API_BASE_URL = "https://backend.gyapak.in";

const makeSlug = (title = "") =>
  title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');

// ---- helpers for date formatting (Testbook-style) ----
const toDate = (value) => {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
};

const formatDateShort = (date) => {
  if (!date || isNaN(date.getTime())) return '';
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const getDateLabel = (event, showFullRange) => {
  const start = toDate(event.date_of_commencement);
  const rawEnd = event.end_date;

  if (!start) return '';

  const end = rawEnd ? toDate(rawEnd) : null;

  if (!showFullRange || !end || isNaN(end.getTime())) {
    return formatDateShort(start);
  }

  if (start.toDateString() === end.toDateString()) {
    return formatDateShort(start);
  }

  const sDay = start.getDate();
  const sMonth = start.toLocaleString('en-IN', { month: 'short' });
  const sYear = start.getFullYear();

  const eDay = end.getDate();
  const eMonth = end.toLocaleString('en-IN', { month: 'short' });
  const eYear = end.getFullYear();

  if (sMonth === eMonth && sYear === eYear) {
    return `${sDay}–${eDay} ${sMonth} ${sYear}`;
  }

  if (sYear === eYear) {
    return `${sDay} ${sMonth} – ${eDay} ${eMonth} ${sYear}`;
  }

  return `${sDay} ${sMonth} ${sYear} – ${eDay} ${eMonth} ${eYear}`;
};

const PAGE_SIZE = 10;

const NewCalendarPage = () => {
  const [categoryId] = useState(null);
  const [stateId] = useState("679a54136a69bc880eb1eea3");
  const [eventType] = useState(null);

  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [showFullRange, setShowFullRange] = useState(false);

  const initMonthsState = () => {
    const state = {};
    for (let m = 1; m <= 12; m++) {
      state[m] = {
        open: false,
        loading: false,
        events: [],
        page: 1,
      };
    }
    return state;
  };

  const [monthsState, setMonthsState] = useState(initMonthsState);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const categories = await fetchCategories(API_BASE_URL);
        console.log("categories", categories);
      } catch (err) {
        console.error("Error in fetchCategories:", err);
      }

      try {
        const states = await fetchStates(API_BASE_URL);
        console.log("states", states);
      } catch (err) {
        console.error("Error in fetchStates:", err);
      }

      try {
        const eventType1 = await fetchEventTypes(API_BASE_URL);
        console.log("event types", eventType1);
      } catch (err) {
        console.error("Error in fetchEventTypes:", err);
      }

      try {
        const events = await fetchEventsForCalendar(
          API_BASE_URL,
          categoryId,
          stateId,
          eventType
        );
        console.log("calendar events", events);
      } catch (err) {
        console.error("Error in fetchEventsForCalendar:", err);
      }

      try {
        const today = await fetchTodaysEvents(API_BASE_URL);
        console.log("today events", today);
        setUpcomingEvents(Array.isArray(today) ? today : []);
      } catch (err) {
        console.error("Error in fetchTodaysEvents:", err);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    setMonthsState(initMonthsState());
  }, [selectedYear]);

  useEffect(() => {
    const firstMonth = 12;
  
    const openAndLoadFirstMonth = async () => {
      try {
        setMonthsState(prev => ({
          ...prev,
          [firstMonth]: {
            ...prev[firstMonth],
            open: true,
            loading: true,
          },
        }));
  
        const data = await fetchEventsByMonth(API_BASE_URL, selectedYear, firstMonth);
        const events = Array.isArray(data) ? data : [];
  
        setMonthsState(prev => ({
          ...prev,
          [firstMonth]: {
            ...prev[firstMonth],
            loading: false,
            events,
            page: 1,
          },
        }));
      } catch (err) {
        console.error('Error loading default month:', err);
        setMonthsState(prev => ({
          ...prev,
          [firstMonth]: {
            ...prev[firstMonth],
            loading: false,
          },
        }));
      }
    };
  
    openAndLoadFirstMonth();
  }, [selectedYear]);
  

  const todayDate = new Date().toLocaleString('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const currentYear = now.getFullYear();
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1];
  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const handleToggleMonth = async (month) => {
    setMonthsState(prev => {
      const current = prev[month];
      const nextOpen = !current.open;
      return {
        ...prev,
        [month]: {
          ...current,
          open: nextOpen,
        },
      };
    });

    const monthState = monthsState[month];
    if (!monthState.open && monthState.events.length === 0) {
      try {
        setMonthsState(prev => ({
          ...prev,
          [month]: { ...prev[month], loading: true }
        }));

        const data = await fetchEventsByMonth(API_BASE_URL, selectedYear, month);
        const events = Array.isArray(data) ? data : [];

        setMonthsState(prev => ({
          ...prev,
          [month]: {
            ...prev[month],
            loading: false,
            events,
            page: 1,
          },
        }));
      } catch (err) {
        console.error(`Error loading events for month ${month}:`, err);
        setMonthsState(prev => ({
          ...prev,
          [month]: { ...prev[month], loading: false }
        }));
      }
    }
  };

  const handlePageChange = (month, direction) => {
    setMonthsState(prev => {
      const state = prev[month];
      const totalPages = Math.max(1, Math.ceil(state.events.length / PAGE_SIZE));
      let newPage = state.page;

      if (direction === 'prev') {
        newPage = Math.max(1, state.page - 1);
      } else if (direction === 'next') {
        newPage = Math.min(totalPages, state.page + 1);
      }

      return {
        ...prev,
        [month]: {
          ...state,
          page: newPage,
        },
      };
    });
  };

  const getPagedEvents = (month) => {
    const { events, page } = monthsState[month];
    const startIndex = (page - 1) * PAGE_SIZE;
    return events.slice(startIndex, startIndex + PAGE_SIZE);
  };

  const getTotalPages = (month) => {
    const { events } = monthsState[month];
    return Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  };

  const reversedMonthOptions = [...monthOptions].reverse();


  return (
    <main className="min-h-screen">
      <div className="mt-40 px-4 md:px-8 mx-auto space-y-12 pb-16">
      <section
        aria-label={`Upcoming Government Exams Calendar ${currentYear}`}
        className="mt-32 mb-8"
        >
        <header className="relative overflow-hidden rounded-3xl px-6 py-8  ">

            <div className="relative space-y-4 ">
            <p className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.18em] text-purple-600">
                <span className="h-1 w-6 rounded-full bg-purple-600" />
                Updated for {currentYear}
            </p>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                Upcoming Government Exams Calendar{" "}
                <span className="text-purple-600">{currentYear}</span>
            </h1>

            <p className="text-sm md:text-base text-purple-600/90 leading-relaxed">
                Stay on top of all <strong>government job exams in India</strong> with a
                single, organized calendar. Track{" "}
                <strong>important exam dates, application deadlines, admit card
                releases, and result updates</strong> for{" "}
                SSC, UPSC, Banking, Railway, Defence, Police, Teaching, and{" "}
                <strong>state–level competitive exams</strong>.
            </p>

            <p className="text-xs md:text-sm text-purple-600/90">
                This calendar is designed for serious aspirants preparing for{" "}
                <strong>Sarkari exams</strong> who don’t want to miss any crucial{" "}
                notification, last date to apply, or exam schedule change.
            </p>

           
            </div>
            <button onClick={() => navigate('/upcomming-government-events')} className='flex mt-4 gap-2 bg-purple-700 text-white px-3 py-2 rounded-md group'>
                Show Upcomming Events
                <ArrowRight className='group-hover:translate-x-1'/>
            </button>
        </header>
      </section>


        {/* Year + global view controls */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2">
             
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Yearly Government Calendar
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Start-only vs range */}
              <div className="inline-flex items-center bg-purple-50 rounded-full p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setShowFullRange(false)}
                  className={`px-3 py-1 rounded-full ${
                    !showFullRange
                      ? 'bg-white text-purple-700 font-semibold shadow-sm'
                      : 'text-purple-500'
                  }`}
                >
                  Start date only
                </button>
                <button
                  type="button"
                  onClick={() => setShowFullRange(true)}
                  className={`px-3 py-1 rounded-full ${
                    showFullRange
                      ? 'bg-white text-purple-700 font-semibold shadow-sm'
                      : 'text-purple-500'
                  }`}
                >
                  Start–End
                </button>
              </div>

              {/* Year selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Year
                </span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* All months lined up */}
          <div className="space-y-4">
            {reversedMonthOptions.map((month) => {
              const monthNum = month.value;
              const state = monthsState[monthNum];
              const monthLabel = new Date(selectedYear, monthNum - 1, 1).toLocaleString(
                'en-IN',
                { month: 'long', year: 'numeric' }
              );
              const totalPages = getTotalPages(monthNum);
              const pagedEvents = getPagedEvents(monthNum);

              return (
                <div
                  key={monthNum}
                  className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
                >
                  {/* Month header (collapsible) - UPDATED UI */}
                  <button
                    type="button"
                    onClick={() => handleToggleMonth(monthNum)}
                    className="relative w-full flex items-center justify-between px-5 py-4 md:px-6 md:py-5 bg-white hover:bg-purple-50 transition-colors"
                  >
                    {/* Curvy purple left border */}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-purple-600 via-purple-500 to-purple-400 rounded-tr-full rounded-br-full"
                    />

                    <div className="pl-4 text-left">
                      <p className="text-lg md:text-xl font-semibold text-gray-900">
                        {monthLabel}
                      </p>
                      <p className="text-[11px] md:text-xs text-gray-500 mt-1">
                        {state.events.length} exam{state.events.length !== 1 && 's'} fetched in this month
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600 pr-1">
                      <span className="text-xs md:text-sm">
                        {state.open ? 'Hide events' : 'View events'}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          state.open ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Month body */}
                  {state.open && (
                    <div className="divide-y divide-gray-100">
                      {state.loading ? (
                        <p className="p-6 text-center text-gray-500">
                          Loading events...
                        </p>
                      ) : state.events.length === 0 ? (
                        <p className="p-6 text-center text-gray-500">
                          No events found for this month.
                        </p>
                      ) : (
                        <>
                          {pagedEvents.map((event) => {
                            const dateLabel = getDateLabel(event, showFullRange);

                            return (
                              <div
                                key={event._id}
                                onClick={() => {
                                  navigate(
                                    `/top-exams-for-government-jobs-in-india/${makeSlug(event.name)}?id=${event._id}`
                                  );
                                }}
                                className="flex items-center justify-between gap-3 px-5 py-4 md:px-6 md:py-4 hover:bg-purple-50 cursor-pointer transition-colors group"
                              >
                                <div className="flex items-center gap-3 w-full">
                                  {/* Date pill */}
                                  <div className="shrink-0">
                                    <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-purple-100 text-purple-700 text-xs md:text-sm font-semibold whitespace-nowrap">
                                      {dateLabel}
                                    </span>
                                  </div>

                                  {/* Title + tag + CTA */}
                                  <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                                          {event.name}
                                        </span>
                                        <span
                                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${
                                            event.event_type === 'Exam'
                                              ? 'bg-purple-100 text-purple-700'
                                              : 'bg-blue-100 text-blue-700'
                                          }`}
                                        >
                                          {event.event_type || 'Exam'}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-[11px] md:text-xs text-purple-600 font-medium shrink-0">
                                      <span>View details</span>
                                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* Pagination controls per month */}
                          {totalPages > 1 && (
                            <div className="flex items-center justify-between px-5 py-3 md:px-6 bg-gray-50 text-xs md:text-sm text-gray-600">
                              <span>
                                Page {state.page} of {totalPages}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handlePageChange(monthNum, 'prev')}
                                  disabled={state.page === 1}
                                  className={`px-3 py-1.5 rounded-md border text-xs md:text-sm ${
                                    state.page === 1
                                      ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-white'
                                      : 'border-gray-300 text-gray-700 hover:bg-white'
                                  }`}
                                >
                                  Previous
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePageChange(monthNum, 'next')}
                                  disabled={state.page === totalPages}
                                  className={`px-3 py-1.5 rounded-md border text-xs md:text-sm ${
                                    state.page === totalPages
                                      ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-white'
                                      : 'border-gray-300 text-gray-700 hover:bg-white'
                                  }`}
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Upcoming events */}
        {/* <section className="up-comming-events">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                Upcoming Government<span className="text-purple-600"> Events</span>
              </h1>
            </div>
            <p className="text-gray-600 text-sm md:text-base pl-14">
              Starting from{" "}
              <span className="font-semibold text-purple-600">
                {todayDate}
              </span>
              {" • "}
              <span className="text-purple-600 font-semibold">
                {upcomingEvents.length} events
              </span>{" "}
              scheduled
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500">No upcoming events found.</p>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  onClick={() => {
                    navigate(
                      `/top-exams-for-government-jobs-in-india/${makeSlug(event.name)}?id=${event._id}`
                    );
                  }}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:border-purple-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {event.event_type}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors text-sm md:text-base">
                    {event.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                    <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">
                      Starts
                    </span>
                    <span className="font-mono bg-purple-50 px-3 py-1 rounded-md text-purple-700 font-medium">
                      {event.date_of_commencement}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section> */}
        
        {/* <UpcommingEvent/> */}
      </div>
    </main>
  );
};

export default NewCalendarPage;
