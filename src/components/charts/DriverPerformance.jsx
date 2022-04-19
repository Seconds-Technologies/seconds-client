import React, { useCallback, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { pickupFilter } from '../../helpers';
import { useSelector } from 'react-redux';
import { PROVIDERS } from '../../constants';

const DriverPerformance = ({ interval, genLabels, barData }) => {
	const filterByInterval = useCallback(pickupFilter, [interval]);
	const { total, completed } = useSelector(state => {
		const { allJobs: total, completedJobs: completed } = state['deliveryJobs'];
		return { total: filterByInterval(total, interval), completed: filterByInterval(completed, interval) };
	});

	useEffect(() => {
		console.log(completed.filter(({ selectedConfiguration: { providerId } }) => providerId === PROVIDERS.PRIVATE));
	}, [completed, interval]);

	const calcDriverPerformance = useCallback(
		ids => {
			let totalVolume = ids.map(driverId => {
				return completed.filter(({ driverInformation }) => driverInformation.id === driverId).length;
			});
			console.log(totalVolume);
			totalVolume.reverse();
			return totalVolume;
		},
		[completed]
	);

	const data = useMemo(() => {
		let { values, labels } = genLabels();
		let datasets = [
			{
				label: 'Completed Orders',
				data: calcDriverPerformance(values),
				backgroundColor: 'rgba(255, 105, 57, 0.5)'
			}
		];
		labels.reverse();
		return {
			labels,
			datasets
		};
	}, [completed]);

	return <Bar options={{ maintainAspectRatio: false }} data={data} />;
};

DriverPerformance.propTypes = {};

export default DriverPerformance;
