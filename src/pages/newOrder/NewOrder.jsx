import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createDeliveryJob, getAllQuotes } from '../../store/actions/delivery';
import { addError, removeError } from '../../store/actions/errors';
import CurrencyInput from 'react-currency-input-field';
import GooglePlaceAutocomplete from 'react-google-places-autocomplete';
import moment from 'moment';
import './NewOrder.css';
import '../../App.css';

const NewOrder = props => {
	const [deliveryJob, setJob] = useState({});
	const [jobModal, showJobModal] = useState(false);
	const [quoteModal, showQuoteModal] = useState(false);
	const [quotes, setQuotes] = useState([]);
	const handleClose = () => showJobModal(false);
	const handleOpen = () => showJobModal(true);
	const { firstname, lastname, email, company, apiKey } = useSelector(state => state['currentUser'].user);
	const error = useSelector(state => state['errors']);
	const dispatch = useDispatch();

	const columns = [
		{ field: 'id', headerName: 'Job ID', width: 100 },
		{ field: 'pickupAddress', headerName: 'pickup address', width: 150 },
		{ field: 'dropoffAddress', headerName: 'dropoff Address', width: 150 },
		{ field: 'pickupStartTime', type: 'dateTime', headerName: 'pickup time', width: 150 },
		{ field: 'dropoffStartTime', type: 'dateTime', headerName: 'dropoff time', width: 150 },
		{ field: 'description', headerName: 'Description', width: 150 },
		{ field: 'quoteID', headerName: 'Quote ID', width: 150 },
	];

	const newJobModal = (
		<Modal show={jobModal} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Your delivery Job!</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					{Object.entries(deliveryJob).map(([key, value], index) => (
						<div key={index} className='row p-3'>
							<div className='col text-capitalize'>{key}</div>
							<div className='col'>{value}</div>
						</div>
					))}
				</div>
			</Modal.Body>
		</Modal>
	);

	const quotesModal = (
		<Modal show={quoteModal} onHide={() => showQuoteModal(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Fleet Provider Quotes 🛴</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					{/*<div className='row p-3'>
						<div className='col text-capitalize fw-bold'>Fleet Provider</div>
						<div className='col fw-bold'>Price (£)</div>
						<div className='col fw-bold'>ETA</div>
						<div className='col fw-bold'/>
					</div>
					{quotes.map(({ providerId, price, dropoffEta, createdAt }, index) => (
						<div key={index} className='row p-3'>
							<div className='col text-capitalize'>{providerId}</div>
							<div className='col'>{`£${price}`}</div>
							<div className='col'>{`${moment(dropoffEta).diff(moment(createdAt), "minutes")} minutes`}</div>
							<div className='col'>
								<button className='d-flex justify-content-center align-items-center OrdersListEdit'>
									<span className='text-decoration-none'>Select</span>
								</button>
							</div>
						</div>
					))}*/}
					<table className='table'>
						<thead>
							<tr>
								<th scope='col'>Fleet Provider</th>
								<th scope='col'>Price</th>
								<th scope='col'>ETA</th>
								<th scope='col' />
							</tr>
						</thead>
						<tbody>
							{quotes.map(({ providerId, price, dropoffEta, createdAt }, index) => (
								<tr key={index}>
									<td className='col text-capitalize'>{providerId}</td>
									<td className='col'>{`£${price}`}</td>
									<td className='col'>{`${moment(dropoffEta).diff(
										moment(createdAt),
										'minutes'
									)} minutes`}</td>
									<td className='col'>
										<button className='d-flex justify-content-center align-items-center OrdersListEdit'>
											<span className='text-decoration-none'>Select</span>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Modal.Body>
		</Modal>
	);

	useEffect(() => {
		window.addEventListener('beforeunload', () => removeError())
		return window.removeEventListener('beforeunload', () => console.log("listener removed!"))
	}, [])

	return (
		<div className='newOrder container py-4'>
			{newJobModal}
			{quotesModal}
			<Formik
				enableReinitialize
				initialValues={{
					pickupFirstName: firstname,
					pickupLastName: lastname,
					pickupBusinessName: company,
					pickupAddress: '',
					pickupEmailAddress: email,
					pickupPhoneNumber: '',
					packagePickupStartTime: '',
					pickupInstructions: '',
					dropoffFirstName: '',
					dropoffLastName: '',
					dropoffBusinessName: '',
					dropoffAddress: '',
					dropoffEmailAddress: 'N/A',
					dropoffPhoneNumber: '',
					packageDropoffStartTime: '',
					dropoffInstructions: '',
					packageValue: 0,
					packageDescription: '',
					itemsCount: null,
				}}
				onSubmit={(values, actions) => {
					console.log(values);
					apiKey
						? dispatch(createDeliveryJob(values, apiKey))
								.then(
									({
										createdAt,
										jobId,
										jobSpecification: { packages },
										status,
										selectedConfiguration: { providerId, winnerQuote },
									}) => {
										let {
											description,
											pickupLocation: { address: pickupAddress },
											dropoffLocation: { address: dropoffAddress },
											pickupStartTime,
											dropoffStartTime,
										} = packages[0];
										let newJob = {
											jobId,
											description,
											pickupAddress,
											dropoffAddress,
											pickupStartTime: moment(pickupStartTime).format('DD-MM-YYYY HH:mm:ss'),
											dropoffStartTime: moment(dropoffStartTime).format('DD-MM-YYYY HH:mm:ss'),
											status,
											fleetProvider: providerId,
										};
										setJob(newJob);
										handleOpen();
									}
								)
								.catch(err => {
									console.log(err);
									err
										? addError(err)
										: addError('Api endpoint could not be' + ' accessed!');
								})
						: alert(
								'Your account does not have an API' +
									' key associated with it. Please generate one from the integrations page'
						  );
				}}
			>
				{({ values, handleBlur, handleChange, handleSubmit, errors, setFieldValue }) => (
					<form onSubmit={handleSubmit} autoComplete='on'>
						<div className='row mx-3 align-items-center'>
							<div className='col-6 d-flex flex-column'>
								<h4>Pickup</h4>
								<div className='border border-2 rounded-3 p-4'>
									<div className='row'>
										<div className='col-6'>
											<label htmlFor='pickup-first-name' className='mb-1'>
												First Name
											</label>
											<input
												autoComplete='given-name'
												name='pickupFirstName'
												type='text'
												className='form-control form-border mb-2'
												defaultValue={firstname}
												aria-label='pickup-first-name'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
										<div className='col-6'>
											<label htmlFor='pickup-last-name' className='mb-1'>
												Last Name
											</label>
											<input
												autoComplete='family-name'
												id='pickup-last-name'
												name='pickupLastName'
												type='text'
												className='form-control form-border mb-2'
												defaultValue={lastname}
												aria-label='pickup-last-name'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col-6'>
											<label htmlFor='pickup-email-address' className='mb-1'>
												Email Address
											</label>
											<input
												autoComplete='email'
												id='pickup-email-address'
												name='pickupEmailAddress'
												type='email'
												className='form-control form-border mb-2'
												defaultValue={email}
												aria-label='pickup-email-address'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
										<div className='col-6'>
											<label htmlFor='pickup-phone-number' className='mb-1'>
												Phone Number
											</label>
											<input
												autoComplete='tel'
												id='pickup-phone-number'
												name='pickupPhoneNumber'
												type='tel'
												className='form-control form-border mb-2'
												placeholder='Phone Number'
												aria-label='pickup-phone-number'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
									<label htmlFor='pickup-business-name' className='mb-1'>
										Business Name
									</label>
									<input
										autoComplete='organization'
										id='pickup-business-name'
										name='pickupBusinessName'
										type='text'
										className='form-control form-border mb-3'
										defaultValue={company}
										aria-label='pickup-business-name'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<label htmlFor='pickup-address' className='mb-1'>
										Pickup Address
									</label>
									<div className='mb-3'>
										<input type='text' name='pickupAddress' style={{ display: 'none' }} />
										<GooglePlaceAutocomplete
											autocompletionRequest={{
												componentRestrictions: {
													country: ['GB'],
												},
											}}
											apiOptions={{
												language: 'GB',
												region: 'GB',
											}}
											selectProps={{
												onChange: ({ label }) => {
													setFieldValue('pickupAddress', label);
													console.log(label, values);
												},
											}}
											apiKey={process.env.REACT_APP_GOOGLE_PLACES_API_KEY}
										/>
									</div>
									<label htmlFor='pickup-datetime' className='mb-1'>
										Pickup At
									</label>
									<input
										name='packagePickupStartTime'
										id='pickup-datetime'
										type='datetime-local'
										className='form-control form-border mb-3'
										aria-label='pickup-datetime'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<label htmlFor='pickup-instructions' className='mb-1'>
										Pickup Instructions
									</label>
									<textarea
										id='pickup-instructions'
										name='pickupInstructions'
										className='form-control form-border mb-3'
										aria-label='pickup-instructions'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
							</div>
							<div className='col-6 d-flex flex-column'>
								<h4>Dropoff</h4>
								<div className='border border-2 rounded-3 p-4'>
									<div className='row'>
										<div className='col-6'>
											<label htmlFor='dropoff-first-name' className='mb-1'>
												First Name
											</label>
											<input
												autoComplete='given-name'
												id='dropoff-first-name'
												name='dropoffFirstName'
												type='text'
												className='form-control form-border mb-2'
												aria-label='dropoff-first-name'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
										<div className='col-6'>
											<label htmlFor='dropoff-last-name' className='mb-1'>
												Last Name
											</label>
											<input
												autoComplete='family-name'
												id='dropoff-last-name'
												name='dropoffLastName'
												type='text'
												className='form-control form-border mb-2'
												aria-label='dropoff-last-name'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col-6'>
											<label htmlFor='dropoff-email-address' className='mb-1'>
												Email Address
											</label>
											<input
												autoComplete='email'
												id='dropoff-email-address'
												name='dropoffEmailAddress'
												type='email'
												className='form-control form-border mb-2'
												aria-label='dropoff-email-address'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
										<div className='col-6'>
											<label htmlFor='dropoff-phone-number' className='mb-1'>
												Phone Number
											</label>
											<input
												autoComplete='tel'
												name='dropoffPhoneNumber'
												type='text'
												className='form-control form-border mb-2'
												aria-label='dropoff-phone-number'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
									<label htmlFor='dropoff-business-name' className='mb-1'>
										Business Name
									</label>
									<input
										autoComplete='organization'
										id='dropoff-business-name'
										name='dropoffBusinessName'
										type='text'
										className='form-control form-border mb-3'
										aria-label='dropoff-business-name'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<label htmlFor='dropoff-street-address' className='mb-1'>
										Dropoff Address
									</label>
									<div className='mb-3'>
										<input type='text' name='dropoffAddress' style={{ display: 'none' }} />
										<GooglePlaceAutocomplete
											apiKey={process.env.REACT_APP_GOOGLE_PLACES_API_KEY}
											autocompletionRequest={{
												componentRestrictions: {
													country: ['GB'],
												},
											}}
											apiOptions={{
												language: 'GB',
												region: 'GB',
											}}
											selectProps={{
												onChange: ({ label }) => {
													setFieldValue('dropoffAddress', label);
													console.log(label, values);
												},
											}}
										/>
									</div>
									<label htmlFor='dropoff-datetime' className='mb-1'>
										Dropoff At
									</label>
									<input
										id='dropoff-datetime'
										name='packageDropoffStartTime'
										type='datetime-local'
										className='form-control form-border mb-3'
										placeholder='Dropoff At'
										aria-label='dropoff-datetime'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<label htmlFor='dropoff-instructions' className='mb-1'>
										Dropoff Instructions
									</label>
									<textarea
										name='dropoffInstructions'
										className='form-control form-border mb-3'
										aria-label='dropoff-instructions'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
							</div>
							<div className='row my-3 align-items-center'>
								<div className='col-12 d-flex flex-column'>
									<h4>Order Details</h4>
									<div className='row'>
										<div className='col-6'>
											<input
												name='itemsCount'
												type='number'
												className='form-control form-border my-2'
												placeholder='Number of Items'
												aria-label='items-count'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
										<div className='col-6'>
											<CurrencyInput
												prefix='£'
												defaultValue={values.packageValue}
												className='form-control form-border my-2'
												name='packageValue'
												placeholder='Package Price'
												aria-label='package-value'
												fixedDecimalLength={2}
												decimalsLimit={2}
												decimalScale={2}
												onValueChange={value => setFieldValue('packageValue', Number(value))}
												onBlur={handleBlur}
												step={1}
											/>
										</div>
									</div>
									<textarea
										name='packageDescription'
										className='form-control form-border my-2'
										placeholder='Package Description'
										aria-label='package-description'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
							</div>
							{error.message && <div className='alert alert-danger text-center'>{error.message}</div>}
							<div className='d-flex pt-5 justify-content-end'>
								<style type='text/css'>
									{`
									.btn-submit {
			                            background-color: #9400d3;
									}
									.btn-xl {
										padding: 1rem 1rem
									}
								`}
								</style>
								<Button
									variant='dark'
									size='lg'
									className='mx-3'
									onClick={() => {
										dispatch(getAllQuotes(apiKey, values))
											.then(({ quotes, bestQuote }) => {
												setQuotes(quotes);
												showQuoteModal(true);
											})
											.catch(err => console.error(err));
									}}
								>
									Get Quote
								</Button>
								<Button className='text-light' variant='submit' type='submit' size='lg' value='newJob'>
									Confirm
								</Button>
							</div>
						</div>
					</form>
				)}
			</Formik>
		</div>
	);
};

export default NewOrder;
