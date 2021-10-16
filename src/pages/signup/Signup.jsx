import './Signup.css';
import logo from '../../img/seconds-logo-black.svg';
import eye from '../../img/eye.svg';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import { authUser } from '../../store/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import { removeError } from '../../store/actions/errors';
import React, { useEffect } from 'react';
import GooglePlaceAutocomplete from 'react-google-places-autocomplete';
import { SignUpSchema } from '../../validation';
import ErrorField from '../../components/ErrorField';

export default function Signup(props) {
	const errors = useSelector(state => state['errors']);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(removeError());
	}, [props.location]);

	return (
		<div className='signupPage bg-white container-fluid'>
			<div className='row h-100'>
				<div className='col-sm-3 d-none d-md-block h-100 p-4 signup-aside'>
					<div className='d-flex flex-column h-100'>
						<img src={logo} alt='' className='img-fluid' width={200} />
						<div className='d-flex flex-grow-1   flex-column justify-content-center'>
							<div className='mt-4'>
								<h1 className="signup-aside-header">Strong coverage across the UK</h1>
								<p className='text-wrap signup-aside-text'>
									With over 7 fleet providers, your business can provide the best delivery experiences
									to your customers.
								</p>
							</div>
							<div className='mt-4'>
								<h1 className="signup-aside-header">Zero percent commission</h1>
								<p className='text-wrap signup-aside-text'>
									All deliveries through the Seconds API and dashboard are all without commission
									fees.
								</p>
							</div>
							<div className='mt-4'>
								<h1 className="signup-aside-header">24/7 reliable customer support</h1>
								<p className='text-wrap signup-aside-text'>
									Our team of specialists are always available to help via email, zoom, or call.
								</p>
							</div>
							<div className='mt-4'>
								<p className="text-wrap signup-aside-text">
									Thank you for choosing us. We look forward to being a reliable partner to your
									business.
								</p>
							</div>
							<div className='mt-4'>
								<span className="signup-aside-text">Ola and Chisom</span>
								<br />
								<span className="signup-aside-text">Founders, Seconds</span>
							</div>
						</div>
					</div>
				</div>
				<div className='col-sm-12 col-md-9 w-sm my-auto mx-auto py-sm-5 px-md-5 px-sm-3'>
					<div className='d-flex flex-grow-1 justify-content-center flex-column'>
						<div className='py-4'>
							<h2 className='signup-header pb-2'>Sign up for your account</h2>
							<span>Lets get you all set up so you can get started</span>
						</div>
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
							validationSchema={SignUpSchema}
							validateOnChange={false}
							validateOnBlur={false}
							initialValues={{
								firstname: '',
								lastname: '',
								email: '',
								company: '',
								password: '',
								phone: '',
								address: '',
								profileImage: {
									file: '',
									data: '',
								},
								apiKey: '',
								stripeCustomerId: '',
							}}
							onSubmit={(values, actions) => {
								console.log(values);
								// const formData = this.mapStateToFormData();
								dispatch(authUser('register', values))
									.then(() => props.history.push('/home'))
									.catch(err => console.log(err));
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
								setFieldValue,
								/* and other goodies */
							}) => (
								<form onSubmit={handleSubmit} className='signupForm'>
									<div className='row'>
										<div className='col-md-6 col-lg-6 pb-xs-4'>
											<label className="mb-2" htmlFor='firstname'>First Name</label>
											<input
												autoComplete='given-name'
												type='text'
												id='firstname'
												name='firstname'
												className='form-control rounded-3'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
											<ErrorField name='firstname' classNames="text-end" />
										</div>
										<div className='col-md-6 col-lg-6 mt-md-0 mt-sm-3'>
											<label className="mb-2" htmlFor='lastname'>Last Name</label>
											<input
												autoComplete='family-name'
												type='text'
												id='lastname'
												name='lastname'
												className='form-control rounded-3'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
											<ErrorField name='lastname' classNames="text-end" />
										</div>
									</div>
									<div className='row mt-3'>
										<div className='col-md-6 col-lg-6 pb-xs-4'>
											<label className="mb-2" htmlFor='company'>Company</label>
											<input
												autoComplete='organization'
												type='text'
												id='company'
												name='company'
												className='form-control rounded-3'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
											<ErrorField name='company' classNames="text-end" />
										</div>
										<div className='col-md-6 col-lg-6 pb-xs-4 mt-md-0 mt-sm-3'>
											<label className="mb-2" htmlFor='company'>Phone</label>
											<input
												autoComplete='tel'
												type='tel'
												id='phone'
												name='phone'
												className='form-control rounded-3'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
											<ErrorField name='phone' classNames="text-end" />
										</div>
									</div>
									<div className='mt-3'>
										<label className="mb-2" htmlFor='company-address'>Company address</label>
										<GooglePlaceAutocomplete
											autocompletionRequest={{
												componentRestrictions: {
													country: ['GB'],
												},
												types: ['geocode', 'establishment']
											}}
											apiOptions={{
												language: 'GB',
												region: 'GB',
											}}
											selectProps={{
												onChange: ({ label }) => {
													setFieldValue('address', label);
													console.log(label, values);
												},
											}}
											apiKey={process.env.REACT_APP_GOOGLE_PLACES_API_KEY}
										/>
										<ErrorField name='address' classNames="text-end" />
									</div>
									<div className='mt-3'>
										<label className="mb-2" htmlFor='email'>Email address</label>
										<input
											autoComplete='email'
											type='email'
											id='email'
											name='email'
											className='form-control rounded-3'
											onBlur={handleBlur}
											onChange={handleChange}
										/>
										<ErrorField name='email' />
									</div>
									<div className='mt-3'>
										<label className="mb-2" htmlFor='password'>Password</label>
										<input
											autoComplete='new-password”'
											type='password'
											name='password'
											className='form-control rounded-3'
											onBlur={handleBlur}
											onChange={handleChange}
										/>
										<i>{eye}</i>
										<ErrorField name='password' />
									</div>
									<div>
										<button type='submit' className='btn btn-dark btn-lg w-100 mt-4'>
											Sign Up
										</button>
									</div>
								</form>
							)}
						</Formik>
						<div className='pt-4'>
							<span className='text-primary fw-bold'>
								Already have an account?&nbsp;<Link to='/login'>Login here!</Link>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
