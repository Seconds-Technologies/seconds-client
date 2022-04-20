import React, { useCallback, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { PROVIDER_TYPES, PROVIDERS } from '../../constants';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { pickupFilter } from '../../helpers';

const DeliveryCost = ({ genLabels, interval, options }) => {
	const filterByInterval = useCallback(pickupFilter, [interval]);

	const { total, completed } = useSelector(state => {
		const { allJobs: total, completedJobs: completed } = state['deliveryJobs'];
		return { total: filterByInterval(total, interval), completed: filterByInterval(completed, interval) };
	});

	const calculateDeliveryFees = useCallback(
		(type, values) => {
			let totalFees;
			switch (interval) {
				case 'week':
					totalFees = values.map(day => {
						if (type === PROVIDER_TYPES.DRIVER) {
							// filter only for jobs completed by internal drivers
							return completed
								.filter(({ selectedConfiguration }) => selectedConfiguration.providerId === PROVIDERS.PRIVATE)
								.reduce((prev, curr) => {
									// check if the order was completed on the selected day
									return moment(curr['jobSpecification'].pickupStartTime).day() === day
										? prev + curr['selectedConfiguration'].deliveryFee
										: 0;
								}, 0);
						} else {
							// filter only jobs completed by third party couriers
							return completed
								.filter(({ selectedConfiguration }) => selectedConfiguration.providerId !== PROVIDERS.PRIVATE)
								.reduce((prev, curr) => {
									// check if the order was completed on the selected day
									return moment(curr['jobSpecification'].pickupStartTime).day() === day
										? prev + curr['selectedConfiguration'].deliveryFee
										: 0;
								}, 0);
						}
					});
					totalFees.reverse();
					return totalFees;
				case 'month':
					totalFees = values.map(date => {
						if (type === PROVIDER_TYPES.DRIVER) {
							// filter only for jobs completed by internal drivers
							return completed
								.filter(({ selectedConfiguration }) => selectedConfiguration.providerId === PROVIDERS.PRIVATE)
								.reduce((prev, curr) => {
									// check if the order was completed on the selected day
									return moment(curr['jobSpecification'].pickupStartTime).date() === date
										? prev + curr['selectedConfiguration'].deliveryFee
										: 0;
								}, 0);
						} else {
							return completed
								.filter(({ selectedConfiguration }) => selectedConfiguration.providerId !== PROVIDERS.PRIVATE)
								.reduce((prev, curr) => {
									// check if the order was completed on the selected day
									return moment(curr['jobSpecification'].pickupStartTime).date() === date
										? prev + curr['selectedConfiguration'].deliveryFee
										: 0;
								}, 0);
						}
					});
					totalFees.reverse();
					return totalFees;
				case 'year':
					totalFees = values.map(month => {
						if (type === PROVIDER_TYPES.DRIVER) {
							// filter only for jobs completed by internal drivers
							return completed
								.filter(({ selectedConfiguration }) => selectedConfiguration.providerId === PROVIDERS.PRIVATE)
								.reduce((prev, curr) => {
									// check if the order was completed on the selected day
									return moment(curr['jobSpecification'].pickupStartTime).month() === month
										? prev + curr['selectedConfiguration'].deliveryFee
										: 0;
								}, 0);
						} else {
							return completed
								.filter(({ selectedConfiguration }) => selectedConfiguration.providerId !== PROVIDERS.PRIVATE)
								.reduce((prev, curr) => {
									// check if the order was completed on the selected day
									return moment(curr['jobSpecification'].pickupStartTime).date() === month
										? prev + curr['selectedConfiguration'].deliveryFee
										: 0;
								}, 0);
						}
					});
					totalFees.reverse();
					return totalFees;
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
				data: calculateDeliveryFees(PROVIDER_TYPES.COURIER, values),
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 1)'
			},
			{
				label: 'Internal Drivers',
				data: calculateDeliveryFees(PROVIDER_TYPES.DRIVER, values),
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

	return (
		<Line
			options={options}
			data={data}
		/>
	);
};

DeliveryCost.propTypes = {};

export default DeliveryCost;
