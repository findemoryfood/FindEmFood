import logo from '../assets/logo_v2.png';
import React, { useState } from 'react';
import { useSettings } from '../SettingsContext';
import '../styles/App.css';

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const [isLoading, setIsLoading] = useState(false); // State for showing the loading screen

  const handleDarkmodeToggle = (event) => {
    const { checked } = event.target;
    updateSettings({ darkMode : checked });

    //Shows the loading page with the spinning logo
    setIsLoading(true);

    setTimeout(() => {
      window.location.reload(); // Refresh the page
    }, 2000); //2-second delay before reloading the page
  };

  return (
      <div>
        {/* Loading Screen */}
        {isLoading && (
          <div style={styles.loadingScreen}>
            <img src={logo} alt="Loading..." style={styles.spinningLogo} />
          </div>
        )}

        <h1>Settings</h1>
        <div className="setting-item">
          <label>
            <input
              type="checkbox"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleDarkmodeToggle}
            />
            Enable dark mode
          </label>
        </div>
      </div>
    );
  };

const styles = {
  loadingScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // High z-index to overlay all content
  },
  spinningLogo: {
    width: '400px', // Adjust size as needed
    height: '400px',
    animation: 'spin 2.5s linear infinite', // Infinite spinning animation
  },
};

export default Settings;