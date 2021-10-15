import React, { useMemo } from 'react';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import marker from '../../img/marker.svg';
import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css';

const Map = () => {
	const latitude = useMemo(() => Number(localStorage.getItem("latitude")), [])
	const longitude = useMemo(() => Number(localStorage.getItem("longitude")), [])
	const Mapbox = useMemo(() => ReactMapboxGl({
		accessToken: process.env.REACT_APP_MAPBOX_TOKEN || "pk.eyJ1IjoiY2hpcHpzdGFyIiwiYSI6ImNrZGxzMHp4ODExajUycG9odTd1ZTUzYm4ifQ.uVlvBQEsn0SDUDy1VcAHRA"
	}), []);

	const onLoaded = (map) => {
		map.resize()
	}

	return (
		<div className='mt-4 map-container'>
			<Mapbox
				zoom={[13]}
				containerStyle={{
					height: "calc(100vh - 320px)",
					width: "100%",
				}}
				onStyleLoad={map => onLoaded(map)}
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
