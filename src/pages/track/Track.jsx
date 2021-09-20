import React from 'react';
import Counter from '../../components/counter/Counter';
import { useSelector } from 'react-redux';
import Tile from '../../components/tile/Tile';
import { COLOURS, STATUS } from '../../constants';
import './Track.css';

const Track = props => {
	const { isIntegrated } = useSelector(state => state['shopifyStore']);
	const { apiKey } = useSelector(state => state['currentUser'].user);
	const orders = useSelector(state => {
		const { allOrders } = state['shopifyOrders'];
		const { allJobs } = state['deliveryJobs'];
		return isIntegrated
			? allOrders.map(({ order_number, status, shipping_address, created_at, customer }) => {
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
							dropoffLocation: { address, firstName, lastName },
						} = packages[0];
						let customerName = `${firstName} ${lastName}`;
						return { id: orderNumber, status, customerName, address, provider: providerId };
					}
			  );
	});
	console.log(orders);
	return (
		<div className='trackContainer py-4'>
			<div className='row flex-row flex-nowrap'>
				<div className='col-sm-6 col-md-3'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>New</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.NEW).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.NEW && (
								<div
									key={index}
									className='my-4 px-3'
									role='button'
									onClick={() => props.history.push(`/view-orders/${id}`)}
								>
									<div style={{ height: 4, backgroundColor: COLOURS.NEW }} />
									<Tile id={id} address={address} name={customerName} provider={provider} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-6 col-md-3'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>Dispatching</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.DISPATCHING).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.DISPATCHING && (
								<div
									key={index}
									className='my-4 px-3'
									role='button'
									onClick={() => props.history.push(`/view-orders/${id}`)}
								>
									<div style={{ height: 4, backgroundColor: COLOURS.DISPATCHING }} />
									<Tile id={id} address={address} name={customerName} provider={provider} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-6 col-md-3'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>En-route</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.EN_ROUTE).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.EN_ROUTE && (
								<div
									key={index}
									className='my-4 px-3'
									role='button'
									onClick={() => props.history.push(`/view-orders/${id}`)}
								>
									<div style={{ height: 4, backgroundColor: COLOURS.EN_ROUTE }} />
									<Tile id={id} address={address} name={customerName} provider={provider} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-6 col-md-3'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>Completed</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.COMPLETED).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.COMPLETED && (
								<div
									key={index}
									className='my-4 px-3'
									role='button'
									onClick={() => props.history.push(`/view-orders/${id}`)}
								>
									<div style={{ height: 4, backgroundColor: COLOURS.COMPLETED }} />
									<Tile id={id} address={address} name={customerName} provider={provider} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-6 col-md-3'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>Cancelled</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.CANCELLED).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.CANCELLED && (
								<div
									key={index}
									className='my-4 px-3'
									role='button'
									onClick={() => props.history.push(`/view-orders/${id}`)}
								>
									<div style={{ height: 4, backgroundColor: COLOURS.CANCELLED }} />
									<Tile id={id} address={address} name={customerName} provider={provider} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-6 col-md-3'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>Expired</h1>
						<Counter value={orders.filter(({ status }) => status === STATUS.EXPIRED).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status, provider }, index) =>
							status === STATUS.EXPIRED && (
								<div
									key={index}
									className='my-4 px-3'
									role='button'
									onClick={() => props.history.push(`/view-orders/${id}`)}
								>
									<div style={{ height: 4, backgroundColor: COLOURS.EXPIRED }} />
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
