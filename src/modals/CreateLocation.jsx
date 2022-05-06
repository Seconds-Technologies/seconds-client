import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Formik } from 'formik';
import { createLocationSchema } from '../validation';
import { parseAddress } from '../helpers';
import { useDispatch, useSelector } from 'react-redux';
import { addError } from '../store/actions/errors';
import { geocodeByAddress } from 'react-google-places-autocomplete';
import { updateProfile } from '../store/actions/auth';
import ClipLoader from 'react-spinners/ClipLoader';
import { Mixpanel } from '../config/mixpanel';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 600,
	bgcolor: 'white',
	boxShadow: 24,
	border: 0,
	paddingX: 6,
	paddingY: 4
};

const CreateLocation = ({ open, onClose }) => {
	const [loading, setLoading] = useState(false);
	const { user } = useSelector(state => state['currentUser'])
	const dispatch = useDispatch()

	const validateAddress = useCallback(address => {
		let err;
		const types = ['street address', 'city', 'postcode'];
		Object.values(address).forEach((item, index) => {
			if (!item) {
				err = `Address does not include a '${types[index]}'. Please add all parts of the address and try again`;
				dispatch(addError(err));
				throw new Error(err);
			} else if (index === 2 && item.length < 6) {
				err = `Postcode,' ${item}', is not complete. Please include a full UK postcode in your address`;
				dispatch(addError(err));
				throw new Error(err);
			}
		});
		return true;
	}, []);

	const getParsedAddress = useCallback(parseAddress, []);

	return (
		<Modal open={open} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
			<Box sx={style}>
				<Formik
					enableReinitialize
					initialErrors={{
						locationName: '',
						businessName: '',
						streetNumber: '',
						streetAddress: '',
						city: '',
						postcode: ''
					}}
					validateOnChange
					validationSchema={createLocationSchema}
					initialValues={{
						id: user.id,
						locationName: '',
						businessName: '',
						streetNumber: '',
						streetAddress: '',
						city: '',
						postcode: '',
						country: 'GB'
					}}
					onSubmit={async (values) => {
						try {
							setLoading(true);
							console.log(values);
							values.fullAddress = `${values.streetNumber} ${values.streetAddress} ${values.city} ${values.postcode}`;
							let inputPostcode = values.postcode; // store postcode entered by the user during signup
							let addressComponents = await geocodeByAddress(values.fullAddress);
							values.address = getParsedAddress(addressComponents, true);
							values.address.postcode = inputPostcode;
							validateAddress(values.address);
							console.table({ address: values.address, fullAddress: values.fullAddress })
							const message = await dispatch(updateProfile(values))
							Mixpanel.track('Create Location', {
								$type: 'SUCCESS'
							});
							console.log(message)
							setLoading(false)
						} catch (err) {
							Mixpanel.track('Create Location', {
								$type: 'FAILURE'
							});
							setLoading(false)
						    console.error(err)
						}
					}}
				>
					{({ values, errors, handleChange, handleSubmit, handleBlur }) => (
						<form action='' onSubmit={handleSubmit} className='container'>
							<header className='d-flex flex-column py-2'>
								<span className='fs-4 font-semibold'>Create a location</span>
								<small className='text-muted font-medium'>This is the location drivers will pick up orders from.</small>
							</header>
							<div className='py-3 mb-2'>
								<label htmlFor='location-name' className='mb-1'>
									<span className='text-muted'>
										{errors['locationName'] && <span className='text-danger'>* </span>}Name of location?
									</span>
								</label>
								<input
									id='location-name'
									name='locationName'
									type='text'
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder='i.e. Seconds HQ'
									className='form-control rounded-0 py-2'
								/>
							</div>
							<section className='d-flex flex-column'>
								<span className='fs-5 font-semibold'>Address</span>
								<div className='row'>
									<div className='mt-1 mb-2 col-12'>
										<label htmlFor='business-name' className='mb-1'>
											<span className='text-muted'>
												{errors['businessName'] && <span className='text-danger'>* </span>}Restaurant/Business Name
											</span>
										</label>
										<input
											id='business-name'
											name='businessName'
											type='text'
											onChange={handleChange}
											onBlur={handleBlur}
											className='form-control rounded-0 py-2'
										/>
									</div>
									<div className='mt-1 mb-2 col-8'>
										<label htmlFor='street-address' className='mb-1'>
											<span className='text-muted'>
												{errors['streetAddress'] && <span className='text-danger'>* </span>}Street
											</span>
										</label>
										<input
											id='street-address'
											name='streetAddress'
											type='text'
											onChange={handleChange}
											onBlur={handleBlur}
											className='form-control rounded-0 py-2'
										/>
									</div>
									<div className='mt-1 mb-2 col-4'>
										<label htmlFor='street-number' className='mb-1'>
											<span className='text-muted'>
												{errors['streetNumber'] && <span className='text-danger'>* </span>}Number
											</span>
										</label>
										<input
											id='street-number'
											name='streetNumber'
											type='text'
											onChange={handleChange}
											onBlur={handleBlur}
											className='form-control rounded-0 py-2'
										/>
									</div>
									<div className='mt-1 mb-2 col-8'>
										<label htmlFor='city' className='mb-1'>
											<span className='text-muted'>{errors['city'] && <span className='text-danger'>* </span>}City</span>
										</label>
										<input
											id='city'
											name='city'
											type='text'
											onChange={handleChange}
											onBlur={handleBlur}
											className='form-control rounded-0 py-2'
										/>
									</div>
									<div className='mt-1 mb-2 col-4'>
										<label htmlFor='postcode' className='mb-1'>
											<span className='text-muted'>
												{errors['postcode'] && <span className='text-danger'>* </span>}Postal Code
											</span>
										</label>
										<input
											id='postcode'
											name='postcode'
											type='text'
											onChange={handleChange}
											onBlur={handleBlur}
											className='form-control rounded-0 py-2'
										/>
									</div>
									<div className='mt-1 mb-2 col-12'>
										<label htmlFor='country' className='text-muted mb-1'>
											Country
										</label>
										<input
											defaultValue={values.country}
											id='country'
											name='country'
											type='text'
											onChange={handleChange}
											onBlur={handleBlur}
											className='form-control rounded-0 py-2'
										/>
									</div>
								</div>
							</section>
							<footer className='d-flex justify-content-center my-4 px-5'>
								<button type="submit" className='d-flex justify-content-center align-items-center btn btn-lg btn-primary rounded-0 w-100' style={{ height: 50 }}>
									<span className='font-semibold me-3'>Create Location</span>
									<ClipLoader color='white' loading={loading} size={20} />
								</button>
							</footer>
						</form>
					)}
				</Formik>
			</Box>
		</Modal>
	);
};

CreateLocation.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired
};

export default CreateLocation;
