import './apikey.css';
import React, { useEffect, useRef, useState } from 'react';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Overlay, Tooltip } from 'react-bootstrap';
import copy from '../../assets/img/copy.svg';
import { authorizeAPI, updateProfile } from '../../store/actions/auth';
import secondsLogo from '../../assets/img/logo.svg';
import { Mixpanel } from '../../config/mixpanel';
import { DELIVERY_STRATEGIES } from '../../constants';

const ApiKey = props => {
	const dispatch = useDispatch();
	const { id, apiKey, email, selectionStrategy } = useSelector(state => state['currentUser'].user);
	const [showApi, setApiModal] = useState(false);
	const [showStrategy, setStrategyModal] = useState(false)
	const [apiTooltip, showApiTooltip] = useState(false);
	const [key, setKey] = useState('');
	const apiKeyRef = useRef(null);

	useEffect(() => {
		Mixpanel.people.increment('page_views');
	}, []);

	const apiModal = (
		<Modal show={showApi} onHide={() => setApiModal(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Generated API Key</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='row d-flex align-items-end'>
					<div className='col-9 d-flex flex-column'>
						<label htmlFor=''>API key</label>
						<input readOnly className='form-control rounded-3 w-100' type='text' value={key} />
					</div>
					<div className='col-3 d-flex flex-column'>
						<Button
							className='rounded-3'
							variant='light'
							ref={apiKeyRef}
							onClick={() => {
								navigator.clipboard.writeText(key).then(r => {
									showApiTooltip(true);
								});
							}}
						>
							<img src={copy} alt='' width={30} height={30} />
							&nbsp;Copy
						</Button>
						<Overlay target={apiKeyRef.current} show={apiTooltip} placement='right'>
							{<Tooltip id='overlay-example'>Api key copied!</Tooltip>}
						</Overlay>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={() => setApiModal(false)}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	)

	const strategyModal = (
		<Modal show={showStrategy} onHide={() => setStrategyModal(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Generated API Key</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='row d-flex align-items-end'>
					<div className='col-9 d-flex flex-column'>
						<label htmlFor=''>New Selection strategy</label>
						<span>{selectionStrategy}</span>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={() => setStrategyModal(false)}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	)

	return (
		<div className='api-key-container bg-light p-4'>
			{apiModal}
			{strategyModal}
			{!apiKey ? (
				<div className='container d-flex flex-column align-items-center justify-content-center h-100'>
					<div>
						<h2>Connect to Seconds API</h2>
					</div>
					<img className='img-fluid seconds-logo my-4' src={secondsLogo} alt='' />
					<div>
						<Formik
							enableReinitialize
							initialValues={{
								strategy: 'eta',
							}}
							onSubmit={(values, actions) =>
								dispatch(authorizeAPI(email))
									.then(key => {
										setKey(key);
										console.log('KEY:', key);
										setApiModal(true);
									})
									.catch(err => console.log(err))
							}
						>
							{({ handleChange, handleBlur, handleSubmit }) => (
								<form className='d-flex flex-grow-1 flex-column justify-content-center align-items-center' onSubmit={handleSubmit}>
									<label htmlFor='strategy'>
										<h4>Delivery strategy</h4>
									</label>
									<select
										required
										placeholder='Optional'
										className='form-select form-select-lg w-50 my-3'
										name='strategy'
										id='strategy'
										onChange={handleChange}
										onBlur={handleBlur}
									>
										<option value='eta'>Fastest Delivery Time</option>
										<option value='price'>Lowest Price</option>
										<option value='rating'>Best Driver Rating</option>
									</select>
									<div id='strategy-help' className='form-text fs-6 mb-4'>
										Your delivery strategy reflects which fleet providers we choose for your customers
									</div>
									<div>
										<button type='submit' className='me-5 btn btn-primary btn-lg api-key-button'>
											Generate API Key
										</button>
										<button
											type='button'
											className='text-center btn btn-secondary btn-lg shopifyButton'
											onClick={props.history.goBack}
										>
											Go Back
										</button>
									</div>
								</form>
							)}
						</Formik>
					</div>
				</div>
			) : (
				<div className='container'>
					<div className='pb-3'>
						<h1>Your API Key</h1>
						<small>
							You can use this API key to authenticate your own service with Seconds and create your own workflow or use the dashboard.
						</small>
						<br />
						<small>
							When you generate a new API key, you will be able to see the key in this box and use it as many times as you need.
						</small>
						<input className='form-control form-control-lg my-4 rounded-0' type='text' value={apiKey} readOnly />
					</div>
					<div className='pb-5'>
						<h1>Delivery Strategy</h1>
						<Formik
							enableReinitialize
							initialValues={{
								strategy: selectionStrategy,
							}}
							onSubmit={(values, actions) =>
								dispatch(updateProfile({img: null, id, selectionStrategy: values.strategy}))
									.then(res => setStrategyModal(true))
									.catch(err => console.log(err))
							}
						>
							{({ handleChange, handleBlur, handleSubmit }) => (
								<form className='d-flex flex-grow-1 flex-column justify-content-center' onSubmit={handleSubmit}>
									<small>
										Your delivery strategy reflects which fleet providers we choose for your customers
									</small>
									<input className='form-control form-control-lg rounded-0 my-3' type='text' value={DELIVERY_STRATEGIES[selectionStrategy]} readOnly />
									</form>
							)}
						</Formik>
					</div>
					<div className='d-flex justify-content-center align-items-center'>
						<button className='mt-2 text-center btn btn-secondary btn-lg shopifyButton' onClick={props.history.goBack}>
							Go Back
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

ApiKey.propTypes = {};

export default ApiKey;
