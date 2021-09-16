import React, { useEffect, useState, useContext } from 'react';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import marker from '../../img/marker.svg';
import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css';

const Map = props => {
	const latitude = Number(localStorage.getItem("latitude"))
	const longitude = Number(localStorage.getItem("longitude"))
	const [showMap, setShowMap] = useState(false);
	const Mapbox = ReactMapboxGl({
		accessToken: process.env.REACT_APP_MAPBOX_TOKEN || "pk.eyJ1IjoiY2hpcHpzdGFyIiwiYSI6ImNrZGxzMHp4ODExajUycG9odTd1ZTUzYm4ifQ.uVlvBQEsn0SDUDy1VcAHRA"
	});

	return (
		<div className='mt-2 map-container'>
			<h3 className='map-title ps-4 pt-3'>Live View</h3>
			<Mapbox
				zoom={[13]}
				containerStyle={{
					height: 500,
					width: '',
				}}
				maxZoom={15}
				minZoom={10}
				center={[longitude, latitude]}
				style='mapbox://styles/chipzstar/cktenny8g0ez218nx2wue8i08'
			>
				<Marker coordinates={[longitude, latitude]}>
					<img src={marker} alt='' width={30} height={30} />
				</Marker>
			</Mapbox>
		</div>
	);
};

Map.propTypes = {};

export default Map;
