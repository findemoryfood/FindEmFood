// EventSidebar.js
import React, { useState, useContext } from 'react';
import { EventsContext } from './EventContext';
import './oldEventSidebar.css'; // Import CSS for styling

const Sidebar = ({ openPopup }) => {
  const { events } = useContext(EventsContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="expand-icon" onClick={toggleSidebar}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
     {/*TODO: Make the login a link to login popup*/}
      <h2 className="sidebar-header">Free Food Near You!</h2>
      <h2 className="login-header">Logged in as ______@emory.edu</h2>
      <div className="event-cards-container">
        {events.map((event) => (
          <div
            key={event.id}
            className="event-card"
            onClick={() => openPopup(event)} // Use the openPopup function from props
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            <h3>{event.title}</h3>
            <p>{event.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;