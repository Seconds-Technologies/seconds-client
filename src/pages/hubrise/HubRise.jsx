import './hubrise.css';
import React, { useCallback, useEffect, useState } from 'react';
import hubriseLogo from '../../assets/img/hubrise-logo.png';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { connectHubrise, disconnectHubrise } from '../../store/actions/hubrise';
import { addError } from '../../store/actions/errors';
import { PATHS } from '../../constants';
import Confirm from './modals/Confirm';

const HubRise = props => {
	const dispatch = useDispatch();
	const { email } = useSelector(state => state['currentUser'].user);
	const error = useSelector(state => state['errors']);
	const { isIntegrated, credentials } = useSelector(state => state['hubRiseStore']);
	const [show, setShow] = useState(false);

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

	const disconnect = useCallback(() => {
		setShow(false)
		dispatch(disconnectHubrise(email)).then(message => console.log(message));
	}, [isIntegrated]);

	return (
		<div className='page-container bg-light container-fluid p-4 d-flex h-100'>
			<Confirm onConfirm={disconnect} show={show} toggleShow={setShow} />
			<div className='my-auto mx-auto'>
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
							Location:{' '}
							<span className='fw-bold text-muted'>
								{credentials.locationName} - {credentials.locationId}
							</span>
						</p>
						<p className='lead'>
							Catalog:{' '}
							<span className='fw-bold text-muted'>
								{credentials.catalogName} - {credentials.catalogId}
							</span>
						</p>
						<p className='lead'>
							Customer List:{' '}
							<span className='fw-bold text-muted'>
								{credentials.customerListName} - {credentials.customerListId}
							</span>
						</p>
						<div className='mb-3'>
							<button className='btn btn-outline-success'>View catalog</button>
						</div>
						<div className='d-flex justify-content-evenly'>
							<a href='https://manager.hubrise.com/dashboard' target='_blank' className='text-hubrise'>
								Go to Hubrise
							</a>
							<span role='button' className='text-hubrise text-secondary text-decoration-underline' onClick={() => setShow(true)}>
								Disconnect
							</span>
						</div>
						<button type='button' className='mt-4 btn btn-secondary btn-lg connectButton' onClick={props.history.goBack}>
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
