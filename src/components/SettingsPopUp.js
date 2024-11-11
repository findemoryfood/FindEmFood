import React from 'react';
import Popup from 'reactjs-popup'; // Import the Popup component from reactjs-popup
import 'reactjs-popup/dist/index.css'; // Import the default CSS for the popup
import './SettingsPopUp.css'; // Custom CSS for the pop-up styling

const SettingsPopUp = () => {
  return (
    <div>
      {/* Button to open the settings pop-up */}
      <Popup 
        trigger={<button className="settings-btn">Open Settings</button>} 
        modal 
        closeOnDocumentClick
      >
        {(close) => (
          // The content of the pop-up
          <div className="settings-popup">
            <h2>Settings</h2>
            {/* Close button - clicking this will close the pop-up */}
            <button className="close-btn" onClick={close}>Close</button>
            <div className="settings-content">
              <div className="setting-item">
                <label>
                  <input type="checkbox" /> Enable Notifications
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" /> Enable Dark Mode
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" /> Enable Location
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" /> Enable Auto-Updates
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="text" placeholder="Enter your username" />
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="password" placeholder="Enter your password" />
                </label>
              </div>
              {/* Add more settings as needed */}
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default SettingsPopUp;