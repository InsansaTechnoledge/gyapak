import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchTodaysEvents } from '../../../Service/calendar';
// import { fetchTodaysEvents } from '../../Service/calendar'; 

const API_BASE_URL = 'http://localhost:8383';

const makeSlug = (title = '') =>
  title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');

const UpcommingEvent = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const navigate = useNavigate();

  const todayDate = new Date().toLocaleString('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  useEffect(() => {
    const fetchUpcommingEvents = async () => {
      try {
        const today = await fetchTodaysEvents(API_BASE_URL);
        console.log('today events', today);
        setUpcomingEvents(Array.isArray(today) ? today : []);
      } catch (err) {
        console.error('Error in fetchTodaysEvents:', err);
      }
    };

    fetchUpcommingEvents();
  }, []);

  return (
    <section className="up-comming-events mt-40 mb-10">
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            Upcoming Government<span className="text-purple-600"> Events</span>
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base pl-14">
          Starting from{' '}
          <span className="font-semibold text-purple-600">
            {todayDate}
          </span>
          {' • '}
          <span className="text-purple-600 font-semibold">
            {upcomingEvents.length} events
          </span>{' '}
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
                  `/top-exams-for-government-jobs-in-india/${makeSlug(
                    event.name
                  )}?id=${event._id}`
                );
              }}
              className="
                group
                bg-white 
                rounded-xl 
                shadow-sm 
                border 
                border-gray-100 
                p-5 
                cursor-pointer
                transition-all 
                hover:shadow-lg 
                hover:border-purple-200 
                hover:-translate-y-0.5
              "
            >
              <div className="flex items-start justify-between mb-3">
                <span className="
                  inline-flex 
                  items-center 
                  px-3 
                  py-1 
                  rounded-full 
                  text-xs 
                  font-medium 
                  bg-purple-50 
                  text-purple-700
                  transition
                  group-hover:bg-purple-600
                  group-hover:text-white
                ">
                  {event.event_type}
                </span>
                <ChevronRight
                  className="
                    w-5 h-5 
                    text-gray-300 
                    transition-all 
                    group-hover:text-purple-600 
                    group-hover:translate-x-1
                  "
                />
              </div>

              <h3
                className="
                  font-semibold 
                  text-gray-900 
                  mb-3 
                  text-sm 
                  md:text-base 
                  transition-colors 
                  group-hover:text-purple-700
                "
              >
                {event.name}
              </h3>

              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">
                  Starts
                </span>
                <span
                  className="
                    font-mono 
                    bg-purple-50 
                    px-3 
                    py-1 
                    rounded-md 
                    text-purple-700 
                    font-medium
                    transition
                    group-hover:bg-purple-100
                  "
                >
                  {event.date_of_commencement}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default UpcommingEvent;
