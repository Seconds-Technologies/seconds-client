import React, { useCallback, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { PERIOD_TYPE, PROVIDER_TYPES, PROVIDERS } from '../../constants';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { analyticsFilterCurrent, analyticsFilterPrevious } from '../../helpers';

const DeliveryCost = ({ genLabels, interval }) => {
	const filterCurrent = useCallback(analyticsFilterCurrent, [interval]);
	const filterPrevious = useCallback(analyticsFilterPrevious, [interval]);

	const { currTotal, currCompleted, prevTotal, prevCompleted } = useSelector(state => {
		const { allJobs, completedJobs } = state['deliveryJobs'];
		return {
			currTotal: filterCurrent(allJobs, interval),
			currCompleted: filterCurrent(completedJobs, interval),
			prevTotal: filterPrevious(allJobs, interval),
			prevCompleted: filterPrevious(completedJobs, interval)
		};
	});

	const calculateDeliveryFees = useCallback(
		(type, values, period) => {
			let totalFees = [];
			let isDriver = type === PROVIDER_TYPES.DRIVER
			switch (interval) {
				case 'week':
					totalFees = values.map(day => {
						if (period === PERIOD_TYPE.CURRENT) {
							// filter only for jobs completed by internal drivers
							return currCompleted
								.filter(({ selectedConfiguration }) => isDriver ? selectedConfiguration.providerId === PROVIDERS.PRIVATE : selectedConfiguration.providerId !== PROVIDERS.PRIVATE)
								.reduce((prev, curr) => {
									// check if the order was completed on the selected day
									return moment(curr['jobSpecification'].pickupStartTime).day() === day
										? prev + curr['selectedConfiguration'].deliveryFee
										: 0;
								}, 0);
						} else {
							// filter only jobs completed by third party couriers
							return prevCompleted
								.filter(({ selectedConfiguration }) => isDriver ? selectedConfiguration.providerId === PROVIDERS.PRIVATE : selectedConfiguration.providerId !== PROVIDERS.PRIVATE)
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
						if (period === PERIOD_TYPE.CURRENT) {
							// filter only for jobs completed by internal drivers
							return currCompleted
								.filter(({ selectedConfiguration }) => isDriver ? selectedConfiguration.providerId === PROVIDERS.PRIVATE : selectedConfiguration.providerId !== PROVIDERS.PRIVATE)
								.reduce((prev, curr) => {
									// check if the order was completed on the selected day
									return moment(curr['jobSpecification'].pickupStartTime).date() === date
										? prev + curr['selectedConfiguration'].deliveryFee
										: 0;
								}, 0);
						} else {
							return prevCompleted
								.filter(({ selectedConfiguration }) => isDriver ? selectedConfiguration.providerId === PROVIDERS.PRIVATE : selectedConfiguration.providerId !== PROVIDERS.PRIVATE)
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
						if (period === PERIOD_TYPE.CURRENT) {
							// filter only for jobs completed by internal drivers
							return currCompleted
								.filter(({ selectedConfiguration }) => isDriver ? selectedConfiguration.providerId === PROVIDERS.PRIVATE : selectedConfiguration.providerId !== PROVIDERS.PRIVATE)
								.reduce((prev, curr) => {
									// check if the order was completed on the selected day
									return moment(curr['jobSpecification'].pickupStartTime).month() === month
										? prev + curr['selectedConfiguration'].deliveryFee
										: 0;
								}, 0);
						} else {
							return prevCompleted
								.filter(({ selectedConfiguration }) => isDriver ? selectedConfiguration.providerId === PROVIDERS.PRIVATE : selectedConfiguration.providerId !== PROVIDERS.PRIVATE)
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
		[currCompleted, prevCompleted, interval]
	);

	const { data, totalCost, percentageChange } = useMemo(() => {
		let { values, labels } = genLabels(interval);
		let currCourierCosts = calculateDeliveryFees(PROVIDER_TYPES.COURIER, values, PERIOD_TYPE.CURRENT);
		let currDriverCosts = calculateDeliveryFees(PROVIDER_TYPES.DRIVER, values, PERIOD_TYPE.CURRENT);
		let prevCourierCosts = calculateDeliveryFees(PROVIDER_TYPES.COURIER, values, PERIOD_TYPE.PREVIOUS);
		let prevDriverCosts = calculateDeliveryFees(PROVIDER_TYPES.DRIVER, values, PERIOD_TYPE.PREVIOUS);

		let datasets = [
			{
				label: 'Third Party Providers',
				data: currCourierCosts,
				borderColor: 'rgba(154, 154, 154, 1)',
				backgroundColor: 'rgba(154, 154, 154, 1)'
			},
			{
				label: 'Internal Drivers',
				data: currDriverCosts,
				borderColor: '#AD73FF',
				backgroundColor: '#AD73FF'
			}
		];
		let data = {
			labels,
			datasets
		};

		let currTotalCost = currCourierCosts.concat(currDriverCosts).reduce((a, b) => a + b, 0);
		let prevTotalCost = prevCourierCosts.concat(prevDriverCosts).reduce((a, b) => a + b, 0);
		console.table({currTotalCost, prevTotalCost})
		let increase = currTotalCost - prevTotalCost
		let percentageChange = prevTotalCost ? (increase / prevTotalCost) * 100 : 100
		console.table({increase, percentageChange})
		labels.reverse();
		return { data, totalCost: currTotalCost, percentageChange };
		// return completed.reduce((prev, curr) => prev + curr['selectedConfiguration'].deliveryFee, 0);
	}, [interval]);

	return (
		<Line
			options={{
				plugins: {
					legend: {
						position: 'bottom'
					},
					subtitle: {
						padding: {
							top: 0,
							bottom: 15
						},
						align: 'start',
						font: {
							weight: 500,
							size: 24
						},
						display: true,
						text: `£${totalCost.toFixed(2)}`
					},
					title: {
						padding: {
							top: 5,
							bottom: 6
						},
						color: '#212529',
						font: {
							weight: 500,
							size: 17
						},
						align: 'start',
						display: true,
						text: 'Delivery Costs'
					}
				},
				scales: {
					y: {
						grid: {
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
						radius: 0,
						hoverRadius: 5
					}
				}
			}}
			data={data}
		/>
	);
};

DeliveryCost.propTypes = {};

export default DeliveryCost;
