import React, { useState, useContext } from 'react';
import { EventsContext } from './EventContext';
import { IoList } from "react-icons/io5";
import { slide as Menu } from 'react-burger-menu'; // Import react-burger-menu for sidebar
import Popup from 'reactjs-popup'; // Import reactjs-popup
import 'reactjs-popup/dist/index.css'; // Import popup styles
import EventCard from './EventCard'; // EventCard component
import './EventSidebar.css';

const EventSidebar = ({ openPopup }) => {
  const { events } = useContext(EventsContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Menu customBurgerIcon={<IoList />}
      isOpen={isExpanded} 
      onStateChange={({ isOpen }) => setIsExpanded(isOpen)} // Handle state change of the menu
      right // Position the menu on the right
    >
      {/* Button to toggle sidebar expansion */}
      <button className="expand-icon" onClick={toggleSidebar}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>

      {/* Sidebar content */}
      <h2 className="sidebar-header">Free Food Near You!</h2>
      <h2 className="login-header">Logged in as ______@emory.edu</h2>
      
      {/* Event cards container */}
      <div className="event-cards-container">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </Menu>
  );
};

export default EventSidebar;