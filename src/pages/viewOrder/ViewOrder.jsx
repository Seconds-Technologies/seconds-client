import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall } from '../../api';
import { Formik } from 'formik';
import ProductItem from '../../components/ProductItem';
import classnames from 'classnames';
import { updateOrderStatus } from '../../store/actions/shopify';
import moment from 'moment';
import './viewOrder.css';
import { STATUS } from '../../constants';
import { updateJobsStatus } from '../../store/actions/delivery';

const ViewOrder = props => {
	const dispatch = useDispatch();
	const {
		isIntegrated,
		credentials: { baseURL, accessToken },
	} = useSelector(state => state['shopifyStore']);
	const { email, apiKey } = useSelector(state => state['currentUser'].user);
	const { allOrders } = useSelector(state => state['shopifyOrders']);
	const { allJobs } = useSelector(state => state['deliveryJobs']);
	const [order, setOrder] = useState({ status: '' });
	const [show, setShow] = useState(false);
	const [products, setProducts] = useState([]);
	const [total, setQuantity] = useState(0);

	const statusBtn = classnames({
		orderAddButton: true,
		'me-3': true,
		new: order.status.toLowerCase() === STATUS.NEW.toLowerCase(),
		pending: order.status.toLowerCase() === STATUS.PENDING.toLowerCase(),
		dispatching: order.status.toLowerCase() === STATUS.DISPATCHING.toLowerCase(),
		'en-route': order.status.toLowerCase() === STATUS.EN_ROUTE.toLowerCase(),
		completed: order.status.toLowerCase() === STATUS.COMPLETED.toLowerCase(),
		cancelled: order.status.toLowerCase() === STATUS.CANCELLED.toLowerCase(),
	});

	useEffect(() => {
		(async () => {
			const orderID = props.location['pathname'].split('/').reverse()[0];
			if (isIntegrated) {
				let currentOrder = allOrders
					.filter(order => order['order_number'] === Number(orderID))
					.map(order => {
						console.log(order);
						if (order['order_number'] === Number(orderID)) {
							let customerName = `${order['customer']['first_name']} ${order['customer']['last_name']}`;
							let email = order['customer']['email'];
							let phone = order['customer']['phone'];
							let { address1, city, zip } = order['shipping_address'];
							let address = `${address1} ${city} ${zip}`;
							let createdAt = moment(order['created_at']).format('DD/MM/YYYY HH:mm:ss');
							return {
								id: order['id'],
								orderNumber: order['order_number'],
								customerName,
								email,
								phone,
								address,
								status: order['status'],
								items: order['line_items'],
								createdAt,
								providerId: 'N/A',
								trackingURL: null,
								pickupDate: null,
								dropoffDate: null,
							};
						}
					})[0];
				console.log(currentOrder);
				setOrder(currentOrder);
				let products = await Promise.all(
					currentOrder.items.map(async ({ product_id: id, title, quantity }) => {
						setQuantity(prevState => prevState + quantity);
						let image = await apiCall('POST', '/server/shopify/product-image', {
							baseURL,
							accessToken,
							id,
						});
						return { title, quantity, img: image['src'] };
					})
				);
				setProducts(products);
			} else {
				let currentOrder = allJobs
					.filter(job => job['jobSpecification']['orderNumber'] === orderID)
					.map(
						({
							_id,
							status,
							jobSpecification: { orderNumber, packages },
							selectedConfiguration: { providerId, jobReference, trackingURL },
							createdAt,
						}) => {
							let {
								dropoffLocation: { address, phoneNumber: phone, firstName, lastName, email },
								dropoffStartTime,
								pickupStartTime,
							} = packages[0];
							let customerName = `${firstName} ${lastName}`;
							createdAt = moment(createdAt).format('DD/MM/YYYY HH:mm:ss');
							return {
								id: _id,
								orderNumber,
								createdAt,
								status: status[0].toUpperCase() + status.toLowerCase().slice(1),
								customerName,
								email,
								phone,
								providerId,
								trackingURL,
								address,
								pickupDate: moment(pickupStartTime).format('DD/MM/YYYY HH:mm:ss'),
								dropoffDate: moment(dropoffStartTime).format('DD/MM/YYYY HH:mm:ss'),
							};
						}
					)[0];
				console.log(currentOrder);
				setOrder(currentOrder);
			}
			console.log(order.status);
		})();
	}, []);

	return (
		<div className='viewOrder'>
			<div className='orderDetailsTitleContainer'>
				<h2 className='orderTitle'>Order Details</h2>
			</div>
			<div className='orderContainer'>
				<div className='orderShow'>
					<div className='orderShowTop'>
						<span className='orderShowCustomerName'>{order.customerName}</span>
					</div>
					<div className='orderShowBottom'>
						<span className='orderShowTitle'>Order Details</span>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Order ID:</h4>
							<span className='orderShowInfoTitle'>{order.orderNumber}</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Created At:</h4>
							<span className='orderShowInfoTitle'>{order.createdAt}</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Email:</h4>
							<span className='orderShowInfoTitle'>{Boolean(order.email) ? order.email : 'N/A'}</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Phone Number:</h4>
							<span className='orderShowInfoTitle'>{Boolean(order.phone) ? order.phone : 'N/A'}</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Address:</h4>
							<span className='orderShowInfoTitle'>{Boolean(order.address) ? order.address : 'N/A'}</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Fleet Provider:</h4>
							<span className='orderShowInfoTitle'>{order.providerId}</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Pickup At:</h4>
							<span className='orderShowInfoTitle'>{order.pickupDate ? order.pickupDate : 'N/A'}</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Dropoff At:</h4>
							<span className='orderShowInfoTitle'>{order.dropoffDate ? order.dropoffDate : 'N/A'}</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Items:</h4>
							<span className='orderShowInfoTitle'>{total}</span>
						</div>
						<div className='orderShowInfo flex-wrap'>
							<h4 className='orderShowLabel'>Tracking URL:</h4>
							{order.trackingURL ? <a href={order.trackingURL} target="_blank" className='orderShowInfoTitle text-wrap'>{order.trackingURL}</a> : <span className='orderShowInfoTitle'>{'N/A'}</span>}
						</div>
						<div className='d-flex flex-row align-items-center'>
							<button className={statusBtn} disabled>
								<span>{order.status}</span>
							</button>
							<div className='d-block w-100'>
								<Formik
									enableReinitialize
									initialValues={{
										status: order.status.toUpperCase(),
									}}
									onSubmit={async values => {
										//if the order status has not changed
										console.log('CHOSEN STATUS', values);
										if (order.status !== values.status) {
											try {
												isIntegrated
													? dispatch(
															updateOrderStatus(
																order.id,
																email,
																values.status,
																order.status
															)
													  )
													: dispatch(
															updateJobsStatus(apiKey, order.id, values.status, email)
													  );
												setShow(true);
											} catch (err) {
												alert(err);
											}
										}
									}}
								>
									{({ values, handleSubmit, handleBlur, handleChange }) => (
										<form action='' onSubmit={handleSubmit}>
											<div className='d-flex flex-row align-items-center py-2'>
												<select
													value={values.status}
													className='form-select'
													name='status'
													onBlur={handleBlur}
													onChange={event => {
														handleChange(event);
														handleSubmit(event);
													}}
												>
													<option value={STATUS.NEW}>New</option>
													<option value={STATUS.PENDING}>Pending</option>
													<option value={STATUS.DISPATCHING}>Dispatching</option>
													<option value={STATUS.EN_ROUTE}>En-route</option>
													<option value={STATUS.COMPLETED}>Completed</option>
													<option value={STATUS.CANCELLED}>Cancelled</option>
												</select>
											</div>
										</form>
									)}
								</Formik>
							</div>
						</div>
						<div className='d-block flex-grow-1 justify-content-center pt-3'>
							{show && (
								<div className='alert alert-success alert-dismissible fade show' role='alert'>
									<h2 className='text-center'>Order updated</h2>
									<button
										type='button'
										className='btn btn-close'
										data-bs-dismiss='alert'
										aria-label='Close'
									/>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className='orderUpdate'>
					<h3 className='orderUpdateTitle'>Products Ordered</h3>
					{products.map(({ title, img, quantity }, index) => (
						<ProductItem key={index} img={img} title={title} quantity={quantity} />
					))}
				</div>
			</div>
		</div>
	);
};

export default ViewOrder;
