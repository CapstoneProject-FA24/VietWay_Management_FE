import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, InfoWindow, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 16.0474,
  lng: 108.2062
};

const libraries = ['places'];

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

  #pac-input{
    left: 0 !important;
  }
`;

function Map({ placeId }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [marker, setMarker] = useState(null);

  const onLoad = useCallback((map) => {
    const placesService = new window.google.maps.places.PlacesService(map);
    
    // Function to handle place selection and marker placement
    const handlePlaceSelection = (place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      // Create marker with all necessary data
      const newMarker = {
        position: place.geometry.location,
        title: place.name,
        geometry: place.geometry,
        name: place.name,
        address_components: place.address_components,
        place_id: place.place_id
      };

      setMarker(newMarker);
      setSelectedPlace(newMarker);

      // Center map on the location
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
    };

    // Initialize search box
    const searchBox = new window.google.maps.places.Autocomplete(
      document.getElementById("pac-input"),
      {
        types: ['establishment', 'geocode'],
        fields: ["place_id", "geometry", "formatted_address", "name", "address_components"]
      }
    );
    
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
      document.getElementById("pac-input")
    );
    
    searchBox.bindTo('bounds', map);
    setSearchBox(searchBox);

    searchBox.addListener("place_changed", () => {
      const place = searchBox.getPlace();
      handlePlaceSelection(place);
    });

    // If placeId is provided, fetch and display the place
    if (placeId) {
      const request = {
        placeId: placeId,
        fields: ["place_id", "geometry", "formatted_address", "name", "address_components"]
      };

      placesService.getDetails(request, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          handlePlaceSelection(place);
        } else {
          console.error("Place details request failed:", status);
        }
      });
    }

    setMap(map);
  }, [placeId]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return isLoaded ? (
    <>
      <style>{infoWindowStyle}</style>
      <style>{autocompleteStyle}</style>
      <input
        id="pac-input"
        className="map-search-box"
        type="text"
        placeholder="Tìm điểm đến..."
        style={{
          marginTop: "10px",
          marginLeft: "10px",
          width: "350px",
          height: "45px",
          padding: "0 20px",
          border: "none",
          borderRadius: "100px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
          fontSize: "14px",
          outline: "none",
          textOverflow: "ellipsis",
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
        {marker && (
          <Marker
            position={marker.position}
            title={marker.title}
            onClick={() => setSelectedPlace(marker)}
          />
        )}
        {selectedPlace && selectedPlace.position && (
          <InfoWindow
            position={selectedPlace.position}
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
                  <strong>Place ID:</strong> {selectedPlace.place_id}
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