import React from 'react';

const EventCard = ({ title, description, date, location }) => {
  return (
    <div className="event-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <p>{new Date(date).toLocaleString()}</p>
      <p>{location}</p>
    </div>
  );
};

export default EventCard;