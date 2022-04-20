import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { PERIOD_TYPE, PROVIDER_TYPES, PROVIDERS } from '../../constants';
import { analyticsFilterCurrent, analyticsFilterPrevious } from '../../helpers';
import { useSelector } from 'react-redux';
import moment from 'moment';
import MuiTooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { BsInfoCircle } from 'react-icons/bs';
import useWindowSize from '../../hooks/useWindowSize';

const DeliveryVolume = ({ interval, intervalLabel, genLabels }) => {
	const dimensions = useWindowSize();
	const size = useMemo(() => {
		return { height: (dimensions.height - 320) / 2, width: dimensions.width / 2 };
	}, [dimensions]);

	const filterCurrent = useCallback(analyticsFilterCurrent, [interval]);
	const filterPrevious = useCallback(analyticsFilterPrevious, [interval]);

	const { currCompleted, prevCompleted } = useSelector(state => {
		const { completedJobs } = state['deliveryJobs'];
		return { currCompleted: filterCurrent(completedJobs, interval), prevCompleted: filterPrevious(completedJobs, interval) };
	});

	const calculateDeliveryVolume = useCallback(
		(type, values, period) => {
			let totalVolume;
			let isDriver = type === PROVIDER_TYPES.DRIVER;
			switch (interval) {
				case 'week':
					totalVolume = values.map(day => {
						if (period === PERIOD_TYPE.CURRENT) {
							// filter only for jobs completed by internal drivers
							return currCompleted
								.filter(({ selectedConfiguration }) =>
									isDriver
										? selectedConfiguration.providerId === PROVIDERS.PRIVATE
										: selectedConfiguration.providerId !== PROVIDERS.PRIVATE
								)
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).day() === day).length;
						} else {
							// filter only jobs completed by third party couriers
							return prevCompleted
								.filter(({ selectedConfiguration }) =>
									isDriver
										? selectedConfiguration.providerId === PROVIDERS.PRIVATE
										: selectedConfiguration.providerId !== PROVIDERS.PRIVATE
								)
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).day() === day).length;
						}
					});
					totalVolume.reverse();
					return totalVolume;
				case 'month':
					totalVolume = values.map(date => {
						if (period === PERIOD_TYPE.CURRENT) {
							// filter only for jobs completed by internal drivers
							return currCompleted
								.filter(({ selectedConfiguration }) =>
									isDriver
										? selectedConfiguration.providerId === PROVIDERS.PRIVATE
										: selectedConfiguration.providerId !== PROVIDERS.PRIVATE
								)
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).date() === date).length;
						} else {
							// filter only jobs completed by third party couriers
							return prevCompleted
								.filter(({ selectedConfiguration }) =>
									isDriver
										? selectedConfiguration.providerId === PROVIDERS.PRIVATE
										: selectedConfiguration.providerId !== PROVIDERS.PRIVATE
								)
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).date() === date).length;
						}
					});
					totalVolume.reverse();
					return totalVolume;
				case 'year':
					totalVolume = values.map(month => {
						if (period === PERIOD_TYPE.CURRENT) {
							// filter only completed jobs for the current time frame
							return currCompleted
								.filter(({ selectedConfiguration }) =>
									isDriver
										? selectedConfiguration.providerId === PROVIDERS.PRIVATE
										: selectedConfiguration.providerId !== PROVIDERS.PRIVATE
								)
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).month() === month).length;
						} else {
							// filter only completed jobs for the previous time frame
							return prevCompleted
								.filter(({ selectedConfiguration }) =>
									isDriver
										? selectedConfiguration.providerId === PROVIDERS.PRIVATE
										: selectedConfiguration.providerId !== PROVIDERS.PRIVATE
								)
								.filter(({ jobSpecification }) => moment(jobSpecification.pickupStartTime).month() === month).length;
						}
					});
					totalVolume.reverse();
					return totalVolume;
				default:
					return new Array(7).fill(0);
			}
		},
		[currCompleted, prevCompleted, interval]
	);

	const { data, totalVolume, percentageChange, percentageChangeString } = useMemo(() => {
		let { values, labels } = genLabels(interval);
		let currCourierVolume = calculateDeliveryVolume(PROVIDER_TYPES.COURIER, values, PERIOD_TYPE.CURRENT);
		let currDriverVolume = calculateDeliveryVolume(PROVIDER_TYPES.DRIVER, values, PERIOD_TYPE.CURRENT);
		let prevCourierVolume = calculateDeliveryVolume(PROVIDER_TYPES.COURIER, values, PERIOD_TYPE.PREVIOUS);
		let prevDriverVolume = calculateDeliveryVolume(PROVIDER_TYPES.DRIVER, values, PERIOD_TYPE.PREVIOUS);

		let datasets = [
			{
				label: 'Third Party Providers',
				data: currCourierVolume,
				borderColor: 'rgba(154, 154, 154, 1)',
				backgroundColor: 'rgba(154, 154, 154, 1)'
			},
			{
				label: 'Internal Drivers',
				data: currDriverVolume,
				borderColor: '#AD73FF',
				backgroundColor: '#AD73FF'
			}
		];
		labels.reverse();
		let data = {
			labels,
			datasets
		};

		const currTotalVolume = currCourierVolume.concat(currDriverVolume).reduce((a, b) => a + b, 0);
		const prevTotalVolume = prevCourierVolume.concat(prevDriverVolume).reduce((a, b) => a + b, 0);
		console.table({ currTotalVolume, prevTotalVolume });

		let increase = currTotalVolume - prevTotalVolume;
		let percentageChange = prevTotalVolume ? (increase / prevTotalVolume) * 100 : 100;
		console.table({ increase, percentageChange });

		let percentageChangeString = percentageChange > 0 ? '+'.concat(percentageChange.toFixed(1).toString()) : percentageChange.toFixed(1).toString();
		console.log(percentageChangeString);
		return { data, totalVolume: currTotalVolume, percentageChange, percentageChangeString };
		// return completed.reduce((prev, curr) => prev + curr['selectedConfiguration'].deliveryFee, 0);
	}, [interval]);

	return (
		<div className='border rounded-3 p-3 position-relative'>
			<MuiTooltip className='position-absolute mt-2 me-3 end-0' title='Track how many orders are being completed' placement='right-start'>
				<IconButton size='small'>
					<BsInfoCircle size={15} />
				</IconButton>
			</MuiTooltip>
			<div className='d-flex flex-column'>
				<span className='font-semibold'>Delivery Volume</span>
				<span className='fs-4'>{totalVolume}</span>
				<small className='text-lowercase font-medium text-muted'>
					<span
						style={{
							color: `${Number(percentageChange) < 0 ? 'red' : 'green'}`
						}}
					>
						{percentageChangeString}%&nbsp;
					</span>
					from the&nbsp;{intervalLabel}
				</small>
			</div>
			<div>
				<Line
					height={size.height}
					options={{
						maintainAspectRatio: false,
						plugins: {
							legend: {
								labels: {
									boxWidth: 5,
									usePointStyle: true,
									pointStyle: 'circle'
								},
								position: 'bottom'
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
			</div>
		</div>
	);
};

DeliveryVolume.propTypes = {};

export default DeliveryVolume;
