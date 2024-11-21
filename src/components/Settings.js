import logo from '../assets/logo.png';
import React, { useState, useEffect } from 'react';
import { useSettings } from '../SettingsContext';
import { writeUserInfo, getUserInfo } from '../firebaseUtils';
import '../styles/App.css';

const Settings = () => {
  const { settings, updateSettings } = useSettings();

  const handleToggle = (event) => {
    const { name, checked } = event.target;
    updateSettings({ [name]: checked });
    window.location.reload(window.confirm("Refresh page?"));
  };

  const handleDarkmodeToggle = (event) => {
    const { checked } = event.target;
    updateSettings({ darkMode : checked });
    if (window.confirm("Updated preference won't take effect until page is refreshed. Refresh now?")){
      window.location.reload(true);
    }
  };

    return (
      <div>
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
  }

  export default Settings;