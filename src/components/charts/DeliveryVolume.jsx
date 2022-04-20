import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { PROVIDER_TYPES, PROVIDERS } from '../../constants';
import { analyticsFilterCurrent } from '../../helpers';
import { useSelector } from 'react-redux';
import moment from 'moment';

const DeliveryVolume = ({ interval, genLabels }) => {
	const filterByInterval = useCallback(analyticsFilterCurrent, [interval]);

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
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).day() === day).length;
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
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).date() === date).length;
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
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).month() === month).length;
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

	const { data, totalVolume } = useMemo(() => {
		let { values, labels } = genLabels(interval);
		let courierVolume = calculateDeliveryVolume(PROVIDER_TYPES.COURIER, values);
		let driverVolume = calculateDeliveryVolume(PROVIDER_TYPES.DRIVER, values);
		let datasets = [
			{
				label: 'Third Party Providers',
				data: courierVolume,
				borderColor: 'rgba(154, 154, 154, 1)',
				backgroundColor: 'rgba(154, 154, 154, 1)'
			},
			{
				label: 'Internal Drivers',
				data: driverVolume,
				borderColor: '#AD73FF',
				backgroundColor: '#AD73FF'
			}
		];
		const totalVolume = courierVolume.concat(driverVolume).reduce((a, b) => a + b, 0);
		labels.reverse();
		let data = {
			labels,
			datasets
		};
		return { data, totalVolume };
		// return completed.reduce((prev, curr) => prev + curr['selectedConfiguration'].deliveryFee, 0);
	}, [completed, interval]);

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
						text: `${totalVolume}`
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
						text: 'Delivery Volume'
					}
				},
				scales: {
					y: {
						grid: {
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
			data={data}
		/>
	);
};

DeliveryVolume.propTypes = {};

export default DeliveryVolume;
