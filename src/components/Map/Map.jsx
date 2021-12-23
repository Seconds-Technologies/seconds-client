import mapboxgl from 'mapbox-gl';
import React, { useEffect, useMemo } from 'react';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css';
import pickupMarker from '../../assets/img/pickup-icon.svg';
import dropoffMarker from '../../assets/img/dropoff-icon.svg';
import courierMarker from '../../assets/img/courier-location-icon.svg';

const Map = ({ styles, height, location, markers, couriers, busy }) => {
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

	const dashboardBounds = useMemo(() => {
		let result = [];
		if (busy) {
			const coordinates = [location, ...couriers];
			console.log('COORDINATES', coordinates);
			const bounds = coordinates.reduce((bounds, coord) => bounds.extend(coord), new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
			result = Object.values(bounds).map(bound => Object.values(bound));
		}
		return result;
	}, [busy, location, couriers]);

	const orderBounds = useMemo(() => {
		let result = [];
		if (markers) {
			console.log('COORDINATES', markers);
			const bounds = markers.reduce((bounds, coord) => bounds.extend(coord), new mapboxgl.LngLatBounds(markers[0], markers[0]));
			result = Object.values(bounds).map(bound => Object.values(bound));
		}
		return result;
	}, [markers]);

	useEffect(() => {
		console.log(dashboardBounds);
	}, [dashboardBounds]);

	return (
		<div className={`${styles} map-container`}>
			<Mapbox
				zoom={location && !busy ? [13] : undefined}
				containerStyle={{
					height: `calc(100vh - ${height}px)`,
					width: '100%'
				}}
				onStyleLoad={map => onLoaded(map)}
				maxZoom={20}
				minZoom={5}
				center={!busy ? location : undefined}
				fitBounds={markers ? orderBounds : busy ? dashboardBounds : undefined}
				fitBoundsOptions={{
					padding: 50
				}}
				style='mapbox://styles/chipzstar/cktenny8g0ez218nx2wue8i08'
			>
				{location && (
					<Marker coordinates={location}>
						<img src={pickupMarker} alt='' width={40} height={40} />
					</Marker>
				)}
				{markers &&
					markers.map((coords, index) => (
						<Marker coordinates={coords}>
							{index === 0 ? (
								<div
									className='d-flex flex-column'
									data-bs-placement='top'
									data-bs-toggle='tooltip'
									data-bs-html='true'
									title='Pickup'
								>
									<img src={pickupMarker} alt='' width={40} height={40} />
								</div>
							) : index === 1 ? (
								<div
									className='d-flex flex-column'
									data-bs-placement='top'
									data-bs-toggle='tooltip'
									data-bs-html='true'
									title='Dropoff'
								>
									<img src={dropoffMarker} alt='' width={40} height={40} />
								</div>
							) : (
								<div
									className='d-flex flex-column'
									data-bs-placement='top'
									data-bs-toggle='tooltip'
									data-bs-html='true'
									title='Courier'
								>
									<img src={courierMarker} alt='' width={40} height={40} />
								</div>
							)}
						</Marker>
					))}
				{couriers &&
					couriers.map((coords, index) => (
						<Marker coordinates={coords}>
							<div className='d-flex flex-column' data-bs-placement='top' data-bs-toggle='tooltip' data-bs-html='true' title='Courier'>
								<img src={courierMarker} alt='' width={40} height={40} />
							</div>
						</Marker>
					))}
			</Mapbox>
		</div>
	);
};

Map.propTypes = {};

export default Map;
