import './profile.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Formik } from 'formik';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/actions/auth';
import camera from '../../assets/img/camera.svg';
import classnames from 'classnames';
import GooglePlaceAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete';
import { addError, removeError } from '../../store/actions/errors';
import { Mixpanel } from '../../config/mixpanel';
import { parseAddress } from '../../helpers';
import SuccessMessage from './modals/SuccessMessage';

const Profile = props => {
	const modalRef = useRef(null);
	const uploadedImage = useRef(null);
	const imageUploader = useRef(null);
	const dispatch = useDispatch();
	const { user } = useSelector(state => state['currentUser']);
	const errors = useSelector(state => state['errors']);
	const { isIntegrated } = useSelector(state => state['shopifyStore']);
	const [src, setSrc] = useState(null);
	const [apiModal, showAPIModal] = useState(false);
	const [successModal, showSuccessModal] = useState(false);
	const handleClose = type => (type === 'api' ? showAPIModal(false) : showSuccessModal(false));
	const handleOpen = type => (type === 'api' ? showAPIModal(true) : showSuccessModal(true));

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		dispatch(removeError());
	}, [props.location]);

	const handleImageUpload = e => {
		const [file] = e.target.files;
		if (file) {
			const reader = new FileReader();
			const { current } = uploadedImage;
			current.file = file;
			reader.onload = e => {
				current.src = e.target.result;
				setSrc(e.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const btnContainer = classnames({
		row: true,
		'd-flex': true,
		'my-4': !isIntegrated,
		'my-5': isIntegrated
	});

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
		<div ref={modalRef} className='profile d-flex flex-column justify-content-center px-5 '>
			<SuccessMessage ref={modalRef} show={successModal} onHide={() => handleClose('profile')} />
			<div>
				<h1 className='fs-3 fw-bold'>Account Information</h1>
			</div>
			<Formik
				enableReinitialize
				initialValues={{
					firstname: user.firstname,
					lastname: user.lastname,
					company: user.company,
					email: user.email,
					phone: user.phone,
					fullAddress: user.fullAddress,
					profileImage: null
				}}
				onSubmit={async ({ profileImage, fullAddress, ...values }) => {
					try {
						console.log(fullAddress);
						console.log(user.fullAddress);
						// check if address has changed
						if (fullAddress !== user.fullAddress) {
							values.fullAddress = fullAddress;
							let addressComponents = await geocodeByAddress(fullAddress);
							values.address = getParsedAddress(addressComponents);
							validateAddress(values.address);
						}
						console.log(values);
						const message = await dispatch(
							updateProfile({
								img: profileImage,
								id: user.id,
								...values
							})
						);
						console.log(message);
						handleOpen('profile');
						Mixpanel.track('Successful profile update');
					} catch (err) {
						Mixpanel.track('Unsuccessful profile update');
						console.log(err);
					}
				}}
			>
				{({ values, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
					<form action='' onSubmit={handleSubmit} className='w-75'>
						<div className='row'>
							<div className='col-12 d-flex flex-column justify-content-center py-3'>
								<input
									name='profileImage'
									type='file'
									ref={imageUploader}
									accept='image/*'
									onChange={e => {
										handleImageUpload(e);
										setFieldValue('profileImage', e.target.files[0]);
									}}
									style={{
										display: 'none'
									}}
								/>
								<div
									role='button'
									className='border-1 rounded-circle text-center'
									style={{
										display: 'inline-flex',
										justifyContent: 'center',
										alignItems: 'center',
										height: '100px',
										width: '100px',
										border: '1px dashed black'
									}}
									onClick={() => imageUploader.current.click()}
								>
									{user.profileImageData ? (
										<img
											src={`data:image/jpeg;base64,${user.profileImageData}`}
											className={'border-1 rounded-circle'}
											ref={uploadedImage}
											style={{
												width: '100px',
												height: '100px'
											}}
											alt='profile-button'
										/>
									) : (
										<img
											src={camera}
											className={src && 'border-1 rounded-circle'}
											ref={uploadedImage}
											style={
												src
													? {
															width: '100px',
															height: '100px'
													  }
													: {
															width: '30px',
															height: '30px'
													  }
											}
											alt='upload-button'
										/>
									)}
								</div>
							</div>
						</div>
						{errors.message && (
							<div className='alert alert-danger alert-dismissible' role='alert'>
								<span>{errors.message}</span>
								<button onClick={() => dispatch(removeError())} type='button' className='btn btn-close' />
							</div>
						)}
						<div className='row my-4'>
							<div className='col'>
								<label htmlFor='firstname' className='mb-2'>
									First Name
								</label>
								<input
									defaultValue={values.firstname}
									name='firstname'
									className='form-control border rounded-3'
									type='text'
									placeholder='First Name'
									required
									onChange={handleChange}
									onBlur={handleBlur}
								/>
							</div>
							<div className='col'>
								<label htmlFor='lastname' className='mb-2'>
									Last Name
								</label>
								<input
									defaultValue={values.lastname}
									name='lastname'
									className=' form-control border rounded-3'
									type='text'
									placeholder='Last Name'
									required
									onChange={handleChange}
									onBlur={handleBlur}
								/>
							</div>
						</div>
						<div className='row my-4'>
							<div className='col'>
								<label htmlFor='phone' className='mb-2'>
									Phone
								</label>
								<input
									defaultValue={values.phone}
									name='phone'
									className='form-control border rounded-3'
									type='tel'
									placeholder='Phone Number'
									required
									onChange={handleChange}
									onBlur={handleBlur}
								/>
							</div>
							<div className='col'>
								<label htmlFor='email' className='mb-2'>
									Email Address
								</label>
								<input
									defaultValue={values.email}
									name='email'
									className=' form-control border rounded-3'
									type='email'
									placeholder='Email'
									required
									onChange={handleChange}
									onBlur={handleBlur}
								/>
							</div>
						</div>
						<div className='row my-4'>
							<div className='col-6'>
								<label htmlFor='company' className='mb-2'>
									Company
								</label>
								<input
									defaultValue={values.company}
									name='company'
									className=' form-control border rounded-3'
									type='text'
									placeholder='Company'
									required
									onChange={handleChange}
									onBlur={handleBlur}
								/>
							</div>
							<div className='col-6'>
								<label htmlFor='address' className='mb-2'>
									Company Address
								</label>
								<GooglePlaceAutocomplete
									autocompletionRequest={{
										componentRestrictions: {
											country: ['GB']
										},
										types: ['geocode', 'establishment']
									}}
									apiOptions={{
										language: 'GB',
										region: 'GB'
									}}
									selectProps={{
										defaultInputValue: values.fullAddress,
										onChange: ({ label }) => {
											setFieldValue('fullAddress', label);
											console.log(label, values);
										}
									}}
									apiKey={process.env.REACT_APP_GOOGLE_PLACES_API_KEY}
								/>
							</div>
						</div>
						<div className={btnContainer}>
							<div className='col-4'>
								<Button className='text-light w-100' variant='primary' type='submit' size='lg'>
									Save Changes
								</Button>
							</div>
						</div>
					</form>
				)}
			</Formik>
		</div>
	);
};

Profile.propTypes = {};

export default Profile;
