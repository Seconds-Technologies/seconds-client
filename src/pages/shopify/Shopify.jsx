import React, { useState } from 'react';
import { Formik } from 'formik';
import { getAllOrders, getAllProducts, validateShopify } from '../../store/actions/shopify';
import { useDispatch, useSelector } from 'react-redux';
import shopifyLogo from '../../img/shopify.svg';
import './shopify.css';

const Shopify = props => {
	const dispatch = useDispatch();
	const { email, createdAt } = useSelector(state => state['currentUser'].user);
	const [error, setError] = useState(null);
	const { isIntegrated, credentials } = useSelector(state => state['shopifyStore']);
	return (
		<div className='shopifyContainer container pb-3'>
			{!isIntegrated ? (
				<h2 className='shopifyConnect'>Connect your Shopify Account</h2>
			) : (
				<h2 className='shopifyConnect'>Your shopify account is now connected!</h2>
			)}
			<img className='img-fluid shopifyLogo' src={shopifyLogo} alt='' />
			<div className='d-flex justify-content-center pt-2'>
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
							shopName: '',
							apiKey: '',
							password: '',
						}}
						onSubmit={values => {
							dispatch(validateShopify({ ...values, email }))
								.then(shop => {
									console.log(shop);
									dispatch(getAllOrders(shop.accessToken, shop.baseURL, email, createdAt));
									dispatch(getAllProducts(shop.accessToken, shop.baseURL, email));
								})
								.catch(err => setError(err.message));
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
							<form className='w-50' onSubmit={handleSubmit}>
								<div className='mb-3'>
									<label htmlFor='shopName' className='form-label'>
										Shop Name
									</label>
									<input
										type='text'
										className='form-control'
										id='shopName'
										name='shopName'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<div id='shopHelp' className='form-text'>
										Name of you Shopify store
									</div>
								</div>
								<div className='mb-3'>
									<label htmlFor='apiKey' className='form-label'>
										Admin API Key
									</label>
									<input
										autoComplete={'new-password'}
										type='password'
										className='form-control'
										id='apiKey'
										name='apiKey'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<div id='shopHelp' className='form-text'>
										To access your Admin API key and password follow the steps&nbsp;
										<a
											href='https://help.shopify.com/en/manual/apps/private-apps?shpxid=06270be5-51B2-4ED0-06D9-B51CAA006983#enable-private-app-development-from-the-shopify-admin'
											target='_blank'
										>
											here
										</a>
									</div>
								</div>
								<div className='mb-3'>
									<label htmlFor='apiPassword' className='form-label'>
										Admin API Password
									</label>
									<input
										autoComplete={'new-password'}
										type='password'
										className='form-control'
										name='password'
										id='apiPassword'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
								<div className='text-center d-flex justify-content-around pt-3'>
									<button type='submit' className='shopifyButton'>
										Connect
									</button>
									<button className='shopifyButton' onClick={props.history.goBack}>
										Go Back
									</button>
								</div>
							</form>
						)}
					</Formik>
				) : (
					<div className='text-center pt-4'>
						<p className='lead'>Shop Owner: {credentials.shopOwner}</p>
						<p className='lead'>Domain: {credentials.domain}</p>
						<p className='lead'>Country: {credentials.country}</p>
						<button className='mt-5 shopifyButton' onClick={props.history.goBack}>
							Go Back
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Shopify;
