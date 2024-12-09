import React, { useEffect, useRef, useState } from 'react';
import { useSettings } from './SettingsContext';
import Switch from 'react-switch'; // Add a library for toggle switches (Install with `npm install react-switch`)
import locations from "./BuildingContent";
import IndoorMap from './floorplans/IndoorMap.js';
import AttwoodMap from './floorplans/AttwoodMap.js';
import WoodruffMap from './floorplans/WoodruffMap.js';
import ESC from './floorplans/ESC.js';
import CoxBuilding from './floorplans/CoxBuilding.js';


const GPS = ({ foodItems }) => {

    const mapRef = useRef(null);
    const directionsService = useRef(null);
    const directionsRenderer = useRef(null);
    const [isIndoor, setIsIndoor] = useState(false);
    const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
    const mapInstance = useRef(null);



    // Settings context for remembering preferences
    const { settings, updateSettings } = useSettings();
    const { useMyLocation, darkMode } = settings;

    const handleLocationToggle = (checked) => {
        updateSettings({ useMyLocation: checked });
    };

    const [startLocation, setStartLocation] = useState('White Hall');
    const [destinationLocation, setDestinationLocation] = useState('MSC');
    const [userLocation, setUserLocation] = useState(null); // State to store user's current location
    const [showPopup, setShowPopup] = useState(false); // State for popup visibility

    const floorPlans = {
        'Atwood Chemistry Center': () => <AttwoodMap />,
        'Callaway Center': null,
        'Clairmont Campus': null,
        'Cox Hall': () => <CoxBuilding />,
        'Emerson Hall': null,
        'Emory Student Center': () => <ESC />,
        'Goizueta Business School': null,
        'McDonough Field': null,
        'MSC': () => <IndoorMap />,
        'Quadrangle': null,
        'Rita Anne Rollins Building':null,
        'White Hall': null,
        'Woodruff Library':() => <WoodruffMap />,
        'Woodruff Soccer Field':null,
    };

    // Initialize Google Map
    const initMap = () => {
        const centerCoordinates = { lat: 33.794035, lng: -84.3248153 };
        const zoom = 14;
        const bounds = calculateBounds(centerCoordinates, 0.5);

        const map = new window.google.maps.Map(mapRef.current, {
            center: centerCoordinates,
            zoom: zoom,
            restriction: { latLngBounds: bounds },
            gestureHandling: 'greedy', // Allows panning even when zoomed in
            draggable: true,
        });

        mapInstance.current = map; // Save the map instance for later use

        directionsService.current = new window.google.maps.DirectionsService();
        directionsRenderer.current = new window.google.maps.DirectionsRenderer();
        directionsRenderer.current.setMap(map);

        addLocationMarkers(map);
    };

    // Add markers on Google Map
    const addLocationMarkers = (map) => {
        Object.keys(locations).forEach((location) => {
            const { lat, lng } = locations[location];
            new window.google.maps.Marker({
                position: { lat, lng },
                map: map,
                title: location,
            });
        });
    };

    // Calculate and display route using Google Directions API
    const calculateAndDisplayRoute = (start, destination) => {
        directionsService.current.route(
            {
                origin: new window.google.maps.LatLng(start.lat, start.lng),
                destination: new window.google.maps.LatLng(destination.lat, destination.lng),
                travelMode: window.google.maps.TravelMode.WALKING,
            },
            (response, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    directionsRenderer.current.setDirections(response);
                    setSelectedFloorPlan(floorPlans[destinationLocation]);

                    const bounds = new window.google.maps.LatLngBounds();
                    const route = response.routes[0];

                    route.legs.forEach((leg) => {
                        bounds.extend(leg.start_location);
                        bounds.extend(leg.end_location);
                    });

                    mapInstance.current.fitBounds(bounds);
                } else {
                    console.error('Directions request failed due to ' + status);
                }
            }
        );
    };

    // Get user's current geolocation
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting user's location: ", error);

                    // Reset the "Use My Location" toggle switch
                    updateSettings({ useMyLocation: false });

                    // Show an alert to inform the user
                    alert("Unable to access your location. Please select a starting location from the dropdown.");
                }
            );
        } else {
            // If the browser does not support geolocation, show an alert
            alert('Geolocation is not supported by this browser.');

            // Reset the "Use My Location" toggle switch
            updateSettings({ useMyLocation: false });
        }
    };


    const renderIndoorMap = () => {
        const MapComponent = floorPlans[destinationLocation];
        return MapComponent ? <MapComponent /> : <div>No indoor map available.</div>;
    };

    // Toggle between indoor and outdoor maps
    const toggleIndoorOutdoor = () => {
        setIsIndoor(!isIndoor);
        if (!isIndoor) renderIndoorMap();
    };

    // Calculate bounds for a given radius in miles
    const calculateBounds = (center, radiusInMiles) => {
        const latInDegrees = radiusInMiles / 69;
        const lngInDegrees = radiusInMiles / (69 * Math.cos(center.lat * (Math.PI / 180)));

        return {
            north: center.lat + latInDegrees,
            south: center.lat - latInDegrees,
            east: center.lng + lngInDegrees,
            west: center.lng - lngInDegrees,
        };
    };

    const handleRouteCalculation = () => {
        let start;
        if (useMyLocation && userLocation) {
            start = userLocation;
        } else {
            start = locations[startLocation];
        }

        let destination;
        if (locations[destinationLocation]) {
            destination = locations[destinationLocation];
        } else {
            const selectedFoodItem = foodItems.find((item) => item.building === destinationLocation);
            if (selectedFoodItem) {
                destination = {
                    lat: locations[selectedFoodItem.building].lat,
                    lng: locations[selectedFoodItem.building].lng,
                };
            }
        }

        if (start && destination) calculateAndDisplayRoute(start, destination);
    };

    // Show popup if there are food items available
    useEffect(() => {
        if (foodItems.length > 0) {
            setShowPopup(true);
        }
    }, [foodItems]);


    useEffect(() => {
        window.initMap = initMap;
    }, []);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Fetch user location when the toggle switch is turned on
    useEffect(() => {
        if (useMyLocation) {
            getUserLocation(); // Fetch user's location when "My Location" is selected
        }
    }, [useMyLocation]);

    return (
        <div style={styles(darkMode).container}>
            {/* Outdoor Map Container */}
            <div
                ref={mapRef}
                id="google-map-container"
                style={{ ...styles(darkMode).mapContainer, display: isIndoor ? 'none' : 'block' }}
            ></div>

            {isIndoor && (
                <div style={styles(darkMode).mapContainer}>
                    {renderIndoorMap()}
                </div>
            )}

            <div style={styles(darkMode).buttonContainer}>
                <h3>Starting Location</h3>

                {/* Toggle for My Location vs. Selected Start Location */}
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ marginRight: '10px' }}>Use My Location</span>
                    <Switch
                        checked={useMyLocation}
                        onChange={handleLocationToggle}
                        onColor="#ffcc33"              // Gold color when switch is ON
                        offColor="#0044cc"             // Blue color when switch is OFF
                        onHandleColor="#ffd966"        // Lighter gold for the handle when switch is ON
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 68, 204, 0.6)"        // Blue shadow when the switch is OFF
                        activeBoxShadow="0px 0px 1px 10px rgba(255, 204, 51, 0.2)" // Gold shadow when the switch is ON
                        height={20}
                        width={48}
                    />

                </label>

                {!useMyLocation && (
                    <select
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                        style={styles(darkMode).select}
                    >
                        {Object.keys(locations).map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                )}

                <h3>Destination</h3>
                <select
                    value={destinationLocation}
                    onChange={(e) => setDestinationLocation(e.target.value)}
                    style={styles(darkMode).select}
                >
                    {Object.keys(floorPlans).map((location) => (
                        <option key={location} value={location}>
                            {location}
                        </option>
                    ))}
                </select>

                <button style={styles(darkMode).button} onClick={handleRouteCalculation}>
                    Calculate Route
                </button>

                <button style={styles(darkMode).button} onClick={toggleIndoorOutdoor}>
                    {isIndoor ? 'Switch to Outdoor Map' : 'Switch to Indoor Map'}
                </button>
                </div>
                 {/* Popup Component */}
                {showPopup && (
                    <div style={styles(darkMode).overlay}>
                        <div style={styles(darkMode).popup}>
                            <h2>Food Events Available on Campus!</h2>
                            <p>There are new events happening at the following locations:</p>
                            <ul>
                                {foodItems.map((item) => (
                                    <li key={item.foodId}>
                                        {item.building} - {item.food}, Room: {item.room}, Time: {item.time}, Club: {item.club}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => setShowPopup(false)} style={styles(darkMode).closeButton}>
                                Close
                            </button>
                        </div>
                    </div>
                )}

            </div>

    );
};

// CSS Styles
const styles = (darkMode) => ({

    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000',


    },
    mapContainer: {
        marginTop: '30px',
        flex: 1,
        position: 'relative',
        height: '500px',
        width: '95%',
        marginBottom: '20px',
        border: '5px solid #0044CC',  // Added blue border with thickness of 5px
        backgroundColor: darkMode ? '#333' : '#fff',
    },
    buttonContainer: {
        width: '80%',
        padding: '10px',
        border: '1px solid #ccc',
        marginBottom: '20px',
        backgroundColor: darkMode ? '#2c2c2c' : '#f9f9f9',
        paddingBottom: '50px',
    },
    select: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: darkMode ? '#444' : '#fff',
        color: darkMode ? '#fff' : '#000',
    },
    button: {
        padding: '10px',
        width: '100%',
        cursor: 'pointer',
        backgroundColor: '#0044CC',
        color: 'white',
        borderRadius: '5px',
        border: 'none',
        margin: '5px',
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    popup: {
        backgroundColor: darkMode ? '#af915c' : '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        width: '80%',
        maxWidth: '500px',
    },
    closeButton: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#0044CC',
        color: 'white',
        borderRadius: '5px',
        border: 'none',
        margin: '5px',
    },
    IndoorMap:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '1000px'
    },

});

export default GPS;
