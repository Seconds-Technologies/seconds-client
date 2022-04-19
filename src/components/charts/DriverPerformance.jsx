import React, { useCallback, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { pickupFilter } from '../../helpers';
import { useSelector } from 'react-redux';

const DriverPerformance = ({ interval, genLabels, options }) => {
	const filterByInterval = useCallback(pickupFilter, [interval]);
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
				return completed.filter(({ selectedConfiguration }) => selectedConfiguration.providerId === provider);
			});
			return driverVolume.concat(courierVolume);
		},
		[completed]
	);

	const data = useMemo(() => {
		let info = genLabels();
		let datasets = [
			{
				label: 'Completed Orders',
				data: calcDriverPerformance(info.driverIds, info.providerIds),
				backgroundColor: 'rgba(255, 105, 57, 0.5)',
				borderColor: 'rgba(255, 105, 57, 1.0)',
				borderWidth: 1
			}
		];
		return {
			labels: info.labels,
			datasets
		};
	}, [completed]);

	return <Bar options={options} data={data} />;
};

DriverPerformance.propTypes = {};

export default DriverPerformance;
