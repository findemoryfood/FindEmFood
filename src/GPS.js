import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import coxLayout from './floorplans/cox-layout.jpg';
import Switch from 'react-switch'; // Add a library for toggle switches (Install with `npm install react-switch`)

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

    // Define original locations and floor plans
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
        'MSC': '/floorplans/msc_layout.jpg',
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
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
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
                        onColor="#86d3ff"
                        onHandleColor="#2693e6"
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
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
                    <img src={selectedFloorPlan} alt="Floor Plan" style={styles.floorPlanImage} />
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
