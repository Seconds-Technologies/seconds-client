import './Signup.css';
import React, { useEffect, useState } from 'react';
import logo from '../../assets/img/seconds-logo-black.svg';
import { Field, Formik } from 'formik';
import { authUser } from '../../store/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import { removeError } from '../../store/actions/errors';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { SignUpSchema } from '../../validation';
import ErrorField from '../../components/ErrorField';
import PasswordField from '../../components/PasswordField';
import LoadingOverlay from 'react-loading-overlay';
import { Mixpanel } from '../../config/mixpanel';
import valuesIcon from '../../assets/img/signup-aside-icon.svg';
import Link from '../../components/Link';
import { PATHS } from '../../constants';

export default function Signup(props) {
	const [isLoading, setLoading] = useState(false);
	const errors = useSelector(state => state['errors']);
	const dispatch = useDispatch();
	const search = props.location.search;

	useEffect(() => {
		dispatch(removeError());
	}, [props.location]);

	return (
		<LoadingOverlay active={isLoading} spinner text='Checking your details...' classNamePrefix='signup_loader_'>
			<div className='row h-100'>
				<div className='col-md-3 d-none d-md-block h-100 p-4 signup-aside'>
					<div className='d-flex flex-column h-100'>
						<div className='position-absolute top-0 start-0 p-4'>
							<img src={logo} alt='' className='img-fluid' width={150} />
						</div>
						<div className='d-flex flex-grow-1 flex-column justify-content-center '>
							<header className='mb-4'>
								<span className='login-aside-header' style={{ lineHeight: 1.1 }}>
									Supercharge your deliveries
								</span>
							</header>
							<List disablePadding sx={{ marginBottom: 5 }}>
								<ListItem disablePadding sx={{ marginBottom: 2 }}>
									<ListItemIcon>
										<img className='img-fluid' src={valuesIcon} alt='' width={20} height={20} />
									</ListItemIcon>
									<ListItemText primary='Tap into any delivery network' />
								</ListItem>
								<ListItem disablePadding sx={{ marginBottom: 2 }}>
									<ListItemIcon>
										<img className='img-fluid' src={valuesIcon} alt='' width={20} height={20} />
									</ListItemIcon>
									<ListItemText primary='Manage your deliveries in one place' />
								</ListItem>
								<ListItem disablePadding sx={{ marginBottom: 2 }}>
									<ListItemIcon>
										<img className='img-fluid' src={valuesIcon} alt='' width={20} height={20} />
									</ListItemIcon>
									<ListItemText primary='Provide customers great experience' />
								</ListItem>
								<ListItem disablePadding sx={{ marginBottom: 2 }}>
									<ListItemIcon>
										<img className='img-fluid' src={valuesIcon} alt='' width={20} height={20} />
									</ListItemIcon>
									<ListItemText primary='Gain insights about deliveries' />
								</ListItem>
							</List>
						</div>
					</div>
				</div>
				<div className='col-sm-12 col-md-9 w-sm mx-auto my-auto py-sm-4 px-md-5 px-sm-3'>
					<div className='d-flex flex-grow-1 justify-content-center flex-column'>
						<div className='py-4'>
							<h2 className='text-center signup-header pb-2'>Sign up for your account!</h2>
						</div>
						{errors.message && (
							<div className='alert alert-danger alert-dismissible' role='alert'>
								<span>{errors.message}</span>
								<button onClick={() => dispatch(removeError())} type='button' className='btn btn-close' />
							</div>
						)}
						<Formik
							enableReinitialize
							initialErrors={{
								firstname: '',
								lastname: '',
								email: '',
								company: '',
								password: '',
								phone: '',
								terms: false
							}}
							validationSchema={SignUpSchema}
							validateOnChange={false}
							validateOnBlur={false}
							initialValues={{
								firstname: new URLSearchParams(search).get('firstname'),
								lastname: new URLSearchParams(search).get('lastname'),
								email: new URLSearchParams(search).get('email'),
								company: new URLSearchParams(search).get('company'),
								phone: new URLSearchParams(search).get('phone'),
								password: '',
								terms: false
							}}
							onSubmit={async (values, actions) => {
								try {
									setLoading(true);
									console.log(values);
									await dispatch(authUser('register', values));
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
								setFieldValue
								/* and other goodies */
							}) => (
								<form id='signup-form' onSubmit={handleSubmit}>
									<div className='row'>
										<div className='col-md-6 col-lg-6 pb-xs-4'>
											<label className='mb-2' htmlFor='signup-firstname'>
												<span className='text-muted signup-form-label text-uppercase'>
													{errors['firstname'] && <span className='text-danger'>*</span>}First Name
												</span>
											</label>
											<input
												defaultValue={values.firstname}
												autoComplete='given-name'
												type='text'
												id='signup-firstname'
												name='firstname'
												className='form-control border-0 signup-aside py-2'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
										<div className='col-md-6 col-lg-6 mt-md-0 mt-sm-2'>
											<label className='mb-2' htmlFor='lastname'>
												<span className='text-muted signup-form-label'>
													{errors['lastname'] && <span className='text-danger'>*</span>}LAST NAME
												</span>
											</label>
											<input
												defaultValue={values.lastname}
												autoComplete='family-name'
												type='text'
												id='signup-lastname'
												name='lastname'
												className='form-control border-0 signup-aside py-2'
												onBlur={handleBlur}
												onChange={handleChange}
											/>
										</div>
									</div>
									<div className='mt-3'>
										<label className='mb-2' htmlFor='email'>
											<span className='text-muted signup-form-label'>
												{errors['email'] && <span className='text-danger'>*</span>}EMAIL ADDRESS
											</span>
										</label>
										<input
											defaultValue={values.email}
											autoComplete='email'
											type='email'
											id='signup-email'
											name='email'
											className='form-control border-0 signup-aside py-2'
											onBlur={handleBlur}
											onChange={handleChange}
										/>
									</div>
									<div className='mt-3'>
										<label className='mb-2' htmlFor='company'>
											<span className='text-muted signup-form-label'>
												{errors['company'] && <span className='text-danger'>*</span>}BUSINESS NAME
											</span>
										</label>
										<input
											defaultValue={values.company}
											autoComplete='organization'
											type='text'
											id='signup-company'
											name='company'
											className='form-control border-0 signup-aside py-2'
											onBlur={handleBlur}
											onChange={handleChange}
										/>
									</div>
									<div className='mt-3'>
										<label className='mb-2' htmlFor='company'>
											<span className='text-muted signup-form-label'>
												{errors['phone'] && <span className='text-danger'>*</span>}PHONE NUMBER
											</span>
										</label>
										<input
											defaultValue={values.phone}
											autoComplete='tel'
											type='tel'
											id='signup-phone'
											name='phone'
											className='form-control border-0 signup-aside py-2'
											onBlur={handleBlur}
											onChange={handleChange}
										/>
									</div>
									<div className='mt-3'>
										<label className='mb-2' htmlFor='password'>
											<span className='text-muted signup-form-label'>
												{errors['password'] && <span className='text-danger'>*</span>}PASSWORD
											</span>
										</label>
										<PasswordField
											id='signup-password'
											name='password'
											onBlur={handleBlur}
											onChange={handleChange}
											classNames='form-control border-0 signup-aside py-2'
											min={8}
											max={50}
										/>
									</div>
									<div className='d-flex justify-content-between mt-3 form-check'>
										<div>
											<Field
												className='form-check-input me-2 rounded-0 py-2'
												type='checkbox'
												id='terms'
												name='terms'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
											<label htmlFor='terms'>
												I agree to the&nbsp;
												<a href={process.env.REACT_APP_TERMS_OF_SERVICE_URL} target='_blank'>
													terms of service
												</a>
											</label>
										</div>
										<ErrorField name='terms' />
									</div>
									<div>
										<button id='signup-button' type='submit' className='btn btn-dark btn-lg w-100 mt-4 rounded-0'>
											Sign Up
										</button>
									</div>
								</form>
							)}
						</Formik>
						<div className='pt-4'>
							<span className='text-primary'>
								Already have an account?&nbsp;<Link id="login-link" to={PATHS.LOGIN}>Login here!</Link>
							</span>
						</div>
					</div>
				</div>
			</div>
		</LoadingOverlay>
	);
}
