import React, { useEffect, useState } from 'react';
import logo from '../../img/seconds-logo-black.svg';
import { removeError } from '../../store/actions/errors';
import { Formik } from 'formik';
import { resetPassword } from '../../store/actions/auth';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link } from 'react-router-dom';
import PasswordField from '../../components/PasswordField';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { PATHS } from '../../constants';
import { ResetPasswordSchema } from '../../validation';
import './resetPassword.css';

const ResetPassword = props => {
	const dispatch = useDispatch();
	const errors = useSelector(state => state['errors']);
	const [isLoading, setLoading] = useState(false);
	const [showSuccess, setSuccess] = useState(false);
	const [token, setToken] = useState("")

	const successModal = (
		<Modal show={showSuccess} onHide={() => setSuccess(false)} centered>
			<Modal.Header closeButton >
				<Modal.Title>Success!</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='alert alert-success text-center'>
					<span className='fs-4'>You can now log in with your new password</span>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Link to={PATHS.LOGIN} className="btn btn-primary">Login Here</Link>
			</Modal.Footer>
		</Modal>
	);

	useEffect(() => {
		console.log(props.location)
		const search = props.location.search
		const token = new URLSearchParams(search).get('token')
		setToken(token)
	}, [props.location]);

	return (
		<div className='resetPasswordPage container-fluid bg-white'>
			<div className='row h-100'>
				<div className='col-md-3 d-none d-md-block h-100 p-4 aside'>
					<div className='d-flex flex-column h-100'>
						<img src={logo} alt='' className='img-fluid' width={150} />
						<div className='mb-5' />
						<div className='d-flex flex-grow-1 flex-column mt-5'>
							<h1 className='login-aside-header'>SUPERCHARGE YOUR DELIVERIES</h1>
							<p className='text-wrap'>
								Seconds helps you to secure driver capacity, expand network coverage, and optimise your
								delivery costs.
							</p>
						</div>
					</div>
				</div>
				<div className='col-md-9 col-sm-12 w-sm mx-auto my-auto py-sm-5 px-md-4 px-sm-3'>
					{successModal}
					<div className='d-flex flex-grow-1 flex-column justify-content-center'>
						<h2 className='login-header pb-2'>Reset your password</h2>
						<span className='text-muted'>Enter your new password below</span>
						{errors.message && (
							<div className='alert alert-danger alert-dismissible' role='alert'>
								<span>{errors.message}</span>
								<button
									onClick={() => dispatch(removeError())}
									type='button'
									className='btn btn-close'
								/>
							</div>
						)}
						<Formik
							initialValues={{
								password: '',
								confirmPassword: ''
							}}
							validationSchema={ResetPasswordSchema}
							validateOnBlur={false}
							validateOnChange={false}
							onSubmit={(values, actions) => {
								setLoading(true);
								dispatch(resetPassword(values, token))
									.then(res => {
										setLoading(false);
										setSuccess(true)
										console.log(res);
									})
									.catch(err => {
										setLoading(false);
										console.log(err);
									});
							}}
						>
							{({
								  values,
								  errors,
								  touched,
								  handleChange,
								  handleBlur,
								  handleSubmit,
								  isSubmitting,
								  /* and other goodies */
							  }) => (
								<form onSubmit={handleSubmit}>
									<div className='loginItem1'>
										<label className='mb-2' htmlFor='email'>
											Password
										</label>
										<PasswordField
											name='password'
											classNames='form-control form-control-lg'
											onChange={handleChange}
											onBlur={handleBlur}
											min={8}
											max={50}
										/>
									</div>
									<div className='loginItem1'>
										<label className='mb-2' htmlFor='e  mail'>
											Confirm Password
										</label>
										<PasswordField
										    name='confirmPassword'
											classNames='form-control form-control-lg'
											onChange={handleChange}
											onBlur={handleBlur}
											min={8}
											max={50}
										/>
									</div>
									<div className='mt-4'>
										<button
											type='submit'
											className='btn btn-dark btn-lg d-flex justify-content-center align-items-center w-100'
										>
											<span className='me-3'>Continue</span>
											<ClipLoader color='white' loading={isLoading} size={20} />
										</button>
									</div>
								</form>
							)}
						</Formik>
						<div className='pt-4'>
							<span className='text-primary'>
								<Link to='/login' className='text-decoration-none'>
									Back to Login
								</Link>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
