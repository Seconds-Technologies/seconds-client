import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';

const UpdateJob = ({ deliveryDetails, show, onHide, onSubmit }) => {
	return (
		<Modal show={show} onHide={onHide} centered>
			<Modal.Header closeButton>
				<Modal.Title>Update Order</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Formik
					enableReinitialize
					initialValues={{
						firstname: deliveryDetails.firstName,
						lastname: deliveryDetails.lastName,
						email: deliveryDetails.email,
						phone: deliveryDetails.phoneNumber,
						addressLine1: deliveryDetails.streetAddress,
						addressLine2: '',
						city: deliveryDetails.city,
						postcode: deliveryDetails.postcode,
						fullAddress: deliveryDetails.fullAddress
					}}
					onSubmit={onSubmit}
				>
					{({ values, errors, handleSubmit, handleBlur, handleChange }) => (
						<form onSubmit={handleSubmit}>
							<div className='row'>
								<div className='col'>
									{errors['firstname'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										defaultValue={values.firstname}
										autoComplete='given-name'
										id='new-drop-firstname'
										name='firstname'
										type='text'
										className='form-control border-0 border-bottom my-2 modal-form'
										placeholder='First Name'
										required
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
								<div className='col'>
									{errors['lastname'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										defaultValue={values.lastname}
										name='lastname'
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
									{errors['phone'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										defaultValue={values.phone}
										autoComplete='tel'
										name='phone'
										type='tel'
										className='form-control border-0 border-bottom my-2 modal-form'
										placeholder='Phone Number'
										onChange={handleChange}
										onBlur={handleBlur}
										required
									/>
								</div>
								<div className='col'>
									{errors['email'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										defaultValue={values.email}
										name='email'
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
									{errors['addressLine1'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										defaultValue={values.addressLine1}
										autoComplete='address-line1'
										placeholder='Address Line 1'
										type='text'
										id='address-line-1'
										name='addressLine1'
										className='form-control border-0 border-bottom my-2 modal-form'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
								<div className='col-md-6 col-lg-6'>
									<input
										defaultValue={values.addressLine2}
										autoComplete='address-line2'
										placeholder='Address Line 2'
										type='text'
										id='address-line-2'
										name='addressLine2'
										className='form-control border-0 border-bottom my-2 modal-form'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='row'>
								<div className='col-md-6 col-lg-6'>
									{errors['city'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										defaultValue={values.city}
										autoComplete='address-level2'
										placeholder='City'
										type='text'
										id='dropoff-city'
										name='city'
										className='form-control border-0 border-bottom my-2 modal-form'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
								<div className='col-md-6 col-lg-6'>
									{errors['postcode'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<input
										defaultValue={values.postcode}
										autoComplete='postal-code'
										placeholder='Postcode'
										type='text'
										id='postcode'
										name='postcode'
										className='form-control border-0 border-bottom my-2 modal-form'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='d-flex justify-content-center my-4'>
								<button type='submit' className='btn w-50 btn-primary'>
									<span className='fs-5'>Update</span>
								</button>
							</div>
						</form>
					)}
				</Formik>
			</Modal.Body>
		</Modal>
	);
};

UpdateJob.propTypes = {};

export default UpdateJob;
