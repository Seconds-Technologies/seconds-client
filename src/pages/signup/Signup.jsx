import "./Signup.css";
import logo from "../../img/secondslogin.svg";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { authUser } from "../../store/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { removeError } from "../../store/actions/errors";
import React, { useEffect } from "react";

export default function Signup(props) {
	const errors = useSelector(state => state["errors"]);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(removeError());
	}, [props.location]);

	return (
		<div className='signupPage container-fluid pt-3 pb-5'>
			<div className='d-flex pt-5'>
				<img className='mx-auto img-fluid' src={logo} alt='' />
			</div>
			<div className='signupContainer w-sm mt-5 mx-auto py-5 px-4'>
				<div className='d-flex flex-grow-1 flex-column justify-content-center'>
					<h4 className='getStarted pb-4'>Get Started</h4>
					{errors.message && (
						<div className='alert alert-danger alert-dismissible' role='alert'>
							<span>{errors.message}</span>
							<button onClick={() => dispatch(removeError())} type='button' className='btn btn-close' />
						</div>
					)}
					<Formik
						initialValues={{
							firstname: "",
							lastname: "",
							email: "",
							company: "",
							password: "",
							profileImage: {
								file: "",
								data: ""
							},
							apiKey: "",
							stripeCustomerId: "",
						}}
						onSubmit={(values, actions) => {
							console.log(values);
							// const formData = this.mapStateToFormData();
							dispatch(authUser("register", values))
								.then(() => props.history.push("/home"))
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
							/* and other goodies */
						}) => (
							<form onSubmit={handleSubmit} className='signupForm'>
								<div className='row'>
									<div className='col-md-6 col-lg-6 pb-xs-4'>
										<input
											autoComplete="given-name"
											type='text'
											name='firstname'
											placeholder='First Name'
											className='form-control rounded-3'
											onBlur={handleBlur}
											onChange={handleChange}
										/>
									</div>
									<div className='col-md-6 col-lg-6'>
										<input
											autoComplete="family-name"
											type='text'
											name='lastname'
											placeholder='Last Name'
											className='form-control rounded-3'
											onBlur={handleBlur}
											onChange={handleChange}
										/>
									</div>
								</div>
								<div className='signupItem1'>
									<input
										autoComplete="organization"
										type='text'
										name='company'
										placeholder='Company Name'
										className='form-control rounded-3'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
								<div className='signupItem1'>
									<input
										autoComplete="email"
										type='email'
										name='email'
										placeholder='Business Email'
										className='form-control rounded-3'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
								<div className='signupItem1'>
									<input
										autoComplete="new-password”"
										type='password'
										name='password'
										placeholder='Password'
										className='form-control rounded-3'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
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
