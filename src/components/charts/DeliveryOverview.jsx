import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import { pickupFilter } from '../../helpers';
import { useSelector } from 'react-redux';
import { PROVIDERS, STATUS } from '../../constants';

const DeliveryOverview = ({ interval }) => {
	const filterByInterval = useCallback(pickupFilter, [interval]);

	const { total, completed } = useSelector(state => {
		const { allJobs: total, completedJobs: completed } = state['deliveryJobs'];
		return { total: filterByInterval(total, interval), completed: filterByInterval(completed, interval) };
	});

	const getOverviewDetails = useCallback(
		() => {
			const numCompleted = completed.length;
			const numUncompleted = total.filter(
				({ status, selectedConfiguration: { providerId } }) =>
					![STATUS.COMPLETED, STATUS.CANCELLED].includes(status) && providerId !== PROVIDERS.UNASSIGNED
			).length;
			const numCancelled = total.filter(({ status }) => status === STATUS.CANCELLED).length;
			const numUnassigned = total.filter(({ selectedConfiguration: { providerId } }) => providerId !== PROVIDERS.UNASSIGNED).length;
			return [numCompleted, numUncompleted, numCancelled, numUnassigned];
		},
		[interval, total, completed]
	);

	const data = useMemo(() => {
		const labels = ['Completed', 'Uncompleted', 'Cancelled', 'Unassigned'];
		const datasets = [
			{
				label: '# of Votes',
				data: getOverviewDetails(),
				backgroundColor: ['rgba(101, 188, 85, 0.2)', 'rgba(255, 105, 57, 0.2)', 'rgba(154, 154, 154, 0.2)', 'rgba(157, 61, 61, 0.2)'],
				borderColor: ['rgba(101, 188, 85, 1)', 'rgba(255, 105, 57, 1)', 'rgba(154, 154, 154, 1)', 'rgba(157, 61, 61, 1)'],
				borderWidth: 1
			}
		];
		return {
			labels,
			datasets
		};
	}, [interval]);

	return <Doughnut options={{ maintainAspectRatio: false }} data={data} />;
};

DeliveryOverview.propTypes = {};

export default DeliveryOverview;
