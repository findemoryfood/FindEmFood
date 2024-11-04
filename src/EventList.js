import React, { useContext } from 'react';
import { EventsContext } from './EventsContext';
import EventCard from './EventCard';

const EventList = () => {
  const { events } = useContext(EventsContext);

  return (
    <div className="event-list">
      {events.map((event) => (
        <EventCard key={event.id} {...event} />
      ))}
    </div>
  );
};

export default EventList;