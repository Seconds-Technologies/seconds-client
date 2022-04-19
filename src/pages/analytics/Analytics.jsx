import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TimeFilter from '../../components/TimeFilter';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Legend, Title, Tooltip } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import useWindowSize from '../../hooks/useWindowSize';
import { faker } from '@faker-js/faker';
import moment from 'moment';
import DeliveryCost from '../../components/charts/DeliveryCost';
import DeliveryVolume from '../../components/charts/DeliveryVolume';
import DriverPerformance from '../../components/charts/DriverPerformance';
import { useSelector } from 'react-redux';
import DeliveryOverview from '../../components/charts/DeliveryOverview';
import { FLEET_PROVIDERS } from '../../constants';
import { capitalize } from '../../helpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, PointElement, LineElement, Legend, ArcElement);

const options = [
	{
		id: 'week',
		name: 'Last 7 days'
	},
	{
		id: 'month',
		name: 'Last Month'
	},
	{
		id: 'year',
		name: 'Last Year'
	}
];

const Analytics = props => {
	const dimensions = useWindowSize();
	const drivers = useSelector(state => state['driversStore']);
	const [active, setActive] = useState({ id: 'week', name: 'Last 7 days' });

	const generateLabels = useCallback(period => {
		let values;
		let labels;
		const week = new Array(7).fill(0);
		const month = new Array(moment().date()).fill(0);
		const year = new Array(7).fill(0);
		switch (period) {
			case 'week':
				values = week.map((_, index) => moment().subtract(index, 'd').day());
				labels = week.map((_, index) => moment().subtract(index, 'd').format('dddd'));
				return { values, labels };
			case 'month':
				values = month.map((_, index) => moment().subtract(index, 'd').date());
				labels = month.map((_, index) => moment().subtract(index, 'd').format('Do MMM'));
				return { values, labels };
			case 'year':
				values = year.map((_, index) => moment().subtract(index, 'M').month());
				labels = year.map((_, index) => moment().subtract(index, 'M').format('MMM'));
				return { values, labels };
			default:
				values = week.map((_, index) => moment().subtract(index, 'd').day());
				labels = week.map((_, index) => moment().subtract(index, 'd').format('dddd'));
				return { values, labels };
		}
	}, []);

	const genPerformanceLabels = useCallback(() => {
		let driverIds = drivers.map(({ id }) => id);
		let providers = FLEET_PROVIDERS.map(provider => capitalize(provider).replaceAll("_", " "))
		let labels = drivers.map(driver => `${driver.firstname} ${driver.lastname}`).concat(providers);
		return { driverIds, providerIds: FLEET_PROVIDERS, labels };
	}, [drivers]);

	const pieData = {
		labels: ['Completed', 'Uncompleted', 'Cancelled', 'Unassigned'],
		datasets: [
			{
				label: '# of Votes',
				data: [12, 19, 3, 5],
				backgroundColor: ['rgba(101, 188, 85, 0.2)', 'rgba(255, 105, 57, 0.2)', 'rgba(154, 154, 154, 0.2)', 'rgba(157, 61, 61, 0.2)'],
				borderColor: ['rgba(101, 188, 85, 1)', 'rgba(255, 105, 57, 1)', 'rgba(154, 154, 154, 1)', 'rgba(157, 61, 61, 1)'],
				borderWidth: 1
			}
		]
	};

	const size = useMemo(() => {
		return { height: (dimensions.height - 114) / 2, width: (dimensions.width - 60) / 2 };
	}, [dimensions]);

	return (
		<div className='page-container px-2 py-4'>
			<div className='d-flex mx-3 mb-2 justify-content-between'>
				<h3>Analytics</h3>
				<TimeFilter current={active} onSelect={setActive} initialOptions={options} />
			</div>

			<div className='container-fluid'>
				<div className='row gy-3'>
					<div className='col-sm-12 col-md-6'>
						<div style={{ height: size.height }} className='border border-2 rounded-3 p-3'>
							<DeliveryOverview interval={active.id} />
						</div>
					</div>
					<div className='col-sm-12 col-md-6'>
						<div style={{ height: size.height }} className='border border-2 rounded-3 p-3'>
							<DeliveryCost
								interval={active.id}
								genLabels={generateLabels}
								options={{
									scales: {
										y: {
											grid:{
												display: false
											},
											ticks: {
												callback: (value, index, ticks) => '£' + value
											}
										}
									},
									maintainAspectRatio: false,
									elements: {
										line: {
											borderWidth: 2
										},
										point: {
											radius: 0
										}
									}
								}}
							/>
						</div>
					</div>
					<div className='col-sm-12 col-md-6'>
						<div style={{ height: size.height }} className='border border-2 rounded-3 p-3'>
							<DriverPerformance options={{
								maintainAspectRatio: false,
								scales: {
									y: {
										grid:{
											display: false
										},
										ticks: {
											// forces step size to be 50 units
											stepSize: 1
										}
									}
								}
							}} interval={active.id} genLabels={genPerformanceLabels} />
						</div>
					</div>
					<div className='col-sm-12 col-md-6'>
						<div style={{ height: size.height }} className='border border-2 rounded-3 p-3'>
							<DeliveryVolume
								interval={active.id}
								genLabels={generateLabels}
								options={{
									scales: {
										y: {
											grid:{
												display: false
											},
											ticks: {
												stepSize: 1
											}
										}
									},
									maintainAspectRatio: false,
									elements: {
										line: {
											borderWidth: 2
										},
										point: {
											radius: 0
										}
									}
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

Analytics.propTypes = {};

export default Analytics;
