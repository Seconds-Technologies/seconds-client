import './Dashboard.css';
import React, { useEffect, useMemo, useState } from 'react';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import Map from '../../components/Map/Map';
import { useDispatch, useSelector } from 'react-redux';
import { Mixpanel } from '../../config/mixpanel';
import { STATUS } from '../../constants';
import { removeError } from '../../store/actions/errors';
import TimeFilter from '../../components/TimeFilter';

const Dashboard = props => {
	const [active, setActive] = useState({ id: 'day', name: 'Last 24 hrs' });
	const {
		company,
		address: { geolocation }
	} = useSelector(state => state['currentUser'].user);
	const dispatch = useDispatch();
	const activeCustomers = useSelector(state =>
		state['deliveryJobs'].allJobs
			.filter(item => ![STATUS.CANCELLED, STATUS.COMPLETED, STATUS.NEW, STATUS.PENDING].includes(item.status))
			.flatMap(item => item['jobSpecification'].deliveries)
	);
	const activeCouriers = useSelector(state =>
		state['deliveryJobs'].allJobs
			.filter(item => ![STATUS.CANCELLED, STATUS.COMPLETED, STATUS.NEW].includes(item.status))
			.filter(
				item =>
					item['driverInformation'].location &&
					item['driverInformation'].location.coordinates &&
					item['driverInformation'].location.coordinates.length === 2
			)
			.map(({ driverInformation }) => driverInformation)
	);

	const { longitude, latitude } = useMemo(() => {
		if (geolocation && geolocation.coordinates && geolocation.coordinates.length === 2) {
			return { longitude: geolocation.coordinates[0], latitude: geolocation.coordinates[1] };
		}
		return { longitude: Number(localStorage.getItem('longitude')), latitude: Number(localStorage.getItem('latitude')) };
	}, [geolocation]);

	const courierLocations = useMemo(() => activeCouriers.map(({ location }) => location.coordinates), [activeCouriers]);

	const customerLocations = useMemo(
		() =>
			activeCustomers
				.filter(({ dropoffLocation: { latitude, longitude } }) => latitude && longitude)
				.map(({ dropoffLocation: { latitude, longitude } }) => [longitude, latitude]),
		[activeCustomers]
	);

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		dispatch(removeError());
	}, []);

	return (
		<div className='page-container'>
			<div className='d-flex justify-content-between px-4 pt-3'>
				<div className='d-flex flex-column justify-content-center'>
					<span className='dashboard-header mb-3'>
						<span className='bold-text'>{`Hey ${company},`}</span>&nbsp;here is your delivery overview
					</span>
				</div>
				<TimeFilter current={active} onSelect={setActive} />
			</div>
			<FeaturedInfo interval={active.id} />
			<Map
				styles='mt-4'
				busy={courierLocations.length || customerLocations.length}
				location={[longitude, latitude]}
				couriers={courierLocations}
				customers={customerLocations}
				height={200}
			/>
		</div>
	);
};

export default Dashboard;
