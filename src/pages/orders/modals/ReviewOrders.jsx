import React, { useEffect, useMemo, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { DISPATCH_TYPE } from '../../../constants';

const ReviewOrders = ({ show, type, onGoBack, onHide, orders, onConfirm, onUpdate, windowStartTime, windowEndTime }) => {
	const [validOrders, setValidOrders] = useState([]);

	const isDisabled = useMemo(() => {
		return validOrders.length ? !orders.every(({ jobSpecification: { orderNumber } }) => validOrders.includes(orderNumber)) : true;
	}, [validOrders]);

	useEffect(() => {
		console.log(validOrders)
	}, [validOrders])

	return (
		<Modal show={show} onHide={onHide} size='lg'>
			<Modal.Header closeButton>
				<Modal.Title>Review Orders</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					<div className='mb-3'>
						<h1 className='fs-6'>The following orders do not fit within your allocated time window.</h1>
						<span className='text-muted'>
							Time Window:&nbsp;
							<span className='fw-bold'>
								{windowStartTime.calendar()} ➡️ {windowEndTime.calendar()}
							</span>
						</span>
					</div>
					<div className='list-group'>
						{orders.map(({ _id: jobId, jobSpecification: { orderNumber, pickupStartTime, deliveries } }, index) => {
							const { dropoffLocation, dropoffStartTime, dropoffEndTime } = deliveries[0];
							return (
								<div key={index} className='list-group-item list-group-item-action' aria-current='true'>
									<div className='d-flex w-100 align-items-center'>
										<h5>
											{validOrders.includes(orderNumber) ? '✅  ' : '⚠  '} {orderNumber}
										</h5>
									</div>
									<span className='fs-5'>{dropoffLocation.fullAddress}</span>
									<Formik
										enableReinitialize
										initialValues={{
											...(type === DISPATCH_TYPE.MULTI_DROP && { pickupStartTime: dayjs(pickupStartTime).format("YYYY-MM-DDTHH:mm:ss") }),
											dropoffStartTime: dropoffStartTime ? dropoffStartTime : dayjs().format('YYYY-MM-DDTHH:mm'),
											dropoffEndTime: dayjs(dropoffEndTime).format('YYYY-MM-DDTHH:mm')
										}}
										onSubmit={values => {
											onUpdate(values, jobId);
											setValidOrders(prevState => [...prevState, orderNumber]);
										}}
									>
										{({ values, handleChange, handleBlur, handleSubmit }) => (
											<form onSubmit={handleSubmit} className='align-items-center'>
												<div className='container my-2'>
													<div className='row'>
														<div className='col-4'>
															<label htmlFor='pickup-start-time' className='w-100'>
																Pickup At
															</label>
														</div>
														<div className='col-8'>
															<input
																defaultValue={dayjs(pickupStartTime).format('YYYY-MM-DDTHH:mm')}
																id='pickup-start-time'
																name='pickupStartTime'
																type='datetime-local'
																aria-label='pickup-start-time'
																className='form-control form-control-sm rounded-3'
																onChange={handleChange}
																onBlur={handleBlur}
																min={dayjs(windowStartTime).format('YYYY-MM-DDTHH:mm')}
																max={dayjs(windowEndTime).format('YYYY-MM-DDTHH:mm')}
																required
															/>
														</div>
													</div>
													<div className='row'>
														<div className='col-4'>
															<label htmlFor='dropoff-start-time' className='w-100'>
																Deliver from
															</label>
														</div>
														<div className='col-8'>
															<input
																defaultValue={dayjs(dropoffStartTime).format('YYYY-MM-DDTHH:mm')}
																id='dropoff-start-time'
																name='dropoffStartTime'
																type='datetime-local'
																aria-label='dropoff-start-time'
																className='form-control form-control-sm rounded-3'
																onChange={handleChange}
																onBlur={handleBlur}
																min={dayjs(windowStartTime).format('YYYY-MM-DDTHH:mm')}
																max={dayjs(windowEndTime).format('YYYY-MM-DDTHH:mm')}
																required
															/>
														</div>
														<div className='col-4'>
															<label htmlFor='dropoff-end-time' className='w-100'>
																Deliver to
															</label>
														</div>
														<div className='col-8'>
															<input
																defaultValue={dayjs(dropoffEndTime).format('YYYY-MM-DDTHH:mm')}
																id='dropoff-end-time'
																name='dropoffEndTime'
																type='datetime-local'
																aria-label='dropoff-end-time'
																className='form-control form-control-sm rounded-3'
																onChange={handleChange}
																onBlur={handleBlur}
																min={dayjs(values.dropoffStartTime).format('YYYY-MM-DDTHH:mm')}
																max={dayjs(windowEndTime).format('YYYY-MM-DDTHH:mm')}
																required
															/>
														</div>
													</div>
												</div>
												<div>
													<Button type='submit' variant='outline-primary' size='sm'>
														Update
													</Button>
												</div>
											</form>
										)}
									</Formik>
								</div>
							);
						})}
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant='secondary'
					onClick={() => {
						setValidOrders(prevState => []);
						onGoBack(type);
					}}
				>
					Go Back
				</Button>
				<Button disabled={isDisabled} variant='primary' onClick={() => onConfirm(type)}>
					Confirm
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

ReviewOrders.propTypes = {
	show: PropTypes.bool.isRequired,
	type: PropTypes.string.isRequired,
	onGoBack: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	orders: PropTypes.array,
	onConfirm: PropTypes.func.isRequired,
	windowStartTime: PropTypes.object,
	windowEndTime: PropTypes.object
};

export default ReviewOrders;
