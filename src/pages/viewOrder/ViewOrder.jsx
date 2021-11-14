import './viewOrder.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import classnames from 'classnames';
import moment from 'moment';
import { STATUS } from '../../constants';
import { subscribe, unsubscribe, updateJobsStatus } from '../../store/actions/delivery';
import { addError, removeError } from '../../store/actions/errors';
import { Mixpanel } from '../../config/mixpanel';

const ViewOrder = props => {
	const dispatch = useDispatch();
	const { email, apiKey, stripeCustomerId } = useSelector(state => state['currentUser'].user);
	const error = useSelector(state => state['errors']);
	const { allJobs } = useSelector(state => state['deliveryJobs']);
	const [order, setOrder] = useState({ status: '' });
	const [show, setShow] = useState(false);

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
			apiKey && dispatch(subscribe(apiKey, email));
			const orderID = props.location['pathname'].split('/').reverse()[0];
			let currentOrder = allJobs
				.filter(job => job['jobSpecification']['orderNumber'] === orderID)
				.map(
					({
						_id,
						status,
						jobSpecification: { deliveries, pickupStartTime },
						selectedConfiguration: { providerId, jobReference, trackingURL, deliveryFee },
						driverInformation: { name: driverName, phone: driverPhone, transport: driverVehicle },
						createdAt,
					}) => {
						let {
							description,
							dropoffLocation: { fullAddress: address, phoneNumber: phone, firstName, lastName, email },
							dropoffStartTime,
							itemsCount,
						} = deliveries[0];
						let customerName = `${firstName} ${lastName}`;
						createdAt = moment(createdAt).format('DD/MM/YYYY HH:mm:ss');
						return {
							id: _id,
							itemsCount,
							reference: jobReference,
							createdAt,
							description,
							status: status[0].toUpperCase() + status.toLowerCase().slice(1),
							customerName,
							email,
							phone,
							providerId,
							trackingURL,
							deliveryFee,
							address,
							driverName,
							driverPhone,
							driverVehicle,
							pickupDate: pickupStartTime,
							dropoffDate: dropoffStartTime,
						};
					}
				)[0];
			console.log(currentOrder);
			setOrder(currentOrder);
		})();
		return () => apiKey && dispatch(unsubscribe());
	}, []);

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		dispatch(removeError());
	}, [props.location]);

	return (
		<div className='viewOrder bg-light p-3'>
			<div className='orderDetailsTitleContainer'>
				<h2 className='orderTitle'>Order Details</h2>
			</div>
			<div className='d-block justify-content-center pt-3'>
				{show && (
					<div className='alert alert-success alert-dismissible fade show' role='alert'>
						<h2 className='text-center'>Order updated</h2>
						<button type='button' className='btn btn-close' data-bs-dismiss='alert' aria-label='Close' />
					</div>
				)}
				{error.message && (
					<div className='alert alert-danger alert-dismissible fade show' role='alert'>
						<h2 className='text-center'>{error.message}</h2>
						<button type='button' className='btn btn-close' data-bs-dismiss='alert' aria-label='Close' />
					</div>
				)}
			</div>
			<div className='d-flex mt-3'>
				<div className='orderShow pt-4 pb-3 px-5'>
					<div className='fs-3 d-flex justify-content-center'>
						<span className='orderShowCustomerName'>{!!order.customerName ? order.customerName : "Name not specified"}</span>
					</div>
					<div className='d-flex flex-column mt-3'>
						<div className='orderShowInfo'>
							<span className='orderShowLabel'>Address:</span>
							<span className='orderShowInfoTitle'>{!!order.address ? order.address : 'N/A'}</span>
						</div>
						<div className='orderShowInfo'>
							<span className='orderShowLabel'>Email:</span>
							<span className='orderShowInfoTitle'>{!!order.email ? order.email : 'N/A'}</span>
						</div>
						<div className='orderShowInfo'>
							<span className='orderShowLabel'>Phone Number:</span>
							<span className='orderShowInfoTitle'>{!!order.phone ? order.phone : 'N/A'}</span>
						</div>
						<div className='orderShowInfo'>
							<span className='orderShowLabel'>Items:</span>
							<span className='orderShowInfoTitle'>
								{!!order.itemsCount ? order.itemsCount : 0}
							</span>
						</div>
						<div className='orderShowInfo flex-column'>
							<span className='orderShowLabel justify-content-center d-flex flex-grow-1'>
								Products Ordered
							</span>
							<textarea
								className='form-control'
								name=''
								id=''
								cols='30'
								rows='4'
								value={order.description}
							/>
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
												dispatch(updateJobsStatus(apiKey, order.id, values.status, stripeCustomerId));
												setShow(true);
											} catch (err) {
												console.error(err);
												dispatch(addError(err.message));
											}
										}
									}}
								>
									{({ values, handleSubmit, handleBlur, handleChange }) => (
										<form action='' onSubmit={handleSubmit}>
											<div className='d-flex flex-row align-items-center py-2'>
												<select
													role='button'
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
					</div>
				</div>
				<div className='deliveryDetails pt-4 pb-2 px-5'>
					<div className='d-flex justify-content-center'>
						<span className='fs-3 orderShowCustomerName'>Delivery Information</span>
					</div>
					<div className='orderShowInfo'>
						<span className='orderShowLabel'>Order Reference:</span>
						<span className='orderShowInfoTitle'>{order.reference}</span>
					</div>
					<div className='orderShowInfo'>
						<span className='orderShowLabel'>Provider:</span>
						<span className='orderShowInfoTitle text-capitalize'>{!!order.providerId ? order.providerId.replace(/_/g, ' ') : "Unknown"}</span>
					</div>
					<div className='orderShowInfo'>
						<span className='orderShowLabel'>Price:</span>
						<span className='orderShowInfoTitle text-capitalize'>{`£${order.deliveryFee}`}</span>
					</div>
					<div className='orderShowInfo'>
						<span className='orderShowLabel'>Created At:</span>
						<span className='orderShowInfoTitle'>{order.createdAt}</span>
					</div>
					<div className='orderShowInfo'>
						<span className='orderShowLabel'>ETA:</span>
						<span className='orderShowInfoTitle'>
							{!order.dropoffDate
								? 'Estimating...'
								: moment(order.dropoffDate).diff(moment(), 'minutes') < 0
								? `Delivered`
								: `${moment().to(moment(order.dropoffDate))}`}
						</span>
					</div>
					<div className='orderShowInfo flex-column'>
						<span className='orderShowLabel justify-content-center d-flex flex-grow-1'>
							Driver Assigned
						</span>
						<table className='table d-flex table-borderless'>
							<tbody>
								<tr>
									<td className='fw-bold'>Name</td>
									<td>{order.driverName}</td>
								</tr>
								<tr>
									<td className='fw-bold'>Phone</td>
									<td>{order.driverPhone}</td>
								</tr>
								<tr>
									<td className='fw-bold'>Transport</td>
									<td>{order.driverVehicle}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className='my-3 d-flex align-items-center justify-content-center'>
						{order.trackingURL ? (
							<a
								href={order.trackingURL}
								target='_blank'
								role='button'
								className='btn btn-lg btn-primary orderShowInfoTitle trackOrderBtn'
							>
								Track Order
							</a>
						) : (
							<span className='orderShowInfoTitle'>No tracking URL available for this provider</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewOrder;
