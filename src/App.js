import logo from './assets/logo_v2.png';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import NavBar from './NavBar';
import GPS from './GPS';
import FoodList from './components/FoodList';
import OrgSignIn from './components/OrgSignIn';
import AboutUs from './components/AboutUs';
import Settings from './components/Settings';
import { useSettings, SettingsProvider } from './SettingsContext';

function App() {
  const [foodItems, setFoodItems] = useState([]); // Shared state for food items
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const [user, setUser] = useState(null); // State for user info
  const { settings } = useSettings(); 
  
  // Function to handle login and update state
  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <SettingsProvider>
      <Router>
        <div className={`App ${settings.darkMode ? 'darkmode' : ''}`}>
          <NavBar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />

          {/* Main content area */}
          <div className="App-content">
            <Routes>
              <Route
                path="/"
                element={<GPS foodItems={foodItems} />} // Pass food items to GPS
              />
              <Route
                path="/GPS"
                element={<GPS foodItems={foodItems} />} // Pass food items to GPS
              />
              <Route
                path="/FoodList"
                element={
                  <FoodList
                    foodItems={foodItems}
                    setFoodItems={setFoodItems}
                    isLoggedIn={isLoggedIn} // Pass login status to control form visibility
                  />
                }
              />
              <Route
                path="/OrgSignIn"
                element={
                  <OrgSignIn
                    onLogin={handleLogin}
                    isLoggedIn={isLoggedIn}
                    user={user}
                    onLogout={handleLogout}
                  />
                }
              />
              <Route
                path="/AboutUs"
                element={<AboutUs />}
              />
              <Route
                path="/Settings"
                element={<Settings />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
