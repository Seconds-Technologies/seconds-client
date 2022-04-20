import React, { useCallback, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { analyticsFilterCurrent } from '../../helpers';
import { useSelector } from 'react-redux';

const DriverPerformance = ({ interval, genLabels }) => {
	const filterByInterval = useCallback(analyticsFilterCurrent, [interval]);
	const { total, completed } = useSelector(state => {
		const { allJobs: total, completedJobs: completed } = state['deliveryJobs'];
		return { total: filterByInterval(total, interval), completed: filterByInterval(completed, interval) };
	});

	const calcDriverPerformance = useCallback(
		(ids, providers) => {
			let driverVolume = ids.map(driverId => {
				return completed.filter(({ driverInformation }) => driverInformation.id === driverId).length;
			});
			let courierVolume = providers.map(provider => {
				return completed.filter(({ selectedConfiguration }) => selectedConfiguration.providerId === provider).length;
			});
			return driverVolume.concat(courierVolume);
		},
		[completed]
	);

	const data = useMemo(() => {
		let { driverIds, providerIds, labels } = genLabels();
		let datasets = [
			{
				label: 'Third Party Provider',
				data: calcDriverPerformance(driverIds, providerIds),
				backgroundColor: new Array(driverIds.length).fill('#AD73FF').concat(new Array(providerIds.length).fill('#57C6F7')),
				borderColor: new Array(driverIds.length).fill('#AD73FF').concat(new Array(providerIds.length).fill('#57C6F7')),
				borderWidth: 1
			},
		];
		return {
			labels,
			datasets
		};
	}, [completed]);

	return <Bar options={{
		plugins: {
			legend: {
				display: false,
				labels: {
					padding: 0
				},
				position: 'bottom'
			},
			title: {
				padding: {
					top: 5,
					bottom: 20
				},
				color: '#212529',
				font: {
					weight: 500,
					size: 17
				},
				align: "start",
				display: true,
				text: 'Driver Performance'
			}
		},
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
	}} data={data} />;
};

DriverPerformance.propTypes = {};

export default DriverPerformance;
