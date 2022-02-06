import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';
import bicycle from '../../../assets/img/bicycle.svg';
import motorbike from '../../../assets/img/motorbike.svg';
import cargobike from '../../../assets/img/cargobike.svg';
import car from '../../../assets/img/car.svg';
import van from '../../../assets/img/van.svg';
import { VEHICLE_TYPES } from '../../../constants';

const DriverModal = ({ type, show, toggleShow, onSubmit, details }) => {

	useEffect(() => {
		console.log(details);
	}, [details]);

	return (
		<Modal show={show} onHide={() => toggleShow('')} size='lg' centered>
			<Modal.Header className='border-0 pb-0' closeButton />
			<Modal.Body>
				<Formik
					enableReinitialize
					initialValues={{
						...(type === "update" && {id: details.id}),
						firstname: details.firstname,
						lastname: details.lastname,
						email: details.email,
						phone: details.phone,
						vehicle: details.vehicle,
						type
					}} onSubmit={onSubmit}>
					{({ errors, values, handleSubmit, handleChange, handleBlur, setFieldValue }) => (
						<div className='row mx-auto w-75'>
							<h2 className='text-center mb-3'>{type === 'create' ? 'New Driver' : 'Update Driver'}</h2>
							<form
								onSubmit={handleSubmit}
								className='row my-4 d-flex flex-column justify-content-center align-items-center'
								autoComplete='on'
							>
								<div className='row'>
									{errors['driverName'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<label htmlFor='staticEmail' className='col-sm-4 col-form-label'>
										First Name
									</label>
									<div className='col-sm-8'>
										<input
											defaultValue={values.firstname}
											id='driver-first-name'
											name='firstname'
											type='text'
											className='form-control form-border rounded-3 my-2'
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
									</div>
								</div>
								<div className='row'>
									{errors['driverName'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<label htmlFor='staticEmail' className='col-sm-4 col-form-label'>
										Last Name
									</label>
									<div className='col-sm-8'>
										<input
											defaultValue={values.lastname}
											id='driver-last-name'
											name='lastname'
											type='text'
											className='form-control form-border rounded-3 my-2'
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
									</div>
								</div>
								<div className='row'>
									{errors['driverName'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<label htmlFor='staticEmail' className='col-sm-4 col-form-label'>
										Phone No.
									</label>
									<div className='col-sm-8'>
										<input
											defaultValue={values.phone}
											id='driver-phone'
											name='phone'
											type='tel'
											className='form-control form-border rounded-3 my-2'
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
									</div>
								</div>
								<div className='row'>
									{errors['driverName'] && <span className='text-danger position-absolute mt-1 ms-1'>*</span>}
									<label htmlFor='staticEmail' className='col-sm-4 col-form-label'>
										Email Address
									</label>
									<div className='col-sm-8'>
										<input
											defaultValue={values.email}
											id='driver-email'
											name='email'
											type='email'
											className='form-control form-border rounded-3 my-2'
											onChange={handleChange}
											onBlur={handleBlur}
											required
										/>
									</div>
								</div>
								<div className='row'>
									<label htmlFor='staticEmail' className='col-sm-4 col-form-label'>
										Vehicle Type
									</label>
									<div className='col-sm-8 d-flex justify-content-around'>
										<label className='d-flex align-items-center'>
											<input type='radio' name='test' value='small' checked={values.vehicle === VEHICLE_TYPES[0].value}
											       onChange={e => setFieldValue('vehicle', VEHICLE_TYPES[0].value)} onBlur={handleBlur} />
											<img className='img-fluid' src={bicycle} alt={''} width={40} height={40} />
										</label>
										<label className='d-flex align-items-center'>
											<input type='radio' name='test' value='small' checked={values.vehicle === VEHICLE_TYPES[2].value}
											       onChange={e => setFieldValue('vehicle', VEHICLE_TYPES[2].value)} onBlur={handleBlur} />
											<img className='img-fluid' src={cargobike} alt='' width={50} height={50} />
										</label>
										<label className='d-flex align-items-center'>
											<input type='radio' name='test' value='small' checked={values.vehicle === VEHICLE_TYPES[1].value}
											       onChange={e => setFieldValue('vehicle', VEHICLE_TYPES[1].value)} onBlur={handleBlur} />
											<img className='img-fluid' src={motorbike} alt='' width={45} height={45} />
										</label>
										<label className='d-flex align-items-end'>
											<input type='radio' name='test' value='small' checked={values.vehicle === VEHICLE_TYPES[3].value}
											       onChange={e => setFieldValue('vehicle', VEHICLE_TYPES[3].value)} onBlur={handleBlur} />
											<img className='img-fluid' src={car} alt='' width={60} height={60} />
										</label>
										<label className='d-flex align-items-center'>
											<input type='radio' name='test' value='small' checked={values.vehicle === VEHICLE_TYPES[4].value}
											       onChange={e => setFieldValue('vehicle', VEHICLE_TYPES[4].value)} onBlur={handleBlur} />
											<img className='img-fluid' src={van} alt='' width={60} height={60} />
										</label>
									</div>
									<div className='d-flex justify-content-around mt-5 '>
										<button type='button' className='btn btn-dark' style={{ width: 150, height: 45 }}
										        onClick={() => toggleShow('')}>
											Cancel
										</button>
										<button type='submit' className='btn btn-primary' style={{ width: 150, height: 45 }}>
											Save
										</button>
									</div>
								</div>
							</form>
						</div>
					)}
				</Formik>
			</Modal.Body>
		</Modal>
	);
};

DriverModal.propTypes = {
	type: PropTypes.string.isRequired,
	show: PropTypes.bool.isRequired,
	toggleShow: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	details: PropTypes.object
};

export default DriverModal;
