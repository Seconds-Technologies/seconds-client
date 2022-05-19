import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';
import { dropsSchema } from '../validation';
import { addDropoff } from '../store/actions/delivery';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';

const NewDropoffForm = ({ show, toggleShow, pickupDateTime }) => {
	const dispatch = useDispatch()
	return (
		<Modal show={show} onHide={() => toggleShow(false)} size='lg' centered>
			<Modal.Header closeButton>
				<Modal.Title>Add New Dropoff</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Formik
					validationSchema={dropsSchema}
					initialValues={{
						dropoffFirstName: '',
						dropoffLastName: '',
						dropoffPhoneNumber: '',
						dropoffEmailAddress: '',
						dropoffAddressLine1: '',
						dropoffAddressLine2: '',
						dropoffCity: '',
						dropoffPostcode: '',
						dropoffInstructions: '',
						packageDropoffEndTime: '',
						packageDescription: '',
					}}
					onSubmit={values => dispatch(addDropoff(values))}
				>
					{({ values, handleBlur, handleChange, handleSubmit, errors, setFieldValue }) => (
						<form onSubmit={handleSubmit} className='d-flex flex-column' autoComplete='on'>
							<div className='row'>
								<div className='col'>
									{errors['dropoffFirstname'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										autoComplete='given-name'
										id='new-drop-firstname'
										name='dropoffFirstName'
										type='text'
										className='form-control form-border rounded-3 my-2'
										placeholder='First Name'
										required
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
								<div className='col'>
									{errors['dropoffLastName'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										name='dropoffLastName'
										type='text'
										className='form-control form-border rounded-3 my-2'
										placeholder='Last Name'
										onChange={handleChange}
										onBlur={handleBlur}
										required
									/>
								</div>
							</div>
							<div className='row'>
								<div className='col'>
									{errors['dropoffPhoneNumber'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										autoComplete='tel'
										name='dropoffPhoneNumber'
										type='tel'
										className='form-control form-border rounded-3 my-2'
										placeholder='Phone Number'
										onChange={handleChange}
										onBlur={handleBlur}
										required
									/>
								</div>
								<div className='col'>
									{errors['dropoffEmailAddress'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										name='dropoffEmailAddress'
										type='email'
										className='form-control form-border rounded-3 my-2'
										placeholder='Email Address'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
							</div>
							<div className='row'>
								<div className='col-md-6 col-lg-6'>
									{errors['dropoffAddressLine1'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										defaultValue={values.dropoffAddressLine1}
										autoComplete='address-line1'
										placeholder='Address Line 1'
										type='text'
										id='dropoff-address-line-1'
										name='dropoffAddressLine1'
										className='form-control rounded-3 my-2'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
								<div className='col-md-6 col-lg-6'>
									<input
										defaultValue={values.dropoffAddressLine2}
										autoComplete='address-line2'
										placeholder='Address Line 2'
										type='text'
										id='dropoff-address-line-2'
										name='dropoffAddressLine2'
										className='form-control rounded-3 my-2'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='row'>
								<div className='col-md-6 col-lg-6'>
									{errors['dropoffCity'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										defaultValue={values.dropoffCity}
										autoComplete='address-level2'
										placeholder='City'
										type='text'
										id='dropoff-city'
										name='dropoffCity'
										className='form-control rounded-3 my-2'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
								<div className='col-md-6 col-lg-6'>
									{errors['dropoffPostcode'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										defaultValue={values.dropoffPostcode}
										autoComplete='postal-code'
										placeholder='Postcode'
										type='text'
										id='dropoff-postcode'
										name='dropoffPostcode'
										className='form-control rounded-3 my-2'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='row'>
								<div className='col'>
									{errors['packageDropoffEndTime'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										type='datetime-local'
										name='packageDropoffEndTime'
										id='dropoff-deadline'
										className='form-control form-border rounded-3 my-2'
										onChange={handleChange}
										onBlur={handleBlur}
										min={
											pickupDateTime
												? dayjs(pickupDateTime).subtract(1, 'minute').format('YYYY-MM-DDTHH:mm')
												: dayjs().subtract(1, 'minute').format('YYYY-MM-DDTHH:mm')
										}
										max={
											pickupDateTime
												? dayjs(pickupDateTime).add(1, 'days').format('YYYY-MM-DDTHH:mm')
												: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm')
										}
										required
									/>
								</div>
							</div>
							<div className='row'>
								<div className='col'>
									<textarea
										placeholder='Dropoff Instructions'
										name='dropoffInstructions'
										className='form-control form-border rounded-3 my-2'
										aria-label='dropoff-instructions'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
								<div className='col'>
									<textarea
										placeholder='Package Description'
										name='packageDescription'
										className='form-control form-border rounded-3 my-2'
										aria-label='dropoff-description'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
							</div>
							<div className='d-flex justify-content-center mt-4'>
								<button type='submit' className='btn w-25 btn-primary'>
									<span className='fs-5'>Add</span>
								</button>
							</div>
						</form>
					)}
				</Formik>
			</Modal.Body>
		</Modal>
	);
};

NewDropoffForm.propTypes = {
	show: PropTypes.bool.isRequired,
	toggleShow: PropTypes.func.isRequired,
	pickupDateTime: PropTypes.string.isRequired
};

export default NewDropoffForm;
