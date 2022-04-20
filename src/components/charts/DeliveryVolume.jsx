import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { PROVIDER_TYPES, PROVIDERS } from '../../constants';
import { pickupFilter } from '../../helpers';
import { useSelector } from 'react-redux';
import moment from 'moment';

const DeliveryVolume = ({ interval, genLabels, options }) => {
	const filterByInterval = useCallback(pickupFilter, [interval]);
	const { total, completed } = useSelector(state => {
		const { allJobs: total, completedJobs: completed } = state['deliveryJobs'];
		return { total: filterByInterval(total, interval), completed: filterByInterval(completed, interval) };
	});

	const calculateDeliveryVolume = useCallback(
		(type, values) => {
			let totalVolume;
			switch (interval) {
				case 'week':
					totalVolume = values.map(day => {
						if (type === PROVIDER_TYPES.DRIVER) {
							// filter only for jobs completed by internal drivers
							return completed
								.filter(({ selectedConfiguration }) => selectedConfiguration.providerId === PROVIDERS.PRIVATE)
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).day() === day).length;
						} else {
							// filter only jobs completed by third party couriers
							return completed
								.filter(({ selectedConfiguration }) => selectedConfiguration.providerId !== PROVIDERS.PRIVATE)
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).day() === day).length
						}
					});
					totalVolume.reverse();
					return totalVolume;
				case 'month':
					totalVolume = values.map(date => {
						if (type === PROVIDER_TYPES.DRIVER) {
							// filter only for jobs completed by internal drivers
							return completed
								.filter(({ selectedConfiguration }) => selectedConfiguration.providerId === PROVIDERS.PRIVATE)
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).date() === date).length;
						} else {
							// filter only jobs completed by third party couriers
							return completed
								.filter(({ selectedConfiguration }) => selectedConfiguration.providerId !== PROVIDERS.PRIVATE)
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).date() === date).length
						}
					});
					totalVolume.reverse();
					return totalVolume;
				case 'year':
					totalVolume = values.map(month => {
						if (type === PROVIDER_TYPES.DRIVER) {
							// filter only for jobs completed by internal drivers
							return completed
								.filter(({ selectedConfiguration }) => selectedConfiguration.providerId === PROVIDERS.PRIVATE)
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).month() === month).length;
						} else {
							// filter only jobs completed by third party couriers
							return completed
								.filter(({ selectedConfiguration }) => selectedConfiguration.providerId !== PROVIDERS.PRIVATE)
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).month() === month).length
						}
					});
					totalVolume.reverse();
					return totalVolume;
				default:
					return new Array(7).fill(0);
			}
		},
		[completed, interval]
	);

	const data = useMemo(() => {
		let { values, labels } = genLabels(interval);

		let datasets = [
			{
				label: 'Third Party Providers',
				data: calculateDeliveryVolume(PROVIDER_TYPES.COURIER, values),
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 1)'
			},
			{
				label: 'Internal Drivers',
				data: calculateDeliveryVolume(PROVIDER_TYPES.DRIVER, values),
				borderColor: 'rgb(53, 162, 235)',
				backgroundColor: 'rgba(53, 162, 235, 1)'
			}
		];

		labels.reverse();
		return {
			labels,
			datasets
		};
		// return completed.reduce((prev, curr) => prev + curr['selectedConfiguration'].deliveryFee, 0);
	}, [completed, interval]);

	return <Line options={options} data={data} />;
};

DeliveryVolume.propTypes = {
	
};

export default DeliveryVolume;
