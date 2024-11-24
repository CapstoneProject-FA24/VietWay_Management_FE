class GooglePlaceService {
    static async waitForGoogleMaps() {
        if (window.google?.maps?.places) {
            return true;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        document.head.appendChild(script);

        return new Promise((resolve, reject) => {
            script.onload = () => {
                setTimeout(() => {
                    if (window.google?.maps?.places) {
                        resolve(true);
                    } else {
                        reject(new Error('Google Maps Places library failed to load'));
                    }
                }, 100);
            };
            script.onerror = () => reject(new Error('Failed to load Google Maps script'));
        });
    }

    static async getPlaceDetails(placeId) {
        try {
            await this.waitForGoogleMaps();
            
            let mapDiv = document.getElementById('google-map-service');
            if (!mapDiv) {
                mapDiv = document.createElement('div');
                mapDiv.id = 'google-map-service';
                mapDiv.style.display = 'none';
                document.body.appendChild(mapDiv);
            }
            
            return new Promise((resolve, reject) => {
                const service = new window.google.maps.places.PlacesService(mapDiv);
                
                service.getDetails(
                    {
                        placeId: placeId,
                        fields: [
                            'name',
                            'formatted_address',
                            'opening_hours',
                            'formatted_phone_number',
                            'website',
                            'rating',
                            'reviews',
                            'user_ratings_total'
                        ]
                    },
                    (result, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                            resolve(result);
                        } else {
                            reject(new Error(`Failed to fetch place details: ${status}`));
                        }
                    }
                );
            });
        } catch (error) {
            console.error('Error fetching place details:', error);
            throw error;
        }
    }

    static formatOpeningHours(openingHours) {
        if (!openingHours || !openingHours.periods) {
            return null;
        }

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        return openingHours.periods.map(period => {
            const day = daysOfWeek[period.open.day];
            const openTime = this.formatTime(period.open.time);
            const closeTime = this.formatTime(period.close.time);
            
            return {
                day,
                openTime,
                closeTime,
                formattedHours: `${day}: ${openTime} – ${closeTime}`
            };
        });
    }

    static formatTime(time) {
        const hours = parseInt(time.substring(0, 2));
        const minutes = time.substring(2);
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        
        return `${formattedHours}:${minutes} ${period}`;
    }
}

export const fetchPlaceDetails = async (placeId) => {
    const details = await GooglePlaceService.getPlaceDetails(placeId);
    return {
        ...details,
        formattedHours: details.opening_hours ? 
            GooglePlaceService.formatOpeningHours(details.opening_hours) : 
            null
    };
};

export default GooglePlaceService;