import './forgotPassword.css';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import logo from '../../assets/img/seconds-logo-black.svg';
import { removeError } from '../../store/actions/errors';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from '../../store/actions/auth';
import ClipLoader from 'react-spinners/ClipLoader';
import Modal from 'react-bootstrap/Modal';

const ForgotPassword = props => {
	const dispatch = useDispatch();
	const errors = useSelector(state => state['errors']);
	const [isLoading, setLoading] = useState(false);
	const [showSuccess, setSuccess] = useState(false);

	useEffect(() => {
		dispatch(removeError());
	}, [props.location]);

	const successModal = (
		<Modal show={showSuccess} onHide={() => setSuccess(false)} centered>
			<Modal.Header closeButton />
			<Modal.Body>
				<div className='alert alert-success text-center'>
					<span className='fs-4'>Password reset link has been sent to your email</span>
				</div>
			</Modal.Body>
		</Modal>
	);

	return (
		<div className='forgotPasswordPage container-fluid bg-white'>
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
						<h2 className='login-header pb-2'>Forgot your password?</h2>
						<span className='text-muted'>Don't worry! We will help you recover your password</span>
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
								email: '',
							}}
							onSubmit={(values, actions) => {
								setLoading(true);
								dispatch(sendPasswordResetEmail(values.email))
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
											Email
										</label>
										<input
											autoComplete='email'
											type='email'
											name='email'
											className='form-control form-control-lg'
											onChange={handleChange}
											onBlur={handleBlur}
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

ForgotPassword.propTypes = {};

export default ForgotPassword;
