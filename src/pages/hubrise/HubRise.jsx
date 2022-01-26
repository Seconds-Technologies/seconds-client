import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import hubriseLogo from '../../assets/img/hubrise-logo.png';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { connectHubrise } from '../../store/actions/hubrise';
import { addError } from '../../store/actions/errors';
import { PATHS } from '../../constants';

const HubRise = props => {
	const dispatch = useDispatch();
	const { email } = useSelector(state => state['currentUser'].user);
	const error = useSelector(state => state['errors'])
	const { isIntegrated, credentials } = useSelector(state => state['hubRiseStore']);

	useEffect(() => {
		const query = new URLSearchParams(props.location.search);
		console.log(query);
		if (query.get('code')) {
			let code = query.get('code');
			dispatch(connectHubrise({ email, code }))
				.then(account => console.log(account))
				.catch(err => dispatch(addError(err.message)));
		} else if (query.get('error')){
			dispatch(addError(query.get('error').replace(/_/g, ' ')))
		}
	}, [props.location]);

	return (
		<div className='page-container bg-light container-fluid p-4'>
			{!isIntegrated ? (
				<h2 className='shopifyConnect'>Connect your HubRise Account</h2>
			) : (
				<h2 className='shopifyConnect'>Your HubRise account is now connected!</h2>
			)}
			<div className='d-flex flex-column justify-content-between mx-auto text-center py-4'>
				<img className='img-fluid d-block mx-auto w-25 mb-3' src={hubriseLogo} alt='' />
				{!isIntegrated && <span>
					<a href='https://manager.hubrise.com/signup?locale=en-GB' target='_blank'>No account yet</a>
				</span>}
			</div>
			<div className='d-flex justify-content-center pt-2'>
				{error.message && (
					<div className='alert alert-danger alert-dismissible fade show' role='alert'>
						<span className='text-center'>{error.message}</span>
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
						onSubmit={values => console.log(values)}>
						{({
							  handleChange,
							  handleBlur,
							  /* and other goodies */
						  }) => (
							<form className='w-50' method='POST' action={`${String(process.env.REACT_APP_SERVER_HOST)}/server/hubrise/authorize`}>
								<input type='hidden' name='email' value={email} />
								<div className='mb-3'>
									<label htmlFor='apiKey' className='form-label'>
										Client ID
									</label>
									<input
										autoComplete={'name'}
										type='text'
										className='form-control rounded-3'
										id='client-id'
										name='clientId'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<div id='hubriseHelp' className='form-text'>
										To access your client ID and Secret, create an OAuth client by following the guide&nbsp;
										<a
											href='https://www.hubrise.com/developers/quick-start/#create-the-oauth-client'
											target='_blank'
										>
											here
										</a>
									</div>
								</div>
								<div className='mb-3'>
									<label htmlFor='apiPassword' className='form-label'>
										Client Secret
									</label>
									<input
										autoComplete={'new-password'}
										type='password'
										className='form-control rounded-3'
										id='client-secret'
										name='clientSecret'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
								<div className='text-center d-flex justify-content-around pt-3'>
									<button className='btn btn-secondary btn-lg shopifyButton' onClick={props.history.goBack}>
										Go Back
									</button>
									<button
										type='submit'
										className='btn btn-primary btn-lg d-flex justify-content-center align-items-center shopifyButton'
									>
										<span className='me-3'>Connect</span>
									</button>
								</div>
							</form>
						)}
					</Formik>
				) : (
					<div className='text-center pt-4'>
						<p className='lead'>Client Id: {credentials.clientId}</p>
						<p className='lead'>Account: {credentials.accountName}</p>
						<p className='lead'>Location: {credentials.locationName}</p>
						<button className='mt-5 btn btn-lg btn-secondary shopifyButton' onClick={() => props.history.push(PATHS.INTEGRATE)}>
							Go Back
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

HubRise.propTypes = {};

export default HubRise;
