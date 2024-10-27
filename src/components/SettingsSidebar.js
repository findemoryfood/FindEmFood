import React, { useState, useEffect } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { IoSettingsOutline } from "react-icons/io5";
import { useSettings } from '../SettingsContext';
import './Sidebar.css'; // doesn't work if if it's in the styles folder for some reason

const SettingsSidebar = () => {
    const { settings, updateSettings } = useSettings();

    // Optional: This state can help manage any additional sidebar logic
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (event) => {
        const { name, checked } = event.target;
        updateSettings({ [name]: checked });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        updateSettings({ [name]: value });
    };

    return (
        <Menu customBurgerIcon={<IoSettingsOutline />} 
        isOpen={isOpen} 
            onStateChange={({ isOpen }) => setIsOpen(isOpen)} // Update isOpen state when sidebar opens or closes
        >
            <div className="settings-menu">
                <h2>Settings</h2>
                <div className="setting-item">
                    <label>
                        <input
                            type="checkbox"
                            name="useLocation"
                            checked={settings.useLocation}
                            onChange={handleToggle}
                        />
                        Enable Location
                    </label>
                </div>
                <div><a id="home" className="menu-item" href="/events">My Events</a></div>
                <button onClick={() => console.log('Settings saved:', settings)} style={styles.saveButton}>Save</button>
            </div>
        </Menu>
    );
};

// styles
const styles = {
    saveButton: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default SettingsSidebar;