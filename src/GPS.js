import React, { useEffect, useRef } from 'react';

const GPS = () => {
    const mapRef = useRef(null);
    const directionsService = useRef(null);
    const directionsRenderer = useRef(null);
    const modeSel = useRef(null)

    //Ending Locations
    const locations = {
        'White Hall': {lat: 33.790821310664015, lng: -84.32591313179799},
        'MSC': {lat: 33.79042898587455, lng: -84.32649785333206},
        'Cox Hall': {lat: 33.79233555962954, lng: -84.32311903755512},
        'McDonough Field': {lat: 33.79406973743722, lng: -84.32512134776637},
        'Emory Student Center': {lat: 33.79363510030303, lng: -84.32386296768192},
        'Clairmont Campus': {lat: 33.79848511148154, lng: -84.3089384586827},
    }

    const start = { lat: 33.7932052496357, lng: -84.32220089095104 };

    // Initialize the map
    const initMap = () => {
        const centerCoordinates = { lat: 33.794035, lng: -84.3248153 };
        const zoom = 14;

        // Calculate the boundary for a 1-mile radius
        const bounds = calculateBounds(centerCoordinates, 1.0);

        // Create a map centered at the specified coordinates
        const map = new window.google.maps.Map(mapRef.current, {
            center: centerCoordinates,
            zoom: zoom,
            restriction: {
                latLngBounds: bounds,
            },
        });

        //For the directions service and renderer
        directionsService.current = new window.google.maps.DirectionsService();
        directionsRenderer.current = new window.google.maps.DirectionsRenderer();
        directionsRenderer.current.setMap(map);

        // Create a marker at the center point
        new window.google.maps.Marker({
            position: centerCoordinates,
            map: map,
            title: 'Center Point',
        });

        //Add the over location markers
        addLocationMarkers(map);
    };

    //Goes through the locations and adds to location Markers
    const addLocationMarkers = (map) => {
        Object.keys(locations).forEach((location) => {
            const { lat, lng } = locations[location];
            new window.google.maps.Marker({
                position: {lat, lng},
                map: map,
                title: location,
            });
        });
    };

    //Function to start the walking or biking routes
    const locationSelection = (location) => {
        const destination = start;
        const selectedLocation = locations[location];

        if (selectedLocation) {
            calculateAndDisplayRoute(selectedLocation, destination);
        }
    };

    const calculateAndDisplayRoute = (selectedLocation, destination) => {
        const mode = modeSel.current.value;

        directionsService.current.route(
            {
                origin: new window.google.maps.LatLng(selectedLocation.lat, selectedLocation.lng),
                destination: new window.google.maps.LatLng(destination.lat, destination.lng),
                travelMode: window.google.maps.TravelMode[mode],
            },
            (response, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    directionsRenderer.current.setDirections(response);
                } else {
                    console.error('Directions request failed due to ' + status);
                }
            }
        );
    };

    // Function to calculate the bounds for a given radius in miles
    const calculateBounds = (center, radiusInMiles) => {
        const latInDegrees = radiusInMiles / 69; // 1 degree latitude ≈ 69 miles
        const lngInDegrees = radiusInMiles / (69 * Math.cos(center.lat * (Math.PI / 180))); // Converts to longitude degrees

        // Calculate the bounds
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

    useEffect(() => {
        window.initMap = initMap; // Assign initMap to the global window object
    }, []);

    // Load the Google Maps API script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=API_Key=initMap`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        // Cleanup the script when the component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []);

     const renderLocationButtons = () => (
        <>
            {Object.keys(locations).map((location) => (
                <button key={location} style={styles.button} onClick={() => handleLocationSelect(location)}>
                    {location}
                </button>
            ))}
        </>
    );

    const handleLocationSelect = (location) => {
        console.log(`Selected location: ${location}`);
        locationSelection(location);
    };

    return (
        <div style={styles.container}>
            <div style={styles.mapContainer} ref={mapRef}></div>
            <div style={styles.buttonContainer}>
                <h3>Mode Selection</h3>
                <select ref={modeSel} defaultValue="WALKING" style={styles.select}>
                    <option value="WALKING">Walking</option>
                    <option value="BICYCLING">Biking</option>
                </select>
                <h3>Navigation</h3>
                <div style={styles.buttonList}>
                    {renderLocationButtons()}
                </div>
            </div>
        </div>
    );
};

// CSS styles for now
const styles = {
    container: {
        display: 'flex',
        height: '500px',
    },
    mapContainer: {
        flex: 2,
        border: '1px solid #ccc',
    },
    buttonContainer: {
        flex: 1,
        overflowY: 'auto',
        borderLeft: '1px solid #ccc',
        padding: '10px',
    },
    buttonList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    button: {
        padding: '10px',
        cursor: 'pointer',
    },
};

export default GPS;
