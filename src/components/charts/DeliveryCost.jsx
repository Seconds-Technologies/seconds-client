import React, { useCallback, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { PERIOD_TYPE, PROVIDER_TYPES, PROVIDERS } from '../../constants';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { analyticsFilterCurrent, analyticsFilterPrevious } from '../../helpers';
import MuiTooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { BsInfoCircle } from 'react-icons/bs';
import useWindowSize from '../../hooks/useWindowSize';

const DeliveryCost = ({ genLabels, interval, intervalLabel }) => {
	const dimensions = useWindowSize();
	const size = useMemo(() => {
		return { height: (dimensions.height - 320) / 2, width: dimensions.width / 2 };
	}, [dimensions]);

	const filterCurrent = useCallback(analyticsFilterCurrent, [interval]);
	const filterPrevious = useCallback(analyticsFilterPrevious, [interval]);

	const { currCompleted, prevCompleted } = useSelector(state => {
		const { completedJobs } = state['deliveryJobs'];
		return {
			currCompleted: filterCurrent(completedJobs, interval),
			prevCompleted: filterPrevious(completedJobs, interval)
		};
	});

	const calculateDeliveryFees = useCallback(
		(type, values, period) => {
			let totalFees = [];
			let isDriver = type === PROVIDER_TYPES.DRIVER;
			switch (interval) {
				case 'week':
					totalFees = values.map(day => {
						if (period === PERIOD_TYPE.CURRENT) {
							// filter only for jobs completed by internal drivers
							return currCompleted
								.filter(({ selectedConfiguration }) =>
									isDriver
										? selectedConfiguration.providerId === PROVIDERS.PRIVATE
										: selectedConfiguration.providerId !== PROVIDERS.PRIVATE
								)
								.reduce((prev, curr) => {
									// check if the order was completed on the selected day
									return moment(curr['jobSpecification'].pickupStartTime).day() === day
										? prev + curr['selectedConfiguration'].deliveryFee
										: 0;
								}, 0);
						} else {
							// filter only jobs completed by third party couriers
							return prevCompleted
								.filter(({ selectedConfiguration }) =>
									isDriver
										? selectedConfiguration.providerId === PROVIDERS.PRIVATE
										: selectedConfiguration.providerId !== PROVIDERS.PRIVATE
								)
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
								.filter(({ selectedConfiguration }) =>
									isDriver
										? selectedConfiguration.providerId === PROVIDERS.PRIVATE
										: selectedConfiguration.providerId !== PROVIDERS.PRIVATE
								)
								.reduce((prev, curr) => {
									// check if the order was completed on the selected day
									return moment(curr['jobSpecification'].pickupStartTime).date() === date
										? prev + curr['selectedConfiguration'].deliveryFee
										: 0;
								}, 0);
						} else {
							return prevCompleted
								.filter(({ selectedConfiguration }) =>
									isDriver
										? selectedConfiguration.providerId === PROVIDERS.PRIVATE
										: selectedConfiguration.providerId !== PROVIDERS.PRIVATE
								)
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
								.filter(({ selectedConfiguration }) =>
									isDriver
										? selectedConfiguration.providerId === PROVIDERS.PRIVATE
										: selectedConfiguration.providerId !== PROVIDERS.PRIVATE
								)
								.reduce((prev, curr) => {
									// check if the order was completed on the selected day
									return moment(curr['jobSpecification'].pickupStartTime).month() === month
										? prev + curr['selectedConfiguration'].deliveryFee
										: 0;
								}, 0);
						} else {
							return prevCompleted
								.filter(({ selectedConfiguration }) =>
									isDriver
										? selectedConfiguration.providerId === PROVIDERS.PRIVATE
										: selectedConfiguration.providerId !== PROVIDERS.PRIVATE
								)
								.reduce((prev, curr) => {
									// check if the order was completed on the selected day
									return moment(curr['jobSpecification'].pickupStartTime).month() === month
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

	const { data, totalCost, percentageChange, percentageChangeString } = useMemo(() => {
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
		labels.reverse();
		let data = {
			labels,
			datasets
		};

		let currTotalCost = currCourierCosts.concat(currDriverCosts).reduce((a, b) => a + b, 0);
		let prevTotalCost = prevCourierCosts.concat(prevDriverCosts).reduce((a, b) => a + b, 0);
		console.table({ currTotalCost, prevTotalCost });

		let increase = currTotalCost - prevTotalCost;
		let percentageChange = prevTotalCost ? (increase / prevTotalCost) * 100 : 100;
		console.table({ increase, percentageChange });

		let percentageChangeString = percentageChange > 0 ? '+'.concat(percentageChange.toFixed(1).toString()) : percentageChange.toFixed(1).toString();
		console.log(percentageChangeString)
		return { data, totalCost: currTotalCost.toFixed(2), percentageChange, percentageChangeString };
		// return completed.reduce((prev, curr) => prev + curr['selectedConfiguration'].deliveryFee, 0);
	}, [interval]);

	/*
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
	*/

	return (
		<div className='border rounded-3 p-3 position-relative'>
			<MuiTooltip
				className='position-absolute mt-2 me-3 end-0'
				title='Track how much money you are spending on deliveries'
				placement='right-start'
			>
				<IconButton size='small'>
					<BsInfoCircle size={15} />
				</IconButton>
			</MuiTooltip>
			<div className="d-flex flex-column">
				<span className='font-semibold'>Delivery Costs</span>
				<span className='fs-4'>£{totalCost}</span>
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
									callback: (value, index, ticks) => '£' + value
								}
							}
						},
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
			</div>
		</div>
	);
};

DeliveryCost.propTypes = {};

export default DeliveryCost;
