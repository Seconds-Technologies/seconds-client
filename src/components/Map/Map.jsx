import './map.css';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mbxClient from '@mapbox/mapbox-sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactMapboxGl, { GeoJSONLayer, Marker, Popup } from '@mahdi-esbati/react-mapbox';
import pickupMarker from '../../assets/img/pickup-icon.svg';
import assignedDropoffMarker from '../../assets/img/dropoff-icon-green.svg';
import unassignedDropoffMarker from '../../assets/img/dropoff-icon-red.svg';
import courierMarker from '../../assets/img/courier-location-icon.svg';
import { PATHS, PROVIDERS } from '../../constants';
import { useHistory } from 'react-router-dom';
import { BsArrowRightCircleFill } from 'react-icons/bs';

const Map = ({ styles, height, location, markers, couriers, customers, busy }) => {
	const history = useHistory();
	const baseClient = mbxClient({
		accessToken:
			process.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiY2hpcHpzdGFyIiwiYSI6ImNrZGxzMHp4ODExajUycG9odTd1ZTUzYm4ifQ.uVlvBQEsn0SDUDy1VcAHRA'
	});

	const Mapbox = useMemo(
		() =>
			ReactMapboxGl({
				accessToken:
					process.env.VITE_MAPBOX_TOKEN ||
					'pk.eyJ1IjoiY2hpcHpzdGFyIiwiYSI6ImNrZGxzMHp4ODExajUycG9odTd1ZTUzYm4ifQ.uVlvBQEsn0SDUDy1VcAHRA'
			}),
		[]
	);

	const onLoaded = useCallback(map => {
		map.addControl(new mapboxgl.FullscreenControl(), "bottom-left");
		map.resize();
	}, []);

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
	const [popup, setShowPopup] = useState({
		show: false,
		orderNumber: '',
		deliveryId: '',
		fullAddress: '',
		driverId: '',
		driverName: '',
		customerName: '',
		provider: '',
		coords: []
	});

	const customerCoords = useMemo(() => (customers ? customers.map(({ coords }) => coords) : null), [customers]);

	const dashboardBounds = useMemo(() => {
		let result = [];
		if (busy) {
			const coordinates = [location, ...couriers, ...customerCoords];
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

	const togglePopup = info => setShowPopup({ show: !popup.show, ...info });

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
					width: '100%',
					overflow: 'visible'
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
					Object.entries(customers).map(([key, value], index) => {
						return (
							<Marker key={index} coordinates={value.coords} onClick={() => togglePopup(value)}>
								<div className='d-flex flex-column' data-bs-placement='top' data-bs-toggle='tooltip' data-bs-html='true'>
									{customers[index].provider === PROVIDERS.UNASSIGNED ? (
										<img src={unassignedDropoffMarker} alt='' width={40} height={40} />
									) : (
										<img src={assignedDropoffMarker} alt='' width={40} height={40} />
									)}
								</div>
							</Marker>
						);
					})}
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
									<img src={assignedDropoffMarker} alt='' width={40} height={40} />
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
				{popup.show && (
					<Popup
						style={{ width: 200, borderRadius: 30 }}
						coordinates={popup.coords}
						offset={{
							'bottom-left': [12, -38],
							bottom: [0, -38],
							'bottom-right': [-12, -38]
						}}
					>
						<div>
							<div className='d-flex justify-content-between align-items-center'>
								<h1 className='fw-bold'>{popup.customerName}</h1>
								<div role='button' onClick={() => history.push(`${PATHS.VIEW_ORDER}/${popup.orderNumber}`)}>
									<BsArrowRightCircleFill size={16} />
								</div>
							</div>
							<span style={{ fontSize: 12 }}>{popup.fullAddress}</span>
							<br />
							<span>
								{popup.provider !== PROVIDERS.PRIVATE
									? `Assigned: ${popup.provider}`
									: popup.driverId
									? `Assigned: ${popup.driverName}`
									: 'Unassigned'}
							</span>
						</div>
					</Popup>
				)}
				{geoJSON.features[0].geometry.coordinates.length && <GeoJSONLayer data={geoJSON} linePaint={linePaint} />}
			</Mapbox>
		</div>
	);
};

Map.propTypes = {};

export default Map;
