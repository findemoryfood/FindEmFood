import logo from '../assets/logo.png';
import React from 'react';
import { useSettings } from '../SettingsContext';
import '../styles/App.css';

const Settings = () => {
  const { settings, updateSettings } = useSettings();

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
};

export default Settings;
