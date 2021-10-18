import React, { useCallback, useEffect, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import GooglePlaceAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete';
import Select, { components } from 'react-select';
import moment from 'moment';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
// functions
import { createDeliveryJob, getAllQuotes } from '../../store/actions/delivery';
import { addError, removeError } from '../../store/actions/errors';
//constants
import { PLACE_TYPES, SUBMISSION_TYPES, VEHICLE_TYPES } from '../../constants';
// components
import ErrorField from '../../components/ErrorField';
// assets
import { jobRequestSchema } from '../../schemas';
import { CreateOrderSchema } from '../../validation';
import bicycle from '../../img/bicycle.svg';
import motorbike from '../../img/motorbike.svg';
import car from '../../img/car.svg';
import cargobike from '../../img/cargobike.svg';
import van from '../../img/van.svg';
import stuart from '../../img/stuart.svg';
import gophr from '../../img/gophr.svg';
import streetStream from '../../img/street-stream.svg';
// styles
import './create.css';

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

	useEffect(() => {
		console.log(moment().utc(true).format('YYYY-MM-DDTHH:mm'));
		dispatch(removeError());
	}, [props.location]);

	const Option = props => {
		return (
			<components.Option {...props}>
				<div className='d-flex align-items-center'>
					<div className='me-3'>
						<img
							src={
								props.value === 'BIC'
									? bicycle
									: props.value === 'MTB'
									? motorbike
									: props.value === 'CGB'
									? cargobike
									: props.value === 'CAR'
									? car
									: van
							}
							className='img-fluid'
							alt=''
							width={50}
							height={50}
						/>
					</div>
					<div className='right'>
						<strong className='title'>{props.data.label}</strong>
						<div>{props.data.description}</div>
					</div>
				</div>
			</components.Option>
		);
	};

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
					// make postcode property empty since the real value is not a full postcode
					formattedAddress.postcode = long_name;
					break;
				default:
					return;
			}
		});
		console.log(formattedAddress);
		return formattedAddress;
	}, []);

	const validateAddresses = useCallback((pickup, dropoff) => {
		const types = ['street address', 'city', 'postcode'];
		Object.values(pickup).forEach((item, index) => {
			if (!item)
				throw new Error(
					`Pickup address does not include a '${types[index]}'. Please add all parts of the address and try again`
				);
			else if (index === 2 && item.length < 6)
				throw new Error(
					`Your Pickup postcode,' ${item}', is not complete. Please include a full UK postcode in your address`
				);
		});
		Object.values(dropoff).forEach((item, index) => {
			if (!item)
				throw new Error(
					`Dropoff address does not include a '${types[index]}'. Please add all parts of the address and try again`
				);
			else if (index === 2 && item.length < 6)
				throw new Error(
					`Your Dropoff postcode '${item}', is not complete. Please include a full UK postcode in your address`
				);
		});
		return true;
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

	const newJobModal = (
		<Modal show={jobModal} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Your delivery Job!</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					<ul className='list-group list-group-flush'>
						{Object.entries(deliveryJob).map(([key, value]) => (
							<li className='list-group-item'>
								<h5 className='mb-1 text-capitalize'>{key.replace(/([A-Z])/g, ' $1').trim()}</h5>
								<div className='text-capitalize'>{value.replace(/_/g, ' ')}</div>
							</li>
						))}
					</ul>
				</div>
			</Modal.Body>
		</Modal>
	);

	const quotesModal = (
		<Modal show={quoteModal} onHide={() => showQuoteModal(false)} size='lg'>
			<Modal.Header closeButton>
				<Modal.Title>Fleet Provider Quotes</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					<table className='table'>
						<thead>
							<tr>
								<th scope='col'>Fleet Provider</th>
								<th scope='col' colSpan={2}>
									Price (Exc. VAT)
								</th>
								<th scope='col'>ETA</th>
								<th scope='col' />
							</tr>
						</thead>
						<tbody>
							{quotes.map(({ providerId, priceExVAT, dropoffEta, createdAt }, index) => (
								<tr key={index}>
									<td className='col text-capitalize'>
										<img
											src={
												providerId === 'stuart'
													? stuart
													: providerId === 'gophr'
													? gophr
													: streetStream
											}
											alt=''
											className='me-3'
											width={25}
											height={25}
										/>
										<span className='text-capitalize'>{providerId.replace(/_/g, ' ')}</span>
									</td>
									<td className='col' colSpan={2}>{`£${priceExVAT.toFixed(2)}`}</td>
									<td className='col'>
										{dropoffEta
											? `${moment(dropoffEta).diff(moment(createdAt), 'minutes')} minutes`
											: 'N/A'}
									</td>
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

	return (
		<LoadingOverlay active={isLoading} spinner text={loadingText}>
			<div className='create bg-light py-4'>
				{newJobModal}
				{quotesModal}
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
						pickupAddress: address,
						packageDeliveryType: '',
					}}
					validationSchema={CreateOrderSchema}
					validateOnChange={false}
					validateOnBlur={false}
					onSubmit={async (values, actions) => {
						console.log(values.type);
						if (apiKey) {
							if (values.type === SUBMISSION_TYPES.GET_QUOTE) {
								try {
									setLoadingText('Getting Quote');
									setLoadingModal(true);
									const { pickupAddress, dropoffAddress } = values;
									console.log(values);
									let pickupAddressComponents = await geocodeByAddress(pickupAddress);
									let dropoffAddressComponents = await geocodeByAddress(dropoffAddress);
									values.pickupFormattedAddress = getParsedAddress(pickupAddressComponents);
									values.dropoffFormattedAddress = getParsedAddress(dropoffAddressComponents);
									validateAddresses(values.pickupFormattedAddress, values.dropoffFormattedAddress);
									const {
										quotes,
										bestQuote: { id },
									} = await dispatch(getAllQuotes(apiKey, values));
									setDeliveryParams(prevState => ({ ...values }));
									setQuotes(quotes);
									setLoadingModal(false);
									showQuoteModal(true);
								} catch (err) {
									setLoadingModal(false);
									console.error(err);
									err
										? dispatch(addError(err.message))
										: dispatch(addError('Api endpoint could not be accessed!'));
								}
							} else {
								setLoadingText('Creating Order');
								setLoadingModal(true);
								try {
									const { pickupAddress: pickup, dropoffAddress: dropoff } = values;
									let pickupAddressComponents = await geocodeByAddress(pickup);
									let dropoffAddressComponents = await geocodeByAddress(dropoff);
									values.pickupFormattedAddress = getParsedAddress(pickupAddressComponents);
									values.dropoffFormattedAddress = getParsedAddress(dropoffAddressComponents);
									validateAddresses(values.pickupFormattedAddress, values.dropoffFormattedAddress);
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
								} catch (err) {
									setLoadingModal(false);
									console.log(err);
									err
										? dispatch(addError(err))
										: dispatch(addError('Api endpoint could not be accessed!'));
								}
							}
						} else {
							setLoadingModal(false);
							alert(
								'Your account does not have an API' +
									' key associated with it. Please generate one from the integrations page'
							);
						}
					}}
				>
					{({ values, handleBlur, handleChange, handleSubmit, errors, setFieldValue }) => (
						<form
							onSubmit={e => {
								const { name, value } = e.nativeEvent['submitter'];
								name === SUBMISSION_TYPES.GET_QUOTE || value === SUBMISSION_TYPES.GET_QUOTE
									? setFieldValue('type', SUBMISSION_TYPES.GET_QUOTE)
									: setFieldValue('type', SUBMISSION_TYPES.CREATE_JOB);
								handleSubmit(e);
							}}
							autoComplete='on'
						>
							<div className='row mx-3'>
								<div className='col-12 d-flex flex-column'>
									<h4>Delivery Type</h4>
									<div className='border border-2 rounded-3 px-4 py-3'>
										<div className='row'>
											<div className='col-12'>
												<div className='form-check mb-2'>
													<input
														className='form-check-input'
														type='radio'
														name='deliveryType'
														id='radio-1'
														checked={values.packageDeliveryType === 'on-demand'}
														onChange={e => {
															setFieldValue('packageDeliveryType', 'on-demand');
															setFieldValue('packagePickupStartTime', '');
															setFieldValue('packageDropoffStartTime', '');
														}}
														onBlur={handleBlur}
													/>
													<label className='form-check-label' htmlFor='radio-1'>
														On Demand
													</label>
												</div>
												<div className='form-check'>
													<input
														className='form-check-input'
														type='radio'
														name='deliveryType'
														id='radio-2'
														checked={values.packageDeliveryType === 'scheduled'}
														onChange={e =>
															setFieldValue('packageDeliveryType', 'scheduled')
														}
														onBlur={handleBlur}
													/>
													<label className='form-check-label' htmlFor='radio-2'>
														Scheduled Same Day
													</label>
												</div>
											</div>
											<ErrorField name='deliveryType' classNames='mt-2' />
										</div>
									</div>
								</div>
								<div className='mt-2 mb-2' />
								<div className='col-12 d-flex flex-column'>
									<h4>Pickup</h4>
									<div className='border border-2 rounded-3 px-4 py-3'>
										<div className='row'>
											<div className='col-6'>
												<label htmlFor='pickup-address' className='mb-1'>
													Pickup Address
												</label>
												<div className='mb-3'>
													<input
														type='text'
														name='pickupAddress'
														style={{ display: 'none' }}
													/>
													<GooglePlaceAutocomplete
														autocompletionRequest={{
															componentRestrictions: {
																country: ['GB'],
															},
															types: ['address'],
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
														}}
														apiKey={process.env.REACT_APP_GOOGLE_PLACES_API_KEY}
													/>
													<ErrorField name='pickupAddress' classNames='text-end' />
												</div>
											</div>
											<div className='col-6'>
												<label htmlFor='pickup-datetime' className='mb-1'>
													Pickup At
												</label>
												<input
													disabled={values.packageDeliveryType === 'on-demand'}
													name='packagePickupStartTime'
													id='pickup-datetime'
													type='datetime-local'
													className='form-control form-border rounded-3 mb-3'
													aria-label='pickup-datetime'
													onChange={handleChange}
													onBlur={handleBlur}
													min={moment().utc(true).format('YYYY-MM-DDTHH:mm')}
													max={moment().add(7, 'days').utc(true).format('YYYY-MM-DDTHH:mm')}
												/>
											</div>
										</div>
										<div className='row'>
											<div className='col-12'>
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
									</div>
								</div>
								<div className='mt-2 mb-2' />
								<div className='col-12 d-flex flex-column'>
									<h4>Dropoff</h4>
									<div className='border border-2 rounded-3 px-4 py-3'>
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
													className='form-control form-border rounded-3 mb-2'
													aria-label='dropoff-first-name'
													onChange={handleChange}
													onBlur={handleBlur}
												/>
												<ErrorField name='dropoffFirstName' classNames='text-end' />
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
													className='form-control form-border rounded-3 mb-2'
													aria-label='dropoff-last-name'
													onChange={handleChange}
													onBlur={handleBlur}
												/>
												<ErrorField name='dropoffLastName' classNames='text-end' />
											</div>
										</div>
										<div className='row mt-1'>
											<div className='col-6'>
												<label htmlFor='dropoff-email-address' className='mb-1'>
													Email Address
												</label>
												<input
													autoComplete='email'
													id='dropoff-email-address'
													name='dropoffEmailAddress'
													type='email'
													className='form-control form-border rounded-3 mb-2'
													aria-label='dropoff-email-address'
													onChange={handleChange}
													onBlur={handleBlur}
												/>
												<ErrorField name='dropoffEmailAddress' classNames='text-end' />
											</div>
											<div className='col-6'>
												<label htmlFor='dropoff-phone-number' className='mb-1'>
													Phone Number
												</label>
												<input
													autoComplete='tel'
													name='dropoffPhoneNumber'
													type='text'
													className='form-control form-border rounded-3 mb-2'
													aria-label='dropoff-phone-number'
													onChange={handleChange}
													onBlur={handleBlur}
												/>
												<ErrorField name='dropoffPhoneNumber' classNames='text-end' />
											</div>
										</div>
										<div className='row mt-1'>
											<div className='col-6'>
												<label htmlFor='dropoff-street-address' className='mb-1'>
													Dropoff Address
												</label>
												<div className='mb-3'>
													<input
														type='text'
														name='dropoffAddress'
														style={{ display: 'none' }}
													/>
													<GooglePlaceAutocomplete
														apiKey={process.env.REACT_APP_GOOGLE_PLACES_API_KEY}
														autocompletionRequest={{
															componentRestrictions: {
																country: ['GB'],
															},
															types: ['address'],
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
													<ErrorField name='dropoffAddress' classNames='text-end' />
												</div>
											</div>
											<div className='col-6'>
												<label htmlFor='dropoff-datetime' className='mb-1'>
													Dropoff At
												</label>
												{values.packagePickupStartTime ? (
													<input
														disabled={values.packageDeliveryType === 'on-demand'}
														id='dropoff-datetime'
														name='packageDropoffStartTime'
														type='datetime-local'
														className='form-control form-border rounded-3 mb-3'
														placeholder='Dropoff At'
														aria-label='dropoff-datetime'
														onChange={handleChange}
														onBlur={handleBlur}
														min={moment(values.packagePickupStartTime)
															.subtract(1, 'minute')
															.utc(true)
															.format('YYYY-MM-DDTHH:mm')}
														max={moment(values.packagePickupStartTime)
															.add(1, 'days')
															.utc(true)
															.format('YYYY-MM-DDTHH:mm')}
													/>
												) : (
													<input
														disabled={values.packageDeliveryType === 'on-demand'}
														id='dropoff-datetime'
														name='packageDropoffStartTime'
														type='datetime-local'
														className='form-control form-border rounded-3 mb-3'
														placeholder='Dropoff At'
														aria-label='dropoff-datetime'
														onChange={handleChange}
														onBlur={handleBlur}
														min={moment().utc(true).format('YYYY-MM-DDTHH:mm')}
														max={moment()
															.add('30', 'days')
															.utc(true)
															.format('YYYY-MM-DDTHH:mm')}
													/>
												)}
											</div>
										</div>
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
								<div className='mt-2 mb-2' />
								<div className='col-12 d-flex flex-column'>
									<h4>Package Details</h4>
									<div className='border border-2 rounded-3 px-4 py-3'>
										<div className='row'>
											<div className='col-6'>
												<label htmlFor='items-count' className='mb-1'>
													Number of Items
												</label>
												<input
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
												/>
												<ErrorField name='vehicleType' classNames='text-end' />
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
										type='submit'
										name={SUBMISSION_TYPES.GET_QUOTE}
										value={SUBMISSION_TYPES.GET_QUOTE}
										variant='dark'
										size='lg'
										className='mx-3'
									>
										Get Quote
									</Button>
									<Button
										className='text-light'
										variant='primary'
										type='submit'
										size='lg'
										name={SUBMISSION_TYPES.CREATE_JOB}
										value={SUBMISSION_TYPES.CREATE_JOB}
									>
										Confirm
									</Button>
								</div>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</LoadingOverlay>
	);
};

export default Create;
