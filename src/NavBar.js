import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ isLoggedIn, user }) => {
  return (
    <nav>
      <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
        <li style={{ marginRight: '20px' }}>
          <Link to="/">Home</Link>
        </li>
        <li style={{ marginRight: '20px' }}>
          <Link to="/GPS">GPS</Link>
        </li>
        <li style={{ marginRight: '20px' }}>
          <Link to="/FoodList">Food List</Link>
        </li>
        <li style={{ marginRight: '20px' }}>
          <Link to="/OrgSignIn">
            {isLoggedIn ? (
              <span style={{ color: 'white' }}>{user?.username}</span>
            ) : (
              'Log In'
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;

