/*
import React, { useState } from 'react';

function useGeolocation() {
	const [longitude, setLongitude] = useState(null);
	const [latitude, setLatitude] = useState(null);
	navigator.geolocation.getCurrentPosition(
		({ coords }) => {
			setLatitude(coords.latitude);
			setLongitude(coords.longitude);
		},
		err => console.error(err),
		{
			enableHighAccuracy: true,
		}
	);
	console.log(latitude, longitude)
	return { latitude, longitude };
}

export default useGeolocation;
*/
