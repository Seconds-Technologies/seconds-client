import './map.css';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mbxClient from '@mapbox/mapbox-sdk';
import React, { useEffect, useMemo, useState } from 'react';
import ReactMapboxGl, { Marker, GeoJSONLayer } from 'react-mapbox-gl';
import pickupMarker from '../../assets/img/pickup-icon.svg';
import dropoffMarker from '../../assets/img/dropoff-icon.svg';
import courierMarker from '../../assets/img/courier-location-icon.svg';

const Map = ({ styles, height, location, markers, couriers, customers, busy }) => {
	const baseClient = mbxClient({
		accessToken:
			process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoiY2hpcHpzdGFyIiwiYSI6ImNrZGxzMHp4ODExajUycG9odTd1ZTUzYm4ifQ.uVlvBQEsn0SDUDy1VcAHRA'
	});

	const Mapbox = useMemo(
		() =>
			ReactMapboxGl({
				accessToken:
					process.env.REACT_APP_MAPBOX_TOKEN ||
					'pk.eyJ1IjoiY2hpcHpzdGFyIiwiYSI6ImNrZGxzMHp4ODExajUycG9odTd1ZTUzYm4ifQ.uVlvBQEsn0SDUDy1VcAHRA'
			}),
		[]
	);

	const [geoJSON, setGeoJSON] = useState({
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: []
				}
			}
		]
	});

	const onLoaded = map => {
		map.resize();
	};

	const dashboardBounds = useMemo(() => {
		let result = [];
		if (busy) {
			const coordinates = [location, ...couriers, ...customers];
			const bounds = coordinates.reduce((bounds, coord) => bounds.extend(coord), new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
			result = Object.values(bounds).map(bound => Object.values(bound));
		}
		return result;
	}, [busy, location, couriers, customers]);

	const orderBounds = useMemo(() => {
		let result = [];
		if (markers) {
			const bounds = markers.reduce((bounds, coord) => bounds.extend(coord), new mapboxgl.LngLatBounds(markers[0], markers[0]));
			result = Object.values(bounds).map(bound => Object.values(bound));
		}
		return result;
	}, [markers]);

	useEffect(() => {
		(async () => {
			const profile = 'mapbox/driving-traffic';
			const coordinates = orderBounds.join(';');
			const request = await baseClient.createRequest({
				method: 'GET',
				path: `/directions/v5/${profile}/${coordinates}?geometries=geojson`
			});
			const response = await request.send();
			const geojson = {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						geometry: {
							...response.body.routes[0].geometry
						}
					}
				]
			};
			setGeoJSON(geojson);
		})();
	}, []);

	const linePaint = {
		'line-color': 'orange',
		'line-width': 4
	};

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
				{customers &&
					customers.map((coords, index) => (
						<Marker key={index} coordinates={coords}>
							<div className='d-flex flex-column' data-bs-placement='top' data-bs-toggle='tooltip' data-bs-html='true' title='Pickup'>
								<img src={dropoffMarker} alt='' width={40} height={40} />
							</div>
						</Marker>
					))}
				{markers &&
					markers.map((coords, index) => (
						<Marker key={index} coordinates={coords}>
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
						<Marker key={index} coordinates={coords}>
							<div className='d-flex flex-column' data-bs-placement='top' data-bs-toggle='tooltip' data-bs-html='true' title='Courier'>
								<img src={courierMarker} alt='' width={40} height={40} />
							</div>
						</Marker>
					))}
				{geoJSON.features[0].geometry.coordinates.length && <GeoJSONLayer data={geoJSON} linePaint={linePaint} />}
			</Mapbox>
		</div>
	);
};

Map.propTypes = {};

export default Map;
