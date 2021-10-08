import React, { useEffect } from 'react';
import Counter from '../../components/counter/Counter';
import { useDispatch, useSelector } from 'react-redux';
import Tile from '../../components/tile/Tile';
import { COLOURS, STATUS } from '../../constants';
import { fetchOrders } from '../../store/actions/shopify';
import { getAllJobs } from '../../store/actions/delivery';
import { removeError } from '../../store/actions/errors';
import './Track.css';

const Track = props => {
	const dispatch = useDispatch();
	const { isIntegrated } = useSelector(state => state['shopifyStore']);
	const { email, apiKey } = useSelector(state => state['currentUser'].user);
	const orders = useSelector(state => {
		const { allOrders } = state['shopifyOrders'];
		const { allJobs } = state['deliveryJobs'];
		return isIntegrated
			? allOrders.map(({ order_number, status, shipping_address, customer }) => {
					let { address1, city, zip } = shipping_address;
					let customerName = `${customer['first_name']} ${customer['last_name']}`;
					let address = `${address1} ${city} ${zip}`;
					return { id: order_number, status, customerName, address, provider: 'N/A' };
			  })
			: allJobs.map(
					({
						status,
						jobSpecification: { orderNumber, packages },
						selectedConfiguration: { providerId },
					}) => {
						let {
							dropoffLocation: { fullAddress: address, firstName, lastName },
						} = packages[0];
						let customerName = `${firstName} ${lastName}`;
						return { id: orderNumber, status, customerName, address, provider: providerId };
					}
			  );
	});

	useEffect(() => {
		isIntegrated ? dispatch(fetchOrders(email)) : dispatch(getAllJobs(apiKey, email));
	}, []);

	useEffect(() => {
		dispatch(removeError());
	}, [props.location]);

	return (
		<div className='trackContainer container bg-light py-4'>
			<div className='row'>
				<div className='col-sm-4 col-md-2 border-end'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>New</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.NEW).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.NEW && (
								<div
									key={index}
									className='my-4 ps-2'
									role='button'
									onClick={() => props.history.push(`/view-orders/${id}`)}
								>
									<div style={{ height: 4, backgroundColor: COLOURS.NEW }} />
									<Tile id={id} address={address} name={customerName} provider={provider} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-4 col-md-2 border-end border-start'>
					<div className='d-flex flex-column align-items-center justify-content-center border-dark'>
						<h1>Pending</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.PENDING).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.PENDING && (
								<div
									key={index}
									className='my-4'
									role='button'
									onClick={() => props.history.push(`/view-orders/${id}`)}
								>
									<div style={{ height: 4, backgroundColor: COLOURS.PENDING }} />
									<Tile id={id} address={address} name={customerName} provider={provider} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-4 col-md-2 border-end border-start'>
					<div className='d-flex flex-column align-items-center justify-content-center border-dark'>
						<h1>Dispatching</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.DISPATCHING).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.DISPATCHING && (
								<div
									key={index}
									className='my-4'
									role='button'
									onClick={() => props.history.push(`/view-orders/${id}`)}
								>
									<div style={{ height: 4, backgroundColor: COLOURS.DISPATCHING }} />
									<Tile id={id} address={address} name={customerName} provider={provider} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-4 col-md-2 border-end border-start'>
					<div className='d-flex flex-column align-items-center justify-content-center border-dark'>
						<h1>En-route</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.EN_ROUTE).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.EN_ROUTE && (
								<div
									key={index}
									className='my-4'
									role='button'
									onClick={() => props.history.push(`/view-orders/${id}`)}
								>
									<div style={{ height: 4, backgroundColor: COLOURS.EN_ROUTE }} />
									<Tile id={id} address={address} name={customerName} provider={provider} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-4 col-md-2 border-end border-start'>
					<div className='d-flex flex-column align-items-center justify-content-center border-dark'>
						<h1>Completed</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.COMPLETED).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.COMPLETED && (
								<div
									key={index}
									className='my-4'
									role='button'
									onClick={() => props.history.push(`/view-orders/${id}`)}
								>
									<div style={{ height: 4, backgroundColor: COLOURS.COMPLETED }} />
									<Tile id={id} address={address} name={customerName} provider={provider} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-4 col-md-2 border-end border-start'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>Cancelled</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.CANCELLED).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.CANCELLED && (
								<div
									key={index}
									className='my-4'
									role='button'
									onClick={() => props.history.push(`/view-orders/${id}`)}
								>
									<div style={{ height: 4, backgroundColor: COLOURS.CANCELLED }} />
									<Tile id={id} address={address} name={customerName} provider={provider} />
								</div>
							)
					)}
				</div>
			</div>
		</div>
	);
};

export default Track;
