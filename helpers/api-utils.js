export const getAllEvents = async () => {
  const response = await fetch(
    "https://nextjs-events-20725-default-rtdb.asia-southeast1.firebasedatabase.app/events.json"
  );
  const data = await response.json();
  const events = [];
  for (let key in data) {
    events.push({
      id: key,
      ...data[key]
    });
  }
  return events;
};
export const getFeaturedEvents = async () => {
  const featuredEvents = await getAllEvents();
  return featuredEvents.filter((event) => event.isFeatured);
};
export const getEventById = async (id) => {
  const allEvents = await getAllEvents();
  return allEvents.find((event) => event.id === id);
};
export const getFilteredEvents = async (dateFilter) => {
  const allEvents = await getAllEvents();
  const { year, month } = dateFilter;
  let filteredEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === year && eventDate.getMonth() === month - 1
    );
  });
  return filteredEvents;
};
export const fetcher = (...args) => fetch(...args).then((res) => res.json());
