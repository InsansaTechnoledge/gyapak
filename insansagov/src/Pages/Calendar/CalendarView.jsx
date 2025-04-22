import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

export default function CalendarView() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const month = currentMonth.month() + 1;
  const year = currentMonth.year();
  const categoryId = selectedCategory?._id;

  const {
    data: events = [],
    isLoading,
    error: eventError,
  } = useQuery({
    queryKey: ['events', categoryId, month, year],
    queryFn: async () => {
      if (!categoryId) return [];

      try {
        const res = await axios.get(`http://localhost:8383/api/event?category=${categoryId}`);
        const data = res.data;

        // Generate single-day events
        const expandedEvents = [];

        data.forEach(exam => {
          const startDate = new Date(exam.date_of_notification);
          const endDate = new Date(exam.end_date);

          // Iterate from start to end date
          let current = new Date(startDate);
          while (current <= endDate) {
            expandedEvents.push({
              title: exam.name,
              start: new Date(current),
              end: new Date(current),
              allDay: true,
              resource: {
                color: exam.color || '#4F46E5',
                slug: exam._id,
              },
            });
            current.setDate(current.getDate() + 1); // move to next day
          }
        });

        return expandedEvents;
      } catch (err) {
        console.error("Error fetching events:", err);
        throw new Error("Failed to load events");
      }
    },
    enabled: !!categoryId,
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleNavigate = useCallback((newDate) => {
    setCurrentMonth(moment(newDate));
  }, []);

  const calendarEvents = useMemo(() => {
    return (events || []).map(event => ({ ...event }));
  }, [events]);

  const EventComponent = ({ event }) => {
    const handleClick = () => {
      if (event?.resource?.slug) {
        navigate(`/opportunity?id=${encodeURIComponent(event.resource.slug)}`);
      }
    };

    return (
      <div
        onClick={handleClick}
        className="cursor-pointer px-2 py-1 mt-1 rounded text-white text-xs truncate"
        style={{ backgroundColor: event?.resource?.color || '#4F46E5' }}
        title={event.title}
      >
        {event.title}
      </div>
    );
  };

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

      {eventError ? (
        <div className="text-center py-10 text-red-500">Failed to load events</div>
      ) : !selectedCategory ? (
        <div className="text-center py-10 text-gray-500">Please select a category</div>
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
  popup={true} // <- this is what enables the "+x more" popup
  components={{ event: EventComponent }}
  style={{ minHeight: '90vh' }} // or remove it entirely
/>

</div>

      )}
    </div>
  );
}
