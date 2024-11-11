import React from 'react';
import Popup from 'reactjs-popup'; // Import Popup from reactjs-popup
import './EventCard.css'; // Add styles for the event card

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <Popup trigger={<button className="event-card-button">{event.title}</button>} modal>
        {/* Modal content displayed on click */}
        {close => (
          <div className="popup-content">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <button onClick={close} className="close-popup-button">Close</button>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default EventCard;