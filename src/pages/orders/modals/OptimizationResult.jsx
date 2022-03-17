import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import moment from 'moment';

const ROUTES = [
	{
		summary: {
			total_time: 12.96833324432373,
			distance: 6.4456,
			travel_time: 12.968333333333334,
			service_time: 0,
			begin_time: 1647544000,
			end_time: 1647544012.9683332,
			wait_time: 0,
			late_time: 0,
			pickup_quantity: 0,
			dropoff_quantity: 2,
			paired_pickup_quantity: 0,
			paired_delivery_quantity: 0,
			num_breaks: 0,
			num_orders: 2,
			vehicle_id: 'BIC-CSRd2NI9WkzD',
			route_id: 0,
			profile: 'car'
		},
		stops: [
			{
				id: 'Spicy Mango Technology',
				arrival_time: 1647544000,
				wait_time: 0,
				service_time: 0,
				late_time: 0,
				depart_time: 1647544000,
				type: 'start_depot',
				geometry: {
					lon: -0.1141112,
					lat: 51.4622144,
					zipcode: 'SW9 8PR'
				}
			},
			{
				id: '0951-350724-4409',
				arrival_time: 1647544000.9066668,
				wait_time: 0,
				service_time: 0,
				late_time: 0,
				depart_time: 1647544000.9066668,
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
				id: '0951-350684-3455',
				arrival_time: 1647544012.9683335,
				wait_time: 0,
				service_time: 0,
				late_time: 0,
				depart_time: 1647544012.9683335,
				type: 'order',
				duration_from_previous: 12.061666666666667,
				distance_from_previous: 6.0465,
				paired_stop: 'null',
				geometry: {
					lon: -0.1726312,
					lat: 51.4486718,
					zipcode: 'SW19 8QT'
				}
			}
		]
	},
	{
		summary: {
			total_time: 20.509999990463257,
			distance: 9.552200000000001,
			travel_time: 20.509999999999998,
			service_time: 0,
			begin_time: 1647544000,
			end_time: 1647544020.51,
			wait_time: 0,
			late_time: 0,
			pickup_quantity: 0,
			dropoff_quantity: 1,
			paired_pickup_quantity: 0,
			paired_delivery_quantity: 0,
			num_breaks: 0,
			num_orders: 1,
			vehicle_id: 'MTB-Tj9Nc1bOrSXL',
			route_id: 1,
			profile: 'car'
		},
		stops: [
			{
				id: 'Spicy Mango Technology',
				arrival_time: 1647544000,
				wait_time: 0,
				service_time: 0,
				late_time: 0,
				depart_time: 1647544000,
				type: 'start_depot',
				geometry: {
					lon: -0.1141112,
					lat: 51.4622144,
					zipcode: 'SW9 8PR'
				}
			},
			{
				id: '0951-350074-6344',
				arrival_time: 1647544020.51,
				wait_time: 0,
				service_time: 0,
				late_time: 0,
				depart_time: 1647544020.51,
				type: 'order',
				duration_from_previous: 20.509999999999998,
				distance_from_previous: 9.552200000000001,
				paired_stop: 'null',
				geometry: {
					lon: -0.1620334,
					lat: 51.52596450000001,
					zipcode: 'NW1 6XU'
				}
			}
		]
	}
];

const OptimizationResult = ({ show, onHide, routes }) => {
	const { allJobs } = useSelector(state => state['deliveryJobs']);

	const jobs = useMemo(() => {
		const result = [];
		for (let route of ROUTES) {
			for (let stop of route.stops) {
				let matches = allJobs.filter(({ jobSpecification: { orderNumber } }) => orderNumber === stop.id);
				result.push(...matches);
			}
		}
		return result;
	}, [routes]);

	return (
		<Modal show={show} onHide={onHide} centered size='lg'>
			<div className="container p-4">
				{routes.map((route, index) => (
					<ol className='list-group list-group-numbered mb-3'>
						<h1 className="fs-2">{"Route #" + index}</h1>
						{route.stops.map(stop => {
							const job = allJobs.find(({ jobSpecification: { orderNumber } }) => orderNumber === stop.id);
							return job ? (
								<li className='list-group-item d-flex justify-content-between align-items-start'>
									<div className='d-flex flex-column ms-2 me-auto'>
										<div className='fw-bold'>{stop.id}</div>
										<span>{job.jobSpecification.deliveries[0].dropoffLocation.fullAddress}</span>
										<span className="text-muted">{moment(job.jobSpecification.deliveries[0].dropoffEndTime).calendar()}</span>
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
				))}
			</div>
		</Modal>
	);
};

OptimizationResult.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	routes: PropTypes.array.isRequired
};

export default OptimizationResult;
