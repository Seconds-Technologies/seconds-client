import './viewOrder.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import classnames from 'classnames';
import moment from 'moment';
import { STATUS } from '../../constants';
import { subscribe, unsubscribe, updateJobsStatus, cancelDelivery } from '../../store/actions/delivery';
import { addError, removeError } from '../../store/actions/errors';
import { Mixpanel } from '../../config/mixpanel';
import Modal from 'react-bootstrap/Modal';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ToastFade from 'react-bootstrap/Toast';
import secondsLogo from '../../assets/img/logo.svg';
import Button from 'react-bootstrap/Button';

const ViewOrder = props => {
	const dispatch = useDispatch();
	const { email, apiKey, stripeCustomerId } = useSelector(state => state['currentUser'].user);
	const error = useSelector(state => state['errors']);
	const { allJobs } = useSelector(state => state['deliveryJobs']);
	const [order, setOrder] = useState({});
	const [message, setShow] = useState('');
	const [toastMessage, setToast] = useState('');
	const [confirmDialog, showConfirmDialog] = useState(false);
	const modalRef = useRef(null);

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

	const comingSoonToast = (
		<ToastContainer className='topRight'>
			<ToastFade onClose={() => setToast('')} show={!!toastMessage} animation={true} delay={3000} autohide>
				<ToastFade.Header closeButton={false}>
					<img src={secondsLogo} className='rounded me-2' alt='' />
					<strong className='me-auto'>Seconds</strong>
				</ToastFade.Header>
				<ToastFade.Body className="fs-5">{toastMessage}</ToastFade.Body>
			</ToastFade>
		</ToastContainer>
	);

	const successModal = (
		<Modal
			show={!!message}
			container={modalRef}
			onHide={() => setShow('')}
			size='lg'
			aria-labelledby='example-custom-modal-styling-title'
			// className='alert alert-success' //Add class name here
		>
			<div className='alert alert-success mb-0'>
				<h2 className='text-center'>{message}</h2>
			</div>
		</Modal>
	);

	const confirmModal = (
		<Modal show={confirmDialog} onHide={() => showConfirmDialog(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Confirm Selection</Modal.Title>
			</Modal.Header>
			<Modal.Body className='d-flex justify-content-center align-items-center border-0'>
				<span className='fs-5'>
					Are you sure you want to cancel this order?
				</span>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={() => showConfirmDialog(false)}>
					Cancel
				</Button>
				<Button onClick={() => {
					showConfirmDialog(false)
					dispatch(cancelDelivery(apiKey, order.id)).then(message => setShow(message))
				}}>Confirm</Button>
			</Modal.Footer>
		</Modal>
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
		'd-none': !error.message,
	});

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		dispatch(removeError());
	}, [props.location]);

	return (
		<div ref={modalRef} className='viewOrder bg-light p-3'>
			{comingSoonToast}
			{successModal}
			{confirmModal}
			<div className='orderDetailsTitleContainer'>
				<h2 className='orderTitle'>Order Details</h2>
			</div>
			<div className={alertWrapper}>
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
												<textarea
													className='form-control bg-transparent'
													name=''
													id=''
													cols='30'
													rows='4'
													defaultValue={description}
													readOnly
												/>
											</div>
											{order.deliveries.length <= 1 && (
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
																		setShow('Order updated');
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
											)}
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
						<div className='deliveryShowInfo my-2'>
							<span className='orderShowLabel'>Job Reference:</span>
							<span className='orderShowInfoTitle'>{order.reference}</span>
						</div>
						<div className='deliveryShowInfo my-2'>
							<span className='orderShowLabel'>Provider:</span>
							<span className='orderShowInfoTitle text-capitalize'>
								{!!order.providerId ? order.providerId.replace(/_/g, ' ') : 'Unknown'}
							</span>
						</div>
						<div className='deliveryShowInfo my-2'>
							<span className='orderShowLabel'>Price:</span>
							<span className='orderShowInfoTitle text-capitalize'>{`£${order.deliveryFee}`}</span>
						</div>
						<div className='deliveryShowInfo my-2'>
							<span className='orderShowLabel'>Created At:</span>
							<span className='orderShowInfoTitle'>{order.createdAt}</span>
						</div>
						<div className='deliveryShowInfo my-2'>
							<span className='orderShowLabel'>Pickup ETA:</span>
							<span className='orderShowInfoTitle'>
								{!order.pickupDate
									? 'Estimating...'
									: moment(order.pickupDate).diff(moment(), 'minutes') < 0
									? `Picked Up`
									: `${moment().to(moment(order.pickupDate))}`}
							</span>
						</div>
						<div className='deliveryShowInfo flex-column mt-2'>
							<span className='orderShowLabel justify-content-center d-flex'>Driver Assigned</span>
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
						{order.status && order.status.toUpperCase() === STATUS.CANCELLED ? (
							<div className='d-flex justify-content-center align-items-center mb-3'>
								<button className='btn btn-info btn-lg' onClick={() => setToast('This feature is coming soon 😄')}>
									Re-order
								</button>
							</div>
						) : order.status && order.status.toUpperCase() !== STATUS.COMPLETED ? (
							<div className='d-flex justify-content-center align-items-center mb-3'>
								<button
									className='btn btn-secondary btn-lg'
									onClick={() => showConfirmDialog(true)}
								>
									Cancel Order
								</button>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewOrder;
