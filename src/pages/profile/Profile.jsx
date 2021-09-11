import React, { useRef, useState } from 'react';
import { Formik } from 'formik';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ReactCrop from 'react-image-crop';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../store/actions/auth';
import 'react-image-crop/dist/ReactCrop.css'
import './profile.css';

const Profile = props => {
	const dispatch = useDispatch();
	const { id, email, firstname, lastname, company, apiKey } = useSelector(state => state['currentUser'].user);
	const [crop, setCrop] = useState({
		unit: "%",
		width: 30,
		aspect: 1
	})
	const [modal, showModal] = useState(false);
	const handleClose = () => showModal(false);
	const handleOpen = () => showModal(true);
	const uploadedImage = useRef();
	const imageUploader = useRef(null);

	const handleImageUpload = e => {
		const [file] = e.target.files;
		if (file) {
			const reader = new FileReader();
			const { current } = uploadedImage;
			current.file = file;
			reader.onload = e => {
				current.src = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='profile container d-flex justify-content-center align-items-center px-5'>
			<Modal show={modal} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title>API Key</Modal.Title>
				</Modal.Header>
				<Modal.Body>{apiKey}</Modal.Body>
			</Modal>
			<div className='profile-wrapper bg-white border-light'>
				<Formik
					initialValues={{
						firstname,
						lastname,
						company,
						email
					}}
					onSubmit={values => {
						dispatch(updateProfile({id, values}))
							.then(({ message }) => alert(message))
							.catch(err => alert(err))
					}}
				>
					{({ values, handleBlur, handleChange, handleSubmit }) => (
						<form action='' onSubmit={handleSubmit} className='w-50'>
							<div className='row text-center'>
								<div className='col-12 d-flex flex-column justify-content-center align-items-center py-3'>
									<input
										type='file'
										ref={imageUploader}
										accept='image/*'
										onChange={handleImageUpload}
										style={{
											display: "none"
										}}
									/>
									<div
										style={{
											height: '100px',
											width: '100px',
											border: '1px dashed black',
										}}
										onClick={() => imageUploader.current.click()}
									>
										<img
											ref={uploadedImage}
											style={{
												width: 100,
												height: 100,
											}}
										/>
									</div>
								</div>
							</div>
							<div className='row my-4'>
								<div className='col'>
									<label htmlFor="floatingInput">First Name</label>
									<input
										defaultValue={values.firstname}
										name="firstname"
										className='form-control border rounded-3'
										type='text'
										placeholder='First Name'
										required
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
								<div className='col'>
									<label htmlFor="floatingInput">Last Name</label>
									<input
										defaultValue={values.lastname}
										name="lastname"
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
									<label htmlFor="floatingInput">Company</label>
									<input
										defaultValue={values.company}
										name="company"
										className=' form-control border rounded-3'
										type='text'
										placeholder='Company'
										required
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
								<div className='col'>
									<label htmlFor="floatingInput">Email Address</label>
									<input
										defaultValue={values.email}
										name="email"
										className=' form-control border rounded-3'
										type='email'
										placeholder='Email'
										required
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
							</div>
							{/*<div className='row my-4'>
								<div className='col'>
									<input
										name="password"
										autoComplete="current-password"
										className=' form-control border rounded-3'
										type='password'
										placeholder='Password'
										required
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
							</div>*/}
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
									<Button variant='dark' size='lg' className='w-100' onClick={handleOpen}>
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
