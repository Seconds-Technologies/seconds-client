import React, { useRef, useState } from 'react';
import { Formik } from 'formik';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/actions/auth';
import './profile.css';
import camera from '../../img/camera.svg';
import axios from 'axios';
import shorthash from 'shorthash';

const Profile = props => {
	const dispatch = useDispatch();
	const { id, email, firstname, lastname, company, apiKey } = useSelector(state => state['currentUser'].user);
	const [preview, setPreview] = useState(null);
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
					<span className='fs-4'>Profile updated successfully!</span>
				</div>
			</Modal.Body>
		</Modal>
	);

	return (
		<div className='profile container d-flex justify-content-center align-items-center px-5'>
			{modal1}
			{modal2}
			<div className='profile-wrapper bg-white border-light'>
				<Formik
					initialValues={{
						firstname,
						lastname,
						company,
						email,
						profileImageURL: null,
					}}
					onSubmit={({ profileImageURL, ...values }) => {
						dispatch(updateProfile({ id, ...values }))
							.then(message => {
								const formData = new FormData();
								console.log(profileImageURL)
								if(profileImageURL) {
									formData.append('profileImageURL', profileImageURL);
									const config = {
										headers: {
											'content-type': 'multipart/form-data',
										},
									};
									axios
										.post('/server/auth/upload', formData, config)
										.then(() => console.log('File has been uploaded successfully!'))
										.catch(err => console.error(err));
								}
								handleOpen('profile')
							})
							.catch(err => alert(err));
					}}
				>
					{({ values, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
						<form action='' onSubmit={handleSubmit} className='w-50'>
							<div className='row text-center'>
								<div className='col-12 d-flex flex-column justify-content-center align-items-center py-3'>
									<input
										name='profileImageURL'
										type='file'
										ref={imageUploader}
										accept='image/*'
										onChange={e => {
											handleImageUpload(e);
											setFieldValue('profileImageURL', e.target.files[0]);
										}}
										style={{
											display: 'none',
										}}
									/>
									<div
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
							<div className='row my-4'>
								<div className='col-12'>
									<span>For developers</span>
								</div>
								<div className='col-6'>
									<style type='text/css'>
										{`
									.btn-submit {
			                            background-color: #9400d3;
									}
									.btn-xl {
										padding: 1rem 1rem
									}
								`}
									</style>
									<Button
										variant='dark'
										size='lg'
										className='w-100'
										onClick={() => handleOpen('api')}
									>
										Get API Key
									</Button>
								</div>
								<div className='col-6 d-flex'>
									<Button className='text-light w-100' variant='submit' type='submit' size='lg'>
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
