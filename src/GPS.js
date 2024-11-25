import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import coxLayout from './floorplans/cox-layout.jpg';
import Switch from 'react-switch'; // Add a library for toggle switches (Install with `npm install react-switch`)
import locations from "./BuildingContent";
import IndoorMap from './floorplans/IndoorMap.js';
import AttwoodMap from './floorplans/AttwoodMap.js';
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



    const [startLocation, setStartLocation] = useState('White Hall');
    const [destinationLocation, setDestinationLocation] = useState('MSC');
    const [useMyLocation, setUseMyLocation] = useState(false); // State for toggle switch
    const [userLocation, setUserLocation] = useState(null); // State to store user's current location
    const [showPopup, setShowPopup] = useState(false); // State for popup visibility

    const floorPlans = {
        'White Hall': () => <IndoorMap />,
        'MSC': () => <IndoorMap />,
        'Cox Hall': () => <img src={coxLayout} alt="Cox Hall Floor Plan" style={{ width: '100%' }} />, // Image-based
        'Attwood Chemistry Center': () => <AttwoodMap />,
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
            <div
                ref={mapRef}
                id="google-map-container"
                style={{ ...styles.mapContainer, display: isIndoor ? 'none' : 'block' }}
            ></div>

            {isIndoor && (
                <div style={styles.mapContainer}>
                    {renderIndoorMap()}
                </div>
            )}

            <div style={styles.buttonContainer}>
                <h3>Starting Location</h3>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ marginRight: '10px' }}>Use My Location</span>
                    <Switch
                        checked={useMyLocation}
                        onChange={setUseMyLocation}
                        onColor="#ffcc33"
                        offColor="#0044cc"
                        handleDiameter={30}
                        height={20}
                        width={48}
                        uncheckedIcon={false}
                        checkedIcon={false}
                    />
                </label>

                {!useMyLocation && (
                    <select
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                        style={styles.select}
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
                    style={styles.select}
                >
                    {Object.keys(floorPlans).map((location) => (
                        <option key={location} value={location}>
                            {location}
                        </option>
                    ))}
                </select>

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
        height: '500px',
        width: '95%',
        marginBottom: '20px',
        border: '5px solid #0044CC',
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
        backgroundColor: '#0044CC',
        color: 'white',
        borderRadius: '5px',
        border: 'none',
    },
};

export default GPS;