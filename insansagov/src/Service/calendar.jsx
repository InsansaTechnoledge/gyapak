import axios from 'axios';

export const fetchCategories = async (apiBaseUrl) => {
  const res = await axios.get(`${apiBaseUrl}/api/category/getCategories`);
  return res.data.map(cat => ({ _id: cat._id, name: cat.category }));
};

export const fetchStates = async (apiBaseUrl) => {
  const res = await axios.get(`${apiBaseUrl}/api/state/list`);
  return res.data.map(state => ({ _id: state.stateId, name: state.name }));
};

export const fetchEventTypes = async (apiBaseUrl) => {
  const res = await axios.get(`${apiBaseUrl}/api/event/getEventTypes`);
  return res.data.map(type => ({ _id: type._id, type: type.type }));
};

export const fetchEventsForCalendar = async (apiBaseUrl, categoryId, stateId, eventType, month, year) => {
  if (!categoryId && !stateId) return [];

  const params = new URLSearchParams();
  if (categoryId) params.append('category', categoryId);
  if (stateId) params.append('state', stateId);
  const queryString = params.toString();

  const res = await axios.get(`${apiBaseUrl}/api/event${queryString ? `?${queryString}` : ''}`);
  const organizations = res.data;
  const groupedByDate = {};

  organizations.forEach(org => {
    const { name, abbreviation, logo, _id: orgId, events } = org;
    const filteredEvents = eventType
      ? events.filter(event => {
        return event.event_type === eventType;
      })
      : events;

    filteredEvents.forEach(event => {
      const startDate = new Date(event.date_of_notification);
      const endDate = new Date(event.end_date);
      let current = new Date(startDate);
      while (current <= endDate) {
        const dateKey = current.toISOString().split('T')[0];
        if (!groupedByDate[dateKey]) groupedByDate[dateKey] = {};
        if (!groupedByDate[dateKey][orgId]) {
          groupedByDate[dateKey][orgId] = {
            organization: { orgId, orgName: name, abbreviation, logo },
            events: []
          };
        }
        groupedByDate[dateKey][orgId].events.push({ slug: event._id, eventName: event.name, color: '#4F46E5' });
        current.setDate(current.getDate() + 1);
      }
    });
  });

  const expandedEvents = [];
  Object.entries(groupedByDate).forEach(([dateKey, orgs]) => {
    Object.values(orgs).forEach(orgBlock => {
      expandedEvents.push({
        title: orgBlock.organization.orgName,
        start: new Date(dateKey),
        end: new Date(dateKey),
        allDay: true,
        resource: { dateKey, organization: orgBlock.organization, events: orgBlock.events }
      });
    });
  });

  return expandedEvents.sort((a, b) => a.start - b.start);
};

export const fetchTodaysEvents = async (apiBaseUrl) => {
  const res = await axios.get(`${apiBaseUrl}/api/event/getTodaysEvents`);
  console.log('Fetched today\'s events:', res.data);
  return res.data;
};