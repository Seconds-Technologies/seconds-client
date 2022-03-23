import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import moment from 'moment';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '../../../components/TabPanel';
import { VEHICLE_TYPES } from '../../../constants';

const TEST_ROUTES = [
	{
		summary: {
			total_time: 2507.0,
			distance: 4.106199999999999,
			travel_time: 9.738333333333333,
			service_time: 0.0,
			begin_time: 1647967693.0,
			end_time: 1647970200.0,
			wait_time: 2497.2616666666668,
			late_time: 0.0,
			pickup_quantity: 0.0,
			dropoff_quantity: 1.0,
			paired_pickup_quantity: 0.0,
			paired_delivery_quantity: 0.0,
			num_breaks: 0,
			num_orders: 1,
			vehicle_id: 'BIC',
			route_id: 0,
			profile: 'car'
		},
		stops: [
			{
				id: 'Guzzl',
				arrival_time: 1647967693.0,
				wait_time: 0,
				service_time: 0.0,
				late_time: 0,
				depart_time: 1647967693.0,
				type: 'start_depot',
				geometry: {
					lon: -0.1141112,
					lat: 51.4622144,
					zipcode: 'SW9 8PR'
				}
			},
			{
				id: '0951-899217-0496',
				arrival_time: 1647967702.7383332,
				wait_time: 2497.2616667747498,
				service_time: 0.0,
				late_time: 0.0,
				depart_time: 1647970200.0,
				type: 'order',
				duration_from_previous: 9.738333333333333,
				distance_from_previous: 4.106199999999999,
				paired_stop: 'null',
				geometry: {
					lon: -0.0791506,
					lat: 51.4702856,
					zipcode: ' SE5 8NA'
				}
			}
		]
	},
	{
		summary: {
			total_time: 2518.358333349228,
			distance: 5.7196,
			travel_time: 12.265,
			service_time: 0.0,
			begin_time: 1647967693.0,
			end_time: 1647970211.3583333,
			wait_time: 2506.093333349228,
			late_time: 0.0,
			pickup_quantity: 0.0,
			dropoff_quantity: 3.0,
			paired_pickup_quantity: 0.0,
			paired_delivery_quantity: 0.0,
			num_breaks: 0,
			num_orders: 3,
			vehicle_id: 'MTB',
			route_id: 1,
			profile: 'car'
		},
		stops: [
			{
				id: 'Guzzl',
				arrival_time: 1647967693.0,
				wait_time: 0,
				service_time: 0.0,
				late_time: 0,
				depart_time: 1647967693.0,
				type: 'start_depot',
				geometry: {
					lon: -0.1141112,
					lat: 51.4622144,
					zipcode: 'SW9 8PR'
				}
			},
			{
				id: '0951-899254-8539',
				arrival_time: 1647967693.9066668,
				wait_time: 2506.0933332443237,
				service_time: 0.0,
				late_time: 0.0,
				depart_time: 1647970200.0,
				type: 'order',
				duration_from_previous: 0.9066666666666666,
				distance_from_previous: 0.3991,
				paired_stop: 'null',
				geometry: {
					lon: -0.1146818,
					lat: 51.4589562,
					zipcode: 'SW2 1BZ'
				}
			},
			{
				id: '0951-899028-9415',
				arrival_time: 1647970205.065,
				wait_time: 0.0,
				service_time: 0.0,
				late_time: 0.0,
				depart_time: 1647970205.065,
				type: 'order',
				duration_from_previous: 5.0649999999999995,
				distance_from_previous: 2.1056,
				paired_stop: 'null',
				geometry: {
					lon: -0.1235256,
					lat: 51.4639252,
					zipcode: 'SW9 9PB'
				}
			},
			{
				id: '0951-899091-6141',
				arrival_time: 1647970211.3583333,
				wait_time: 0.0,
				service_time: 0.0,
				late_time: 0.0,
				depart_time: 1647970211.3583333,
				type: 'order',
				duration_from_previous: 6.293333333333334,
				distance_from_previous: 3.2149,
				paired_stop: 'null',
				geometry: {
					lon: -0.1133062,
					lat: 51.4852173,
					zipcode: 'SE11 5DE'
				}
			}
		]
	}
];

