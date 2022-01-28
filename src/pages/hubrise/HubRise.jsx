import React, { useEffect } from 'react';
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
	const error = useSelector(state => state['errors']);
	const { isIntegrated, credentials } = useSelector(state => state['hubRiseStore']);

	useEffect(() => {
		const query = new URLSearchParams(props.location.search);
		console.log(query);
		if (query.get('code')) {
			let code = query.get('code');
			dispatch(connectHubrise({ email, code }))
				.then(account => console.log(account))
				.catch(err => dispatch(addError(err.message)));
		} else if (query.get('error')) {
			dispatch(addError(query.get('error').replace(/_/g, ' ')));
		}
	}, [props.location]);

	return (
		<div className='page-container bg-light container-fluid p-4 d-flex h-100'>
			<div className='my-auto mx-auto'>
				{!isIntegrated ? (
					<h2 className="text-center">Connect your HubRise Account</h2>
				) : (
					<h2 className="text-center">Connected to Hubrise!</h2>
				)}
				<div className='d-flex flex-column justify-content-between mx-auto text-center py-4'>
					<img className='img-fluid d-block mx-auto mb-3' src={hubriseLogo} alt='' width={250}/>
					{!isIntegrated && (
						<span>
							<a href='https://manager.hubrise.com/signup?locale=en-GB' target='_blank'>
								No account yet?
							</a>
						</span>
					)}
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
							onSubmit={values => console.log(values)}
						>
							{({
								handleChange,
								handleBlur
								/* and other goodies */
							}) => (
								<form className='w-50' method='POST' action={`${String(process.env.REACT_APP_SERVER_HOST)}/server/hubrise/authorize`}>
									<input type='hidden' name='email' value={email} />
									<div className='text-center d-flex justify-content-around pt-3'>
										<button
											type='submit'
											className='btn btn-outline-primary btn-lg connectButton'
										>
											<span>Connect</span>
										</button>
									</div>
								</form>
							)}
						</Formik>
					) : (
						<div className='text-center pt-4'>
							<p className='lead'>Location: <span className="fw-bold text-muted">{credentials.locationName} - {credentials.locationId}</span></p>
							<p className='lead'>Catalog: <span className="fw-bold text-muted">{credentials.catalogName} - {credentials.catalogId}</span></p>
							<p className='lead'>Customer List: <span className="fw-bold text-muted">{credentials.customerListName} - {credentials.customerListId}</span></p>
							<button className='mt-5 btn btn-lg btn-secondary connectButton' onClick={() => props.history.push(PATHS.INTEGRATE)}>
								Go Back
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

HubRise.propTypes = {};

export default HubRise;
