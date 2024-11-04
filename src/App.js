//import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SettingsSidebar from './components/SettingsSidebar';
import AddEventPopUp from './components/AddEventPopUp';
import { SettingsProvider } from './SettingsContext';
import logo from './logo.svg';
import placeholderImage from './EMMAP.png';
import './styles/App.css';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import GPS from './GPS';
import FoodList from './components/FoodList';
import OrgSignIn from './components/OrgSignIn';
import Sidebar from './Sidebar';
import { EventsProvider } from './EventContext';
import React, { useState } from 'react';

function App() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openPopup = (event) => {
    setSelectedEvent(event);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setSelectedEvent(null);
    setIsPopupVisible(false);
  };

  return (
    <SettingsProvider>
      <Router>
        <div className="app-container">
          <NavBar />
          <Sidebar openPopup={openPopup} />
          <div className="main-content">
          <SettingsSidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
          <AddEventPopUp />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/GPS" element={<GPS />} />
              <Route path="/FoodList" element={<FoodList />} /> 
              <Route path="/OrgSignIn" element={<OrgSignIn />} />
            </Routes>
          </div>
        </div>

        {/* Insert GPS here I think */}
        <div className="default-functionality">
          <img src={placeholderImage} alt="Placeholder" className="placeholder-image" />
        </div>

        {/* Popup Component */}
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
      </Router>
    </SettingsProvider>
  );
}

// Want to stop page from scrolling and only feature map

export default App;
