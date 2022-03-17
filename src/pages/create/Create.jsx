import './create.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { geocodeByAddress } from 'react-google-places-autocomplete';
import Select, { components } from 'react-select';
import moment from 'moment';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Mixpanel } from '../../config/mixpanel';
// functions
import { assignDriver, createDeliveryJob, createMultiDropJob, getAllQuotes, removeDropoff, setDropoffs } from '../../store/actions/delivery';
import { getAllDrivers, subscribe, unsubscribe } from '../../store/actions/drivers';
import { parseAddress, validateAddress } from '../../helpers';
import { addError, removeError } from '../../store/actions/errors';
//constants
import { DELIVERY_TYPES, PROVIDER_TYPES, SUBMISSION_TYPES, VEHICLE_TYPES } from '../../constants';
// components
import ErrorField from '../../components/ErrorField';
// assets
import { jobRequestSchema } from '../../schemas';
import { CreateOrderSchema } from '../../validation';
import bicycle from '../../assets/img/bicycle.svg';
import motorbike from '../../assets/img/motorbike.svg';
import car from '../../assets/img/car.svg';
import cargobike from '../../assets/img/cargobike.svg';
import van from '../../assets/img/van.svg';
// modals
import CSVUpload from '../../modals/CSVUpload';
import Quotes from '../../modals/Quotes';
import ConfirmProvider from '../../modals/ConfirmProvider';
import ApiKeyAlert from '../../modals/ApiKeyAlert';
import DeliveryJob from '../../modals/DeliveryJob';
import MultiDropQuote from '../../modals/MultiDropQuote';
import NewDropoffForm from '../../modals/NewDropoffForm';
import Drivers from '../../modals/Drivers';

