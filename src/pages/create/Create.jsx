import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createDeliveryJob, getAllQuotes } from '../../store/actions/delivery';
import { addError, removeError } from '../../store/actions/errors';
import GooglePlaceAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete';
import Select, { components } from 'react-select';
import moment from 'moment';
import { PLACE_TYPES, VEHICLE_TYPES } from '../../constants';
import loadingIcon from '../../img/loadingicon.svg';
import { jobRequestSchema } from '../../schemas';
import { CreateOrderSchema } from '../../validation';
import './create.css';
import '../../App.css';

const Create = props => {
	const [deliveryJob, setJob] = useState({});
	const [jobModal, showJobModal] = useState(false);
	const [isLoading, setLoadingModal] = useState(false);
	const [confirmDialog, showConfirmDialog] = useState(false);
	const [deliveryParams, setDeliveryParams] = useState({
		...jobRequestSchema,
	});
	const [fleetProvider, selectFleetProvider] = useState('');
	const [loadingText, setLoadingText] = useState('');
	const [quoteModal, showQuoteModal] = useState(false);
	const [quotes, setQuotes] = useState([]);
	const handleClose = () => showJobModal(false);
	const handleOpen = () => showJobModal(true);
	const { firstname, lastname, email, company, apiKey, phone, address } = useSelector(
		state => state['currentUser'].user
	);
	const error = useSelector(state => state['errors']);
	const dispatch = useDispatch();

	const Option = props => (
		<components.Option {...props}>
			<div className='left'>{props.isSelected ? '✔' : ''}</div>
			<div className='right'>
				<strong className='title'>{props.data.label}</strong>
				<div>{props.data.description}</div>
			</div>
		</components.Option>
	);

	const getParsedAddress = useCallback(data => {
		let address = data[0].address_components;
		let formattedAddress = {
			street: '',
			city: '',
			postcode: '',
			countryCode: 'GB',
		};
		let components = address.filter(({ types }) => types.some(type => Object.values(PLACE_TYPES).includes(type)));
		components.forEach(({ long_name, types }) => {
			switch (types[0]) {
				case PLACE_TYPES.STREET_NUMBER:
					formattedAddress.street = long_name + ' ';
					break;
				case PLACE_TYPES.STREET_ADDRESS:
					formattedAddress.street = formattedAddress.street + long_name;
					break;
				case PLACE_TYPES.CITY:
					formattedAddress.city = long_name;
					break;
				case PLACE_TYPES.POSTCODE:
					formattedAddress.postcode = long_name;
					break;
				case PLACE_TYPES.POSTCODE_PREFIX:
					formattedAddress.postcode = long_name;
					break;
				default:
					return;
			}
		});
		return formattedAddress;
	}, []);

	const confirmSelection = () => {
		setLoadingText('Creating Order');
		showConfirmDialog(false);
		setLoadingModal(true);
		dispatch(createDeliveryJob(deliveryParams, apiKey, fleetProvider)).then(
			({
				createdAt,
				jobSpecification: { packages, orderNumber },
				status,
				selectedConfiguration: { providerId, winnerQuote },
			}) => {
				let {
					description,
					pickupLocation: { fullAddress: pickupAddress },
					dropoffLocation: { fullAddress: dropoffAddress },
					pickupStartTime,
					dropoffStartTime,
				} = packages[0];
				let newJob = {
					orderNumber,
					description,
					pickupAddress,
					dropoffAddress,
					pickupStartTime: moment(pickupStartTime).format('DD-MM-YYYY HH:mm:ss'),
					dropoffStartTime: moment(dropoffStartTime).format('DD-MM-YYYY HH:mm:ss'),
					status,
					fleetProvider: providerId,
				};
				setLoadingModal(false);
				setJob(newJob);
				handleOpen();
			}
		);
	};

	const loadingModal = (
		<Modal
			contentClassName='model-border'
			centered
			show={isLoading}
			onHide={() => setLoadingModal(false)}
			style={{
				backgroundColor: 'transparent',
			}}
		>
			<Modal.Body
				className='d-flex justify-content-center align-item-center'
				style={{
					backgroundColor: 'transparent',
					borderRadius: 40,
				}}
			>
				<img src={loadingIcon} alt='' width={400} height={400} />
			</Modal.Body>
			<Modal.Footer className='d-flex justify-content-center align-items-center'>
				<div className='text-center h4'>{`${loadingText} ...`}</div>
			</Modal.Footer>
		</Modal>
	);

	const newJobModal = (
		<Modal show={jobModal} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Your delivery Job!</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					{Object.entries(deliveryJob).map(([key, value], index) => {
						return (
							<div key={index} className='row p-3'>
								<div className='fw-bold col text-capitalize'>{key}</div>
								<div className='col'>{value}</div>
							</div>
						);
					})}
				</div>
			</Modal.Body>
		</Modal>
	);

	const quotesModal = (
		<Modal show={quoteModal} onHide={() => showQuoteModal(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Fleet Provider Quotes</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
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
										<button
											className='d-flex justify-content-center align-items-center OrdersListEdit'
											onClick={() => {
												showQuoteModal(false);
												selectFleetProvider(providerId);
												showConfirmDialog(true);
											}}
										>
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

	const confirmModal = (
		<Modal show={confirmDialog} onHide={() => showConfirmDialog(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Confirm Selection</Modal.Title>
			</Modal.Header>
			<Modal.Body className='d-flex justify-content-center align-items-center border-0'>
				<span className='fs-4'>
					You are confirming <span className='fw-bold text-uppercase'>{fleetProvider}</span>!
				</span>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={() => showConfirmDialog(false)}>
					Cancel
				</Button>
				<Button onClick={confirmSelection}>Confirm</Button>
			</Modal.Footer>
		</Modal>
	);

	useEffect(() => {
		dispatch(removeError());
	}, [props.location]);

	return (
		<div className='create bg-light py-4'>
			{newJobModal}
			{quotesModal}
			{loadingModal}
			{confirmModal}
			<Formik
				enableReinitialize
				initialValues={{
					...jobRequestSchema,
					pickupFirstName: firstname,
					pickupLastName: lastname,
					pickupBusinessName: company,
					pickupEmailAddress: email,
					pickupPhoneNumber: phone,
					pickupAddress: address
				}}
				validationSchema={CreateOrderSchema}
				onSubmit={async (values, actions) => {
					setLoadingText('Creating Order');
					setLoadingModal(true);
					try {
						if (apiKey) {
							const { pickupAddress: pickup, dropoffAddress: dropoff } = values;
							let pickupAddressComponents = await geocodeByAddress(pickup);
							let dropoffAddressComponents = await geocodeByAddress(dropoff);
							values.pickupFormattedAddress = getParsedAddress(pickupAddressComponents);
							console.log(values.pickupFormattedAddress);
							values.dropoffFormattedAddress = getParsedAddress(dropoffAddressComponents);
							const {
								createdAt,
								jobSpecification: { packages, orderNumber },
								status,
								selectedConfiguration: { providerId, winnerQuote },
							} = await dispatch(createDeliveryJob(values, apiKey));
							let {
								description,
								pickupLocation: { fullAddress: pickupAddress },
								dropoffLocation: { fullAddress: dropoffAddress },
								pickupStartTime,
								dropoffStartTime,
							} = packages[0];
							let newJob = {
								orderNumber,
								description,
								pickupAddress,
								dropoffAddress,
								pickupStartTime: moment(pickupStartTime).format('DD-MM-YYYY HH:mm:ss'),
								dropoffStartTime: moment(dropoffStartTime).format('DD-MM-YYYY HH:mm:ss'),
								status,
								fleetProvider: providerId,
							};
							setLoadingModal(false);
							setJob(newJob);
							handleOpen();
						} else {
							setLoadingModal(false);
							alert(
								'Your account does not have an API' +
									' key associated with it. Please generate one from the integrations page'
							);
						}
					} catch (err) {
						console.log(err);
						err ? addError(err) : addError('Api endpoint could not be accessed!');
					}
				}}
			>
				{({ values, handleBlur, handleChange, handleSubmit, errors, setFieldValue }) => (
					<form onSubmit={handleSubmit} autoComplete='on'>
						<div className='row mx-3'>
							<div className='col-6 d-flex flex-column'>
								<h4>Pickup</h4>
								<div className='border border-2 rounded-3 p-4'>
									<div className='row'>
										<div className='col-6'>
											<label htmlFor='pickup-first-name' className='mb-1'>
												First Name
											</label>
											<input
												required
												autoComplete='given-name'
												name='pickupFirstName'
												type='text'
												className='form-control form-border rounded-3 mb-2'
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
												required
												autoComplete='family-name'
												id='pickup-last-name'
												name='pickupLastName'
												type='text'
												className='form-control form-border rounded-3 mb-2'
												defaultValue={lastname}
												aria-label='pickup-last-name'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
									<div className='row mt-1'>
										<div className='col-6'>
											<label htmlFor='pickup-email-address' className='mb-1'>
												Email Address
											</label>
											<input
												required
												autoComplete='email'
												id='pickup-email-address'
												name='pickupEmailAddress'
												type='email'
												className='form-control form-border rounded-3 mb-2'
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
												required
												autoComplete='tel'
												id='pickup-phone-number'
												name='pickupPhoneNumber'
												type='tel'
												defaultValue={phone}
												className='form-control form-border rounded-3 mb-2'
												placeholder='Phone Number'
												aria-label='pickup-phone-number'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
									<label htmlFor='pickup-business-name' className='my-1'>
										Business Name
									</label>
									<input
										required
										autoComplete='organization'
										id='pickup-business-name'
										name='pickupBusinessName'
										type='text'
										className='form-control form-border rounded-3 mb-3'
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
												defaultInputValue: values.pickupAddress,
												onChange: ({ label }) => {
													setFieldValue('pickupAddress', label);
													console.log(label, values);
												},

												/*styles: {
													input: (provided) => ({
														...provided,
														color: 'blue',
													}),
													option: (provided) => ({
														...provided,
														color: 'blue',
													}),
													singleValue: (provided) => ({
														...provided,
														color: 'blue',
													}),
												},*/
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
										className='form-control form-border rounded-3 mb-3'
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
										className='form-control form-border rounded-3 mb-3'
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
												required
												autoComplete='given-name'
												id='dropoff-first-name'
												name='dropoffFirstName'
												type='text'
												className='form-control form-border rounded-3 mb-2'
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
												required
												autoComplete='family-name'
												id='dropoff-last-name'
												name='dropoffLastName'
												type='text'
												className='form-control form-border rounded-3 mb-2'
												aria-label='dropoff-last-name'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
									<div className='row mt-1'>
										<div className='col-6'>
											<label htmlFor='dropoff-email-address' className='mb-1'>
												Email Address
											</label>
											<input
												required
												autoComplete='email'
												id='dropoff-email-address'
												name='dropoffEmailAddress'
												type='email'
												className='form-control form-border rounded-3 mb-2'
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
												required
												autoComplete='tel'
												name='dropoffPhoneNumber'
												type='text'
												className='form-control form-border rounded-3 mb-2'
												aria-label='dropoff-phone-number'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
									<div className='mb-1' />
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
										className='form-control form-border rounded-3 mb-3'
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
										className='form-control form-border rounded-3 mb-3'
										aria-label='dropoff-instructions'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
							</div>
							<div className='mt-4 mb-3' />
							<div className='col-12 d-flex flex-column'>
								<h4>Order Details</h4>
								<div className='border border-2 rounded-3 p-4'>
									<div className='row'>
										<div className='col-6'>
											<label htmlFor='items-count' className='mb-1'>
												Number of Items
											</label>
											<input
												required
												id='items-count'
												name='itemsCount'
												type='number'
												className='form-control form-border rounded-3 my-2'
												placeholder='Number of Items'
												aria-label='items-count'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
										<div className='col-6'>
											<label htmlFor='vehicle-type' className='mb-1'>
												Vehicle Type
											</label>
											<Select
												id='vehicle-type'
												name='vehicleType'
												className='my-2'
												options={VEHICLE_TYPES}
												components={{ Option }}
												onChange={({ value }) => {
													setFieldValue('vehicleType', value);
													console.log(value);
												}}
												aria-label='vehicle type selection'
												required
											/>
										</div>
									</div>
									<div className='row'>
										<div className='col'>
											<label htmlFor='package-description' className='mb-1'>
												Package Description
											</label>
											<textarea
												id='package-description'
												name='packageDescription'
												className='form-control form-border rounded-3 my-2'
												placeholder='Max. 200 characters'
												maxLength={200}
												aria-label='package-description'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className='my-3 d-flex justify-content-center'>
								{error.message && (
									<div className='alert alert-danger text-center w-75'>{error.message}</div>
								)}
							</div>
							<div className='d-flex pt-5 justify-content-end'>
								<Button
									variant='dark'
									size='lg'
									className='mx-3'
									onClick={async () => {
										try {
											if (apiKey) {
												setLoadingText('Getting Quote');
												setLoadingModal(true);
												const { pickupAddress, dropoffAddress } = values;
												let pickupAddressComponents = await geocodeByAddress(pickupAddress);
												let dropoffAddressComponents = await geocodeByAddress(dropoffAddress);
												values.pickupFormattedAddress =
													getParsedAddress(pickupAddressComponents);
												values.dropoffFormattedAddress =
													getParsedAddress(dropoffAddressComponents);
												const {
													quotes,
													bestQuote: { id },
												} = await dispatch(getAllQuotes(apiKey, values));
												setDeliveryParams(prevState => ({ ...values }));
												setQuotes(quotes);
												setLoadingModal(false);
												showQuoteModal(true);
											} else {
												setLoadingModal(false);
												alert(
													'Your account does not have an API' +
														' key associated with it. Please generate one from the integrations page'
												);
											}
										} catch (err) {
											setLoadingModal(false);
											console.error(err);
											alert(err);
										}
									}}
								>
									Get Quote
								</Button>
								<Button className='text-light' variant='primary' type='submit' size='lg' value='newJob'>
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

export default Create;
