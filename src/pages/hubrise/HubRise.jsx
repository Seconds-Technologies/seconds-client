import './hubrise.css';
import React, { useCallback, useEffect, useState } from 'react';
import hubriseLogo from '../../assets/img/hubrise-logo.png';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';
import { connectHubrise, disconnectHubrise, pullCatalog, configureHubrise } from '../../store/actions/hubrise';
import { addError, removeError } from '../../store/actions/errors';
import { PATHS } from '../../constants';
import Confirm from './modals/Confirm';
import SuccessToast from '../../modals/SuccessToast';
import HubriseOptions from './modals/HubriseOptions';
import { Mixpanel } from '../../config/mixpanel';

const HubRise = props => {
	const dispatch = useDispatch();
	const { email } = useSelector(state => state['currentUser'].user);
	const error = useSelector(state => state['errors']);
	const { isIntegrated, credentials, authCode, catalog } = useSelector(state => state['hubriseStore']);
	const [confirm, setConfirm] = useState(false);
	const [successMessage, setSuccess] = useState('');
	const [isLoading, setLoading] = useState(false);
	const [optionsModal, setShowOptions] = useState(false);

	useEffect(() => {
		const query = new URLSearchParams(props.location.search);
		if (query.get('code') && authCode !== query.get('code')) {
			let code = query.get('code');
			dispatch(connectHubrise({ email, code }))
				.then(account => console.log(account))
				.catch(err => dispatch(addError(err.message)));
		} else if (query.get('error')) {
			dispatch(addError(query.get('error').replace(/_/g, ' ')));
		}
		Mixpanel.people.increment('page_views');
		dispatch(removeError());
	}, [props.location]);

	const disconnect = useCallback(() => {
		setConfirm(false);
		dispatch(disconnectHubrise(email)).then(message => setSuccess(message));
	}, [isIntegrated]);

	const handleSubmit = useCallback(values => {
		dispatch(configureHubrise(email, values)).then(message => setSuccess(message));
	}, []);

	return (
		<div className='page-container container-fluid p-4 d-flex'>
			<Confirm onConfirm={disconnect} show={confirm} toggleShow={setConfirm} />
			<SuccessToast toggleShow={setSuccess} message={successMessage} />
			<HubriseOptions show={optionsModal} onSubmit={handleSubmit} onHide={() => setShowOptions(false)} centered />
			<div className='m-auto'>
				{!isIntegrated ? (
					<h2 className='text-center'>Connect your HubRise Account</h2>
				) : (
					<h2 className='text-center'>Connected to Hubrise!</h2>
				)}
				<div className='d-flex flex-column justify-content-between mx-auto text-center py-4'>
					<img className='img-fluid d-block mx-auto mb-3' src={hubriseLogo} alt='' width={250} />
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
				{!isIntegrated ? (
					<div className='d-flex justify-content-center'>
						<Formik
							initialValues={{
								email: ''
							}}
							onSubmit={values => console.log(values)}
						>
							{() => (
								<form className='w-50' method='POST' action={`${String(process.env.REACT_APP_SERVER_HOST)}/server/hubrise/authorize`}>
									<input type='hidden' name='email' value={email} />
									<div className='text-center d-flex justify-content-around pt-3'>
										<button type='submit' className='btn btn-primary btn-lg connectButton'>
											<span>Connect</span>
										</button>
									</div>
								</form>
							)}
						</Formik>
					</div>
				) : (
					<div className='d-flex text-center flex-column'>
						<p className='lead'>
							Account:&nbsp;
							<span className='fw-bold text-muted'>{credentials.accountName}</span>
						</p>
						<p className='lead'>
							Location:&nbsp;
							<span className='fw-bold text-muted'>
								{credentials.locationName} - {credentials.locationId}
							</span>
						</p>
						<p className='lead'>
							Catalogs:&nbsp;
							<span className='fw-bold text-muted'>
								{credentials.catalogName} - {credentials.catalogId}
							</span>
						</p>
						<div className='mb-3 d-flex justify-content-evenly'>
							{!credentials.catalog && (
								<button
									className='btn btn-outline-primary d-flex align-items-center'
									onClick={() => {
										setLoading(true);
										dispatch(pullCatalog(email))
											.then(message => {
												setLoading(false);
												console.log(message);
												setSuccess(message);
											})
											.catch(() => setLoading(false));
									}}
								>
									<span className={isLoading ? 'me-2' : ''}>Pull catalog</span>
									<ClipLoader color='grey' loading={isLoading} size={16} />
								</button>
							)}
							<button className='btn btn-outline-info d-flex align-items-center' onClick={() => setShowOptions(true)}>
								<span className={isLoading ? 'me-2' : ''}>Options</span>
							</button>
							{catalog && (
								<button className='btn btn-outline-success' onClick={() => props.history.push(PATHS.HUBRISE_CATALOG)}>
									View catalog
								</button>
							)}
						</div>
						<div className='d-flex justify-content-evenly'>
							<a href='https://manager.hubrise.com/dashboard' target='_blank' className='text-hubrise'>
								Go to Hubrise
							</a>
							<span role='button' className='text-hubrise text-secondary text-decoration-underline' onClick={() => setConfirm(true)}>
								Disconnect
							</span>
						</div>
						<button
							type='button'
							className='mt-4 btn btn-secondary btn-lg connectButton'
							onClick={() => props.history.push(PATHS.SETTINGS)}
						>
							<span>Go Back</span>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

HubRise.propTypes = {};

export default HubRise;