const OptimizationResult = ({ show, onHide, routes, unreachable, onAssign }) => {
	const { allJobs } = useSelector(state => state['deliveryJobs']);
	/*const jobs = useMemo(() => {
		const result = [];
		for (let route of ROUTES) {
			for (let stop of route.stops) {
				let matches = allJobs.filter(({ jobSpecification: { orderNumber } }) => orderNumber === stop.id);
				result.push(...matches);
			}
		}
		return result;
	}, [routes]);*/
	const [value, setValue] = React.useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Modal show={show} onHide={onHide} centered size='lg'>
			<div className='container p-4'>
				<h1 className="text-center">Optimized Routes</h1>
				<Box sx={{ width: '100%' }}>
					<AppBar sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, backgroundColor: 'white', boxShadow: 'none' }}>
						<Tabs
							indicatorColor='secondary'
							value={value}
							onChange={handleChange}
							aria-label='basic tabs example'
							variant='scrollable'
							scrollButtons='auto'
							allowScrollButtonsMobile
						>
							{routes.map(({ summary, stops }, index) => (
								<Tab
									key={index}
									label={`${VEHICLE_TYPES.find(item => item.value === summary.vehicle_id).label}-${index}`}
									id={`simple-tab-${index}`}
									aria-controls={`simple-tabpanel-${index}`}
								/>
							))}
							{unreachable.length && (
								<Tab label='Unreachable' id={`simple-tab-${routes.length}`} aria-controls={`simple-tabpanel-${routes.length}`} />
							)}
						</Tabs>
					</AppBar>
					{routes.map((route, index) => (
						<TabPanel key={index} value={value} index={index}>
							<ol className='list-group list-group-numbered mb-3'>
								{route.stops.map((stop, index) => {
									const job = allJobs.find(({ jobSpecification: { orderNumber } }) => orderNumber === stop.id);
									return job ? (
										<li key={index} className='list-group-item d-flex justify-content-between align-items-start'>
											<div className='d-flex flex-column ms-2 me-auto'>
												<div className='fw-bold'>{stop.id}</div>
												<span>{job.jobSpecification.deliveries[0].dropoffLocation.fullAddress}</span>
												<span className='text-muted'>
													Deliver from: {moment(job.jobSpecification.deliveries[0].dropoffStartTime).calendar()}&emsp; - &emsp; Deliver until:{' '}
													{moment(job.jobSpecification.deliveries[0].dropoffEndTime).calendar()}
												</span>
											</div>
										</li>
									) : (
										<li className='list-group-item d-flex justify-content-between align-items-start'>
											<div className='ms-2 me-auto'>
												<div className='fw-bold'>{stop.id}</div>
												<span>Start Depot</span>
											</div>
										</li>
									);
								})}
							</ol>
							<div className='d-flex justify-content-end'>
								<button className='btn btn-lg btn-primary' style={{ width: 120 }} onClick={() => onAssign(route.summary.vehicle_id)}>
									<span>Assign</span>
								</button>
							</div>
						</TabPanel>
					))}
					{unreachable.length && (
						<TabPanel value={value} index={routes.length}>
							<ol className='list-group list-group-numbered mb-3'>
								{unreachable.map(orderNo => {
									const job = allJobs.find(({ jobSpecification: { orderNumber } }) => orderNumber === orderNo);
									return (
										<li className='list-group-item d-flex justify-content-between align-items-start'>
											<div className='d-flex flex-column ms-2 me-auto'>
												<div className='fw-bold'>{orderNo}</div>
												<span>{job.jobSpecification.deliveries[0].dropoffLocation.fullAddress}</span>
												<span className='text-muted'>
													Pickup at: {moment(job.jobSpecification.pickupStartTime).calendar()}&emsp; - &emsp; Deliver until:{' '}
													{moment(job.jobSpecification.deliveries[0].dropoffEndTime).calendar()}
												</span>
											</div>
										</li>
									);
								})}
							</ol>
						</TabPanel>
					)}
				</Box>
			</div>
		</Modal>
	);
};

OptimizationResult.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	routes: PropTypes.array.isRequired,
	unreachable: PropTypes.array,
	onAssign: PropTypes.func.isRequired
};

export default OptimizationResult;
