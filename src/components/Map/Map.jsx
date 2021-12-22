import React, { useEffect, useMemo } from 'react';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css';
import pickupMarker from '../../assets/img/pickup-icon.svg';
import dropoffMarker from '../../assets/img/dropoff-icon.svg';
import courierMarker from '../../assets/img/courier-location-icon.svg'

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
						<img src={pickupMarker} alt='' width={40} height={40} />
					</Marker>
				)}
				{bounds &&
					bounds.map((coords, index) => (
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
			</Mapbox>
		</div>
	);
};

Map.propTypes = {};

export default Map;
