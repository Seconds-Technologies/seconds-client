import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { Marker } from 'react-map-gl';
import marker from '../../img/marker.svg';
import './map.css';

const Map = props => {
	const [showMap, setShowMap] = useState(false);
	const [viewport, setViewport] = useState({})

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(({ coords }) => {
			setViewport({
				latitude: coords.latitude,
				longitude: coords.longitude,
				width: 1350,
				height: 500,
				zoom: 12
			})
			setShowMap(true)
		}, err => console.error(err))
	}, []);

	return (
		<div className="mt-2 map-container">
			<h3 className='map-title ps-3 pt-3'>Live View</h3>
			{showMap && <ReactMapGL
				{...viewport}
				mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN || "pk.eyJ1IjoiY2hpcHpzdGFyIiwiYSI6ImNrZGxzMHp4ODExajUycG9odTd1ZTUzYm4ifQ.uVlvBQEsn0SDUDy1VcAHRA"}
				onViewportChange={viewport => setViewport(viewport)}
				mapStyle="mapbox://styles/chipzstar/cktenny8g0ez218nx2wue8i08"
			>
				<Marker
					latitude={viewport.latitude}
					longitude={viewport.longitude}
				>
					<img src={marker} alt='' width={20} height={20}/>
				</Marker>
			</ReactMapGL>}
		</div>
	);
};

Map.propTypes = {};

export default Map;
