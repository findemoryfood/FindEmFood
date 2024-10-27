import React, { useEffect, useRef, useState } from 'react';
import coxLayout from './floorplans/cox-layout.jpg';

const GPS = () => {
    const mapRef = useRef(null);
    const directionsService = useRef(null);
    const directionsRenderer = useRef(null);
    const modeSel = useRef(null);

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

    const [startLocation, setStartLocation] = useState('White Hall');
    const [destinationLocation, setDestinationLocation] = useState('MSC');
    const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);

    const initMap = () => {
        const centerCoordinates = { lat: 33.794035, lng: -84.3248153 };
        const zoom = 14;

        const bounds = calculateBounds(centerCoordinates, 1);

        const map = new window.google.maps.Map(mapRef.current, {
            center: centerCoordinates,
            zoom: zoom,
            restriction: {
                latLngBounds: bounds,
            },
        });

        directionsService.current = new window.google.maps.DirectionsService();
        directionsRenderer.current = new window.google.maps.DirectionsRenderer();
        directionsRenderer.current.setMap(map);

        addLocationMarkers(map);
    };

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

    const calculateAndDisplayRoute = (start, destination) => {
        const mode = modeSel.current.value;

        directionsService.current.route(
            {
                origin: new window.google.maps.LatLng(start.lat, start.lng),
                destination: new window.google.maps.LatLng(destination.lat, destination.lng),
                travelMode: window.google.maps.TravelMode[mode],
            },
            (response, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    directionsRenderer.current.setDirections(response);
                    setSelectedFloorPlan(floorPlans[destinationLocation]);
                } else {
                    console.error('Directions request failed due to ' + status);
                }
            }
        );
    };

    const calculateBounds = (center, radiusInMiles) => {
        const latInDegrees = radiusInMiles / 69; 
        const lngInDegrees = radiusInMiles / (69 * Math.cos(center.lat * (Math.PI / 180)));

        const northEast = {
            lat: center.lat + latInDegrees,
            lng: center.lng + lngInDegrees,
        };

        const southWest = {
            lat: center.lat - latInDegrees,
            lng: center.lng - lngInDegrees,
        };

        return { north: northEast.lat, south: southWest.lat, east: northEast.lng, west: southWest.lng };
    };

    const handleRouteCalculation = () => {
        const start = locations[startLocation];
        const destination = locations[destinationLocation];

        if (start && destination) {
            calculateAndDisplayRoute(start, destination);
        }
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

    return (
        <div style={styles.container}>
            <div style={styles.mapContainer} ref={mapRef}></div>
            <div style={styles.buttonContainer}>
                <h3>Mode Selection</h3>
                <select ref={modeSel} defaultValue="WALKING" style={styles.select}>
                    <option value="WALKING">Walking</option>
                    <option value="BICYCLING">Biking</option>
                </select>

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
            </div>

            {/* New area for floor plan */}
            <div style={styles.floorPlanArea}>
                {selectedFloorPlan && (
                    <div style={styles.floorPlanContainer}>
                        <h3>Floor Plan</h3>
                        <img src={selectedFloorPlan} alt="Floor Plan" style={styles.floorPlanImage} />
                    </div>
                )}
            </div>
        </div>
    );
};

// CSS styles
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
        alignItems: 'center',
    },
    mapContainer: {
        width: '80%',
        height: '400px',
        border: '1px solid #ccc',
        marginBottom: '20px',
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
    floorPlanContainer: {
        marginTop: '10px',
    },
    floorPlanImage: {
        width: '100%',
        maxHeight: '300px',
        objectFit: 'cover',
    },
};

export default GPS;


