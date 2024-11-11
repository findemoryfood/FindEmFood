import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import coxLayout from './floorplans/cox-layout.jpg';
import Switch from 'react-switch'; // Add a library for toggle switches (Install with `npm install react-switch`)
import locations from "./BuildingContent";
import IndoorMap from './floorplans/IndoorMap.js';
// Set Mapbox access token
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

const GPS = ({ foodItems }) => {
    const mapRef = useRef(null);
    const directionsService = useRef(null);
    const directionsRenderer = useRef(null);
    const [isIndoor, setIsIndoor] = useState(false);
    const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
    const mapInstance = useRef(null); // For the Google Map instance

    const floorPlans = {
        'White Hall': '/floorplans/white_hall_layout.jpg',
        'MSC': IndoorMap,
        'Cox Hall': coxLayout,
        'McDonough Field': '/floorplans/mcdonough_layout.jpg',
        'Emory Student Center': '/floorplans/emory_student_center_layout.jpg',
        'Clairmont Campus': '/floorplans/clairmont_layout.jpg',
        'Goizueta Business School': '/floorplans/goizueta_layout.jpg',
        'Woodruff Library': '/floorplans/woodruff_layout.jpg',
    };

    const [startLocation, setStartLocation] = useState('White Hall');
    const [destinationLocation, setDestinationLocation] = useState('MSC');
    const [useMyLocation, setUseMyLocation] = useState(false); // State for toggle switch
    const [userLocation, setUserLocation] = useState(null); // State to store user's current location
    const [showPopup, setShowPopup] = useState(false); // State for popup visibility

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
    // const getUserLocation = () => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 setUserLocation({
    //                     lat: position.coords.latitude,
    //                     lng: position.coords.longitude,
    //                 });
    //             },
    //             (error) => {
    //                 console.error("Error getting user's location: ", error);
    //
    //                 // Reset the "Use My Location" toggle switch
    //                 setUseMyLocation(false);
    //
    //                 // Show an alert to inform the user
    //                 alert("Unable to access your location. Please select a starting location from the dropdown.");
    //             }
    //         );
    //     } else {
    //         // If the browser does not support geolocation, show an alert
    //         alert('Geolocation is not supported by this browser.');
    //
    //         // Reset the "Use My Location" toggle switch
    //         setUseMyLocation(false);
    //     }
    // };

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
                    setUseMyLocation(false);

                    // Show an alert to inform the user
                    alert("Unable to access your location. Please select a starting location from the dropdown.");
                }
            );
        } else {
            // If the browser does not support geolocation, show an alert
            alert('Geolocation is not supported by this browser.');

            // Reset the "Use My Location" toggle switch
            setUseMyLocation(false);
        }
    };


    // Load Mapbox indoor map
    const loadIndoorMap = () => {
        const mapboxMap = new mapboxgl.Map({
            container: 'mapbox-container',
            style: 'mapbox://styles/mapbox/light-v10',
            center: [-84.32661616462353, 33.790241869210575],
            zoom: 18,
        });

        mapboxMap.on('load', () => {
            mapboxMap.addSource('test-raster', {
                'type': 'raster',
                'url': 'mapbox://red-grace2024.648zhuku',
                'tileSize': 256,
            });

            mapboxMap.addLayer({
                'id': 'test-raster-layer',
                'type': 'raster',
                'source': 'test-raster',
            });
        });
    };

    // Toggle between indoor and outdoor maps
    const toggleIndoorOutdoor = () => {
        setIsIndoor(!isIndoor);
        if (!isIndoor) loadIndoorMap();
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
        <div style={styles.container}>
            {/* Outdoor Map Container */}
            <div
                ref={mapRef}
                id="google-map-container"
                style={{ ...styles.mapContainer, display: isIndoor ? 'none' : 'block' }}
            ></div>

            {/* Indoor Map Container */}
            <div
                id="mapbox-container"
                style={{ ...styles.mapContainer, display: isIndoor ? 'block' : 'none' }}
            ></div>

            {/* Controls */}
            <div style={styles.buttonContainer}>
                <h3>Starting Location</h3>

                {/* Toggle for My Location vs. Selected Start Location */}
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ marginRight: '10px' }}>Use My Location</span>
                    <Switch
                        checked={useMyLocation}
                        onChange={(checked) => setUseMyLocation(checked)}
                        onColor="#ffcc33"              // Gold color when switch is ON
                        offColor="#0044cc"             // Blue color when switch is OFF
                        onHandleColor="#ffd966"        // Lighter gold for the handle when switch is ON (optional)
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
                    <select value={startLocation} onChange={(e) => setStartLocation(e.target.value)} style={styles.select}>
                        {Object.keys(locations).map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                )}

                <h3>Destination</h3>
                <select value={destinationLocation} onChange={(e) => setDestinationLocation(e.target.value)} style={styles.select}>
                    {/* Original Locations */}
                    {Object.keys(locations).map((location) => (
                        <option key={location} value={location}>
                            {location}
                        </option>
                    ))}
                    {/* Additional Locations from Food List */}
                    {foodItems.length > 0 &&
                        foodItems.map((item) => (
                            <option key={item.foodId} value={item.building}>
                                {`${item.building} - Room: ${item.room}, Food: ${item.food}, Time: ${item.time}, Club: ${item.club}`}
                            </option>
                        ))}
                </select>

                <button style={styles.button} onClick={handleRouteCalculation}>
                    Calculate Route
                </button>

                <button style={styles.button} onClick={toggleIndoorOutdoor}>
                    {isIndoor ? 'Switch to Outdoor Map' : 'Switch to Indoor Map'}
                </button>
            </div>

            {/* Floor Plan Display */}
{selectedFloorPlan && (
    <div style={styles.floorPlanArea}>
        <h3>Floor Plan</h3>
        <div>
            <h1>Indoor Map</h1>
            <iframe
                href="https://www.mappedin.com/"
                title="Mappedin Map"
                name="Mappedin Map"
                allow="clipboard-write 'self' https://app.mappedin.com; web-share 'self' https://app.mappedin.com"
                scrolling="no"
                width="100%"
                height="650"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://app.mappedin.com/map/6732310c66ce60000b9169e8?embedded=true">
            </iframe>
        </div>
    </div>
)}

            {/* Popup Component */}
            {showPopup && (
                <div style={styles.overlay}>
                    <div style={styles.popup}>
                        <h2>Food Events Available on Campus!</h2>
                        <p>There are new events happening at the following locations:</p>
                        <ul>
                            {foodItems.map((item) => (
                                <li key={item.foodId}>
                                    {item.building} - {item.food}, Room: {item.room}, Time: {item.time}, Club: {item.club}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setShowPopup(false)} style={styles.closeButton}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Popup Component */}
            {showPopup && (
                <div style={styles.overlay}>
                    <div style={styles.popup}>
                        <h2>Food Events Available on Campus!</h2>
                        <p>There are new events happening at the following locations:</p>
                        <ul>
                            {foodItems.map((item) => (
                                <li key={item.foodId}>
                                    {item.building} - {item.food}, Room: {item.room}, Time: {item.time}, Club: {item.club}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setShowPopup(false)} style={styles.closeButton}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// CSS Styles
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
        height: '100%',
        width: '100%',
        border: '5px solid #0044CC',  // Added blue border with thickness of 5px
    },
    buttonContainer: {
        width: '80%',
        padding: '10px',
        border: '1px solid #ccc',
        marginBottom: '20px',
    },
    select: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
    },
    button: {
        padding: '10px',
        width: '100%',
        cursor: 'pointer',
    },
    floorPlanArea: {
        width: '80%',
        textAlign: 'center',
        marginBottom: '20px',
        border: '1px solid #ccc',
        padding: '10px',
    },
    floorPlanImage: {
        width: '100%',
        maxHeight: '300px',
        objectFit: 'cover',
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
        backgroundColor: '#fff',
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
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
    },
};
export default GPS;
