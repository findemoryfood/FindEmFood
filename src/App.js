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
import { SettingsProvider, useSettings } from './SettingsContext';
import { AuthProvider } from './AuthContext';
import { FoodListProvider } from './FoodListContext';

function App() {
  const [foodItems, setFoodItems] = useState([]); // Shared state for food items
  const { settings } = useSettings();

  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <div className={`App ${settings.darkMode ? 'darkmode' : ''}`}>
            <NavBar />
            <div className="App-content">
              <Routes>
                <Route path="/" element={<GPS foodItems={foodItems} />} />
                <Route path="/GPS" element={<GPS foodItems={foodItems} />} />
                <Route
                  path="/FoodList"
                  element={
                    <FoodListProvider>
                      <FoodList foodItems={foodItems} setFoodItems={setFoodItems} />
                    </FoodListProvider>
                  }
                />
                <Route path="/OrgSignIn" element={<OrgSignIn />} />
                <Route path="/AboutUs" element={<AboutUs />} />
                <Route path="/Settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;

