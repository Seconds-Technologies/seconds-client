import './Signup.css';
import logo from '../../img/secondslogin.svg';
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
		<div className='signupPage container-fluid pt-3 pb-5'>
			<div className='d-flex pt-5'>
				<img className='mx-auto img-fluid' src={logo} alt='' />
			</div>
			<div className='signupContainer w-sm mt-5 mx-auto py-5 px-md-5 px-sm-3'>
				<div className='d-flex flex-grow-1 flex-column justify-content-center'>
					<h4 className='getStarted pb-4'>Get Started</h4>
					{errors.message && (
						<div className='alert alert-danger alert-dismissible' role='alert'>
							<span>{errors.message}</span>
							<button onClick={() => dispatch(removeError())} type='button' className='btn btn-close' />
						</div>
					)}
					<Formik
						validationSchema={SignUpSchema}
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
										<input
											autoComplete='given-name'
											type='text'
											name='firstname'
											placeholder='First Name'
											className='form-control rounded-3'
											onBlur={handleBlur}
											onChange={handleChange}
										/>
										<ErrorField name="firstname" />
									</div>
									<div className='col-md-6 col-lg-6 mt-md-0 mt-sm-3'>
										<input
											autoComplete='family-name'
											type='text'
											name='lastname'
											placeholder='Last Name'
											className='form-control rounded-3'
											onBlur={handleBlur}
											onChange={handleChange}
										/>
										<ErrorField name="lastname" />
									</div>
								</div>
								<div className='row mt-3'>
									<div className='col-md-6 col-lg-6 pb-xs-4'>
										<input
											autoComplete='organization'
											type='text'
											name='company'
											placeholder='Company Name'
											className='form-control rounded-3'
											onBlur={handleBlur}
											onChange={handleChange}
										/>
										<ErrorField name="company" />
									</div>
									<div className='col-md-6 col-lg-6 pb-xs-4 mt-md-0 mt-sm-3'>
										<input
											autoComplete='tel'
											type='tel'
											name='phone'
											placeholder='Phone Number'
											className='form-control rounded-3'
											onBlur={handleBlur}
											onChange={handleChange}
										/>
										<ErrorField name="phone" />
									</div>
								</div>
								<div className='mt-sm-3 mt-md-4'>
									<GooglePlaceAutocomplete
										autocompletionRequest={{
											componentRestrictions: {
												country: ['GB'],
											},
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
											placeholder: "Address"
										}}
										apiKey={process.env.REACT_APP_GOOGLE_PLACES_API_KEY}
									/>
								</div>
								<div className='mt-3'>
									<input
										autoComplete='email'
										type='email'
										name='email'
										placeholder='Business Email'
										className='form-control rounded-3'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
									<ErrorField name="email" />
								</div>
								<div className='mt-3'>
									<input
										autoComplete='new-password”'
										type='password'
										name='password'
										placeholder='Password'
										className='form-control rounded-3'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
									<ErrorField name="password" />
								</div>
								<div>
									<button type='submit' className='signUp w-100'>
										Sign Up
									</button>
								</div>
							</form>
						)}
					</Formik>
					<div className='text-center pt-4'>
						<span className='text-center text-muted text-light'>
							Already have an account?&nbsp;<Link to='/login'>Login here!</Link>
						</span>
					</div>
				</div>
			</div>
			<h6 className='motto'>Automated one hour and same day deliveries for your customers</h6>
		</div>
	);
}
