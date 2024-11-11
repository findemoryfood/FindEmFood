import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddEventPopUp from './components/AddEventPopUp';
import { SettingsProvider } from './SettingsContext';
import placeholderImage from './EMMAP.png';
import './styles/App.css';
import NavBar from './NavBar';
import GPS from './GPS';
import FoodList from './components/FoodList';
import OrgSignIn from './components/OrgSignIn';
import { EventsProvider } from './components/EventContext';
import React, { useState } from 'react';
import EventSidebar from './components/oldEventSidebar';
import SettingsPopUp from './components/SettingsPopUp'; // Import the new SettingsPopUp

function App() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // const [isSettingsSidebarCollapsed, setIsSettingsSidebarCollapsed] = useState(true); // Default collapsed
  const [isEventSidebarCollapsed, setIsEventSidebarCollapsed] = useState(true); // Default collapsed

  // Open popup
  const openPopup = (event) => {
    setSelectedEvent(event);
    setIsPopupVisible(true);
  };

  // Close popup
  const closePopup = () => {
    setSelectedEvent(null);
    setIsPopupVisible(false);
  };

  return (
    <SettingsProvider>
      <EventsProvider>
        <Router>
          <div className="app-container">
            <NavBar />
            <div className="content-wrapper">
              <div className="main-content">
                <SettingsPopUp /> 
                
                {/* Event Sidebar */}
                <EventSidebar />
                
                <AddEventPopUp />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/GPS" element={<GPS />} />
                  <Route path="/FoodList" element={<FoodList />} />
                  <Route path="/OrgSignIn" element={<OrgSignIn />} />
                </Routes>
              </div>
            </div>

            <div className="default-functionality">
              <img src={placeholderImage} alt="Placeholder" className="placeholder-image" />
            </div>

            {isPopupVisible && (
              <div className="popup" onClick={closePopup}>
                <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                  <h3>{selectedEvent?.title}</h3>
                  <p>{selectedEvent?.description}</p>
                  <p><strong>Date:</strong> {new Date(selectedEvent?.date).toLocaleString()}</p>
                  <p><strong>Location:</strong> {selectedEvent?.location}</p>
                  <button className="close-popup" onClick={closePopup}>Close</button>
                </div>
              </div>
            )}
          </div>
        </Router>
      </EventsProvider>
    </SettingsProvider>
  );
}

export default App;