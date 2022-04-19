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
	const drivers = useSelector(state => state['driversStore'])
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

	const genDriverLabels = useCallback(() => {
		let values = drivers.map(({ id }) => id)
		let labels = drivers.map(driver => `${driver.firstname} ${driver.lastname}`)
		return { values, labels }
	}, [drivers])

	const barData = {
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [
			{
				label: 'Third Party Providers',
				data: ['January', 'February', 'March', 'April', 'May', 'June', 'July'].map(() => faker.datatype.number({ min: 0, max: 1000 })),
				backgroundColor: 'rgba(255, 99, 132, 0.5)'
			},
			{
				label: 'Internal Drivers',
				data: ['January', 'February', 'March', 'April', 'May', 'June', 'July'].map(() => faker.datatype.number({ min: 0, max: 1000 })),
				backgroundColor: 'rgba(53, 162, 235, 0.5)'
			}
		]
	};

	const lineData = {
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [
			{
				label: 'Dataset 1',
				data: ['January', 'February', 'March', 'April', 'May', 'June', 'July'].map(() => faker.datatype.number({ min: -1000, max: 1000 })),
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)'
			},
			{
				label: 'Dataset 2',
				data: ['January', 'February', 'March', 'April', 'May', 'June', 'July'].map(() => faker.datatype.number({ min: -1000, max: 1000 })),
				borderColor: 'rgb(53, 162, 235)',
				backgroundColor: 'rgba(53, 162, 235, 0.5)'
			}
		]
	};

	const pieData = {
		labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
		datasets: [
			{
				label: '# of Votes',
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)'
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
				],
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
							<DeliveryCost
								interval={active.id}
								genLabels={generateLabels}
								options={{
									scales: {
										y: {
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
							<DeliveryVolume
								interval={active.id}
								genLabels={generateLabels}
								options={{
									maintainAspectRatio: false,
									elements: {
										line: {
											borderWidth: 2,
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
							<DriverPerformance interval={active.id} genLabels={genDriverLabels} data={barData}/>
						</div>
					</div>
					<div className='col-sm-12 col-md-6'>
						<div style={{ height: size.height }} className='border border-2 rounded-3 p-3'>
							<Doughnut options={{ maintainAspectRatio: false }} data={pieData} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

Analytics.propTypes = {};

export default Analytics;
