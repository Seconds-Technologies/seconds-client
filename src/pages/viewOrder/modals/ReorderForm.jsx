import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';
import { ReOrderSchema } from '../../../validation';
import moment from 'moment';
import { jobRequestSchema } from '../../../schemas';
import Select from 'react-select';
import { DELIVERY_TYPES, VEHICLE_TYPES } from '../../../constants';
import VehicleOptions from '../../../components/VehicleOptions';
import ErrorField from '../../../components/ErrorField';

const ReorderForm = ({ show, toggleShow, onSubmit, prevJob }) => {

	const PICKUP_LIMIT = useMemo(() => -600, []);
	const drops = useMemo(() => {
		return prevJob.deliveries.map(({ description, dropoffLocation, dropoffEndTime }) => ({
			dropoffAddress: '',
			dropoffAddressLine1: dropoffLocation['streetAddress'],
			dropoffAddressLine2: '',
			dropoffCity: dropoffLocation.city,
			dropoffPostcode: dropoffLocation.postcode,
			dropoffPhoneNumber: dropoffLocation.phoneNumber,
			dropoffEmailAddress: dropoffLocation['email'],
			dropoffFirstName: dropoffLocation['firstName'],
			dropoffLastName: dropoffLocation['lastName'],
			dropoffInstructions: dropoffLocation.instructions,
			packageDropoffEndTime:
				moment().diff(dropoffEndTime, 'seconds') < PICKUP_LIMIT
					? moment(dropoffEndTime).format('YYYY-MM-DDTHH:mm')
					: moment().add(75, 'minutes').format('YYYY-MM-DDTHH:mm'),
			packageDescription: description,
		}));
	}, [prevJob]);

	return (
		<Modal show={show} onHide={() => toggleShow(false)} size='xl' centered>
			<Modal.Header closeButton>
				<Modal.Title>Re-order</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Formik
					validationSchema={ReOrderSchema}
					initialValues={{
						...jobRequestSchema,
						pickupFirstName: prevJob.pickupLocation['firstName'],
						pickupLastName: prevJob.pickupLocation['lastName'],
						pickupBusinessName: prevJob.pickupLocation['businessName'],
						pickupEmailAddress: prevJob.pickupLocation.email,
						pickupPhoneNumber: prevJob.pickupLocation.phoneNumber,
						pickupAddressLine1: prevJob.pickupLocation['streetAddress'],
						pickupAddressLine2: '',
						pickupCity: prevJob.pickupLocation.city,
						pickupPostcode: prevJob.pickupLocation.postcode,
						// if currentTime is at least 10 mins before the previous requested pickup time, use that as the default value
						// if not set the default to be 15 mins after the current time
						packagePickupStartTime:
							moment().diff(prevJob.pickupStartTime, 'seconds') < PICKUP_LIMIT
								? moment(prevJob.pickupStartTime).format('YYYY-MM-DDTHH:mm')
								: moment().add(15, 'minutes').format('YYYY-MM-DDTHH:mm'),
						drops,
						itemsCount: 0
					}}
					onSubmit={onSubmit}
				>
					{({ values, handleBlur, handleChange, handleSubmit, errors, setFieldValue }) => (
						<form onSubmit={handleSubmit} className='d-flex flex-column' autoComplete='on'>
							<div className='row'>
								<div className='col'>
									<h4 className='text-center'>Pickup</h4>
									<div className='row'>
										<div className='col'>
											{errors['pickupFirstName'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
											<input
												defaultValue={values.pickupFirstName}
												autoComplete='given-name'
												id='new-drop-firstname'
												name='pickupFirstName'
												type='text'
												className='form-control border-0 border-bottom my-2 modal-form'
												placeholder='First Name'
												required
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
										<div className='col'>
											{errors['pickupLastName'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
											<input
												defaultValue={values.pickupLastName}
												name='pickupLastName'
												type='text'
												className='form-control border-0 border-bottom my-2 modal-form'
												placeholder='Last Name'
												onChange={handleChange}
												onBlur={handleBlur}
												required
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col'>
											{errors['pickupPhoneNumber'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
											<input
												defaultValue={values.pickupPhoneNumber}
												autoComplete='tel'
												name='pickupPhoneNumber'
												type='tel'
												className='form-control border-0 border-bottom my-2 modal-form'
												placeholder='Phone Number'
												onChange={handleChange}
												onBlur={handleBlur}
												required
											/>
										</div>
										<div className='col'>
											{errors['pickupEmailAddress'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
											<input
												defaultValue={values.pickupEmailAddress}
												name='pickupEmailAddress'
												type='email'
												className='form-control border-0 border-bottom my-2 modal-form'
												placeholder='Email Address'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col-md-6 col-lg-6'>
											{errors['pickupAddressLine1'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
											<input
												defaultValue={values.pickupAddressLine1}
												autoComplete='address-line1'
												placeholder='Address Line 1'
												type='text'
												id='pickup-address-line-1'
												name='pickupAddressLine1'
												className='form-control border-0 border-bottom my-2 modal-form'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
										<div className='col-md-6 col-lg-6'>
											<input
												defaultValue={values.pickupAddressLine2}
												autoComplete='address-line2'
												placeholder='Address Line 2'
												type='text'
												id='dropoff-address-line-2'
												name='pickupAddressLine2'
												className='form-control border-0 border-bottom my-2 modal-form'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col-md-6 col-lg-6'>
											{errors['pickupCity'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
											<input
												defaultValue={values.pickupCity}
												autoComplete='address-level2'
												placeholder='City'
												type='text'
												id='dropoff-city'
												name='pickupCity'
												className='form-control border-0 border-bottom my-2 modal-form'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
										<div className='col-md-6 col-lg-6'>
											{errors['pickupPostcode'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
											<input
												defaultValue={values.pickupPostcode}
												autoComplete='postal-code'
												placeholder='Postcode'
												type='text'
												id='dropoff-postcode'
												name='pickupPostcode'
												className='form-control border-0 border-bottom my-2 modal-form'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col'>
											{errors['packagePickupStartTime'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
											<input
												disabled={values.packageDeliveryType === DELIVERY_TYPES.ON_DEMAND}
												defaultValue={moment(values.packagePickupStartTime).format('YYYY-MM-DDTHH:mm')}
												type='datetime-local'
												name='packagePickupStartTime'
												id='pickup_start_time'
												className='form-control border-0 border-bottom my-2 modal-form'
												onChange={handleChange}
												onBlur={handleBlur}
												min={moment(prevJob.pickupStartTime).format('YYYY-MM-DDTHH:mm')}
												max={moment().add(7, 'days').format('YYYY-MM-DDTHH:mm')}
												required={values.packageDeliveryType !== DELIVERY_TYPES.ON_DEMAND}
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col'>
											<textarea
												placeholder='Pickup Instructions'
												name='pickupInstructions'
												className='form-control border-0 border-bottom my-2 modal-form'
												aria-label='pickup-instructions'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
								</div>
								<div className='col'>
									<h4 className='text-center'>Dropoff</h4>
									<div className='row'>
										<div className='col'>
											{errors['drops'] && errors['drops'][0]['dropoffFirstName'] && (
												<span className='text-danger position-absolute mt-1 ms-1'>*</span>
											)}
											<input
												defaultValue={values.drops[0].dropoffFirstName}
												autoComplete='given-name'
												id='new-drop-firstname'
												name='drops[0].dropoffFirstName'
												type='text'
												className='form-control border-0 border-bottom my-2 modal-form'
												placeholder='First Name'
												required
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
										<div className='col'>
											{errors['drops'] && errors['drops'][0]['dropoffLastName'] && (
												<span className='text-danger position-absolute mt-1 ms-1'>*</span>
											)}
											<input
												defaultValue={values.drops[0].dropoffLastName}
												name='drops[0].dropoffLastName'
												type='text'
												className='form-control border-0 border-bottom my-2 modal-form'
												placeholder='Last Name'
												onChange={handleChange}
												onBlur={handleBlur}
												required
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col'>
											{errors['drops'] && errors['drops'][0]['dropoffPhoneNumber'] && (
												<span className='text-danger position-absolute mt-1 ms-1'>*</span>
											)}
											<input
												defaultValue={values.drops[0].dropoffPhoneNumber}
												autoComplete='tel'
												name='drops[0].dropoffPhoneNumber'
												type='tel'
												className='form-control border-0 border-bottom my-2 modal-form'
												placeholder='Phone Number'
												onChange={handleChange}
												onBlur={handleBlur}
												required
											/>
										</div>
										<div className='col'>
											{errors['drops'] && errors['drops'][0]['dropoffEmailAddress'] && (
												<span className='text-danger position-absolute mt-1 ms-1'>*</span>
											)}
											<input
												defaultValue={values.drops[0].dropoffEmailAddress}
												name='drops[0].dropoffEmailAddress'
												type='email'
												className='form-control border-0 border-bottom my-2 modal-form'
												placeholder='Email Address'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col-md-6 col-lg-6'>
											{errors['drops'] && errors['drops'][0]['dropoffAddressLine1'] && (
												<span className='text-danger position-absolute mt-1 ms-1'>*</span>
											)}
											<input
												defaultValue={values.drops[0].dropoffAddressLine1}
												autoComplete='address-line1'
												placeholder='Address Line 1'
												type='text'
												id='dropoff-address-line-1'
												name='drops[0].dropoffAddressLine1'
												className='form-control border-0 border-bottom my-2 modal-form'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
										<div className='col-md-6 col-lg-6'>
											<input
												defaultValue={values.drops[0].dropoffAddressLine2}
												autoComplete='address-line2'
												placeholder='Address Line 2'
												type='text'
												id='dropoff-address-line-2'
												name='drops[0].dropoffAddressLine2'
												className='form-control border-0 border-bottom my-2 modal-form'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col-md-6 col-lg-6'>
											{errors['drops'] && errors['dropoffCity'] && errors['drops'][0]['dropoffCity'] && (
												<span className='text-danger position-absolute mt-1 ms-1'>*</span>
											)}
											<input
												defaultValue={values.drops[0].dropoffCity}
												autoComplete='address-level2'
												placeholder='City'
												type='text'
												id='dropoff-city'
												name='dropoffCity'
												className='form-control border-0 border-bottom my-2 modal-form'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
										<div className='col-md-6 col-lg-6'>
											{errors['drops'] && errors['dropoffPostcode'] && errors['drops'][0]['dropoffCity'] && (
												<span className='text-danger position-absolute mt-1 ms-1'>*</span>
											)}
											<input
												defaultValue={values.drops[0].dropoffPostcode}
												autoComplete='postal-code'
												placeholder='Postcode'
												type='text'
												id='dropoff-postcode'
												name='drops[0].dropoffPostcode'
												className='form-control border-0 border-bottom my-2 modal-form'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col'>
											{errors['drops'] && errors['drops'][0]['packageDropoffEndTime'] && (
												<span className='text-danger position-absolute mt-1 ms-1'>*</span>
											)}
											<input
												disabled={values.packageDeliveryType === DELIVERY_TYPES.ON_DEMAND}
												defaultValue={
													// if currentTime is at least 10 mins before the previous requested pickup time, use that as the default value
													// if not set the default to be 15 mins after the current time
													moment().diff(values.drops[0].packageDropoffEndTime, 'seconds') < PICKUP_LIMIT
														? moment(values.drops[0].packageDropoffEndTime).format('YYYY-MM-DDTHH:mm')
														: moment(values.packagePickupStartTime).add(60, 'minutes').format('YYYY-MM-DDTHH:mm')
												}
												type='datetime-local'
												name='drops[0].packageDropoffEndTime'
												id='dropoff-deadline'
												className='form-control border-0 border-bottom my-2 modal-form'
												onChange={handleChange}
												onBlur={handleBlur}
												min={moment(values.packagePickupStartTime).format('YYYY-MM-DDTHH:mm')}
												max={moment().add(7, 'days').format('YYYY-MM-DDTHH:mm')}
												required={values.packageDeliveryType !== DELIVERY_TYPES.ON_DEMAND}
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col'>
											<textarea
												placeholder='Dropoff Instructions'
												name='drops[0].dropoffInstructions'
												className='form-control border-0 border-bottom my-2 modal-form'
												aria-label='dropoff-instructions'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className='row gy-3'>
								<div className='col'>
									<h4 className='text-center'>Delivery Type</h4>
									<div className='d-flex flex-grow-1 justify-content-center flex-column mt-4'>
										<div className='form-check mb-2'>
											<input
												className='form-check-input'
												type='radio'
												name='deliveryType'
												id='radio-1'
												checked={values.packageDeliveryType === DELIVERY_TYPES.ON_DEMAND}
												onChange={e => setFieldValue('packageDeliveryType', DELIVERY_TYPES.ON_DEMAND)}
												onBlur={handleBlur}
											/>
											<label className='form-check-label' htmlFor='radio-1'>
												On Demand
											</label>
										</div>
										<div className='form-check mb-2'>
											<input
												className='form-check-input'
												type='radio'
												name='deliveryType'
												id='radio-2'
												checked={values.packageDeliveryType === DELIVERY_TYPES.SAME_DAY}
												onChange={e => setFieldValue('packageDeliveryType', DELIVERY_TYPES.SAME_DAY)}
												onBlur={handleBlur}
											/>
											<label className='form-check-label' htmlFor='radio-2'>
												Scheduled Same Day
											</label>
										</div>
										<ErrorField name='packageDeliveryType' classNames='mt-2' />
									</div>
								</div>
								<div className='col'>
									<h4 className='text-center'>Package Details</h4>
									<textarea
										defaultValue={values.drops[0].packageDescription}
										placeholder='Package Description'
										name='drops[0].packageDescription'
										className='form-control border-0 border-bottom my-2 modal-form'
										aria-label='dropoff-description'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<div>
										{errors['vehicleType'] && (
											<span className='text-danger position-absolute' style={{ zIndex: 1000 }}>
												*&nbsp;
											</span>
										)}
										<Select
											menuPlacement='top'
											id='vehicle-type'
											name='vehicleType'
											className='my-2'
											options={VEHICLE_TYPES}
											components={{ VehicleOptions }}
											placeholder={'Vehicle Type'}
											onChange={({ value }) => {
												setFieldValue('vehicleType', value);
												console.log(value);
											}}
											styles={{
												container: (provided, state) => ({
													...provided,
													border: 0,
													boxShadow: 0,
												}),
												control: (provided, state) => ({
													...provided,
													border: 0,
													boxShadow: 'none',
													borderRadius: 0,
													borderBottom: '1px solid lightgrey',
												}),
											}}
											aria-label='vehicle type selection'
										/>
									</div>
								</div>
							</div>
							<div className='d-flex justify-content-center mt-4'>
								<button type='submit' className='btn w-25 btn-primary'>
									<span className='fs-5'>Re-order</span>
								</button>
							</div>
						</form>
					)}
				</Formik>
			</Modal.Body>
		</Modal>
	);
};

ReorderForm.propTypes = {
	show: PropTypes.bool.isRequired,
	toggleShow: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	prevJob: PropTypes.object.isRequired
};

export default ReorderForm;
