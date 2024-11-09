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
    const input = document.createElement("input");
    input.placeholder = "Search location...";
    input.className = "map-search-box";
    input.style.cssText = `
      margin: 10px; width: 350px; height: 45px; padding: 0 20px; border: none;
      border-radius: 100px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); font-size: 14px;
      outline: none; text-overflow: ellipsis; position: absolute; left: 0; top: 0;
    `;

    const style = document.createElement('style');
    style.textContent = `
      .pac-container {
        border-radius: 20px;
        margin-top: 10px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        padding-left: 10px;
        padding-right: 10px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      }
      .pac-item {
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
      }
      .pac-item:hover {
        background-color: #f5f5f5;
      }
      .pac-item-query {
        font-size: 14px;
        padding-right: 4px;
      }
      .pac-matched {
        font-weight: bold;
      }
      .pac-icon {
        margin-right: 8px;
      }

      /* InfoWindow styles */
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
      
      .gm-style .transit-container .gm-title{
        font-size: 18px !important;
        width: 100% !important;
      }

      .address{
        display: flex;
        flex-wrap: wrap;
      }

      .address-line{
        width: fit-content !important;
      }

      .address-line:not(:last-child)::after {
        content: ",\u00A0";
      }

      /* InfoWindow content styles */
      .gm-style .gm-style-iw-c div {
        color: #333333;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        font-size: 14px;
        line-height: 1.4;
      }
    `;
    document.head.appendChild(style);

    const searchBox = new window.google.maps.places.SearchBox(input);
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);
    setSearchBox(searchBox);

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const bounds = new window.google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return isLoaded ? (
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
  ) : <></>;
}

export default Map;