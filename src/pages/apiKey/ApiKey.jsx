import React, { useEffect, useRef, useState } from 'react';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Overlay, Tooltip } from 'react-bootstrap';
import copy from '../../img/copy.svg';
import { authorizeAPI } from '../../store/actions/auth';
import './apikey.css';

const ApiKey = props => {
	const dispatch = useDispatch();
	const { user } = useSelector(state => state['currentUser']);
	const [modal, setShow] = useState(false);
	const [apiTooltip, showApiTooltip] = useState(false);
	const [key, setKey] = useState('');
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const apiKeyRef = useRef(null);
	let timeout;

	useEffect(() => {
		return () => clearTimeout(timeout);
	}, []);

	return (
		<div className='api-key-container p-4'>
			<Modal show={modal} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Generated API Key</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className='row d-flex align-items-end'>
						<div className='col-9 d-flex flex-column'>
							<label htmlFor=''>API key</label>
							<input readOnly className='form-control w-100' type='text' value={key} />
						</div>
						<div className='col-3 d-flex flex-column'>
							<Button
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
					{/*<div className='row d-flex align-items-end'>
						<div className='col-9 d-flex flex-column'>
							<label htmlFor=''>Secret key</label>
							<input className="form-control" type='text' value={keys.secretKey} />
						</div>
						<div className='col-3 d-flex flex-column'>
							<Button variant="light" ref={secretRef} onClick={() => {
								navigator.clipboard.writeText(keys.secretKey).then(r => {
									showSecretTooltip(true)
									setTimeout(() => showSecretTooltip(false), 2000)
								})
							}}>
								<img src={copy} alt='' width={30} height={30} />
								&nbsp;Copy
							</Button>
							<Overlay target={secretRef.current} show={secretTooltip} placement="right">
								{(
									<Tooltip id="overlay-example">
										Secret key copied!
									</Tooltip>
								)}
							</Overlay>
						</div>
					</div>*/}
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
			{!user.apiKey ? (
				<div className='container'>
					<div className='pb-5'>
						<h1>New Api Key</h1>
					</div>
					<div className='d-flex flex-grow-1 flex-column justify-content-center'>
						<Formik
							initialValues={{
								strategy: 'eta',
							}}
							onSubmit={(values, actions) =>
								dispatch(authorizeAPI(user, values.strategy))
									.then(key => {
										setKey(key);
										console.log('KEY:', key);
										handleShow();
									})
									.catch(err => console.log(err))
							}
						>
							{({ values, errors, handleChange, handleBlur, handleSubmit }) => (
								<form className='' onSubmit={handleSubmit}>
									<label htmlFor='strategy'>
										<h2>Delivery strategy</h2>
									</label>
									<select
										required
										placeholder='Optional'
										className='form-select form-select-lg w-50 my-4'
										name='strategy'
										id='strategy'
										onChange={handleChange}
										onBlur={handleBlur}
									>
										<option value='eta'>Shortest ETA</option>
										<option value='price'>Lowest Price</option>
										<option value='rating'>Best Rating</option>
									</select>
									<button type='submit' className='me-5 api-key-button'>
										Generate API Key
									</button>
									<button className='mt-2 text-center shopifyButton' onClick={props.history.goBack}>
										Go Back
									</button>
								</form>
							)}
						</Formik>
					</div>
				</div>
			) : (
				<div className='container'>
					<div className='pb-5'>
						<h1>Your API Key</h1>
						<input className='form-control form-control-lg my-4' type='text' value={user.apiKey} readOnly />
					</div>
					<div className='d-flex justify-content-center align-items-center'>
						<button className='mt-2 text-center shopifyButton' onClick={props.history.goBack}>
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
