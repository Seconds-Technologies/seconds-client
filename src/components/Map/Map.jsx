import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
import marker from '../../img/marker.svg';
import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css';

const Map = props => {
	const [showMap, setShowMap] = useState(false);
	const [viewport, setViewport] = useState({})

	const Mapbox = ReactMapboxGl({
		accessToken: process.env.REACT_APP_DEFAULT_MAPBOX_TOKEN

	});

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(({ coords },) => {
			setViewport({
				latitude: coords.latitude,
				longitude: coords.longitude,
				width: 1350,
				height: 500,
				zoom: 13
			})
			setShowMap(true)
		}, err => console.error(err), {
			enableHighAccuracy: true
		})
	}, []);

	return (
		<div className="mt-2 map-container">
			<h3 className='map-title ps-3 pt-3'>Live View</h3>
			{showMap && <Mapbox
				zoom={[viewport.zoom]}
				containerStyle={{
					height: viewport.height,
					width: viewport.width
				}}
				center={[viewport.longitude, viewport.latitude]}
				onViewportChange={viewport => setViewport(viewport)}
				style="mapbox://styles/chipzstar/cktenny8g0ez218nx2wue8i08"
			>
				<Marker
				    coordinates={[viewport.longitude, viewport.latitude]}
				>
					<img src={marker} alt='' width={30} height={30}/>
				</Marker>
			</Mapbox>}
		</div>
	);
};

Map.propTypes = {};

export default Map;
