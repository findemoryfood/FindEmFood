import React, { createContext, useState, useEffect } from 'react';

export const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  // Sample event data
  const sampleEvents = [
    {
      id: '1',
      title: 'Sample Event 1',
      description: 'Description for Sample Event 1',
      date: '2024-11-10T18:00:00Z',
      location: 'Location 1',
      user: 'User 1',
    },
    {
      id: '2',
      title: 'Sample Event 2',
      description: 'Description for Sample Event 2',
      date: '2024-11-12T18:00:00Z',
      location: 'Location 2',
      user: 'User 2',
    },
    {
      id: '3',
      title: 'Sample Event 3',
      description: 'Description for Sample Event 3',
      date: '2024-11-12T18:00:00Z',
      location: 'Location 3',
      user: 'User 3',
    },
    {
      id: '4',
      title: 'Sample Event 4',
      description: 'Description for Sample Event 4',
      date: '2024-11-12T18:00:00Z',
      location: 'Location 4',
      user: 'User 4',
    },
    {
      id: '5',
      title: 'Sample Event 5',
      description: 'Description for Sample Event 5',
      date: '2024-11-12T18:00:00Z',
      location: 'Location 5',
      user: 'User 5',
    },
    {
      id: '6',
      title: 'Sample Event 6',
      description: 'Description for Sample Event 6',
      date: '2024-11-12T18:00:00Z',
      location: 'Location 6',
      user: 'User 6',
    },
  ];

  useEffect(() => {
    // Set events to sample data instead of fetching from API
    setEvents(sampleEvents);
  }, []);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      {children}
    </EventsContext.Provider>
  );
};

/*Database connection point, adjust to fit needs of data team*/

// export const EventsProvider = ({ children }) => {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       const response = await fetch('/api/events');
//       const data = await response.json();
//       setEvents(data);
//     };

//     fetchEvents();
//   }, []);

//   const addEvent = async (newEvent) => {
//     const response = await fetch('/api/events', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(newEvent),
//     });

//     const addedEvent = await response.json();
//     setEvents((prevEvents) => [...prevEvents, addedEvent]);
//   };

//   return (
//     <EventsContext.Provider value={{ events, addEvent }}>
//       {children}
//     </EventsContext.Provider>
//   );
// };