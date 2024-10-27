import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
    return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
    // Load initial settings from localStorage or set default values
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('appSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            useLocation: true,
            eventsList: [],
        };
    });

    // Update settings and localStorage whenever settings change
    const updateSettings = (newSettings) => {
        setSettings((prevSettings) => {
            const updatedSettings = {
                ...prevSettings,
                ...newSettings,
            };
            localStorage.setItem('appSettings', JSON.stringify(updatedSettings)); // Save to localStorage
            return updatedSettings;
        });
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};