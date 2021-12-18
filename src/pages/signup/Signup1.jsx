import './Signup.css';
import React, { useContext, useEffect, useState } from 'react';
import { removeError } from '../../store/actions/errors';
import backArrow from '../../assets/img/noun-go-back-vector.svg';
import { Formik } from 'formik';
import { Mixpanel } from '../../config/mixpanel';
import { useDispatch, useSelector } from 'react-redux';
import { updateDeliveryStrategies } from '../../store/actions/auth';

const Signup1 = props => {
	const [isLoading, setLoading] = useState(false);
	const errors = useSelector(state => state['errors']);
	const newUser = useSelector(state => state['currentUser'].user);
	const dispatch = useDispatch();

	useEffect(() => {
		console.log(newUser);
	}, []);

	return (
		<div className='d-flex flex-column justify-content-center align-items-center mx-auto my-auto py-5 signupPage w-sm'>
			<div className='top-0 align-self-start' role='button' onClick={() => props.history.goBack()}>
				<img src={backArrow} alt='Go back button' width={40} height={40} />
			</div>
			<div className='d-flex flex-grow-1 justify-content-center flex-column'>
				<div className='py-4'>
					<h2 className='signup-header pb-2'>Select your delivery criteria</h2>
					<span className='text-muted'>The criteria you select will reflect which couriers we choose for your customers</span>
				</div>
				{errors.message && (
					<div className='alert alert-danger alert-dismissible' role='alert'>
						<span>{errors.message}</span>
						<button onClick={() => dispatch(removeError())} type='button' className='btn btn-close' />
					</div>
				)}
				<Formik
					enableReinitialize
					validateOnChange={false}
					validateOnBlur={false}
					initialValues={{
						eta: false,
						price: false,
						rating: false,
					}}
					onSubmit={async (values, actions) => {
						try {
							setLoading(true);
							await dispatch(updateDeliveryStrategies(newUser.email, values))
							props.history.push('/signup/2')
							setLoading(false);
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
							<div className='form-check'>
								<input
									className='form-check-input'
									type='checkbox'
									value=''
									id='eta-strategy'
									name='eta'
									onChange={handleChange}
									onBlur={handleBlur}
									checked={values.eta}
								/>
								<label className='form-check-label' htmlFor='eta-strategy'>
									Fastest Delivery Time
								</label>
							</div>
							<div className='form-check'>
								<input
									className='form-check-input'
									type='checkbox'
									value=''
									id='price-strategy'
									name='price'
									onChange={handleChange}
									onBlur={handleBlur}
									checked={values.price}
								/>
								<label className='form-check-label' htmlFor='price-strategy'>
									Lowest Price
								</label>
							</div>
							<div className='form-check'>
								<input
									className='form-check-input'
									type='checkbox'
									value=''
									id='rating-strategy'
									name='rating'
									onChange={handleChange}
									onBlur={handleBlur}
									checked={values.rating}
								/>
								<label className='form-check-label' htmlFor='rating-strategy'>
									Best Driver Rating
								</label>
							</div>
							<div>
								<button type='submit' className='btn btn-dark btn-lg w-100 mt-4'>
									Continue
								</button>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default Signup1;
