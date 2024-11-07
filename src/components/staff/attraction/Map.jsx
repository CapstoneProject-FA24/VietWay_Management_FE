import React, { useEffect, useState } from 'react';

function Map() {
  const [isLoaded, setIsLoaded] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', () => {
        setIsLoaded(true);
      });
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      setIsLoaded(true);
    }
  }, [apiKey]);

  useEffect(() => {
    if (isLoaded && window.google) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 10.8231, lng: 106.6297 },
        zoom: 13,
      });
    }
  }, [isLoaded]);

  return (
    <div>
      {!isLoaded ? (
        <div>Loading...</div>
      ) : (
        <div id="map" style={{ height: '400px', width: '100%' }}></div>
      )}
    </div>
  );
}

export default Map;
