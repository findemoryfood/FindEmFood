import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
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
                    <Link to="/FoodList">FoodList</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
