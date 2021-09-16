import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiCall } from '../../api';
import { Formik } from 'formik';
import ProductItem from '../../components/ProductItem';
import classnames from 'classnames';
import { updateOrderStatus } from '../../store/actions/shopify';
import moment from 'moment';
import './viewOrder.css';

const ViewOrder = props => {
	const dispatch = useDispatch();
	const {
		isIntegrated,
		credentials: { baseURL, accessToken },
	} = useSelector(state => state['shopifyStore']);
	const { email } = useSelector(state => state['currentUser'].user);
	const { allOrders } = useSelector(state => state['shopifyOrders']);
	const { allJobs } = useSelector(state => state['deliveryJobs']);

	const [fleets] = useState(['Gophr', 'Stuart']);
	const [order, setOrder] = useState({ status: null});
	const [show, setShow] = useState(false);
	const [products, setProducts] = useState([]);
	const [total, setQuantity] = useState(0);

	const statusBtn = classnames({
		orderAddButton: true,
		'me-3': true,
		unpacked: order.status === 'Unpacked',
		inProgress: order.status === 'In Progress',
		completed: order.status === 'Completed',
	});

	useEffect(() => {
		(async () => {
			const orderID = props.location['pathname'].split('/').reverse()[0];
			if (isIntegrated) {
				let currentOrder = allOrders
					.filter(order => order['order_number'] === Number(orderID))
					.map(order => {
						console.log(order)
						if (order['order_number'] === Number(orderID)) {
							let fullName = `${order['customer']['first_name']} ${order['customer']['last_name']}`;
							let email = order['customer']['email'];
							let phone = order['customer']['phone'];
							let { address1, city, zip } = order['shipping_address'];
							let address = `${address1} ${city} ${zip}`;
							let createdAt = moment(order['created_at']).format('DD/MM/YYYY HH:MM:ss');
							return {
								id: order['id'],
								orderNumber: order['order_number'],
								fullName,
								email,
								phone,
								address,
								status: order['status'],
								items: order['line_items'],
								createdAt,
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
					.map(({ _id, status, jobSpecification: { orderNumber, packages }, createdAt }) => {
						let {
							dropoffLocation: { address, phoneNumber: phone, firstName, lastName, email },
							dropoffStartTime,
							pickupStartTime,
						} = packages[0];
						let customerName = `${firstName} ${lastName}`;
						createdAt = moment(createdAt).format('DD/MM/YYYY HH:MM:ss');
						return {
							id: _id,
							orderNumber,
							createdAt,
							status,
							customerName,
							email,
							phone,
							address,
							pickupDate: moment(pickupStartTime).format('DD/MM/YYYY HH:mm:ss'),
							dropoffDate: moment(dropoffStartTime).format('DD/MM/YYYY HH:mm:ss')
						};
					})[0];
				console.log(currentOrder)
				setOrder(currentOrder);
			}
		})();
	}, []);

	return (
		<div className='viewOrder'>
			<div className='orderDetailsTitleContainer'>
				<h2 className='orderTitle'>Order Details</h2>
			</div>
			{/*<table className="table">
				<tbody>
				<tr>
					<th scope="row">Order ID</th>
					<td>Mark</td>
				</tr>
				<tr>
					<th scope="row">Email</th>
					<td>Jacob</td>
				</tr>
				<tr>
					<th scope="row">Phone Number</th>
					<td colSpan="2">Larry the Bird</td>
				</tr>
				<tr>
					<th scope="row">Address</th>
					<td colSpan="2">Larry the Bird</td>
				</tr>
				<tr>
					<th scope="row">Items</th>
					<td colSpan="2">Larry the Bird</td>
				</tr>
				</tbody>
			</table>*/}
			<div className='orderContainer'>
				<div className='orderShow'>
					<div className='orderShowTop'>
						<span className='orderShowCustomerName'>{order.fullName}</span>
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
							<span className='orderShowInfoTitle'>{fleets[Math.floor(Math.random() * 2)]}</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Pickup At:</h4>
							<span className='orderShowInfoTitle'>
								{order.pickupDate ? order.pickupDate : "N/A"}
							</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Dropoff At:</h4>
							<span className='orderShowInfoTitle'>
								{order.dropoffDate ? order.dropoffDate : "N/A"}
							</span>
						</div>
						<div className='orderShowInfo'>
							<h4 className='orderShowLabel'>Items:</h4>
							<span className='orderShowInfoTitle'>{total}</span>
						</div>
						<div className='d-flex flex-row align-items-center'>
							<button className={statusBtn} disabled>
								<span>{order.status}</span>
							</button>
							<div className='d-block w-100'>
								<Formik
									enableReinitialize
									initialValues={{
										status: order.status,
									}}
									onSubmit={async values => {
										if (order.status !== values.status) {
											try {
												dispatch(
													updateOrderStatus(order.id, email, values.status, order.status)
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
													<option value='Unpacked'>Unpacked</option>
													<option value='In Progress'>In Progress</option>
													<option value='Completed'>Completed</option>
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
