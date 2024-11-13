import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/logo.png';
import './styles/NavBar.css'; // Link to the CSS file for styles

const NavBar = ({ isLoggedIn, user }) => {
  return (
    <div className="navbar">
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

      {/* Logo */}
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
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
  );
};

export default NavBar;
