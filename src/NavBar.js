import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/logo_v2.png';
import './styles/NavBar.css';
import { SettingsProvider, useSettings } from './SettingsContext'; // Use SettingsProvider for settings context


const NavBar = ({ isLoggedIn, user }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // Settings context for remembering preferences
  const { settings, updateSettings } = useSettings();
  const {darkMode } = settings;
  // For the sidebar implementation for small devices and minimized screens
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`navbar ${darkMode ? 'darkmode' : ''}`}>
      {/* Sidebar Toggle Button for small screens */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>☰</button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'show' : ''}`}>
          <ul>
              <li>
                  <Link to="/HomePage">Home</Link>
              </li>
              <li>
                  <Link to="/GPS" onClick={toggleSidebar}>GPS</Link>
              </li>
              <li>
                  <Link to="/FoodList" onClick={toggleSidebar}>Food List</Link>
              </li>
              <li>
                  <Link to="/AboutUs" onClick={toggleSidebar}>About Us</Link>
              </li>
              <li>
                  {isLoggedIn ? (
                      <Link to="/UserProfile" onClick={toggleSidebar}>
                          <span>{user?.username}</span>
                      </Link>
                  ) : (
                      <Link to="/OrgSignIn" onClick={toggleSidebar}>Log In</Link>
                  )}
              </li>
          </ul>
      </div>

        {/* Main navbar for larger screens of full screen on computer */}
        <div className="main-nav">
        {/* Logo with Product Name */}
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        {/* Left Links */}
        <nav className="nav-links nav-left">
            <ul>
            <li>
                    <Link to="/HomePage">Home</Link>
                </li>
                <li>
                    <Link to="/GPS">GPS</Link>
                </li>
                <li>
                    <Link to="/FoodList">Food Hub</Link>
                </li>
                <li>
                    <Link to="/AboutUs">About Us</Link>
                </li>
            </ul>
        </nav>


            {/* Right Links */}
            <nav className="nav-links nav-right">
          <ul>

            <li>
              {isLoggedIn ? (
                <Link to="/UserProfile">
                  <span>{user?.username}</span>
                </Link>
              ) : (
                <Link to="/OrgSignIn">Log In / Sign Up</Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
