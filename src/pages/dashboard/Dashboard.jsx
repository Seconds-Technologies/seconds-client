import './Dashboard.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import Map from '../../components/Map/Map';
import { useDispatch, useSelector } from 'react-redux';
import { Mixpanel } from '../../config/mixpanel';
import { STATUS } from '../../constants';
import { removeError } from '../../store/actions/errors';
import TimeFilter from '../../components/TimeFilter';
import { Steps } from 'intro.js-react';
import { toggleTourHints, updateDashboardTour } from '../../store/actions/onboarding';

const Dashboard = props => {
	const dispatch = useDispatch();
	const [active, setActive] = useState({ id: 'day', name: 'Last 24 hrs' });
	const {
		user: { company, address, fullAddress, lastLogin }
	} = useSelector(state => state['currentUser']);
	const { dashboard } = useSelector(state => state['onboardingStore']);

	const stepsRef = useRef(null);

	const stepsEnabled = useMemo(() => {
		return Boolean(fullAddress && !lastLogin && dashboard.stepsEnabled);
	}, [fullAddress, dashboard, lastLogin]);

	const onBeforeChange = useCallback(
		nextStepIndex => {
			if (nextStepIndex === 4) {
				dispatch(toggleTourHints({ hintsEnabled: true, hints: dashboard.hints }));
				stepsRef.current.updateStepElement(nextStepIndex);
			}
		},
		[stepsRef]
	);

	const activeCustomers = useSelector(state =>
		state['deliveryJobs'].allJobs
			.filter(item => ![STATUS.COMPLETED, STATUS.CANCELLED].includes(item.status))
			.flatMap(job => {
				return job['jobSpecification'].deliveries.map(delivery => ({
					orderNumber: job['jobSpecification']['orderNumber'],
					driverId: job['driverInformation']['id'],
					driverName: job['driverInformation']['name'],
					provider: job['selectedConfiguration']['providerId'],
					...delivery
				}));
			})
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
		if (address && address.geolocation && address.geolocation.coordinates && address.geolocation.coordinates.length === 2) {
			return { longitude: address.geolocation.coordinates[0], latitude: address.geolocation.coordinates[1] };
		}
		return { longitude: Number(localStorage.getItem('longitude')), latitude: Number(localStorage.getItem('latitude')) };
	}, [address]);

	const courierLocations = useMemo(() => activeCouriers.map(({ location }) => location.coordinates), [activeCouriers]);

	const customerLocations = useMemo(
		() =>
			activeCustomers
				.filter(({ dropoffLocation: { latitude, longitude } }) => latitude && longitude)
				.map(
					({
						orderNumber,
						id,
						driverName,
						driverId,
						provider,
						dropoffLocation: { firstName, lastName, fullAddress, latitude, longitude }
					}) => ({
						orderNumber,
						customerName: `${firstName} ${lastName}`,
						fullAddress,
						driverId,
						driverName,
						provider,
						deliveryId: id,
						coords: [longitude, latitude]
					})
				),
		[activeCustomers]
	);

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		dispatch(removeError());
	}, [props.location]);

	return (
		<div id='dashboard-page' className='page-container'>
			<Steps
				ref={stepsRef}
				enabled={stepsEnabled}
				steps={dashboard.steps}
				initialStep={0}
				onBeforeChange={onBeforeChange}
				onExit={() => {
					dispatch(updateDashboardTour({ stepsEnabled: false }));
					/*dispatch(updateCurrentUser({ lastLogin: dayjs().format() }));
					dispatch(
						updateProfile({
							id,
							lastLogin: dayjs().format()
						})
					);*/
				}}
				options={{
					exitOnEsc: true,
					exitOnOverlayClick: false,
					showStepNumbers: true,
					showBullets: false,
					showProgress: true,
					skipLabel: 'Skip',
					doneLabel: 'Done'
				}}
			/>
			<div className='d-flex justify-content-between px-4 pt-3'>
				<div className='d-flex flex-column justify-content-center'>
					<span className='dashboard-header mb-3'>
						<span className='bold-text'>{`Hey ${company},`}</span>&nbsp;your delivery overview
					</span>
				</div>
				<TimeFilter current={active} onSelect={setActive} />
			</div>
			<FeaturedInfo id='dashboard' interval={active.id} />
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
