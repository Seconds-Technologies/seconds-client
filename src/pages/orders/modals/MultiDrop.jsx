import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import Button from 'react-bootstrap/Button';

const MultiDrop = ({ show, onHide, orders, orderNumbers, windowStartTime, windowEndTime, onSubmit, onUpdate }) => {
	return (
		<Modal show={show} onHide={onHide} centered size='lg'>
			<div className='p-4 mt-2'>
				<Formik
					enableReinitialize
					initialValues={{
						startTime: windowStartTime,
						endTime: windowEndTime,
					}}
					onSubmit={onSubmit}
				>
					{({ values, handleBlur, handleChange, setFieldValue }) => (
						<div className='container-fluid'>
							<div className='d-flex justify-content-between mb-3'>
								<h1 className='fs-4 font-header'>New Multi-Drop Order</h1>
								<button type='button' className='btn-close shadow-none' aria-label='Close' onClick={onHide} />
							</div>
							<div className='row gy-2 mb-4'>
								<div className='col-12'>
									<h1 className='fs-5 font-header'>Time Window</h1>
								</div>
								<div className='col-6'>
									<label htmlFor=''>Start from</label>
									<input
										defaultValue={values.startTime}
										id='start-time'
										name='startTime'
										type='datetime-local'
										aria-label='start-time'
										className='form-control form-border rounded-3'
										onChange={handleChange}
										onBlur={handleBlur}
										min={dayjs().add(5, 'm').format('YYYY-MM-DDTHH:mm')}
										required
									/>
								</div>
								<div className='col-6'>
									<label htmlFor=''>End at</label>
									<input
										defaultValue={values.endTime}
										name='endTime'
										id='end-time'
										type='datetime-local'
										className='form-control form-border rounded-3'
										aria-label='end-time'
										onChange={handleChange}
										onBlur={handleBlur}
										min={dayjs(values.startTime).format('YYYY-MM-DDTHH:mm')}
										// max={dayjs(values.startTime).set('hour', 23).set('minute', 59).format('YYYY-MM-DDTHH:mm')}
										required
									/>
								</div>
							</div>
							<header className='mb-3'>
								<h1 className='fs-5 font-header'>Selected Orders</h1>
							</header>
							<div className='list-group mb-3'>
								{orders.map(({ _id: jobId, jobSpecification: { orderNumber, pickupStartTime, deliveries } }, index) => {
									const { dropoffLocation, dropoffStartTime, dropoffEndTime } = deliveries[0];
									return (
										<div key={index} className='list-group-item list-group-item-action' aria-current='true'>
											<span className='fs-5'>{dropoffLocation.fullAddress}</span>
											<Formik
												enableReinitialize
												initialValues={{
													dropoffStartTime: dropoffStartTime ? dropoffStartTime : dayjs().format('YYYY-MM-DDTHH:mm'),
													dropoffEndTime
												}}
												onSubmit={values => onUpdate(values, jobId)}
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
							<div className="d-flex justify-content-end">
								<Button type='submit' variant='primary' size='lg'>
									Get Quotes
								</Button>
							</div>
						</div>
					)}
				</Formik>
			</div>
		</Modal>
	);
};

MultiDrop.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	orders: PropTypes.array.isRequired,
	orderNumbers: PropTypes.array.isRequired,
	onSubmit: PropTypes.func.isRequired
};

export default MultiDrop;
