import React, { useCallback, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { analyticsFilterCurrent } from '../../helpers';
import { useSelector } from 'react-redux';
import MuiTooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { BsInfoCircle } from 'react-icons/bs';
import useWindowSize from '../../hooks/useWindowSize';

const DriverPerformance = ({ interval, genLabels }) => {
	const dimensions = useWindowSize();
	const size = useMemo(() => {
		return { height: (dimensions.height - 280) / 2, width: dimensions.width / 2 };
	}, [dimensions]);
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
			}
		];
		return {
			labels,
			datasets
		};
	}, [completed]);

	return (
		<div className='border rounded-3 p-3 position-relative'>
			<MuiTooltip
				className='position-absolute me-3 end-0'
				title='Track the performance of your internal drivers and fleet providers'
				placement='right-start'
			>
				<IconButton size='small'>
					<BsInfoCircle size={15} />
				</IconButton>
			</MuiTooltip>
			<div className="d-flex flex-column mb-2">
				<span className='font-semibold'>Driver Performance</span>
			</div>
			<div>
				<Bar
					height={size.height}
					options={{
						plugins: {
							legend: {
								display: false,
								labels: {
									padding: 0
								},
								position: 'bottom'
							}
						},
						maintainAspectRatio: false,
						scales: {
							y: {
								grid: {
									display: false
								},
								ticks: {
									// forces step size to be 50 units
									stepSize: 1
								}
							}
						}
					}}
					data={data}
				/>
			</div>
		</div>
	);
};

DriverPerformance.propTypes = {};

export default DriverPerformance;
