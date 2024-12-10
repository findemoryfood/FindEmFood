import logo from '../assets/glass.png';
import React, { useState, useEffect } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { IconContext } from "react-icons";
import { IoSettingsOutline } from "react-icons/io5";
import { useSettings } from '../SettingsContext';
import '../styles/App.css';
import '../styles/Sidebar.css'; 
import '../styles/FoodList.css'; 

const SettingsSidebar = () => {
    const { settings, updateSettings } = useSettings();
    const [isLoading, setIsLoading] = useState(false); // State for showing the loading screen
    const [fontSize, setFontSize] = useState(settings.fontSize);
    const root = document.documentElement; // Targets the <html> element

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

    const handleFontSizeChange = (event) => {
        const { value } = event.target;
        updateSettings({ fontSize : value });
        setFontSize(value);
    };

    const restoreDefaults = () => {
        if (window.confirm('Are you sure you want to restore default settings?')) {
            {
                localStorage.removeItem('appSettings'); // Clears saved settings in localStorage
                // Reset the SettingsContext to its default values
                updateSettings({
                    useMyLocation: false,
                    darkMode: false,
                    fontSize: 16, // Default font size
                });

                setIsLoading(true);

                setTimeout(() => {
                window.location.reload(); // Refresh the page
                }, 2000); //2-second delay before reloading the page

                window.location.reload();
            }
        }
    }
    
    useEffect(() => {
    root.style.fontSize = `${fontSize}px`;
    }, [fontSize, root]);

    return (
        <div>
            {/* Loading Screen */}
            {isLoading && (
            <div style={styles.loadingScreen}>
                <img src={logo} alt="Loading..." style={styles.spinningLogo} />
            </div>
            )}

            <IconContext.Provider value={{ color: settings.darkMode ? 'white' : '#ffcc33', className: "global-class-name" }}>
            <Menu right width={ 275 } customBurgerIcon={<IoSettingsOutline />} 
                isOpen={isOpen} 
                    onStateChange={({ isOpen }) => setIsOpen(isOpen)} // Update isOpen state when sidebar opens or closes
                >
                <div className="settings-menu">
                    <h1 className="bm-h">SETTINGS</h1>
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
                        <h1> </h1>
                        <div class="font-size-controls">
                            <label for="font-size-slider">Font Size:</label>
                            <input type="range" id="font-size-slider" min="12" max="22" value={fontSize} onChange={handleFontSizeChange}/>
                        </div>
                        <h1> </h1>
                        <button onClick={restoreDefaults} className="sidebar-button"> Restore defaults </button>
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