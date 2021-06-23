import "./Signup.css";
import logo from "../../img/secondslogin.svg";
import { Formik } from "formik";
import { Link, useHistory, useLocation } from "react-router-dom";
import { authUser } from "../../store/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { removeError } from "../../store/actions/errors";
import React, { useEffect } from "react";

export default function Signup() {
	const errors = useSelector(state => state["errors"]);
	const history = useHistory();
	const location = useLocation();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(removeError());
	}, [location]);

	return (
		<div className='signupPage'>
			<div className='pt-5'>
				<img className='signupLogo' src={logo} alt='' />
			</div>
			<div className='signupContainer mt-5 py-5 px-4'>
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
							profileImageURL: "",
						}}
						onSubmit={(values, actions) => {
							console.log(values);
							// const formData = this.mapStateToFormData();
							dispatch(authUser("register", values))
								.then(() => history.push("/home"))
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
									<div className='col'>
										<input
											type='text'
											name='firstname'
											placeholder='First Name'
											className='form-control'
											onBlur={handleBlur}
											onChange={handleChange}
										/>
									</div>
									<div className='col'>
										<input
											type='text'
											name='lastname'
											placeholder='Last Name'
											className='form-control'
											onBlur={handleBlur}
											onChange={handleChange}
										/>
									</div>
								</div>
								<div className='signupItem1'>
									<input
										type='text'
										name='company'
										placeholder='Company Name'
										className='form-control'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
								<div className='signupItem1'>
									<input
										type='email'
										name='email'
										placeholder='Business Email'
										className='form-control'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
								<div className='signupItem1'>
									<input
										type='password'
										name='password'
										placeholder='Password'
										className='form-control'
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
					<div className='text-center mt-4'>
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
