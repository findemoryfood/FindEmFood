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

const GPS = () => {
    const mapRef = useRef(null);
    const directionsService = useRef(null);
    const directionsRenderer = useRef(null);
    const [isIndoor, setIsIndoor] = useState(false);
    const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
    const mapInstance = useRef(null); // For the Google Map instance

    // Define locations and floor plans
    const locations = {
        'White Hall': { lat: 33.790821310664015, lng: -84.32591313179799 },
        'MSC': { lat: 33.79042898587455, lng: -84.32649785333206 },
        'Cox Hall': { lat: 33.79233555962954, lng: -84.32311903755512 },
        'McDonough Field': { lat: 33.79406973743722, lng: -84.32512134776637 },
        'Emory Student Center': { lat: 33.79363510030303, lng: -84.32386296768192 },
        'Clairmont Campus': { lat: 33.79848511148154, lng: -84.3089384586827 },
        'Goizueta Business School': { lat: 33.790124, lng: -84.322036 },
        'Woodruff Library': { lat: 33.790748, lng: -84.323125 },
    };

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
    const [showMap, setShowMap] = useState(false);

    // Initialize Google Map
    const initMap = () => {
        const centerCoordinates = { lat: 33.794035, lng: -84.3248153 };
        const zoom = 14;
        const bounds = calculateBounds(centerCoordinates, 0.5);

        const map = new window.google.maps.Map(mapRef.current, {
            center: centerCoordinates,
            zoom: zoom,
            restriction: { latLngBounds: bounds },
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

                    // Adjust the map view to fit the route
                    const bounds = new window.google.maps.LatLngBounds();
                    const route = response.routes[0];

                    // Extend bounds to include each route's legs
                    route.legs.forEach((leg) => {
                        bounds.extend(leg.start_location);
                        bounds.extend(leg.end_location);
                    });

                    // Fit the map to the bounds of the route
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
        // const mapboxMap = new mapboxgl.Map({
        //     container: 'mapbox-container',
        //     style: 'mapbox://styles/mapbox/light-v10',
        //     center: [-84.32661616462353, 33.790241869210575],
        //     zoom: 18,
        // });

        // mapboxMap.on('load', () => {
        //     mapboxMap.addSource('test-raster', {
        //         'type': 'raster',
        //         'url': 'mapbox://red-grace2024.648zhuku',
        //         'tileSize': 256,
        //     });

        //     mapboxMap.addLayer({
        //         'id': 'test-raster-layer',
        //         'type': 'raster',
        //         'source': 'test-raster',
        //     });
        // });
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
        const start = locations[startLocation];
        const destination = locations[destinationLocation];
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
                <select value={startLocation} onChange={(e) => setStartLocation(e.target.value)} style={styles.select}>
                    {Object.keys(locations).map((location) => (
                        <option key={location} value={location}>
                            {location}
                        </option>
                    ))}
                </select>

                <h3>Destination</h3>
                <select value={destinationLocation} onChange={(e) => setDestinationLocation(e.target.value)} style={styles.select}>
                    {Object.keys(locations).map((location) => (
                        <option key={location} value={location}>
                            {location}
                        </option>
                    ))}
                </select>

                <button style={styles.button} onClick={handleRouteCalculation}>
                    Calculate Route
                </button>

                {/* Indoor */}
                <div>
                <button style={styles.button} onClick={toggleIndoorOutdoor}>
                    {isIndoor ? 'Switch to Outdoor Map' : 'Switch to Indoor Map'}
                </button>
                {isIndoor && 
                (
                <iframe
                    href="https://www.mappedin.com/"
                    title="Mappedin Map"
                    name="Mappedin Map"
                    allow="clipboard-write 'self' https://app.mappedin.com; web-share 'self' https://app.mappedin.com"
                    scrolling="no"
                    width="100%"
                    height="650"
                    frameBorder="0"
                    style={{
                        // flex: ,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '52.5%',
                        width: '90.2%',
                        marginTop: '19%',
                        marginLeft:'4%',
                        
                        // marginBottom: '20px',
                        //  border: '5px solid #0044CC'
                    }}
                    src="https://app.mappedin.com/map/6732310c66ce60000b9169e8?embedded=true"
                ></iframe>
            )}
            </div>

            </div>

            {/* Floor Plan Display
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
)} */}

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
    },

    mapContainer: {
        flex: 1,
        position: 'relative',
        height: '100%',
        width: '100%',
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
};

export default GPS;
