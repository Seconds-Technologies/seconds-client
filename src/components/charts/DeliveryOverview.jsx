import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import { analyticsFilterCurrent } from '../../helpers';
import { useSelector } from 'react-redux';
import { PROVIDERS, STATUS } from '../../constants';
import MuiTooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { BsInfoCircle } from 'react-icons/bs';
import useWindowSize from '../../hooks/useWindowSize';

const DeliveryOverview = ({ interval }) => {
	const dimensions = useWindowSize();
	const size = useMemo(() => {
		return { height: (dimensions.height - 280) / 2, width: dimensions.width / 2 };
	}, [dimensions]);

	const filterByInterval = useCallback(analyticsFilterCurrent, [interval]);
	const { total, completed } = useSelector(state => {
		const { allJobs: total, completedJobs: completed } = state['deliveryJobs'];
		return { total: filterByInterval(total, interval), completed: filterByInterval(completed, interval) };
	});

	const getOverviewDetails = useCallback(() => {
		const numCompleted = completed.length;
		const numUncompleted = total.filter(
			({ status, selectedConfiguration: { providerId } }) =>
				![STATUS.COMPLETED, STATUS.CANCELLED].includes(status) && providerId !== PROVIDERS.UNASSIGNED
		).length;
		const numCancelled = total.filter(({ status }) => status === STATUS.CANCELLED).length;
		const numUnassigned = total.filter(({ selectedConfiguration: { providerId } }) => providerId !== PROVIDERS.UNASSIGNED).length;
		return [numCompleted, numUncompleted, numCancelled, numUnassigned];
	}, [interval, total, completed]);

	const data = useMemo(() => {
		const labels = ['Completed', 'Uncompleted', 'Cancelled', 'Unassigned'];
		const datasets = [
			{
				label: '# of Votes',
				data: getOverviewDetails(),
				hoverBackgroundColor: ['rgba(101, 188, 85, 1)', 'rgba(255, 105, 57, 1)', 'rgba(154, 154, 154, 1)', 'rgba(157, 61, 61, 1)'],
				hoverBorderColor: ['rgba(101, 188, 85, 1)', 'rgba(255, 105, 57, 1)', 'rgba(154, 154, 154, 1)', 'rgba(157, 61, 61, 1)'],
				borderColor: ['#43CB2B', '#9D3D3D', '#9A9A9A', '#FF6939'],
				backgroundColor: ['#43CB2B', '#9D3D3D', '#9A9A9A', '#FF6939'],
				borderWidth: 1
			}
		];
		return {
			labels,
			datasets
		};
	}, [interval]);

	return (
		<div className='border border-light-grey rounded-3 p-3 position-relative'>
			<MuiTooltip
				className='position-absolute me-3 end-0'
				title='Overview of all your orders and their current status'
				placement='right-start'
			>
				<IconButton size='small'>
					<BsInfoCircle size={15} />
				</IconButton>
			</MuiTooltip>
			<div className="d-flex flex-column mb-2">
				<span className='font-semibold'>Delivery Overview</span>
			</div>
			<div>
				<Doughnut
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
								position: 'right'
							}
						}
					}}
					data={data}
				/>
			</div>
		</div>
	);
};

DeliveryOverview.propTypes = {};

export default DeliveryOverview;
