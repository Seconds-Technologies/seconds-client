import './Login.css';
import logo from '../../img/seconds-logo-black.svg';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { authUser } from '../../store/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { removeError } from '../../store/actions/errors';
import LoadingOverlay from 'react-loading-overlay';

const Login = props => {
	const errors = useSelector(state => state['errors']);
	const dispatch = useDispatch();
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		dispatch(removeError());
	}, [props.location]);

	return (
		<LoadingOverlay active={isLoading} spinner text='Hold tight, logging you in...'>
			<div className='row h-100'>
				<div className='col-md-3 d-none d-md-block h-100 p-4 login-aside'>
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
					<div className='d-flex flex-grow-1 flex-column justify-content-center'>
						<h2 className='login-header pb-2'>Login to your account</h2>
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
								password: '',
							}}
							onSubmit={(values, actions) => {
								setLoading(true);
								dispatch(authUser('login', values))
									.then(() => {
										setLoading(false);
										props.history.push('/');
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
									<div className='loginItem1'>
										<label className='mb-2' htmlFor='password'>
											Password
										</label>
										<input
											autoComplete='current-password'
											type='password'
											name='password'
											className='form-control form-control-lg'
											onChange={handleChange}
											onBlur={handleBlur}
										/>
									</div>
									<div className='mt-5'>
										<button type='submit' className='btn btn-dark btn-lg w-100'>
											Sign In
										</button>
									</div>
								</form>
							)}
						</Formik>
						<div className='pt-4'>
							<span className='text-primary'>
								<Link to='/signup' className='text-decoration-none'>
									Create Account
								</Link>
							</span>
						</div>
					</div>
				</div>
			</div>
		</LoadingOverlay>
	);
};

export default Login;
