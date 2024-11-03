import logo from './logo.svg';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import NavBar from './NavBar';
import Home from './Home';
import GPS from './GPS';
import FoodList from './components/FoodList';
import OrgSignIn from './components/OrgSignIn';

function App() {
  const [foodItems, setFoodItems] = useState([]); // Shared state for food items

  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/GPS"
            element={<GPS foodItems={foodItems} />} // Pass food items to GPS
          />
          <Route
            path="/FoodList"
            element={<FoodList foodItems={foodItems} setFoodItems={setFoodItems} />} // Pass food items and setFoodItems to FoodList
          />
          <Route path="/OrgSignIn" element={<OrgSignIn />} />
        </Routes>
      </div>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            HELLO CS 370 <code></code>
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Welcome to FindEmFood
          </a>
        </header>
      </div>
    </Router>
  );
}

export default App;
