import './viewOrder.css';
import React, { useCallback, useEffect, useState } from 'react';
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
	const [order, setOrder] = useState({});
	const [show, setShow] = useState(false);

	const statusBtn = useCallback(
		activeIndex => {
			if (order.deliveries) {
				let unknown = Object.values(STATUS).indexOf(order.deliveries[activeIndex].status.toUpperCase()) === -1;
				return classnames({
					orderAddButton: true,
					'me-3': true,
					new: order.deliveries[activeIndex].status.toUpperCase() === STATUS.NEW,
					pending: order.deliveries[activeIndex].status.toUpperCase() === STATUS.PENDING,
					dispatching: order.deliveries[activeIndex].status.toUpperCase() === STATUS.DISPATCHING,
					'en-route': order.deliveries[activeIndex].status.toUpperCase() === STATUS.EN_ROUTE,
					completed: order.deliveries[activeIndex].status.toUpperCase() === STATUS.COMPLETED,
					cancelled: order.deliveries[activeIndex].status.toUpperCase() === STATUS.CANCELLED,
					unknown,
				});
			}
			return classnames({
				orderAddButton: true,
				'me-3': true,
				new: true,
			});
		},
		[order]
	);

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
						jobSpecification: { deliveries, pickupStartTime, jobReference },
						selectedConfiguration: { providerId, deliveryFee },
						driverInformation: { name: driverName, phone: driverPhone, transport: driverVehicle },
						createdAt,
					}) => {
						createdAt = moment(createdAt).format('DD/MM/YYYY HH:mm:ss');
						return {
							id: _id,
							reference: jobReference,
							createdAt,
							status: status[0].toUpperCase() + status.toLowerCase().slice(1),
							providerId,
							deliveryFee,
							driverName,
							driverPhone,
							driverVehicle,
							pickupDate: pickupStartTime,
							deliveries,
						};
					}
				)[0];
			console.log(currentOrder);
			setOrder(currentOrder);
		})();
		return () => apiKey && dispatch(unsubscribe());
	}, []);

	const alertWrapper = classnames({
		'd-block': true,
		'justify-content-center': true,
		'pt-3': true,
		'd-none': !(show || error.message),
	});

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		dispatch(removeError());
	}, [props.location]);

	return (
		<div className='viewOrder bg-light p-3'>
			<div className='orderDetailsTitleContainer'>
				<h2 className='orderTitle'>Order Details</h2>
			</div>
			<div className={alertWrapper}>
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
				<div id='carouselExampleIndicators' className='orderShow pt-4 pb-1 px-5 carousel carousel-dark slide' data-bs-ride='carousel'>
					<div className='carousel-indicators'>
						{order.deliveries &&
							order.deliveries.map((delivery, index) =>
								index === 0 ? (
									<button
										key={index}
										type='button'
										data-bs-target='#carouselExampleIndicators'
										data-bs-slide-to={index}
										className='active'
										aria-current='true'
										aria-label={`Slide ${index}`}
									/>
								) : (
									<button
										key={index}
										type='button'
										data-bs-target='#carouselExampleIndicators'
										data-bs-slide-to={index}
										aria-label={`Slide ${index}`}
									/>
								)
							)}
					</div>
					<div className='carousel-inner pb-5'>
						{order.deliveries &&
							order.deliveries.map(
								(
									{
										dropoffStartTime,
										dropoffLocation: { firstName, lastName, fullAddress, phoneNumber, email },
										orderReference,
										trackingURL,
										description,
										status,
									},
									index
								) => (
									<div key={index} className={index === 0 ? 'carousel-item active' : 'carousel-item'}>
										<div className='d-flex flex-column justify-content-center'>
											<span className='fs-3 groupTitle text-center'>{`${firstName} ${lastName}`}</span>
											<div className='orderShowInfo'>
												<span className='orderShowLabel'>Order Reference:</span>
												<span className='orderShowInfoTitle'>{orderReference}</span>
											</div>
											<div className='orderShowInfo'>
												<span className='orderShowLabel'>Address:</span>
												<span className='orderShowInfoTitle'>{fullAddress}</span>
											</div>
											<div className='orderShowInfo'>
												<span className='orderShowLabel'>Email:</span>
												<span className='orderShowInfoTitle'>{email ? email : 'N/A'}</span>
											</div>
											<div className='orderShowInfo'>
												<span className='orderShowLabel'>Phone Number:</span>
												<span className='orderShowInfoTitle'>{phoneNumber ? phoneNumber : 'N/A'}</span>
											</div>
											<div className='d-flex justify-content-center align-items-center my-2' style={{ color: '#444' }}>
												<div className='mx-3'>
													{trackingURL ? (
														<a
															href={trackingURL}
															target='_blank'
															role='button'
															className='btn btn-primary orderShowInfoTitle trackOrderBtn'
														>
															Track Order
														</a>
													) : (
														<span className='orderShowInfoTitle'>Tracking not available</span>
													)}
												</div>
												<div className='mx-2'>
													<span className='orderShowLabel'>Delivery ETA:</span>
													<span className='orderShowInfoTitle'>
														{!dropoffStartTime
															? 'Estimating...'
															: moment(dropoffStartTime).diff(moment(), 'minutes') < 0
																? `Delivered`
																: `${moment().to(moment(dropoffStartTime))}`}
													</span>
												</div>
											</div>
											<div className='orderShowInfo flex-column'>
												<span className='orderShowLabel justify-content-center d-flex flex-grow-1'>Products Ordered</span>
												<textarea className='form-control' name='' id='' cols='30' rows='4' defaultValue={description} />
											</div>
											<div className='d-flex flex-row align-items-center'>
												<button className={statusBtn(index)} disabled>
													<span>{status[0].toUpperCase() + status.toLowerCase().slice(1)}</span>
												</button>
												<div className='d-block w-100'>
													<Formik
														enableReinitialize
														initialValues={{
															status: status.toUpperCase(),
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
								)
							)}
						<button className='carousel-control-prev' type='button' data-bs-target='#carouselExampleIndicators' data-bs-slide='prev'>
							<span className='carousel-control-prev-icon' aria-hidden='true' />
							<span className='visually-hidden'>Previous</span>
						</button>
						<button className='carousel-control-next' type='button' data-bs-target='#carouselExampleIndicators' data-bs-slide='next'>
							<span className='carousel-control-next-icon' aria-hidden='true' />
							<span className='visually-hidden'>Next</span>
						</button>
					</div>
				</div>
				<div className='deliveryDetails pt-4 pb-2 px-5'>
					<div className='fs-3 groupTitle text-center'>Delivery Information</div>
					<div className='d-flex flex-grow-1 flex-column justify-content-center'>
						<div className='deliveryShowInfo'>
							<span className='orderShowLabel'>Job Reference:</span>
							<span className='orderShowInfoTitle'>{order.reference}</span>
						</div>
						<div className='deliveryShowInfo'>
							<span className='orderShowLabel'>Provider:</span>
							<span className='orderShowInfoTitle text-capitalize'>
								{!!order.providerId ? order.providerId.replace(/_/g, ' ') : 'Unknown'}
							</span>
						</div>
						<div className='deliveryShowInfo'>
							<span className='orderShowLabel'>Price:</span>
							<span className='orderShowInfoTitle text-capitalize'>{`£${order.deliveryFee}`}</span>
						</div>
						<div className='deliveryShowInfo'>
							<span className='orderShowLabel'>Created At:</span>
							<span className='orderShowInfoTitle'>{order.createdAt}</span>
						</div>
						<div className='deliveryShowInfo'>
							<span className='orderShowLabel'>Pickup ETA:</span>
							<span className='orderShowInfoTitle'>
								{!order.pickupDate
									? 'Estimating...'
									: moment(order.pickupDate).diff(moment(), 'minutes') < 0
									? `Picked Up`
									: `${moment().to(moment(order.pickupDate))}`}
							</span>
						</div>
						<br/>
						<div className='deliveryShowInfo flex-column'>
							<span className='orderShowLabel justify-content-center d-flex flex-grow-1'>Driver Assigned</span>
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
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewOrder;
