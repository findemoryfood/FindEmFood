import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const GPS = () => {
    const mapRef = useRef(null);
    const modeSel = useRef(null);
    const [map, setMap] = useState(null);

    const locations = {
        'White Hall': {lat: 33.790821310664015, lng: -84.32591313179799},
        'MSC': {lat: 33.79042898587455, lng: -84.32649785333206},
        'Cox Hall': {lat: 33.79233555962954, lng: -84.32311903755512},
        'McDonough Field': {lat: 33.79406973743722, lng: -84.32512134776637},
        'Emory Student Center': {lat: 33.79363510030303, lng: -84.32386296768192},
        'Clairmont Campus': {lat: 33.79848511148154, lng: -84.3089384586827},
    }

    const start = { lat: 33.7932052496357, lng: -84.32220089095104 };

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [start.lng, start.lat],
            zoom: 14,
        });

        setMap(map);

        new mapboxgl.Marker()
            .setLngLat([start.lng, start.lat])
            .setPopup(new mapboxgl.Popup().setText('Campus Center'))
            .addTo(map);

        addLocationMarkers(map);

        return () => map.remove();
    }, []);

    const addLocationMarkers = (map) => {
        Object.keys(locations).forEach((location) => {
            const { lat, lng } = locations[location];
            new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup().setText(location))
                .addTo(map);
        });
    };

    const handleLocationSelect = (location) => {
        calculateAndDisplayRoute(location);
    };

    const calculateAndDisplayRoute = (location) => {
        const selectedLocation = locations[location];
        const mode = modeSel.current.value === 'WALKING' ? 'walking' : 'cycling';

        if (selectedLocation) {
            const directionUrl = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${selectedLocation.lng},${selectedLocation.lat};${start.lng},${start.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

            fetch(directionUrl)
                .then((response) => response.json())
                .then((data) => {
                    const route = data.routes[0].geometry.coordinates;
                    drawRoute(route);
                })
                .catch((error) => console.error('Error fetching directions: ', error));
        }
    };

    const drawRoute = (route) => {
        if (map.getSource('route')) {
            map.getSource('route').setData({
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: route,
                },
            });
        } else {
            map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: route,
                        },
                    },
                },
                layout: {
                    'line-color': '#007AFF',
                    'line-width': 5,
                },
            });
        }
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
                    {Object.keys(locations).map((location) => (
                        <button
                            key={location}
                            style={styles.button}
                            onClick={() => handleLocationSelect(location)}
                        >
                            {location}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

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
