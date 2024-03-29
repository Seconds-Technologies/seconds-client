import './square.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import weeblyLogo from '../../assets/img/weebly-vector-logo.svg';
import { Formik } from 'formik';
import { getSquareCredentials, validateSquare } from '../../store/actions/square';
import ClipLoader from 'react-spinners/ClipLoader';
import { PATHS } from '../../constants';

const Square = props => {
	const dispatch = useDispatch();
	const { email, createdAt } = useSelector(state => state['currentUser'].user);
	const [error, setError] = useState(null);
	const { isIntegrated, credentials } = useSelector(state => state['squareStore']);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		console.log('Mounting Square...');
		const query = new URLSearchParams(props.location.search);
		console.log(query);
		if (query.get('code') && query.get('state')) {
			let code = query.get('code');
			let state = query.get('state');
			dispatch(getSquareCredentials({ email, code, state }))
				.then(shop => console.log(shop))
				.catch(err => alert(err));
		}
		return () => console.log('Unmounting Square');
	}, [props.location]);

	return (
		<div className='square-container bg-light pb-2'>
			{!isIntegrated ? (
				<h2 className='shopifyConnect'>Connect your Square Store</h2>
			) : (
				<h2 className='shopifyConnect'>Your Square account is now connected!</h2>
			)}
			<div className='d-flex flex-column align-items-center'>
				<img className='img-fluid d-block' src={weeblyLogo} alt='' width={300} />
				{error && (
					<div className='alert alert-danger alert-dismissible fade show' role='alert'>
						<span className='text-center'>{error}</span>
						<button type='button' className='btn btn-close' data-bs-dismiss='alert' aria-label='Close' />
					</div>
				)}
			</div>
			<div className='d-flex justify-content-center'>
				{!isIntegrated ? (
					<Formik
						initialValues={{
							clientId: '',
							clientSecret: ''
						}}
						onSubmit={values => {
							setLoading(true);
							dispatch(validateSquare({ ...values, email }))
								.then(shop => {
									console.log(shop);
									setLoading(false);
								})
								.catch(err => {
									setLoading(false);
									setError(err.message);
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
							isSubmitting
							/* and other goodies */
						}) => (
							<form className='w-50' method='POST' action={`${String(process.env.REACT_APP_SERVER_HOST)}/server/square/authorize`}>
								<div className='mb-3'>
									<input type='hidden' name='email' value={email} />
									<label htmlFor='clientId' className='form-label'>
										Application ID
									</label>
									<input
										type='text'
										className='form-control rounded-3'
										id='clientId'
										name='clientId'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<div id='shopHelp' className='form-text'>
										To access your Application ID and Secret, create an&nbsp;
										<a href='https://developer.squareup.com/apps' target='_blank'>
											application
										</a>
										&nbsp;and follow the steps in the OAuth page of your app's&nbsp;
										<a href='https://developer.squareup.com/apps' target='_blank'>
											Developer Dashboard
										</a>
									</div>
								</div>
								<div className='mb-3'>
									<label htmlFor='apiKey' className='form-label'>
										Application Secret
									</label>
									<input
										autoComplete='new-password'
										type='password'
										className='form-control rounded-3'
										id='apiKey'
										name='clientSecret'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
								<div className='text-center d-flex justify-content-around pt-3'>
									<button type='button' className='btn btn-secondary btn-lg shopifyButton' onClick={props.history.goBack}>
										Go Back
									</button>
									<button
										type='submit'
										className='btn btn-primary btn-lg d-flex justify-content-center align-items-center shopifyButton'
									>
										<span className='me-3'>Connect</span>
										<ClipLoader color='white' loading={isLoading} size={20} />
									</button>
								</div>
							</form>
						)}
					</Formik>
				) : (
					<div className='text-center pt-4'>
						<p className='lead'>Shop Id: {credentials.shopId}</p>
						<p className='lead'>Shop Name: {credentials.shopName}</p>
						<p className='lead'>Domain: {credentials.domain}</p>
						<button className='mt-5 btn btn-lg btn-secondary shopifyButton' onClick={() => props.history.push(PATHS.INTEGRATE)}>
							Go Back
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Square;
