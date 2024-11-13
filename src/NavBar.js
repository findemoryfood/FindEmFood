import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/logo.png';
import './styles/NavBar.css';

const NavBar = ({ isLoggedIn, user }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // For the sidebar implementation for small devices and minimized screens
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="navbar">
      {/* Sidebar Toggle Button for small screens */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>☰</button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'show' : ''}`}>
        <ul>
          <li>
            <Link to="/GPS" onClick={toggleSidebar}>GPS</Link>
          </li>
          <li>
            <Link to="/FoodList" onClick={toggleSidebar}>Food List</Link>
          </li>
          <li>
            <Link to="/Setting" onClick={toggleSidebar}>Settings</Link>
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
        {/* Left Links */}
        <nav className="nav-links nav-left">
          <ul>
            <li>
              <Link to="/GPS">GPS</Link>
            </li>
            <li>
              <Link to="/FoodList">Food List</Link>
            </li>
          </ul>
        </nav>

        {/* Logo with Product Name */}
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          {/*<div className="logo-text">Find 'Em Food</div>*/}
        </div>

        {/* Right Links */}
        <nav className="nav-links nav-right">
          <ul>
            <li>
              <Link to="/Setting">Settings</Link>
            </li>
            <li>
              {isLoggedIn ? (
                <Link to="/UserProfile">
                  <span>{user?.username}</span>
                </Link>
              ) : (
                <Link to="/OrgSignIn">Log In</Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
