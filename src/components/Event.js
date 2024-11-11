export const eventSchema = {
    id: '',
    title: '',
    description: '',
    date: '',
    location: '',
    user: '',
    createdAt: '',
  };
  
  // support adding events
  export const createEvent = (id, title, description, date, location, user) => ({
    id,
    title,
    description,
    date,
    location,
    user,
    createdAt: new Date().toISOString(), // Automatically set createdAt to the current date
  });