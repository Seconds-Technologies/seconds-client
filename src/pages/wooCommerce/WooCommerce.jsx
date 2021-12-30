import React, { useEffect, useState } from 'react';
import woocommerceLogo from '../../assets/img/woocommerce-logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import ClipLoader from 'react-spinners/ClipLoader';
import { PATHS } from '../../constants';
import { setWoo } from '../../store/woocommerce';
import { syncUser } from '../../store/actions/auth';

const WooCommerce = props => {
	const { isIntegrated, credentials } = useSelector(state => state['wooCommerceStore']);
	const dispatch = useDispatch();
	const [error, setError] = useState(null);
	const [isLoading, setLoading] = useState(false);
	const { email, company } = useSelector(state => state['currentUser'].user);

	useEffect(() => {
		console.log('Mounting WooCommerce...');
		const query = new URLSearchParams(props.location.search);
		console.log(query);
		if (query.get('success')) {
			let success = Number(query.get('success'))
			if (success) {
				dispatch(syncUser(email)).then((user) => {
					console.log(user.woocommerce)
					dispatch(setWoo(user.woocommerce))
				}).catch((error) => console.error(error))
			} else {
				let error = query.get('error')
				console.log("ERROR", error)
			}
		}
		return () => console.log('Unmounting WooCommerce');
	}, [props.location]);

	return (
		<div className='page-container bg-light pb-2'>
			{!isIntegrated ? (
				<h2 className='shopifyConnect'>Connect your Woocommerce Store</h2>
			) : (
				<h2 className='shopifyConnect'>Your WooCommerce account is now connected!</h2>
			)}
			<div className='d-flex flex-column align-items-center'>
				<img className='img-fluid d-block my-5' src={woocommerceLogo} alt='' width={250} />
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
							store_url: ""
						}}
						onSubmit={values => console.log(values)}
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
							<form className='w-50' method='POST' action={`${String(process.env.REACT_APP_SERVER_HOST)}/server/woocommerce/authorize`}>
								<div className='mb-3'>
									<input type='hidden' name='email' value={email} />
									<label htmlFor='store-url' className='form-label'>
										Store URL
									</label>
									<input
										type='text'
										className='form-control rounded-3'
										id='store-url'
										name='store_url'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<div id='shopHelp' className='form-text'>
										e.g. https://example-store.com
									</div>
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
						<p className='lead'>Shop Name: {company}</p>
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

export default WooCommerce;
