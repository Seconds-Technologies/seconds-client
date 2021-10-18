import React, { useRef, useState } from 'react';
import { Formik } from 'formik';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/actions/auth';
import camera from '../../img/camera.svg';
import { PATHS } from '../../constants';
import classnames from 'classnames';
import './profile.css';

const Profile = props => {
	const dispatch = useDispatch();
	const { id, email, firstname, lastname, company, apiKey, profileImageData } = useSelector(
		state => state['currentUser'].user
	);
	const { isIntegrated } = useSelector(state => state["shopifyStore"])
	const [src, setSrc] = useState(null);
	const [apiModal, showAPIModal] = useState(false);
	const [successModal, showSuccessModal] = useState(false);
	const handleClose = type => (type === 'api' ? showAPIModal(false) : showSuccessModal(false));
	const handleOpen = type => (type === 'api' ? showAPIModal(true) : showSuccessModal(true));
	const uploadedImage = useRef(null);
	const imageUploader = useRef(null);

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

	const modal1 = (
		<Modal show={apiModal} onHide={() => handleClose('api')} centered size='sm' style={{ marginLeft: 100 }}>
			<Modal.Header closeButton>
				<Modal.Title>Your API Key</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='text-center'>
					<span className='fs-5'>{apiKey}</span>
				</div>
			</Modal.Body>
		</Modal>
	);

	const modal2 = (
		<Modal show={successModal} onHide={() => handleClose('profile')} centered style={{ marginLeft: 100 }}>
			<Modal.Header closeButton />
			<Modal.Body>
				<div className='alert alert-success text-center'>
					<span className='fs-4'>Profile updated!</span>
				</div>
			</Modal.Body>
		</Modal>
	);

	const btnContainer = classnames({
		"row": true,
		"d-flex": true,
		"justify-content-center": true,
		"my-4": !isIntegrated,
		"my-5": isIntegrated
	})

	return (
		<div className='profile bg-light d-flex justify-content-center align-items-center px-5'>
			{modal1}
			{modal2}
			<div className='profile-wrapper bg-white'>
				<Formik
					initialValues={{
						firstname,
						lastname,
						company,
						email,
						profileImage: null,
					}}
					onSubmit={({ profileImage, ...values }) => {
						dispatch(updateProfile({ img: profileImage, id, ...values }))
							.then(message => handleOpen('profile'))
							.catch(err => alert(err));
					}}
				>
					{({ values, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
						<form action='' onSubmit={handleSubmit} className='w-50'>
							<div className='row text-center'>
								<div className='col-12 d-flex flex-column justify-content-center align-items-center py-3'>
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
											display: 'none',
										}}
									/>
									<div
										role="button"
										className='border-1 rounded-circle text-center'
										style={{
											display: 'inline-flex',
											justifyContent: 'center',
											alignItems: 'center',
											height: '100px',
											width: '100px',
											border: '1px dashed black',
										}}
										onClick={() => imageUploader.current.click()}
									>
										{profileImageData ? (
											<img
												src={`data:image/jpeg;base64,${profileImageData}`}
												className={'border-1 rounded-circle'}
												ref={uploadedImage}
												style={{
													width: '100px',
													height: '100px',
												}}
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
																height: '100px',
														  }
														: {
																width: '30px',
																height: '30px',
														  }
												}
											/>
										)}
									</div>
								</div>
							</div>
							<div className='row my-4'>
								<div className='col'>
									<label htmlFor='floatingInput'>First Name</label>
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
									<label htmlFor='floatingInput'>Last Name</label>
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
									<label htmlFor='floatingInput'>Company</label>
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
								<div className='col'>
									<label htmlFor='floatingInput'>Email Address</label>
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
							<div className={btnContainer}>
								{!isIntegrated && <div className='col-12'>
									<span>For developers</span>
								</div>}
								{!isIntegrated && <div className='col-6'>
									<Button
										variant='dark'
										size='lg'
										className='w-100'
										onClick={() => apiKey ? handleOpen('api') : props.history.push(PATHS.API_KEY)}
									>
										Get API Key
									</Button>
								</div>}
								<div className='col-6'>
									<Button className='text-light w-100' variant='primary' type='submit' size='lg'>
										Save Changes
									</Button>
								</div>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</div>
	);
};

Profile.propTypes = {};

export default Profile;
