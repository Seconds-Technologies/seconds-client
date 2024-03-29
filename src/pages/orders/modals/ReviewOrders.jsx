import React, { useEffect, useMemo, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

const ReviewOrders = ({ show, onGoBack, onHide, orders, onConfirm, onUpdate, windowStartTime, windowEndTime }) => {
	const [validOrders, setValidOrders] = useState([])

	const isDisabled = useMemo(() => {
		return validOrders.length ? !orders.every(({ jobSpecification: { orderNumber }}) => validOrders.includes(orderNumber)) : true;
	}, [validOrders])

	useEffect(() => {
		console.log(isDisabled)
	}, [validOrders, isDisabled])

	return (
		<Modal show={show} onHide={onHide}>
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
								{windowStartTime.calendar()} - {windowEndTime.calendar()}
							</span>
						</span>
					</div>
					<div className='list-group'>
						{orders.map(({ _id: jobId, jobSpecification: { orderNumber, pickupStartTime, deliveries } }, index) => {
							const { dropoffLocation, dropoffStartTime, dropoffEndTime } = deliveries[0];
							return (
								<div key={index} className='list-group-item list-group-item-action' aria-current='true'>
									<div className='d-flex w-100 align-items-center'>
										<h5>{validOrders.includes(orderNumber) ? "✅  "  : "⚠  "  } {orderNumber}</h5>
									</div>
									<span className='fs-5'>{dropoffLocation.fullAddress}</span>
									<Formik
										enableReinitialize
										initialValues={{
											dropoffStartTime: dropoffStartTime ? dropoffStartTime : moment().format('YYYY-MM-DDTHH:mm'),
											dropoffEndTime
										}}
										onSubmit={(values => {
											onUpdate(values, jobId)
											setValidOrders(prevState => [...prevState, orderNumber])
										})}
									>
										{({ values, handleChange, handleBlur, handleSubmit }) => (
											<form onSubmit={handleSubmit} className='align-items-center'>
												<div className='row my-2'>
													<div className='col-4'>
														<label htmlFor='dropoff-start-time' className='w-100'>
															Deliver from
														</label>
													</div>
													<div className='col-8'>
														<input
															defaultValue={moment(dropoffStartTime).format('YYYY-MM-DDTHH:mm')}
															id='dropoff-start-time'
															name='dropoffStartTime'
															type='datetime-local'
															aria-label='dropoff-start-time'
															className='form-control form-control-sm rounded-3'
															onChange={handleChange}
															onBlur={handleBlur}
															min={moment(windowStartTime).format('YYYY-MM-DDTHH:mm')}
															max={moment(windowEndTime).format('YYYY-MM-DDTHH:mm')}
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
															defaultValue={moment(dropoffEndTime).format('YYYY-MM-DDTHH:mm')}
															id='dropoff-end-time'
															name='dropoffEndTime'
															type='datetime-local'
															aria-label='dropoff-end-time'
															className='form-control form-control-sm rounded-3'
															onChange={handleChange}
															onBlur={handleBlur}
															min={moment(values.dropoffStartTime).format('YYYY-MM-DDTHH:mm')}
															max={moment(windowEndTime).format('YYYY-MM-DDTHH:mm')}
															required
														/>
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
				<Button variant='secondary' onClick={() => {
					setValidOrders(prevState => [])
					onGoBack()
				}}>
					Go Back
				</Button>
				<Button disabled={isDisabled} variant='primary'onClick={onConfirm}>Confirm</Button>
			</Modal.Footer>
		</Modal>
	);
};

ReviewOrders.propTypes = {
	show: PropTypes.bool.isRequired,
	onGoBack: PropTypes.func.isRequired,
	onHide: PropTypes.func.isRequired,
	orders: PropTypes.array,
	onConfirm: PropTypes.func.isRequired,
	windowStartTime: PropTypes.object,
	windowEndTime: PropTypes.object
};

export default ReviewOrders;
