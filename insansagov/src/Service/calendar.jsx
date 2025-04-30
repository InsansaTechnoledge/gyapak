import { fetchEventsByCategory } from "../Pages/Calendar/fetchers";


export const fetchTodaysEvents = async (apiBaseUrl, categoryId = null, stateId = null) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const allEvents = await fetchEventsByCategory(apiBaseUrl, categoryId, stateId);

  console.log('🗓️ Today is:', today.toISOString().split('T')[0]);
  console.log('📦 All Events:', allEvents.map(e => ({
    title: e.title,
    start: e.start.toISOString().split('T')[0]
  })));

  const todaysEvents = allEvents.filter(event => {
    const eventDate = new Date(event.start);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });

  console.log('✅ Filtered Today\'s Events:', todaysEvents);
  return todaysEvents;
};
