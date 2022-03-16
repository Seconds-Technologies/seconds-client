import './Track.css';
import React, { useCallback, useEffect, useState } from 'react';
import Counter from '../../components/counter/Counter';
import { useDispatch, useSelector } from 'react-redux';
import Tile from '../../components/tile/Tile';
import { STATUS_COLOURS, STATUS, PATHS } from '../../constants';
import { subscribe, unsubscribe } from '../../store/actions/delivery';
import { removeError } from '../../store/actions/errors';
import { Mixpanel } from '../../config/mixpanel';
import { dateFilter } from '../../helpers';
import TimeFilter from '../../components/TimeFilter';
import { BsTable } from 'react-icons/bs';
import Button from '@mui/material/Button';

const Track = props => {
	const dispatch = useDispatch();
	const { email, apiKey } = useSelector(state => state['currentUser'].user);
	const [active, setActive] = useState({ id: 'day', name: 'Last 24 hrs' });
	const filterByInterval = useCallback(dateFilter,[active.id])
	const orders = useSelector(state => {
		const { allJobs } = state['deliveryJobs'];
		return filterByInterval(allJobs, active.id).map(
			({ status, jobSpecification: { orderNumber, deliveries }, selectedConfiguration: { providerId } }) => {
				let {
					dropoffLocation: { fullAddress: address, firstName, lastName },
				} = deliveries[0];
				let customerName = `${firstName} ${lastName}`;
				return { id: orderNumber, status, customerName, address, provider: providerId };
			}
		);
	});

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		apiKey && dispatch(subscribe(apiKey, email));
		return () => apiKey && dispatch(unsubscribe());
	}, []);

	useEffect(() => {
		dispatch(removeError());
	}, [props.location]);

	return (
		<div className='page-container container-fluid px-5 pb-4'>
			<div className="d-flex justify-content-end py-3 px-3">
				<Button className="me-3" onClick={() => props.history.push(PATHS.ORDERS)} startIcon={<BsTable />}>
					<span>Table</span>
				</Button>
				<TimeFilter current={active} onSelect={setActive}/>
			</div>
			<div className='row'>
				<div className='col-sm-4 col-md-3 border-end'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>New</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.NEW).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.NEW && <Tile key={index} id={id} address={address} name={customerName} colour={STATUS_COLOURS.NEW} />
					)}
				</div>
				<div className='col-sm-4 col-md-3 border-end border-start'>
					<div className='d-flex flex-column align-items-center justify-content-center border-dark'>
						<h1>Ready for Dispatch</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.DISPATCHING).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.DISPATCHING && <Tile key={index} id={id} address={address} name={customerName} colour={STATUS_COLOURS.DISPATCHING} />
					)}
				</div>
				<div className='col-sm-4 col-md-3 border-end border-start'>
					<div className='d-flex flex-column align-items-center justify-content-center border-dark'>
						<h1>En-route</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.EN_ROUTE).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.EN_ROUTE && <Tile key={index} id={id} address={address} name={customerName} colour={STATUS_COLOURS.EN_ROUTE} />
					)}
				</div>
				<div className='col-sm-4 col-md-3 border-start'>
					<div className='d-flex flex-column align-items-center justify-content-center border-dark'>
						<h1>Completed</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.COMPLETED).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.COMPLETED && 	<Tile key={index} id={id} address={address} name={customerName} colour={STATUS_COLOURS.COMPLETED} />
					)}
				</div>
			</div>
		</div>
	);
};

export default Track;
