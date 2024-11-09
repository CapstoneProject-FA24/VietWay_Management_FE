import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 16.0474,
  lng: 108.2062
};

// Move libraries array outside component and make it constant
const GOOGLE_MAPS_LIBRARIES = ['places'];

const infoWindowStyle = `
  .gm-style .gm-style-iw-c {
    padding: 15px !important;
    border-radius: 10px !important;
    box-shadow: 0 2px 7px 1px rgba(0, 0, 0, 0.3) !important;
    background-color: white !important;
    width: 400px !important;
  }

  .gm-style .gm-style-iw-d {
    overflow: hidden !important;
    padding: 0 !important;
  }
  
  .gm-style .transit-container .gm-title {
    font-size: 18px !important;
    width: 100% !important;
  }

  .address {
    display: flex;
    flex-wrap: wrap;
  }

  .address-line {
    width: fit-content !important;
  }

  .address-line:not(:last-child)::after {
    content: ",\\00A0";
  }

  .gm-style .gm-style-iw-c div {
    color: #333333;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    font-size: 14px;
    line-height: 1.4;
  }
`;

const autocompleteStyle = `
  /* Main dropdown container */
  .pac-container {
    border-radius: 10px;
    margin-top: 5px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    border: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  /* Individual result items */
  .pac-item {
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
  }

  /* Hover state for items */
  .pac-item:hover {
    background-color: #f5f5f5;
  }

  /* The matched text in results */
  .pac-item-query {
    font-size: 14px;
    color: #333333;
  }

  /* Secondary text (location) */
  .pac-secondary-query {
    font-size: 13px;
    color: #666666;
  }

  /* Icons in the results */
  .pac-icon {
    margin-top: 5px;
  }

  /* Remove the default Google logo */
  .pac-logo:after {
    display: none;
  }
`;

const searchBoxStyle = `
  .map-search-box {
    margin: 10px !important;
    width: 300px !important;
    height: 45px !important;
    padding: 0 20px !important;
    border: none !important;
    border-radius: 100px !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
    font-size: 14px !important;
    outline: none !important;
    text-overflow: ellipsis !important;
    background-color: white !important;
  }

  /* Fullscreen mode */
  .gm-fullscreen-control ~ div .map-search-box {
    margin: 20px !important;
    width: 400px !important;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .map-search-box,
    .gm-fullscreen-control ~ div .map-search-box {
      width: calc(100% - 100px) !important;
      max-width: 300px !important;
    }
  }
`;

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchBox, setSearchBox] = useState(null);

  const onLoad = useCallback((map) => {
    const input = document.getElementById("pac-input");
    
    // Create the autocomplete object
    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      fields: ["place_id", "geometry", "formatted_address", "name", "address_components"],
      types: ['establishment', 'geocode'],
    });

    // Bind autocomplete to map bounds
    autocomplete.bindTo('bounds', map);
    
    // Add the input to the map controls
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);
    setSearchBox(input);

    // Create a marker
    const marker = new window.google.maps.Marker({ map: map });
    setMarker(marker);

    // Add place_changed event listener
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

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

      // Update marker position
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      setSelectedPlace(place);
    });

    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    if (map && searchBox) {
      // Remove the search box from map controls before unmounting
      const controls = map.controls[window.google.maps.ControlPosition.TOP_LEFT];
      const index = controls.getArray().indexOf(searchBox);
      if (index !== -1) {
        controls.removeAt(index);
      }
    }
    setMap(null);
    setSearchBox(null);
    setMarker(null);
    setSelectedPlace(null);
  }, [map, searchBox]);

  return isLoaded ? (
    <>
      <style>{infoWindowStyle}</style>
      <style>{autocompleteStyle}</style>
      <style>{searchBoxStyle}</style>
      <input
        id="pac-input"
        className="map-search-box"
        type="text"
        placeholder="Tìm điểm đến..."
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
          },
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_TOP
          },
          zoomControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_TOP
          }
        }}
      >
        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.geometry.location}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div>
              <div className="transit-container">
                <div className="gm-title">{selectedPlace.name}</div>
              </div>
              <div className="address">
                {selectedPlace.address_components?.map((component, index) => (
                  <span key={index} className="address-line">
                    {component.long_name}
                  </span>
                ))}
              </div>
              {selectedPlace.place_id && (
                <div style={{ marginTop: '10px', color: '#666' }}>
                  Place ID: {selectedPlace.place_id}
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  ) : <></>;
}

export default Map;