import logo from '../assets/glass.png';
import React, { useState, useEffect } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { IconContext } from "react-icons";
import { IoSettingsOutline } from "react-icons/io5";
import { useSettings } from '../SettingsContext';
import '../styles/App.css';
import '../styles/Sidebar.css'; 

const SettingsSidebar = () => {
    const { settings, updateSettings } = useSettings();
    const [isLoading, setIsLoading] = useState(false); // State for showing the loading screen

    // Optional: This state can help manage any additional sidebar logic
    const [isOpen, setIsOpen] = useState(false);

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

            <IconContext.Provider value={{ color: settings.darkMode ? 'white' : 'black', className: "global-class-name" }}>
            <Menu right width={ 275 } customBurgerIcon={<IoSettingsOutline />} 
                isOpen={isOpen} 
                    onStateChange={({ isOpen }) => setIsOpen(isOpen)} // Update isOpen state when sidebar opens or closes
                >
                <div className="settings-menu">
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
            </Menu>
            </IconContext.Provider>
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
      width: '500px', // Adjust size as needed
      height: '600px',
      animation: 'spin 3.5s linear infinite', // Infinite spinning animation
    },
  };

export default SettingsSidebar;