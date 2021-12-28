import './Dashboard.css';
import React, { useEffect, useMemo, useState } from 'react';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import Map from '../../components/Map/Map';
import { useDispatch, useSelector } from 'react-redux';
import { Mixpanel } from '../../config/mixpanel';
import { STATUS } from '../../constants';
import { removeError } from '../../store/actions/errors';

const Dashboard = props => {
	const [options] = useState([
		{
			id: 'day',
			name: 'Last 24 hrs'
		},
		{
			id: 'week',
			name: 'Last Week'
		},
		{
			id: 'month',
			name: 'Last Month'
		},
		{
			id: 'year',
			name: 'Last Year'
		}
	]);
	const [active, setActive] = useState({ id: 'day', name: 'Last 24 hrs' });
	const { firstname, address: {geolocation} } = useSelector(state => state['currentUser'].user);
	const dispatch = useDispatch();
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

	const courierLocations = useMemo(() => {
		return activeCouriers.map(({ location }) => location.coordinates);
	}, [activeCouriers]);

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		dispatch(removeError());
	}, []);

	return (
		<div className='dashboard bg-light'>
			<div className='d-flex justify-content-between px-4 pt-3'>
				<div className='d-flex flex-column justify-content-center'>
					<span className='dashboard-header mb-3'>
						<span className='bold-text'>{`Hey ${firstname},`}</span>&nbsp;here is your delivery overview
					</span>
				</div>
				<div className='dropdown'>
					<button
						className='btn bg-white dropdown-toggle border border-1 border-grey'
						type='button'
						id='dropdownMenuButton1'
						data-bs-toggle='dropdown'
						aria-expanded='false'
					>
						{active.name}
					</button>
					<ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
						{options.map(
							({ id, name }, index) =>
								id !== active.id && (
									<li key={index} role='button'>
										{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
										<div className='dropdown-item' onClick={() => setActive({ id, name })}>
											{name}
										</div>
									</li>
								)
						)}
					</ul>
				</div>
			</div>
			<FeaturedInfo interval={active.id} />
			<Map styles='mt-4' busy={courierLocations.length} location={[longitude, latitude]} couriers={courierLocations} height={270} />
		</div>
	);
};

export default Dashboard;
