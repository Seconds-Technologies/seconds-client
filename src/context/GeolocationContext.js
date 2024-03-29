import React, { useCallback } from 'react';
import { GeolocationContext } from './index';
import useGeolocation from 'react-hook-geolocation';
const GeolocationContextProvider = props => {

	const onGeolocationUpdate = useCallback((location) => {
		localStorage.setItem('latitude', location.latitude.toString());
		localStorage.setItem('longitude', location.longitude.toString());
	}, [])

	const geolocation = useGeolocation({
		enableHighAccuracy: true,
		maximumAge: 15000,
		timeout: 12000,
	}, onGeolocationUpdate);

	return <GeolocationContext.Provider value={{ ...geolocation }}>{props.children}</GeolocationContext.Provider>;
};

export default GeolocationContextProvider;