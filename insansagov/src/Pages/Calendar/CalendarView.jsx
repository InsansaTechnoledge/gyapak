import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useCallback } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SquareArrowOutUpRight, X } from 'lucide-react'

const localizer = momentLocalizer(moment);

export default function CalendarView() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const {
    data: categories = [],
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await axios.get("http://localhost:8383/api/category/getCategories");
        return res.data.map(cat => ({
          _id: cat._id,
          name: cat.category,
        }));
      } catch (err) {
        console.error("Error fetching categories:", err);
        throw new Error("Failed to load categories");
      }
    },
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });


  const {
    data: states = [],
    isLoading: isStateLoading,
    error: stateError,
  } = useQuery({
    queryKey: ['navbarStates'],
    queryFn: async () => {
      try {
        const res = await axios.get("http://localhost:8383/api/state/list")
        console.log(res.data);
        console.log("States fetched successfully: 🥲");
        return res.data.map(state => ({
          _id: state.stateId,
          name: state.name,
        }))
      } catch (err) {
        console.error("Error fetching states:", err);
        throw new Error("Failed to load states");
      }
    },
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const month = currentMonth.month() + 1;
  const year = currentMonth.year();
  const [calendarEvents, setCalendarEvents] = useState([]);


  const fetchEventsByCategory = async (categoryId, stateId, month, year) => {

    console.log("Fetching events");
    if (!categoryId && !stateId) return [];
    const params = new URLSearchParams();
    if (categoryId) params.append('category', categoryId);
    if (stateId) params.append('state', stateId);
    console.log(params.toString());
    const queryString = params.toString();


    try {
      console.log(stateId);
      const res = await axios.get(`http://localhost:8383/api/event${queryString ? `?${queryString}` : ''}`);
      const organizations = res.data;
      console.log("Fetched Organizations with Events:", organizations);

      const groupedByDate = {};

      organizations.forEach(org => {
        const { name, abbreviation, logo, _id: orgId, events } = org;

        events.forEach(event => {
          const startDate = new Date(event.date_of_notification);
          const endDate = new Date(event.end_date);

          let current = new Date(startDate);
          while (current <= endDate) {
            const dateKey = current.toISOString().split('T')[0];

            // Init date block
            if (!groupedByDate[dateKey]) {
              groupedByDate[dateKey] = {};
            }

            // Init org block within that date
            if (!groupedByDate[dateKey][orgId]) {
              groupedByDate[dateKey][orgId] = {
                organization: {
                  orgId,
                  orgName: name,
                  abbreviation,
                  logo
                },
                events: []
              };
            }

            // Push the event
            groupedByDate[dateKey][orgId].events.push({
              slug: event._id,
              eventName: event.name,
              color: '#4F46E5',
            });

            current.setDate(current.getDate() + 1);
          }
        });
      });

      // Now flatten the grouped structure into an array
      const expandedEvents = [];

      Object.entries(groupedByDate).forEach(([dateKey, orgs]) => {
        Object.values(orgs).forEach(orgBlock => {
          expandedEvents.push({
            title: orgBlock.organization.orgName,
            start: new Date(dateKey),
            end: new Date(dateKey),
            allDay: true,
            resource: {
              dateKey,
              organization: orgBlock.organization,
              events: orgBlock.events
            }
          });
        });
      });
      console.log("Expanded Events:", expandedEvents);
      const sortedEvents = expandedEvents.sort((a, b) => a.start - b.start);
      return sortedEvents;

    } catch (err) {
      console.error("Error fetching events:", err);
      throw new Error("Failed to load events");
    }
  };


  const {
    data: events,

    isLoading,
    error: eventError,
  } = useQuery({
    queryKey: ['events', selectedCategory?._id, selectedState?._id, month, year],
    queryFn: () => fetchEventsByCategory(selectedCategory?._id, selectedState?._id, month, year),
    enabled: !!selectedCategory?._id || !!selectedState?._id,
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000, // Cache for 1 day
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
  useEffect(() => {
    if (events) {
      setCalendarEvents(events)
    };
  }, [events])


  const handleNavigate = useCallback((newDate) => {
    setCurrentMonth(moment(newDate));
  }, []);

  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentOrganizationSlug, setCurrentOrganizationSlug] = useState(null);

  const EventComponent = ({ event }) => {
    // const handleClick = () => {
    //   if (event?.resource?.slug) {
    //     navigate(`/opportunity?id=${encodeURIComponent(event.resource.slug)}`);
    //   }
    // };

    const handleClick = () => {
      if (event?.start) {
        console.log("Event clicked:", event);
        const selectedMoment = moment(event.start);
        setSelectedDate(selectedMoment);
        setShowEventModal(true);
        setCurrentOrganizationSlug(event.resource.organization.orgId); // or event.resource.organizationSlug if different

      }
    };

    return (
      <div className='relative'>
        <div

          onClick={handleClick}
          // className="cursor-pointer px-0 py-0 mt-0 w-fit rounded text-white text-xs truncate flex items-center justify-center"
          className="cursor-pointer flex items-center space-x-3 w-fit h-fit"
          // style={{ backgroundColor:'#ffffff' }}

          title={event.title}
        >

          <img src={`data:image/png;base64,${event.resource.organization.logo}`} className="w-6 h-6 rounded bg-slate-200" />
          <span className="font-semibold text-black">{event.title}</span>
        </div>
        {/* {showEventModal && selectedDate && (
            <div className="absolute top-2 bg-white shadow-lg rounded-xl p-6 w-96 z-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Events on {selectedDate.format("MMMM D, YYYY")}
                </h2>
                <button onClick={() => setShowEventModal(false)} className="text-gray-500 hover:text-black">
                  ✖
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {events
                  .filter(ev => moment(ev.start).isSame(selectedDate, 'day') && ev.resource.orgId === currentOrganizationSlug)
                  .map(ev => (
                    <>
                    <button 
                    onClick={() => navigate(`/opportunity?id=${encodeURIComponent(ev.resource.slug)}`)}
                    
                    className='flex hover:bg-gray-100 p-2 cursor-pointer rounded-lg'>
                        <div
                          key={ev.resource.slug}
                          className=""
                        >
                          {ev.resource.eventName} 
                        </div>
                        <SquareArrowOutUpRight className='my-auto w-10 h-10' />
                    </button>
                      
                    </>
                  ))}
              </div>
            </div>
          )} */}
      </div>
    );
  };

  const handleSelectSlot = useCallback((slotInfo) => {
    console.log("Selected slot:", slotInfo);
    // const startDate = moment(slotInfo.start).format('YYYY-MM-DD');
    // const endDate = moment(slotInfo.end).format('YYYY-MM-DD');
    // const selectedEvents = calendarEvents.filter(event => {
    //   const eventDate = moment(event.start).format('YYYY-MM-DD');
    //   return eventDate === startDate;
    // });

    // if (selectedEvents.length > 0) {
    //   navigate(`/opportunity?id=${encodeURIComponent(selectedEvents[0].resource.slug)}`);
    // }
  }, [calendarEvents, navigate]);

  return (
    <div className="p-4 pt-28">
      <div className="mb-4">
        <label className="font-medium mr-2">Select Category:</label>
        {isCategoryLoading ? (
          <span>Loading categories...</span>
        ) : categoryError ? (
          <span className="text-red-500">Failed to load categories</span>
        ) : (
          <select
            value={selectedCategory?._id || ""}
            onChange={(e) => {
              const selected = categories.find(c => c._id === e.target.value);
              setSelectedCategory(selected);
            }}
          >

            <option value="">-- Select --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mb-4">
        <label className="font-medium mr-2">Select States:</label>
        {isStateLoading ? (
          <span>Loading States...</span>
        ) : stateError ? (
          <span className="text-red-500">Failed to load states</span>
        ) : (
          <select
            value={selectedState?._id || ""}
            onChange={(e) => {
              const selected = states.find(s => s._id === e.target.value);
              setSelectedState(selected);
            }}
          >
            <option value="">-- Select --</option>
            {states.map((state) => (

              <option key={state._id} value={state._id}>


                {state.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {eventError ? (
        <div className="text-center py-10 text-red-500">Failed to load events</div>
      ) : (!selectedCategory && !selectedState) ? (
        <div className="text-center py-10 text-gray-500">Please select a category or state</div>
      ) : isLoading ? (
        <div className="text-center py-10">Loading events...</div>
      ) : (

        <div className="p-4 pt-28 min-h-screen">

          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            views={['month', 'week', 'day', 'agenda']}
            defaultDate={currentMonth.toDate()}
            onNavigate={handleNavigate}
            popup={true}
            components={{ event: EventComponent }}
            selectable={true}
            onSelectSlot={handleSelectSlot}
            style={{ minHeight: '90vh' }}
          />

          {showEventModal && selectedDate && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-xl p-6 w-96 z-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Events on {selectedDate.format("MMMM D, YYYY")}
                </h2>
                <button onClick={() => setShowEventModal(false)} className="text-purple-700 hover:text-purple-800">
                  <X className='font-extrabold' />
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {events
                  .filter(ev => moment(ev.start).isSame(selectedDate, 'day') && ev.resource.organization.orgId === currentOrganizationSlug)
                  .map(ev => (
                    <>

                      <div className="font-medium text-sm text-gray-600 mb-1">
                        {ev.resource.organization.orgName}
                      </div>
                      {/* <button 
                    onClick={() => navigate(`/opportunity?id=${encodeURIComponent(ev.resource.event.slug)}`)}
                    
                    className='flex justify-between w-full hover:bg-gray-100 p-2 cursor-pointer rounded-lg'>
                        <div
                          key={ev.resource.slug}
                          className="text-left flex-grow"
                        >
                          {ev.resource.eventName} 
                        </div>
                        <SquareArrowOutUpRight className='my-auto flex-shrink-0 w-5 h-5 flex' />
                    </button> */}
                      <div className="space-y-1">
                        {ev.resource.events.map((event, idx) => (
                          <button
                            key={event.slug}
                            onClick={() => navigate(`/opportunity?id=${encodeURIComponent(event.slug)}`)}
                            className="flex justify-between w-full hover:bg-gray-100 p-2 cursor-pointer rounded-lg"
                          >
                            <div className="text-left flex-grow">
                              {event.eventName}
                            </div>
                            <SquareArrowOutUpRight className="my-auto flex-shrink-0 w-5 h-5 text-gray-500 hover:text-black" />
                          </button>
                        ))}
                      </div>
                    </>
                  ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