const Create = props => {
	const csvUploadRef = useRef(null);
	const [deliveryJob, setJob] = useState({});
	const [jobModal, showJobModal] = useState(false);
	const [isLoading, setLoadingModal] = useState(false);
	const [confirmDialog, showConfirmDialog] = useState(false);
	const [multiDropDialog, showMultiDropDialog] = useState(false);
	const [dropoffModal, showDropoffModal] = useState(false);
	const [pickupDatetime, setPickupDatetime] = useState('');
	const [deliveryParams, setDeliveryParams] = useState({
		...jobRequestSchema
	});
	const [toastMessage, setToast] = useState('');
	const [provider, selectProvider] = useState({ type: '', id: '', name: '' });
	const [loadingText, setLoadingText] = useState('');
	const [quoteModal, showQuoteModal] = useState(false);
	const [driversModal, showDriversModal] = useState(false);
	const [quotes, setQuotes] = useState([]);
	const [uploadCSV, showCSVUpload] = useState(false);
	const [isLocked, setLock] = useState(true);
	// handlers
	const handleClose = () => showJobModal(false);
	const handleOpen = () => showJobModal(true);
	// redux slices
	const { firstname, lastname, email, company, apiKey, phone, address } = useSelector(state => state['currentUser'].user);
	const drivers = useSelector(state => state['driversStore'])
	const error = useSelector(state => state['errors']);
	const { dropoffs } = useSelector(state => state['addressHistory']);
	const dispatch = useDispatch();

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		dispatch(subscribe(email))
		return () => dispatch(unsubscribe())
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

	const validateAddresses = useCallback(validateAddress, []);

	const handleAddresses = useCallback(
		async values => {
			const { pickupAddressLine1, pickupAddressLine2, pickupCity, pickupPostcode, drops } = values;
			values.pickupAddress = `${pickupAddressLine1} ${pickupAddressLine2} ${pickupCity} ${pickupPostcode}`;
			let pickupAddressComponents = await geocodeByAddress(values.pickupAddress);
			let pickupFormattedAddress = getParsedAddress(pickupAddressComponents);
			values.pickupAddressLine1 = pickupFormattedAddress.street;
			values.pickupCity = pickupFormattedAddress.city;
			values.pickupPostcode = pickupFormattedAddress.postcode;
			values.latitude = pickupFormattedAddress.latitude;
			values.longitude = pickupFormattedAddress.longitude;
			for (const drop of drops) {
				let index = drops.indexOf(drop);
				console.table(drop);
				console.log('INDEX', index);
				values.drops[
					index
				].dropoffAddress = `${drop.dropoffAddressLine1} ${drop.dropoffAddressLine2} ${drop.dropoffCity} ${drop.dropoffPostcode}`;
				let dropoffAddressComponents = await geocodeByAddress(values.drops[index].dropoffAddress);
				let dropoffFormattedAddress = getParsedAddress(dropoffAddressComponents);
				// check if postcode from geocoding is different to original postcode
				// if so change back to original postcode
				if (drop.dropoffPostcode !== dropoffFormattedAddress.postcode) {
					dropoffFormattedAddress.postcode = drop.dropoffPostcode;
				}
				values.drops[index].dropoffAddressLine1 = dropoffFormattedAddress.street;
				values.drops[index].dropoffCity = dropoffFormattedAddress.city;
				values.drops[index].dropPostcode = dropoffFormattedAddress.postcode;
				values.drops[index].latitude = dropoffFormattedAddress.latitude;
				values.drops[index].longitude = dropoffFormattedAddress.longitude;
				validateAddresses(pickupFormattedAddress, dropoffFormattedAddress);
			}
			return values;
		},
		[getParsedAddress, validateAddresses]
	);

	const confirmMultiDropQuote = () => {
		showMultiDropDialog(false);
		setLoadingText('Creating Order');
		showConfirmDialog(false);
		setLoadingModal(true);
		dispatch(createMultiDropJob(deliveryParams, apiKey))
			.then(
				({
					jobSpecification: {
						deliveries,
						orderNumber,
						pickupLocation: { fullAddress: pickupAddress },
						pickupStartTime
					},
					selectedConfiguration: { deliveryFee, providerId }
				}) => {
					let {
						dropoffLocation: { fullAddress: dropoffAddress },
						dropoffEndTime,
						orderReference: customerReference
					} = deliveries[0];
					let newJob = {
						orderNumber,
						customerReference,
						pickupAddress,
						dropoffAddress,
						pickupFrom: moment(pickupStartTime).format('DD-MM-YYYY HH:mm:ss'),
						deliverUntil: moment(dropoffEndTime).format('DD-MM-YYYY HH:mm:ss'),
						deliveryFee,
						courier: providerId.replace(/_/g, ' ')
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

	const confirmProvider = () => {
		setLoadingText('Creating Order');
		showConfirmDialog(false);
		setLoadingModal(true);
		provider.type === PROVIDER_TYPES.COURIER
			? dispatch(createDeliveryJob(deliveryParams, apiKey, provider.id))
					.then(
						({
							jobSpecification: {
								deliveries,
								orderNumber,
								pickupLocation: { fullAddress: pickupAddress },
								pickupStartTime
							},
							selectedConfiguration: { deliveryFee, providerId }
						}) => {
							let {
								dropoffLocation: { fullAddress: dropoffAddress },
								dropoffEndTime,
								orderReference: customerReference
							} = deliveries[0];
							let newJob = {
								orderNumber,
								customerReference,
								pickupAddress,
								dropoffAddress,
								pickupFrom: moment(pickupStartTime).format('DD-MM-YYYY HH:mm:ss'),
								deliverUntil: moment(dropoffEndTime).format('DD-MM-YYYY HH:mm:ss'),
								deliveryFee,
								courier: providerId.replace(/_/g, ' ')
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
					})
			: dispatch(assignDriver(deliveryParams, apiKey, provider.id))
					.then(
						({
							jobSpecification: {
								deliveries,
								orderNumber,
								pickupLocation: { fullAddress: pickupAddress },
								pickupStartTime
							},
							selectedConfiguration: { deliveryFee },
							driverInformation: { name }
						}) => {
							let {
								dropoffLocation: { fullAddress: dropoffAddress },
								dropoffEndTime,
								orderReference: customerReference
							} = deliveries[0];
							let newJob = {
								orderNumber,
								customerReference,
								pickupAddress,
								dropoffAddress,
								pickupFrom: moment(pickupStartTime).format('DD-MM-YYYY HH:mm:ss'),
								deliverUntil: moment(dropoffEndTime).format('DD-MM-YYYY HH:mm:ss'),
								deliveryFee,
								courier: name.replace(/_/g, ' ')
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

	return (
		<LoadingOverlay active={isLoading} spinner text={loadingText} className='pt-2' classNamePrefix='create_loader_'>
			<DeliveryJob job={deliveryJob} show={jobModal} onHide={showJobModal} />
			<ApiKeyAlert message={toastMessage} onClose={setToast} />
			<MultiDropQuote show={multiDropDialog} toggleShow={showMultiDropDialog} numDropoffs={dropoffs.length} confirm={confirmMultiDropQuote} />
			<NewDropoffForm show={dropoffModal} toggleShow={showDropoffModal} pickupDateTime={pickupDatetime} />
			<ConfirmProvider show={confirmDialog} provider={provider} toggleShow={showConfirmDialog} onConfirm={confirmProvider} />
			<Quotes
				show={quoteModal}
				toggleShow={showQuoteModal}
				quotes={quotes}
				selectCourier={selectProvider}
				showConfirmDialog={showConfirmDialog}
			/>
			<Drivers
				show={driversModal}
				toggleShow={showDriversModal}
				drivers={drivers}
				selectDriver={selectProvider}
				showConfirmDialog={showConfirmDialog}
			/>
			<CSVUpload
				show={uploadCSV}
				ref={csvUploadRef}
				hide={() => showCSVUpload(false)}
				handleRemoveFile={() => console.log('File removed')}
				handleOnError={err => console.log(err)}
				handleOnDrop={drops => {
					let dropoff = {};
					let { data: keys } = drops.shift();
					if (drops.length > 8) {
						drops = drops.slice(0, 8);
						setToast(`Multi-drop only supports a maximum of 8 dropoffs`);
					}
					keys.forEach(key => (dropoff[key] = ''));
					let dropoffs = drops.map(({ data }) => {
						let dropoff = {};
						data.forEach((item, index) => {
							let key = keys[index];
							if (key === 'packageDropoffEndTime') {
								item = moment(item, 'DD/MM/YYYY HH:mm').format();
							}
							dropoff[key] = item;
						});
						return dropoff;
					});
					console.log(dropoffs);
					dispatch(setDropoffs(dropoffs));
				}}
				handleOpenDialog={res => console.log(res)}
			/>
			<div className='container-fluid my-auto'>
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
						pickupPostcode: address.postcode
					}}
					validationSchema={CreateOrderSchema}
					validateOnChange={false}
					validateOnBlur={false}
					onSubmit={async (values, actions) => {
						if (apiKey) {
							if (values.type === SUBMISSION_TYPES.GET_QUOTE) {
								setLoadingText('Getting Quote');
								setLoadingModal(true);
								try {
									if (values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP) {
										values.drops = dropoffs;
										values = await handleAddresses(values);
										setDeliveryParams(prevState => ({ ...values }));
										setLoadingModal(false);
										showMultiDropDialog(true);
									} else {
										values = await handleAddresses(values);
										setDeliveryParams(prevState => ({ ...values }));
										const {
											quotes,
											bestQuote: { id }
										} = await dispatch(getAllQuotes(apiKey, values));
										setQuotes(quotes);
										setLoadingModal(false);
										showQuoteModal(true);
									}
								} catch (err) {
									setLoadingModal(false);
									console.error(err);
								}
							} else {
								setLoadingText('Checking available drivers...');
								setLoadingModal(true);
								try {
									values = await handleAddresses(values);
									setDeliveryParams(prevState => ({ ...values }));
									setLoadingModal(false);
									showDriversModal(true);
								} catch (err) {
									setLoadingModal(false);
									console.log(err);
								}
							}
						} else {
							setLoadingModal(false);
							setToast('Your account does not have an API key associated with it. Please generate one from the integrations page');
						}
					}}
				>
					{({ values, handleBlur, handleChange, handleSubmit, errors, setFieldValue }) => (
						<form
							onSubmit={e => {
								const { name, value } = e.nativeEvent['submitter'];
								name === SUBMISSION_TYPES.GET_QUOTE || value === SUBMISSION_TYPES.GET_QUOTE
									? setFieldValue('type', SUBMISSION_TYPES.GET_QUOTE)
									: setFieldValue('type', SUBMISSION_TYPES.ASSIGN_DRIVER);
								handleSubmit(e);
							}}
							autoComplete='on'
							className='container-fluid overflow-hidden'
						>
							<div className='row mx-1'>
								<div className='col-6'>
									<div className='border border-2 rounded-3 d-flex flex-column px-4 pt-3 pb-4'>
										<h4>Delivery Type</h4>
										<div className='d-flex mt-2 justify-content-center'>
											<div className='form-check mb-2'>
												<input
													className='form-check-input'
													type='radio'
													name='deliveryType'
													id='radio-1'
													checked={values.packageDeliveryType === DELIVERY_TYPES.ON_DEMAND}
													onChange={e => {
														setFieldValue('packageDeliveryType', DELIVERY_TYPES.ON_DEMAND);
														setFieldValue('packagePickupStartTime', '');
														setFieldValue('drops[0].packageDropoffEndTime', '');
													}}
													onBlur={handleBlur}
												/>
												<label className='form-check-label' htmlFor='radio-1'>
													On Demand
												</label>
											</div>

											<div className='form-check mb-2 mx-4'>
												<input
													className='form-check-input'
													type='radio'
													name='deliveryType'
													id='radio-2'
													checked={values.packageDeliveryType === DELIVERY_TYPES.SAME_DAY}
													onChange={e => setFieldValue('packageDeliveryType', DELIVERY_TYPES.SAME_DAY)}
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
													checked={values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP}
													onChange={e => setFieldValue('packageDeliveryType', DELIVERY_TYPES.MULTI_DROP)}
													onBlur={handleBlur}
												/>
												<label className='form-check-label' htmlFor='radio-2'>
													Multi drop
												</label>
											</div>
											<ErrorField name='packageDeliveryType' classNames='mt-2' />
										</div>
										<div className='mt-2 mb-2' />
										<div className='d-flex justify-content-between align-items-center'>
											<h4>Pickup</h4>
											<div
												className='btn btn-sm btn-outline-primary me-1'
												onClick={() => {
													setLock(!isLocked);
													console.log(values);
												}}
											>
												Edit
											</div>
										</div>
										<div className='row'>
											<div className='col-md-6 col-lg-6 pb-xs-4'>
												<label className='mb-1' htmlFor='address-line-1'>
													<span>
														{errors['pickupAddressLine1'] && <span className='text-danger'>*&nbsp;</span>}
														Address line 1
													</span>
												</label>
												<input
													defaultValue={values.pickupAddressLine1}
													autoComplete='address-line1'
													type='text'
													id='address-line-1'
													name='pickupAddressLine1'
													className='form-control  rounded-3 mb-2'
													onBlur={handleBlur}
													onChange={handleChange}
													disabled={isLocked}
												/>
											</div>
											<div className='col-md-6 col-lg-6 pb-xs-4'>
												<label className='mb-1' htmlFor='address-line-2'>
													<span>
														{errors['pickupAddressLine2'] && <span className='text-danger'>*&nbsp;</span>}
														Address line 2
													</span>
												</label>
												<input
													defaultValue={values.pickupAddressLine2}
													autoComplete='address-line2'
													type='text'
													id='pickupAddressLine2'
													name='pickupAddress.addressLine2'
													className='form-control  rounded-3 mb-2'
													onBlur={handleBlur}
													onChange={handleChange}
													disabled={isLocked}
												/>
											</div>
										</div>
										<div className='row'>
											<div className='col-md-6 col-lg-6 pb-xs-4'>
												<label className='mb-1' htmlFor='city'>
													<span>
														{errors['pickupCity'] && <span className='text-danger'>*&nbsp;</span>}
														City
													</span>
												</label>
												<input
													defaultValue={values.pickupCity}
													autoComplete='address-level2'
													type='text'
													id='city'
													name='pickupCity'
													className='form-control  rounded-3 mb-2'
													onBlur={handleBlur}
													onChange={handleChange}
													disabled={isLocked}
												/>
											</div>
											<div className='col-md-6 col-lg-6 pb-xs-4'>
												<label className='mb-1' htmlFor='postcode'>
													<span>
														{errors['pickupPostcode'] && <span className='text-danger'>*&nbsp;</span>}
														Postcode
													</span>
												</label>
												<input
													defaultValue={values.pickupPostcode}
													autoComplete='postal-code'
													type='text'
													id='postcode'
													name='pickupPostcode'
													className='form-control  rounded-3 mb-2'
													onBlur={handleBlur}
													onChange={handleChange}
													disabled={isLocked}
												/>
											</div>
										</div>
										<div className='row'>
											<div className='col-6'>
												<label htmlFor='pickup-datetime' className='mb-1'>
													Pickup At
												</label>
												<input
													disabled={values.packageDeliveryType === DELIVERY_TYPES.ON_DEMAND}
													name='packagePickupStartTime'
													id='pickup-datetime'
													type='datetime-local'
													className='form-control  form-border rounded-3 mb-3'
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
											<div className='col-6'>
												<label htmlFor='pickup-instructions' className='mb-1'>
													Pickup Instructions
												</label>
												<textarea
													id='pickup-instructions'
													name='pickupInstructions'
													className='form-control  form-border rounded-3 mb-3'
													aria-label='pickup-instructions'
													onChange={handleChange}
													onBlur={handleBlur}
													rows={1}
												/>
											</div>
										</div>
										<div className='mt-2 mb-2' />
										<h4>Package Details</h4>
										<div className='row'>
											<div className='col-6'>
												<label htmlFor='items-count' className='mb-1'>
													<span>
														{errors['itemsCount'] && <span className='text-danger'>*&nbsp;</span>}
														Number of items
													</span>
												</label>
												<input
													id='items-count'
													name='itemsCount'
													type='number'
													className='form-control  form-border rounded-3 my-2'
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
														{errors['vehicleType'] && <span className='text-danger'>*&nbsp;</span>}
														Vehicle Type
													</span>
												</label>
												<Select
													menuPlacement='top'
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
													className='form-control  form-border rounded-3 my-2'
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
								<div className='col-6'>
									<div className='border border-2 rounded-3 d-flex flex-column px-4 py-3'>
										<h4>
											{values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP
												? 'Multi Drop (min. 5 dropoffs, max 8 dropoffs)'
												: 'Dropoff'}
										</h4>
										{values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP ? (
											<div>
												<ol className='list list-unstyled'>
													{dropoffs.map(
														(
															{
																dropoffFirstName,
																dropoffLastName,
																dropoffAddressLine1,
																dropoffPostcode,
																packageDropoffEndTime,
																dropoffPhoneNumber,
																dropoffPackageDescription
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
																		<span className='card-text'>{dropoffPhoneNumber}</span>
																	</span>
																	<div className='d-flex align-items-center justify-content-between'>
																		<small className='text-muted'>
																			{moment(packageDropoffEndTime).calendar()}
																		</small>
																		<div>
																			<button
																				type='button'
																				className='btn btn-sm btn-outline-danger'
																				onClick={() => dispatch(removeDropoff(index))}
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
												<div className='d-flex align-items-center'>
													<div
														className='btn btn-outline-primary'
														onClick={() =>
															dropoffs.length < 8
																? showDropoffModal(true)
																: setToast(`You cannot add more than 8 dropoff locations per multi drop`)
														}
													>
														Add Dropoff
													</div>
													<div className='ms-4 btn btn-outline-success' onClick={() => showCSVUpload(true)}>
														Upload CSV
													</div>
													<Link className='ms-4' to='/example.csv' target='_blank' download='template.csv'>
														Download CSV template
													</Link>
												</div>
												<div className='d-flex pt-3 justify-content-center'>
													<Button
														type='submit'
														name={SUBMISSION_TYPES.GET_QUOTE}
														value={SUBMISSION_TYPES.GET_QUOTE}
														variant='primary'
														size='lg'
														className='mx-3'
														disabled={values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP && dropoffs.length < 5}
														onClick={() =>
															values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP &&
															dropoffs.length < 5 &&
															alert('Please add at least 5 dropoffs before creating a multi drop')
														}
														style={{ width: '100%' }}
													>
														<span className='btn-text'>Outsource</span>
													</Button>
												</div>
											</div>
										) : (
											<div className='my-2'>
												<div className='row'>
													<div className='col-6'>
														<label htmlFor='dropoff-first-name' className='mb-1'>
															<span>
																{errors['drops'] && errors['drops'][0]['dropoffFirstName'] && (
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
															required
														/>
													</div>
													<div className='col-6'>
														<label htmlFor='dropoff-last-name' className='mb-1'>
															<span>
																{errors['drops'] && errors['drops'][0]['dropoffLastName'] && (
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
															required
														/>
													</div>
												</div>
												<div className='row mt-1'>
													<div className='col-6'>
														<label htmlFor='dropoff-email-address' className='mb-1'>
															<span>
																{errors['drops'] && errors['drops'][0]['dropoffEmailAddress'] && (
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
																{errors['drops'] && errors['drops'][0]['dropoffPhoneNumber'] && (
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
															required
														/>
													</div>
												</div>
												<div className='row mt-1'>
													<div className='col-md-6 col-lg-6 pb-xs-4'>
														<label className='mb-1' htmlFor='dropoff-address-line-1'>
															<span>
																{errors['drops'] && errors['drops'][0]['dropoffAddressLine1'] && (
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
															required
														/>
													</div>
													<div className='col-md-6 col-lg-6 pb-xs-4'>
														<label className='mb-1' htmlFor='dropoff-address-line-2'>
															<span>
																{errors['drops'] && errors['drops'][0]['dropoffAddressLine2'] && (
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
															required
														/>
													</div>
													<div className='col-md-6 col-lg-6 pb-xs-4'>
														<label className='mb-1' htmlFor='dropoff-postcode'>
															<span>
																{errors['drops'] && errors['drops'][0]['dropoffPostcode'] && (
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
															required
														/>
													</div>
												</div>
												<div className='row mt-1'>
													<div className='col-12'>
														<label htmlFor='dropoff-datetime' className='mb-1'>
															Dropoff Until
														</label>
														{values.packagePickupStartTime ? (
															<input
																disabled={values.packageDeliveryType === DELIVERY_TYPES.ON_DEMAND}
																id='dropoff-datetime'
																name='drops[0].packageDropoffEndTime'
																type='datetime-local'
																className='form-control form-border rounded-3 mb-3'
																placeholder='Dropoff Until'
																aria-label='dropoff-datetime'
																onChange={handleChange}
																onBlur={handleBlur}
																min={moment(values.packagePickupStartTime)
																	.subtract(1, 'minute')
																	.format('YYYY-MM-DDTHH:mm')}
																max={moment(values.packagePickupStartTime).add(1, 'days').format('YYYY-MM-DDTHH:mm')}
																required={values.packageDeliveryType !== DELIVERY_TYPES.ON_DEMAND}
															/>
														) : (
															<input
																disabled={values.packageDeliveryType === DELIVERY_TYPES.ON_DEMAND}
																id='dropoff-datetime'
																name='drops[0].packageDropoffEndTime'
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
												<div className='my-2 d-flex justify-content-center'>
													{error.message && <div className='alert alert-danger text-center w-75'>{error.message}</div>}
												</div>
												<div className='d-flex justify-content-evenly'>
													<div>
														<Button
															type='submit'
															name={SUBMISSION_TYPES.ASSIGN_DRIVER}
															value={SUBMISSION_TYPES.ASSIGN_DRIVER}
															variant='primary'
															size='lg'
															className='mx-3'
															disabled={values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP && dropoffs.length < 5}
															onClick={() =>
																values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP &&
																dropoffs.length < 5 &&
																alert('Please add at least 5 dropoffs before creating a multi drop')
															}
															style={{ width: 150 }}
														>
															<span className='btn-text'>Assign</span>
														</Button>
													</div>
													<div>
														<Button
															type='submit'
															name={SUBMISSION_TYPES.GET_QUOTE}
															value={SUBMISSION_TYPES.GET_QUOTE}
															variant='primary'
															size='lg'
															className='mx-3'
															disabled={values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP && dropoffs.length < 5}
															onClick={() =>
																values.packageDeliveryType === DELIVERY_TYPES.MULTI_DROP &&
																dropoffs.length < 5 &&
																alert('Please add at least 5 dropoffs before creating a multi drop')
															}
															style={{ width: 150 }}
														>
															<span className='btn-text'>Outsource</span>
														</Button>
													</div>
												</div>
											</div>
										)}
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
