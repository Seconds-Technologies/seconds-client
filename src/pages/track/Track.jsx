import React from 'react';
import './Track.css';
import Counter from '../../components/counter/Counter';
import { useSelector } from 'react-redux';
import Tile from '../../components/tile/Tile';
import { COLOURS, STATUS } from '../../constants';

const Track = () => {
	const orders = useSelector(state => {
		const allOrders = state['shopifyOrders'].allOrders;
		return allOrders.map(({ order_number, status, shipping_address, phone, created_at, customer }) => {
			let { address1, city, zip } = shipping_address;
			let customerName = `${customer['first_name']} ${customer['last_name']}`;
			let address = `${address1} ${city} ${zip}`;
			return { id: order_number, status, customerName, address };
		});
	});
	return (
		<div className='trackContainer py-4'>
			<div className='row flex-row flex-nowrap'>
				<div className='col-sm-6 col-md-3'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>New</h1>
						<Counter value={orders.filter(({status}) => status === STATUS.NEW).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status }) =>
							status === STATUS.NEW && (
								<div className="my-4 px-3">
									<div style={{height: 4, backgroundColor: COLOURS.NEW}}/>
									<Tile id={id} address={address} name={customerName} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-6 col-md-3'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>Dispatching</h1>
						<Counter value={orders.filter(({status}) => status === STATUS.DISPATCHING).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status }) =>
							status === STATUS.DISPATCHING && (
								<div className="my-4 px-3">
									<div style={{height: 4, backgroundColor: COLOURS.DISPATCHING}}/>
									<Tile id={id} address={address} name={customerName} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-6 col-md-3'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>En-route</h1>
						<Counter value={orders.filter(({status}) => status === STATUS.EN_ROUTE).length}/>
					</div>
					{orders.map(
						({ id, customerName, address, status }) =>
							status === STATUS.EN_ROUTE && (
								<div className="my-4 px-3">
									<div style={{height: 4, backgroundColor: COLOURS.EN_ROUTE}}/>
									<Tile id={id} address={address} name={customerName} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-6 col-md-3'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>Completed</h1>
						<Counter value={orders.filter(({status}) => status === STATUS.COMPLETED).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status }) =>
							status === 'Completed' && (
								<div className="my-4 px-3">
									<div style={{height: 4, backgroundColor: COLOURS.COMPLETED}}/>
									<Tile id={id} address={address} name={customerName} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-6 col-md-3'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>Cancelled</h1>
						<Counter value={orders.filter(({status}) => status === STATUS.CANCELLED).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status }) =>
							status === STATUS.CANCELLED && (
								<div className="my-4 px-3">
									<div style={{height: 4, backgroundColor: COLOURS.CANCELLED}}/>
									<Tile id={id} address={address} name={customerName} />
								</div>
							)
					)}
				</div>
				<div className='col-sm-6 col-md-3'>
					<div className='d-flex flex-column align-items-center justify-content-center'>
						<h1>Expired</h1>
						<Counter value={orders.filter(({status}) => status === STATUS.EXPIRED).length} />
					</div>
					{orders.map(
						({ id, customerName, address, status }) =>
							status === STATUS.EXPIRED && (
								<div className="my-4 px-3">
									<div style={{height: 4, backgroundColor: COLOURS.EXPIRED}}/>
									<Tile id={id} address={address} name={customerName} />
								</div>
							)
					)}
				</div>
			</div>
		</div>
	);
};

export default Track;
