import './Signup.css';
import logo from '../../assets/img/seconds-logo-black.svg';
import { Formik, Field } from 'formik';
import { Link } from 'react-router-dom';
import { authUser, validateRegistration } from '../../store/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import { addError, removeError } from '../../store/actions/errors';
import React, { useCallback, useEffect, useState } from 'react';
import { geocodeByAddress } from 'react-google-places-autocomplete';
import { SignUpSchema } from '../../validation';
import ErrorField from '../../components/ErrorField';
import PasswordField from '../../components/PasswordField';
import LoadingOverlay from 'react-loading-overlay';
import { Mixpanel } from '../../config/mixpanel';
import { parseAddress } from '../../helpers';

export default function Signup(props) {
	const [isLoading, setLoading] = useState(false);
	const errors = useSelector(state => state['errors']);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(removeError());
	}, [props.location]);

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
		<LoadingOverlay active={isLoading} spinner text='Checking your details...' classNamePrefix="signup_loader_">
			<div className='row h-100'>
				<div className='col-md-3 d-none d-md-block h-100 p-4 signup-aside'>
					<div className='d-flex flex-column h-100'>
						<img src={logo} alt='' className='img-fluid' width={150} />
						<div className='d-flex flex-grow-1 flex-column mt-4'>
							<div className='mt-4'>
								<h1 className='signup-aside-header'>Strong coverage across the UK</h1>
								<p className='text-wrap signup-aside-text'>
									With over 7 fleet providers, your business can provide the best delivery experiences
									to your customers.
								</p>
							</div>
							<div className='mt-4'>
								<h1 className='signup-aside-header'>Low commission</h1>
								<p className='text-wrap signup-aside-text'>
									All deliveries through the Seconds API and dashboard are all with low commission
									fees.
								</p>
							</div>
							<div className='mt-4'>
								<h1 className='signup-aside-header'>24/7 reliable customer support</h1>
								<p className='text-wrap signup-aside-text'>
									Our team of specialists are always available to help via email, zoom, or call.
								</p>
							</div>
							<div className='mt-4'>
								<p className='text-wrap signup-aside-text'>
									Thank you for choosing us. We look forward to being a reliable partner to your
									business.
								</p>
							</div>
							<div className='mt-4'>
								<span className='signup-aside-text'>Ola and Chisom</span>
								<br />
								<span className='signup-aside-text'>Founders, Seconds</span>
							</div>
						</div>
					</div>
				</div>
				<div className='col-sm-12 col-md-9 w-sm mx-auto my-auto py-sm-4 px-md-5 px-sm-3'>
					<div className='d-flex flex-grow-1 justify-content-center flex-column'>
						<div className='py-4'>
							<h2 className='signup-header pb-2'>Sign up for your account</h2>
							<span className='text-muted'>Lets get you all set up so you can get started</span>
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
							initialErrors={{
								firstname: '',
								lastname: '',
								email: '',
								company: '',
								password: '',
								phone: '',
								address: {
									addressLine1: '',
									city: '',
									postcode: '',
								},
								terms: false,
							}}
							enableReinitialize
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
								fullAddress: '',
								address: {
									addressLine1: '',
									addressLine2: '',
									city: '',
									postcode: '',
									countryCode: 'GB',
								},
								terms: false,
							}}
							onSubmit={async (values, actions) => {
								try {
									setLoading(true);
									console.log(values)
									values.fullAddress = `${values.address.addressLine1} ${values.address.addressLine2} ${values.address.city} ${values.address.postcode}`
									let inputPostcode = values.address.postcode; // store postcode entered by the user during signup
									let addressComponents = await geocodeByAddress(values.fullAddress);
									values.address = getParsedAddress(addressComponents, true);
									values.address.postcode = inputPostcode
									validateAddress(values.address);
									console.table({address: values.address, fullAddress: values.fullAddress});
									const user = await dispatch(authUser('register', values));
									Mixpanel.identify(user.id);
									Mixpanel.track('Successful Registration');
									Mixpanel.people.set({
										$first_name: user.firstname,
										$last_name: user.lastname,
										$email: user.email,
										$company: user.company,
										$address: user.fullAddress,
										$apiKey: false,
										$subscribed: false,
									});
									setLoading(false);
									props.history.push('/signup/1');
								} catch (err) {
									Mixpanel.track('Unsuccessful registration');
									setLoading(false);
									console.log(err);
								}
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
											<label className='mb-2' htmlFor='firstname'>
												<span>
													{errors['firstname'] && <span className='text-danger'>*</span>}First
													Name
												</span>
											</label>
											<input
												autoComplete='given-name'
												type='text'
												id='firstname'
												name='firstname'
												className='form-control rounded-3'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
										<div className='col-md-6 col-lg-6 mt-md-0 mt-sm-2'>
											<label className='mb-2' htmlFor='lastname'>
												<span>
													{errors['lastname'] && <span className='text-danger'>*</span>}Last
													Name
												</span>
											</label>
											<input
												autoComplete='family-name'
												type='text'
												id='lastname'
												name='lastname'
												className='form-control rounded-3'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className='row mt-3'>
										<div className='col-md-6 col-lg-6 pb-xs-4'>
											<label className='mb-2' htmlFor='company'>
												<span>
													{errors['company'] && <span className='text-danger'>*</span>}Company
												</span>
											</label>
											<input
												autoComplete='organization'
												type='text'
												id='company'
												name='company'
												className='form-control rounded-3'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
										<div className='col-md-6 col-lg-6 pb-xs-4 mt-md-0 mt-sm-2'>
											<label className='mb-2' htmlFor='company'>
												<span>
													{errors['phone'] && <span className='text-danger'>*</span>}Phone
												</span>
											</label>
											<input
												autoComplete='tel'
												type='tel'
												id='phone'
												name='phone'
												className='form-control rounded-3'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className='row mt-3'>
										<div className='col-md-6 col-lg-6 pb-xs-4'>
											<label className='mb-2' htmlFor='company-address'>
												<span>
													{errors['address'] && errors['address']['addressLine1'] && <span className='text-danger'>*</span>}
													Address line 1
												</span>
											</label>
											<input
												autoComplete='address-line1'
												type='text'
												id='address-line-1'
												name='address.addressLine1'
												className='form-control rounded-3'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
										<div className='col-md-6 col-lg-6 pb-xs-4'>
											<label className='mb-2' htmlFor='company-address'>
												<span>
													{errors['address'] && errors['address']['addressLine2'] && <span className='text-danger'>*</span>}
													Address line 2
												</span>
											</label>
											<input
												autoComplete='address-line2'
												type='text'
												id='address-line-2'
												name='address.addressLine2'
												className='form-control rounded-3'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className='row mt-3'>
										<div className='col-md-6 col-lg-6 pb-xs-4'>
											<label className='mb-2' htmlFor='city'>
												<span>
													{errors['address'] && errors['address']['city'] && <span className='text-danger'>*</span>}
													City
												</span>
											</label>
											<input
												autoComplete='address-level2'
												type='text'
												id='city'
												name='address.city'
												className='form-control rounded-3'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
										<div className='col-md-6 col-lg-6 pb-xs-4'>
											<label className='mb-2' htmlFor='company-address'>
												<span>
													{errors['address'] && errors['address']['postcode'] && <span className='text-danger'>*</span>}
													Postcode
												</span>
											</label>
											<input
												autoComplete='postal-code'
												type='text'
												id='postcode'
												name='address.postcode'
												className='form-control rounded-3'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className='mt-3'>
										<label className='mb-2' htmlFor='email'>
											<span>
												{errors['email'] && <span className='text-danger'>*</span>}Email Address
											</span>
										</label>
										<input
											autoComplete='email'
											type='email'
											id='email'
											name='email'
											className='form-control rounded-3'
											onBlur={handleBlur}
											onChange={handleChange}
										/>
									</div>
									<div className='mt-3'>
										<label className='mb-2' htmlFor='password'>
											<span>
												{errors['password'] && <span className='text-danger'>*</span>}Password
											</span>
										</label>
										<PasswordField
											name='password'
											onBlur={handleBlur}
											onChange={handleChange}
											classNames='form-control rounded-3'
											min={8}
											max={50}
										/>
									</div>
									<div className='d-flex justify-content-between mt-3 form-check'>
										<div>
											<Field
												className='form-check-input me-2'
												type='checkbox'
												id='terms'
												name='terms'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
											<label htmlFor='terms'>
												I agree to the&nbsp;
												<a
													href={process.env.REACT_APP_TERMS_OF_SERVICE_URL}
													target='_blank'
												>
													terms of service
												</a>
											</label>
										</div>
										<ErrorField name='terms' />
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
							<span className='text-primary'>
								Already have an account?&nbsp;<Link to='/login'>Login here!</Link>
							</span>
						</div>
					</div>
				</div>
			</div>
		</LoadingOverlay>
	);
}
