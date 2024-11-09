import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: 16.0474,
  lng: 108.2062
};

const libraries = ['places'];

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);

  const onLoad = useCallback((map) => {
    const searchBox = new window.google.maps.places.Autocomplete(
      document.getElementById('pac-input'),
      {
        types: ['establishment', 'geocode'],
      }
    );
    
    searchBox.bindTo('bounds', map);
    setSearchBox(searchBox);

    searchBox.addListener("place_changed", () => {
      const place = searchBox.getPlace();
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
    });

    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return isLoaded ? (
    <>
      <input
        id="pac-input"
        className="map-search-box"
        type="text"
        placeholder="Search location..."
        style={{
          margin: '10px',
          width: '350px',
          height: '45px',
          padding: '0 20px',
          border: 'none',
          borderRadius: '100px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          fontSize: '14px',
          outline: 'none',
          textOverflow: 'ellipsis',
          position: 'absolute',
          left: '0',
          top: '0',
          zIndex: '1'
        }}
      />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControlOptions: {
            position: window.google.maps.ControlPosition.BOTTOM_LEFT
          }
        }}
      >
      </GoogleMap>
    </>
  ) : <></>;
}

export default Map;