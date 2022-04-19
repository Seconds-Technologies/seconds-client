import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import TimeFilter from '../../components/TimeFilter';
import { dateFilter } from '../../helpers';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import useWindowSize from '../../hooks/useWindowSize';
import { faker } from '@faker-js/faker';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, PointElement, LineElement, ArcElement);

const Analytics = props => {
	const [active, setActive] = useState({ id: 'day', name: 'Last 24 hrs' });
	const filterByInterval = useCallback(dateFilter, [active.id]);
	const dimensions = useWindowSize();
	const [labels, updateLabels] = useState(['January', 'February', 'March', 'April', 'May', 'June', 'July']);

	const barData = {
		labels,
		datasets: [
			{
				label: 'Dataset 1',
				data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
				backgroundColor: 'rgba(255, 99, 132, 0.5)'
			},
			{
				label: 'Dataset 2',
				data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
				backgroundColor: 'rgba(53, 162, 235, 0.5)'
			}
		]
	};

	const lineData = {
		labels,
		datasets: [
			{
				label: 'Dataset 1',
				data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)'
			},
			{
				label: 'Dataset 2',
				data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
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

	useEffect(() => {
		console.table(dimensions);
	}, [dimensions]);

	return (
		<div className='page-container px-2 py-4'>
			<div className='d-flex mx-3 mb-2 justify-content-between'>
				<h3>Analytics</h3>
				<TimeFilter current={active} onSelect={setActive} />
			</div>

			<div className='container-fluid'>
				<div className='row gy-3'>
					<div className='col-sm-12 col-md-6'>
							<div style={{ height: size.height }} className="border border-2 rounded-3 p-3">
							<Line options={{ maintainAspectRatio: false }} data={lineData} />
						</div>
					</div>
					<div className='col-sm-12 col-md-6'>
						<div style={{ height: size.height }} className="border border-2 rounded-3 p-3">
							<Line options={{ maintainAspectRatio: false }} data={lineData} />
						</div>
					</div>
					<div className='col-sm-12 col-md-6'>
						<div style={{ height: size.height }} className="border border-2 rounded-3 p-3">
							<Bar options={{ maintainAspectRatio: false }} data={barData} />
						</div>
					</div>
					<div className='col-sm-12 col-md-6'>
						<div style={{ height: size.height }} className="border border-2 rounded-3 p-3">
							<Doughnut options={{ maintainAspectRatio: false }} data={pieData}/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

Analytics.propTypes = {};

export default Analytics;
