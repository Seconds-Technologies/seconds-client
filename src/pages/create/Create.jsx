import React, { useCallback, useEffect, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { geocodeByAddress } from 'react-google-places-autocomplete';
import Select, { components } from 'react-select';
import moment from 'moment';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
// functions
import {
	addDropoff,
	clearDropoffs,
	createDeliveryJob,
	createMultiDropJob,
	getAllQuotes,
	removeDropoff,
} from '../../store/actions/delivery';
import { addError, removeError } from '../../store/actions/errors';
//constants
import { DELIVERY_TYPES, PATHS, SUBMISSION_TYPES, VEHICLE_TYPES } from '../../constants';
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
import ecofleet from '../../img/ecofleet.svg';
// styles
import './create.css';
import { Mixpanel } from '../../config/mixpanel';
import { parseAddress } from '../../helpers';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ToastFade from 'react-bootstrap/Toast';
import secondsLogo from '../../img/logo.svg';

const Create = props => {
	const [deliveryJob, setJob] = useState({});
	const [jobModal, showJobModal] = useState(false);
	const [isLoading, setLoadingModal] = useState(false);
	const [confirmDialog, showConfirmDialog] = useState(false);
	const [dropoffModal, showDropoffModal] = useState(false);
	const [pickupDatetime, setPickupDatetime] = useState('');
	const [deliveryParams, setDeliveryParams] = useState({
		...jobRequestSchema,
	});
	const [toastMessage, setToast] = useState('');
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
	const { dropoffs } = useSelector(state => state['addressHistory']);
	const dispatch = useDispatch();

	useEffect(() => {
		Mixpanel.people.increment('page_views');
	}, []);

	useEffect(() => {
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

	const getParsedAddress = useCallback(parseAddress, []);

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

	const handleAddresses = useCallback(
		async values => {
			const { pickupAddressLine1, pickupAddressLine2, pickupCity, pickupPostcode, drops } = values;
			for (const drop of drops) {
				const index = drops.indexOf(drop);
				console.table(drop);
				console.log('INDEX', index);
				values.pickupAddress = `${pickupAddressLine1} ${pickupAddressLine2} ${pickupCity} ${pickupPostcode}`;
				values.drops[
					index
				].dropoffAddress = `${drop.dropoffAddressLine1} ${drop.dropoffAddressLine2} ${drop.dropoffCity} ${drop.dropoffPostcode}`;
				let pickupAddressComponents = await geocodeByAddress(values.pickupAddress);
				let dropoffAddressComponents = await geocodeByAddress(values.drops[index].dropoffAddress);
				let pickupFormattedAddress = getParsedAddress(pickupAddressComponents);
				values.pickupAddressLine1 = pickupFormattedAddress.street;
				values.pickupCity = pickupFormattedAddress.city;
				values.pickupPostcode = pickupFormattedAddress.postcode;
				let dropoffFormattedAddress = getParsedAddress(dropoffAddressComponents);
				values.drops[index].dropoffAddressLine1 = dropoffFormattedAddress.street;
				values.drops[index].dropoffCity = dropoffFormattedAddress.city;
				values.drops[index].dropPostcode = dropoffFormattedAddress.postcode;
				validateAddresses(pickupFormattedAddress, dropoffFormattedAddress);
			}
			return values;
		},
		[getParsedAddress, validateAddresses]
	);

	const confirmSelection = () => {
		setLoadingText('Creating Order');
		showConfirmDialog(false);
		setLoadingModal(true);
		dispatch(createDeliveryJob(deliveryParams, apiKey, fleetProvider))
			.then(
				({
					jobSpecification: {
						deliveries,
						orderNumber,
						pickupLocation: { fullAddress: pickupAddress },
						pickupStartTime,
					},
					status,
					selectedConfiguration: { providerId },
				}) => {
					let {
						description,
						dropoffLocation: { fullAddress: dropoffAddress },
						dropoffStartTime,
					} = deliveries[0];
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
			)
			.catch(err => {
				setLoadingModal(false);
				console.log(err);
				err ? dispatch(addError(err.message)) : dispatch(addError('Api endpoint could not be accessed!'));
			});
	};

	const newJobModal = (
		<Modal show={jobModal} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Your delivery Job!</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					<ul className='list-group list-group-flush'>
						{Object.entries(deliveryJob).map(([key, value], index) => (
							<li key={index} className='list-group-item'>
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
									Price
								</th>
								<th scope='col'>ETA</th>
								<th scope='col' />
							</tr>
						</thead>
						<tbody>
							{quotes.map(
								({ providerId, priceExVAT, dropoffEta, createdAt }, index) =>
									providerId !== 'ecofleet' && (
										<tr key={index}>
											<td className='col text-capitalize'>
												<img
													src={
														providerId === 'stuart'
															? stuart
															: providerId === 'gophr'
															? gophr
															: providerId === 'street_stream'
															? streetStream
															: ecofleet
													}
													alt=''
													className='me-3'
													width={25}
													height={25}
												/>
												<span className='text-capitalize'>{providerId.replace(/_/g, ' ')}</span>
											</td>
											<td className='col' colSpan={2}>
												{priceExVAT ? `£${priceExVAT.toFixed(2)}` : 'N/A'}
											</td>
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
									)
							)}
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

	const apiKeyToast = (
		<ToastContainer className='bottomRight'>
			<ToastFade onClose={() => setToast('')} show={!!toastMessage} animation={'true'} delay={3000} autohide>
				<ToastFade.Header closeButton={false}>
					<img src={secondsLogo} className='rounded me-2' alt='' />
					<strong className='me-auto'>Seconds</strong>
				</ToastFade.Header>
				<ToastFade.Body>{toastMessage}</ToastFade.Body>
			</ToastFade>
		</ToastContainer>
	);

	const newDropoff = (
		<Modal show={dropoffModal} onHide={() => showDropoffModal(false)} size='lg' centered>
			<Modal.Header closeButton>
				<Modal.Title>Add New Dropoff</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Formik
					initialValues={{
						dropoffFirstName: '',
						dropoffLastName: '',
						dropoffPhoneNumber: '',
						dropoffEmailAddress: '',
						dropoffAddressLine1: '',
						dropoffAddressLine2: '',
						dropoffCity: '',
						dropoffPostcode: '',
						dropoffInstructions: '',
						packageDropoffStartTime: '',
						packageDescription: '',
					}}
					onSubmit={values => {
						dispatch(addDropoff(values));
					}}
				>
					{({ values, handleBlur, handleChange, handleSubmit, errors, setFieldValue }) => (
						<form onSubmit={handleSubmit} className='d-flex flex-column' autoComplete='on'>
							<div className='row'>
								<div className='col'>
									<input
										autoComplete='given-name'
										id='new-drop-firstname'
										name='dropoffFirstName'
										type='text'
										className='form-control form-border rounded-3 my-2'
										placeholder='First Name'
										required
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
								<div className='col'>
									<input
										name='dropoffLastName'
										type='text'
										className='form-control form-border rounded-3 my-2'
										placeholder='Last Name'
										onChange={handleChange}
										onBlur={handleBlur}
										required
									/>
								</div>
							</div>
							<div className='row'>
								<div className='col'>
									<input
										autoComplete='tel'
										name='dropoffPhoneNumber'
										type='tel'
										className='form-control form-border rounded-3 my-2'
										placeholder='Phone Number'
										onChange={handleChange}
										onBlur={handleBlur}
										required
									/>
								</div>
								<div className='col'>
									<input
										name='dropoffEmailAddress'
										type='email'
										className='form-control form-border rounded-3 my-2'
										placeholder='Email Address'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
							</div>
							<div className='row'>
								<div className='col-md-6 col-lg-6'>
									<input
										defaultValue={values.dropoffAddressLine1}
										autoComplete='address-line1'
										placeholder='Address Line 1'
										type='text'
										id='dropoff-address-line-1'
										name='dropoffAddressLine1'
										className='form-control rounded-3 my-2'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
								<div className='col-md-6 col-lg-6'>
									<input
										defaultValue={values.dropoffAddressLine2}
										autoComplete='address-line2'
										placeholder='Address Line 2'
										type='text'
										id='dropoff-address-line-2'
										name='dropoffAddressLine2'
										className='form-control rounded-3 my-2'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='row'>
								<div className='col-md-6 col-lg-6'>
									<input
										defaultValue={values.dropoffCity}
										autoComplete='address-level2'
										placeholder='City'
										type='text'
										id='dropoff-city'
										name='dropoffCity'
										className='form-control rounded-3 my-2'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
								<div className='col-md-6 col-lg-6'>
									<input
										defaultValue={values.dropoffPostcode}
										autoComplete='postal-code'
										placeholder='Postcode'
										type='text'
										id='dropoff-postcode'
										name='dropoffPostcode'
										className='form-control rounded-3 my-2'
										onBlur={handleBlur}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className='row'>
								<div className='col'>
									<input
										type='datetime-local'
										name='packageDropoffStartTime'
										id='dropoff-deadline'
										className='form-control form-border rounded-3 my-2'
										onChange={handleChange}
										onBlur={handleBlur}
										min={
											pickupDatetime
												? moment(pickupDatetime)
														.subtract(1, 'minute')
														.format('YYYY-MM-DDTHH:mm')
												: moment().subtract(1, 'minute').format('YYYY-MM-DDTHH:mm')
										}
										max={
											pickupDatetime
												? moment(pickupDatetime).add(1, 'days').format('YYYY-MM-DDTHH:mm')
												: moment().add(1, 'day').format('YYYY-MM-DDTHH:mm')
										}
										required
									/>
								</div>
							</div>
							<div className='row'>
								<div className='col'>
									<textarea
										placeholder='Dropoff Instructions'
										name='dropoffInstructions'
										className='form-control form-border rounded-3 my-2'
										aria-label='dropoff-instructions'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
								<div className='col'>
									<textarea
										placeholder='Package Description'
										name='packageDescription'
										className='form-control form-border rounded-3 my-2'
										aria-label='dropoff-description'
										onChange={handleChange}
										onBlur={handleBlur}
									/>
								</div>
							</div>
							<div className='d-flex justify-content-center mt-4'>
								<button type='submit' className='btn w-25 btn-primary'>
									<span className='fs-5'>Add</span>
								</button>
							</div>
						</form>
					)}
				</Formik>
			</Modal.Body>
		</Modal>
	);

	return (
		<LoadingOverlay active={isLoading} spinner text={loadingText}>
			<div className='create bg-light py-4'>
				{newJobModal}
				{quotesModal}
				{confirmModal}
				{apiKeyToast}
				{newDropoff}
				<Formik
					enableReinitialize
					initialValues={{
						...jobRequestSchema,
						pickupFirstName: firstname,
						pickupLastName: lastname,
						pickupBusinessName: company,
						pickupEmailAddress: email,
						pickupPhoneNumber: phone,
						pickupAddressLine1: address.street,
						pickupAddressLine2: '',
						pickupCity: address.city,
						pickupPostcode: address.postcode,
					}}
					validationSchema={CreateOrderSchema}
					validateOnChange={false}
					validateOnBlur={false}
					onSubmit={async (values, actions) => {
						if (apiKey) {
							// check if job is on-demand
							if (values.packageDeliveryType === DELIVERY_TYPES.ON_DEMAND) {
								values.packagePickupStartTime = moment().add('25', 'minutes').format();
								values.drops[0].packageDropoffStartTime = moment().add('50', 'minutes').format();
							}
							if (values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP) values.drops = dropoffs;
							if (values.type === SUBMISSION_TYPES.GET_QUOTE) {
								setLoadingText('Getting Quote');
								setLoadingModal(true);
								try {
									values = await handleAddresses(values);
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
									values = await handleAddresses(values);
									const {
										jobSpecification: {
											deliveries,
											pickupLocation: { fullAddress: pickupAddress },
											pickupStartTime,
											orderNumber,
										},
										status,
										selectedConfiguration: { providerId },
									} = values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP
										? await dispatch(createMultiDropJob(values, apiKey))
										: await dispatch(createDeliveryJob(values, apiKey));
									let {
										description,
										dropoffLocation: { fullAddress: dropoffAddress },
										dropoffStartTime,
									} = deliveries[0];
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
									// values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP &&
									// 	dispatch(clearDropoffs());
									handleOpen();
								} catch (err) {
									setLoadingModal(false);
									console.log(err);
									err
										? dispatch(addError(err.message))
										: dispatch(addError('Api endpoint could not be accessed!'));
								}
							}
						} else {
							setLoadingModal(false);
							setToast(
								'Your account does not have an API key associated with it. Please generate one from the integrations page'
							);
						}
					}}
				>
					{({ values, handleBlur, handleChange, handleSubmit, errors, setFieldValue }) => (
						<form
							onSubmit={e => {
								console.table(values);
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
														checked={
															values.packageDeliveryType === DELIVERY_TYPES.ON_DEMAND
														}
														onChange={e => {
															setFieldValue(
																'packageDeliveryType',
																DELIVERY_TYPES.ON_DEMAND
															);
															setFieldValue('packagePickupStartTime', '');
															setFieldValue('drops[0].packageDropoffStartTime', '');
														}}
														onBlur={handleBlur}
													/>
													<label className='form-check-label' htmlFor='radio-1'>
														On Demand
													</label>
												</div>
												<div className='form-check mb-2'>
													<input
														className='form-check-input'
														type='radio'
														name='deliveryType'
														id='radio-2'
														checked={values.packageDeliveryType === DELIVERY_TYPES.SAME_DAY}
														onChange={e =>
															setFieldValue(
																'packageDeliveryType',
																DELIVERY_TYPES.SAME_DAY
															)
														}
														onBlur={handleBlur}
													/>
													<label className='form-check-label' htmlFor='radio-2'>
														Scheduled Same Day
													</label>
												</div>
												<div className='form-check'>
													<input
														className='form-check-input'
														type='radio'
														name='deliveryType'
														id='radio-2'
														checked={
															values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP
														}
														onChange={e =>
															setFieldValue(
																'packageDeliveryType',
																DELIVERY_TYPES.MULTI_DROP
															)
														}
														onBlur={handleBlur}
													/>
													<label className='form-check-label' htmlFor='radio-2'>
														Multi drop
													</label>
												</div>
											</div>
											<ErrorField name='packageDeliveryType' classNames='mt-2' />
										</div>
									</div>
								</div>
								<div className='mt-2 mb-2' />
								<div className='col-12 d-flex flex-column'>
									<h4>Package Details</h4>
									<div className='border border-2 rounded-3 px-4 py-3'>
										<div className='row'>
											<div className='col-6'>
												<label htmlFor='items-count' className='mb-1'>
													<span>
														{errors['itemsCount'] && (
															<span className='text-danger'>*&nbsp;</span>
														)}
														Number of items
													</span>
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
													min={0}
													max={10}
												/>
											</div>
											<div className='col-6'>
												<label htmlFor='vehicle-type' className='mb-1'>
													<span>
														{errors['vehicleType'] && (
															<span className='text-danger'>*&nbsp;</span>
														)}
														Vehicle Type
													</span>
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
											</div>
										</div>
										<div className='row'>
											<div className='col'>
												<label htmlFor='package-description' className='mb-1'>
													Package Description
												</label>
												<textarea
													id='package-description'
													name='drops[0].packageDescription'
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
								<div className='mt-2 mb-2' />
								<div className='col-12 d-flex flex-column'>
									<h4>Pickup</h4>
									<div className='border border-2 rounded-3 px-4 py-3'>
										<div className='row'>
											<div className='col-md-6 col-lg-6 pb-xs-4'>
												<label className='mb-1' htmlFor='address-line-1'>
													<span>
														{errors['pickupAddressLine1'] && (
															<span className='text-danger'>*&nbsp;</span>
														)}
														Address line 1
													</span>
												</label>
												<input
													defaultValue={values.pickupAddressLine1}
													autoComplete='address-line1'
													type='text'
													id='address-line-1'
													name='pickupAddressLine1'
													className='form-control rounded-3 mb-2'
													onBlur={handleBlur}
													onChange={handleChange}
												/>
											</div>
											<div className='col-md-6 col-lg-6 pb-xs-4'>
												<label className='mb-1' htmlFor='address-line-2'>
													<span>
														{errors['pickupAddressLine2'] && (
															<span className='text-danger'>*&nbsp;</span>
														)}
														Address line 2
													</span>
												</label>
												<input
													defaultValue={values.pickupAddressLine2}
													autoComplete='address-line2'
													type='text'
													id='pickupAddressLine2'
													name='pickupAddress.addressLine2'
													className='form-control rounded-3 mb-2'
													onBlur={handleBlur}
													onChange={handleChange}
												/>
											</div>
										</div>
										<div className='row'>
											<div className='col-md-6 col-lg-6 pb-xs-4'>
												<label className='mb-1' htmlFor='city'>
													<span>
														{errors['pickupCity'] && (
															<span className='text-danger'>*&nbsp;</span>
														)}
														City
													</span>
												</label>
												<input
													defaultValue={values.pickupCity}
													autoComplete='address-level2'
													type='text'
													id='city'
													name='pickupCity'
													className='form-control rounded-3 mb-2'
													onBlur={handleBlur}
													onChange={handleChange}
												/>
											</div>
											<div className='col-md-6 col-lg-6 pb-xs-4'>
												<label className='mb-1' htmlFor='postcode'>
													<span>
														{errors['pickupPostcode'] && (
															<span className='text-danger'>*&nbsp;</span>
														)}
														Postcode
													</span>
												</label>
												<input
													defaultValue={values.pickupPostcode}
													autoComplete='postal-code'
													type='text'
													id='postcode'
													name='pickupPostcode'
													className='form-control rounded-3 mb-2'
													onBlur={handleBlur}
													onChange={handleChange}
												/>
											</div>
										</div>
										<div className='row'>
											<div className='col-12'>
												<label htmlFor='pickup-datetime' className='mb-1'>
													Pickup At
												</label>
												<input
													disabled={values.packageDeliveryType === DELIVERY_TYPES.ON_DEMAND}
													name='packagePickupStartTime'
													id='pickup-datetime'
													type='datetime-local'
													className='form-control form-border rounded-3 mb-3'
													aria-label='pickup-datetime'
													onChange={e => {
														handleChange(e);
														setPickupDatetime(e.target.value);
													}}
													onBlur={handleBlur}
													min={moment().format('YYYY-MM-DDTHH:mm')}
													max={moment().add(7, 'days').format('YYYY-MM-DDTHH:mm')}
													required={values.packageDeliveryType !== DELIVERY_TYPES.ON_DEMAND}
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
									<h4>
										{values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP
											? 'Multi Drop (min. 5 dropoffs)'
											: 'Dropoff'}
									</h4>
									{values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP ? (
										<div className='border border-2 rounded-3 px-4 py-3'>
											<ol className='list list-unstyled'>
												{dropoffs.map(
													(
														{
															dropoffFirstName,
															dropoffLastName,
															dropoffAddressLine1,
															dropoffPostcode,
															packageDropoffStartTime,
															dropoffPhoneNumber,
															dropoffPackageDescription,
														},
														index
													) => (
														<li key={index} className='card mb-2'>
															<div className='card-body'>
																<h5 className='card-title'>
																	{dropoffAddressLine1}, {dropoffPostcode}
																</h5>
																<span className='fs-6'>
																	{dropoffFirstName} {dropoffLastName} -&nbsp;
																	<span className='card-text'>
																		{dropoffPhoneNumber}
																	</span>
																</span>
																<div className='d-flex align-items-center justify-content-between'>
																	<small className='text-muted'>
																		{moment(packageDropoffStartTime).calendar()}
																	</small>
																	<div>
																		<button
																			type='button'
																			className='btn btn-sm btn-outline-danger'
																			onClick={() =>
																				dispatch(removeDropoff(index))
																			}
																		>
																			Remove
																		</button>
																	</div>
																</div>
															</div>
														</li>
													)
												)}
											</ol>
											<div className='d-flex align-items-start'>
												<div
													className='btn btn-outline-primary'
													onClick={() => showDropoffModal(true)}
												>
													Add Dropoff
												</div>
											</div>
										</div>
									) : (
										<div className='border border-2 rounded-3 px-4 py-3'>
											<div className='row'>
												<div className='col-6'>
													<label htmlFor='dropoff-first-name' className='mb-1'>
														<span>
															{errors['drops'] &&
																errors['drops'][0]['dropoffFirstName'] && (
																	<span className='text-danger'>*&nbsp;</span>
																)}
															First Name
														</span>
													</label>
													<input
														autoComplete='given-name'
														id='dropoff-first-name'
														name='drops[0].dropoffFirstName'
														type='text'
														className='form-control form-border rounded-3 mb-2'
														aria-label='dropoff-first-name'
														onChange={handleChange}
														onBlur={handleBlur}
													/>
												</div>
												<div className='col-6'>
													<label htmlFor='dropoff-last-name' className='mb-1'>
														<span>
															{errors['drops'] &&
																errors['drops'][0]['dropoffLastName'] && (
																	<span className='text-danger'>*&nbsp;</span>
																)}
															Last Name
														</span>
													</label>
													<input
														autoComplete='family-name'
														id='dropoff-last-name'
														name='drops[0].dropoffLastName'
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
														<span>
															{errors['drops'] &&
																errors['drops'][0]['dropoffEmailAddress'] && (
																	<span className='text-danger'>*&nbsp;</span>
																)}
															Email Address
														</span>
													</label>
													<input
														autoComplete='email'
														id='dropoff-email-address'
														name='drops[0].dropoffEmailAddress'
														type='email'
														className='form-control form-border rounded-3 mb-2'
														aria-label='dropoff-email-address'
														onChange={handleChange}
														onBlur={handleBlur}
													/>
												</div>
												<div className='col-6'>
													<label htmlFor='dropoff-phone-number' className='mb-1'>
														<span>
															{errors['drops'] &&
																errors['drops'][0]['dropoffPhoneNumber'] && (
																	<span className='text-danger'>*&nbsp;</span>
																)}
															Phone Number
														</span>
													</label>
													<input
														autoComplete='tel'
														name='drops[0].dropoffPhoneNumber'
														type='text'
														className='form-control form-border rounded-3 mb-2'
														aria-label='dropoff-phone-number'
														onChange={handleChange}
														onBlur={handleBlur}
													/>
												</div>
											</div>
											<div className='row mt-1'>
												<div className='col-md-6 col-lg-6 pb-xs-4'>
													<label className='mb-1' htmlFor='dropoff-address-line-1'>
														<span>
															{errors['drops'] &&
																errors['drops'][0]['dropoffAddressLine1'] && (
																	<span className='text-danger'>*&nbsp;</span>
																)}
															Address line 1
														</span>
													</label>
													<input
														defaultValue={values.drops[0].dropoffAddressLine1}
														autoComplete='address-line1'
														type='text'
														id='dropoff-address-line-1'
														name='drops[0].dropoffAddressLine1'
														className='form-control rounded-3 mb-2'
														onBlur={handleBlur}
														onChange={handleChange}
													/>
												</div>
												<div className='col-md-6 col-lg-6 pb-xs-4'>
													<label className='mb-1' htmlFor='dropoff-address-line-2'>
														<span>
															{errors['drops'] &&
																errors['drops'][0]['dropoffAddressLine2'] && (
																	<span className='text-danger'>*&nbsp;</span>
																)}
															Address line 2
														</span>
													</label>
													<input
														defaultValue={values.drops[0].dropoffAddressLine2}
														autoComplete='address-line2'
														type='text'
														id='dropoff-address-line-2'
														name='drops[0].dropoffAddressLine2'
														className='form-control rounded-3 mb-2'
														onBlur={handleBlur}
														onChange={handleChange}
													/>
												</div>
											</div>
											<div className='row'>
												<div className='col-md-6 col-lg-6 pb-xs-4'>
													<label className='mb-1' htmlFor='dropoff-city'>
														<span>
															{errors['drops'] && errors['drops'][0]['dropoffCity'] && (
																<span className='text-danger'>*&nbsp;</span>
															)}
															City
														</span>
													</label>
													<input
														defaultValue={values.drops[0].dropoffCity}
														autoComplete='address-level2'
														type='text'
														id='dropoff-city'
														name='drops[0].dropoffCity'
														className='form-control rounded-3 mb-2'
														onBlur={handleBlur}
														onChange={handleChange}
													/>
												</div>
												<div className='col-md-6 col-lg-6 pb-xs-4'>
													<label className='mb-1' htmlFor='dropoff-postcode'>
														<span>
															{errors['drops'] &&
																errors['drops'][0]['dropoffPostcode'] && (
																	<span className='text-danger'>*&nbsp;</span>
																)}
															Postcode
														</span>
													</label>
													<input
														defaultValue={values.drops[0].dropoffPostcode}
														autoComplete='postal-code'
														type='text'
														id='dropoff-postcode'
														name='drops[0].dropoffPostcode'
														className='form-control rounded-3 mb-2'
														onBlur={handleBlur}
														onChange={handleChange}
													/>
												</div>
											</div>
											<div className='row mt-1'>
												<div className='col-12'>
													<label htmlFor='dropoff-datetime' className='mb-1'>
														Dropoff At
													</label>
													{values.packagePickupStartTime ? (
														<input
															disabled={
																values.packageDeliveryType === DELIVERY_TYPES.ON_DEMAND
															}
															id='dropoff-datetime'
															name='drops[0].packageDropoffStartTime'
															type='datetime-local'
															className='form-control form-border rounded-3 mb-3'
															placeholder='Dropoff At'
															aria-label='dropoff-datetime'
															onChange={handleChange}
															onBlur={handleBlur}
															min={moment(values.packagePickupStartTime)
																.subtract(1, 'minute')
																.format('YYYY-MM-DDTHH:mm')}
															max={moment(values.packagePickupStartTime)
																.add(1, 'days')
																.format('YYYY-MM-DDTHH:mm')}
															required={
																values.packageDeliveryType !== DELIVERY_TYPES.ON_DEMAND
															}
														/>
													) : (
														<input
															disabled={
																values.packageDeliveryType === DELIVERY_TYPES.ON_DEMAND
															}
															id='dropoff-datetime'
															name='drops[0].packageDropoffStartTime'
															type='datetime-local'
															className='form-control form-border rounded-3 mb-3'
															placeholder='Dropoff At'
															aria-label='dropoff-datetime'
															onChange={handleChange}
															onBlur={handleBlur}
															min={moment().format('YYYY-MM-DDTHH:mm')}
															max={moment().add('30', 'days').format('YYYY-MM-DDTHH:mm')}
														/>
													)}
												</div>
											</div>
											<label htmlFor='dropoff-instructions' className='mb-1'>
												Dropoff Instructions
											</label>
											<textarea
												name='drops[0].dropoffInstructions'
												className='form-control form-border rounded-3 mb-3'
												aria-label='dropoff-instructions'
												onChange={handleChange}
												onBlur={handleBlur}
											/>
										</div>
									)}
								</div>
								<div className='my-3 d-flex justify-content-center'>
									{error.message && (
										<div className='alert alert-danger text-center w-75'>{error.message}</div>
									)}
								</div>
								<div className='d-flex pt-3 justify-content-end'>
									<div>
										<Button
											type='submit'
											name={SUBMISSION_TYPES.GET_QUOTE}
											value={SUBMISSION_TYPES.GET_QUOTE}
											variant='dark'
											size='lg'
											className='mx-3'
											disabled={values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP}
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
											disabled={
												values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP &&
												dropoffs.length < 5
											}
											onClick={() =>
												values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP &&
												dropoffs.length < 5 &&
												alert('Please add at least 5 dropoffs before creating a multi drop')
											}
										>
											Confirm
										</Button>
									</div>
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
