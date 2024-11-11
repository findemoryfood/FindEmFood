import logo from './assets/logo.png';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import NavBar from './NavBar';
import Home from './Home';
import GPS from './GPS';


<<<<<<< Updated upstream
=======
import FoodList from './components/FoodList';
import OrgSignIn from './components/OrgSignIn';
// import Indoor from './IndoorMap';
>>>>>>> Stashed changes

function App() {
  const [foodItems, setFoodItems] = useState([]); // Shared state for food items
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const [user, setUser] = useState(null); // State for user info

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
    <Router>
      <div>
        <NavBar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
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
        </Routes>
      </div>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Welcome to Find 'Em Food <code></code>
          </p>

        </header>
      </div>
    </Router>
  );
}

const styles = {
    //.div
};

export default App;
