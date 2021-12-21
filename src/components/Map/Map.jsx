import React, { useEffect, useMemo } from 'react';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
// import { ReactComponent as MarkerIcon } from '../../assets/img/marker.svg';
import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css';
import MarkerIcon from './MarkerIcon';
import { MARKER_COLOURS } from '../../constants';

const Map = ({ styles, height, location, bounds }) => {

	useEffect(() => {
		console.log(location);
	}, [location]);

	const Mapbox = useMemo(
		() =>
			ReactMapboxGl({
				accessToken:
					process.env.REACT_APP_MAPBOX_TOKEN ||
					'pk.eyJ1IjoiY2hpcHpzdGFyIiwiYSI6ImNrZGxzMHp4ODExajUycG9odTd1ZTUzYm4ifQ.uVlvBQEsn0SDUDy1VcAHRA'
			}),
		[]
	);

	const onLoaded = map => {
		map.resize();
	};

	return (
		<div className={`${styles} map-container`}>
			<Mapbox
				zoom={location ? [13] : undefined}
				containerStyle={{
					height: `calc(100vh - ${height}px)`,
					width: '100%'
				}}
				onStyleLoad={map => onLoaded(map)}
				maxZoom={20}
				minZoom={10}
				center={location}
				fitBounds={bounds}
				fitBoundsOptions={{
					padding: 20
				}}
				style='mapbox://styles/chipzstar/cktenny8g0ez218nx2wue8i08'
			>
				{location && (
					<Marker coordinates={location}>
						<MarkerIcon fillPrimary={MARKER_COLOURS[0]} fillSecondary={MARKER_COLOURS[0]} alt='' width={30} height={30} />
					</Marker>
				)}
				{bounds &&
					bounds.map((coords, index) => (
						<Marker coordinates={coords}>
							<MarkerIcon fillPrimary={MARKER_COLOURS[index]} fillSecondary={MARKER_COLOURS[index]} width={30} height={30} />
						</Marker>
					))}
			</Mapbox>
		</div>
	);
};

Map.propTypes = {};

export default Map;
