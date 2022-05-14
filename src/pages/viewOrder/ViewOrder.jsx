import './viewOrder.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { assignDriver, createDeliveryJob, subscribe, unsubscribe, updateDelivery } from '../../store/actions/delivery';
import { addError, removeError } from '../../store/actions/errors';
import { Mixpanel } from '../../config/mixpanel';
import Modal from 'react-bootstrap/Modal';
import ReorderForm from './modals/ReorderForm';
import DeliveryJob from '../../modals/DeliveryJob';
import LoadingOverlay from 'react-loading-overlay';
import { capitalize, parseAddress, validateAddress } from '../../helpers';
import { geocodeByAddress } from 'react-google-places-autocomplete';
import Item from './components/Item';
import Card from './components/Card';
import Panel from './components/Panel';
import Map from '../../components/Map/Map';
import ConfirmCancel from './modals/ConfirmCancel';
import { PROVIDERS, STATUS, SUBMISSION_TYPES } from '../../constants';
import { useIntercom } from 'react-use-intercom';
import { jobRequestSchema } from '../../schemas';
import SelectDriver from '../../modals/SelectDriver';
import ConfirmProvider from '../../modals/ConfirmProvider';
import DeliveryProof from './modals/DeliveryProof';
import { downloadDeliveryProof } from '../../store/actions/auth';
import SuccessMessage from '../../modals/SuccessMessage';
import UpdateJob from './modals/UpdateJob';

const ViewOrder = props => {
	const dispatch = useDispatch();
	const { firstname, lastname, email, company, phone, apiKey } = useSelector(state => state['currentUser'].user);
	const drivers = useSelector(state => state['driversStore']);
	const error = useSelector(state => state['errors']);
	const { allJobs } = useSelector(state => state['deliveryJobs']);
	const [message, showMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [confirmCancel, showCancelDialog] = useState(false);
	const [confirmDialog, showConfirmDialog] = useState(false);
	const [reorderForm, showReOrderForm] = useState(false);
	const [proofModal, showProofModal] = useState(false);
	const [loadingText, setLoadingText] = useState('');
	const [jobModal, showJobModal] = useState(false);
	const [driversModal, showDriversModal] = useState(false);
	const [updateModal, showUpdateModal] = useState(false);
	const [activeIndex, setIndex] = useState(0);
	const [deliveryJob, setJob] = useState({});
	const [deliveryParams, setDeliveryParams] = useState({
		...jobRequestSchema
	});
	const [deliverySignature, setSignature] = useState('');
	const [deliveryPhoto, setPhoto] = useState('');
	const [provider, selectProvider] = useState({ type: '', id: '', name: '' });
	const modalRef = useRef(null);
	const { boot, shutdown } = useIntercom();

	const order = useMemo(() => {
		const orderID = props.location['pathname'].split('/').reverse()[0];
		return allJobs
			.filter(job => job['jobSpecification']['orderNumber'] === orderID)
			.map(
				({
					_id,
					status,
					jobSpecification: { deliveries, pickupStartTime, jobReference, pickupLocation },
					selectedConfiguration: { providerId, deliveryFee },
					driverInformation: { name: driverName, phone: driverPhone, transport: driverVehicle, location },
					createdAt
				}) => {
					createdAt = moment(createdAt).format('DD/MM/YYYY HH:mm:ss');
					return {
						id: _id,
						reference: jobReference,
						createdAt,
						status,
						providerId,
						deliveryFee,
						driverName,
						driverPhone,
						driverVehicle,
						driverLocation: location,
						pickupLocation,
						pickupStartTime,
						deliveries
					};
				}
			)[0];
	}, [allJobs]);

	const delivery = useMemo(() => {
		return order.deliveries
			? order.deliveries.map(({ orderReference, dropoffEndTime, dropoffLocation, trackingURL, description, status, proofOfDelivery }) => ({
					dropoffEndTime: dropoffEndTime,
					firstName: dropoffLocation.firstName,
					lastName: dropoffLocation.lastName,
					email: dropoffLocation.email,
					latitude: dropoffLocation.latitude,
					longitude: dropoffLocation.longitude,
					phoneNumber: dropoffLocation.phoneNumber,
					address: dropoffLocation.fullAddress,
					streetAddress: dropoffLocation.streetAddress,
					city: dropoffLocation.city,
					postcode: dropoffLocation.postcode,
					proofOfDelivery,
					orderReference,
					trackingURL,
					description,
					status
			  }))[activeIndex]
			: [];
	}, [order, activeIndex]);

	const markers = useMemo(() => {
		if (order && order.deliveries) {
			let result = [];
			let pickupCoords = [order.pickupLocation.longitude, order.pickupLocation.latitude];
			result.push(pickupCoords);
			let deliveryCoords = [delivery.longitude, delivery.latitude];
			result.push(deliveryCoords);
			/// check if courier coords have been sent
			if (order.driverLocation && order.driverLocation.coordinates && order.driverLocation.coordinates.length === 2)
				result.push(order.driverLocation.coordinates);
			return result;
		}
		return [
			[0, 0],
			[0, 0]
		];
	}, [order, activeIndex]);

	const stuartWidget = useCallback(() => {
		console.log('booting intercom widget....');
		return boot({
			name: `${firstname} ${lastname}`,
			email: email,
			company: company,
			phone: phone,
			userId: process.env.REACT_APP_STUART_USER_ID,
			userHash: process.env.REACT_APP_STUART_USER_HASH
		});
	}, [boot]);

	useEffect(() => {
		apiKey && dispatch(subscribe(apiKey, email));
		if (order && order.providerId === PROVIDERS.PRIVATE && order.status === STATUS.COMPLETED) {
			dispatch(downloadDeliveryProof(email, delivery.proofOfDelivery.signature.filename)).then(img => setSignature(img));
			dispatch(downloadDeliveryProof(email, delivery.proofOfDelivery.photo.filename)).then(img => setPhoto(img));
		}
		return () => {
			apiKey && dispatch(unsubscribe());
			console.log('shutting down intercom widget....');
			shutdown();
		};
	}, []);

	useEffect(() => {
		order && order.providerId === PROVIDERS.STUART && stuartWidget();
	}, [order.providerId, stuartWidget]);

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		dispatch(removeError());
	}, [props.location]);

	const errorModal = (
		<Modal
			show={!!error.message}
			container={modalRef}
			onHide={() => dispatch(removeError())}
			size='lg'
			aria-labelledby='example-custom-modal-styling-title'
		>
			<div className='alert alert-danger mb-0' role='alert'>
				<h3 className='text-center'>{error.message}</h3>
			</div>
		</Modal>
	);

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
				const index = drops.indexOf(drop);
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

	const handleSubmit = async values => {
		showReOrderForm(false);
		try {
			if (values.type === SUBMISSION_TYPES.ASSIGN_DRIVER) {
				setLoadingText('Checking available drivers...');
				setLoading(true);
				try {
					values = await handleAddresses(values);
					setDeliveryParams(prevState => ({ ...values }));
					setLoading(false);
					showDriversModal(true);
				} catch (err) {
					setLoading(false);
					console.log(err);
				}
			} else {
				setLoadingText('Creating Order...');
				setLoading(true);
				values = await handleAddresses(values);
				console.log(values);
				const {
					jobSpecification: {
						deliveries,
						orderNumber,
						pickupLocation: { fullAddress: pickupAddress },
						pickupStartTime
					},
					selectedConfiguration: { deliveryFee, providerId }
				} = await dispatch(createDeliveryJob(values, apiKey));
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
					dropoffUntil: moment(dropoffEndTime).format('DD-MM-YYYY HH:mm:ss'),
					deliveryFee,
					fleetProvider: providerId.replace(/_/g, ' ')
				};
				setLoading(false);
				setJob(newJob);
				showJobModal(true);
			}
		} catch (err) {
			setLoading(false);
			console.log(err);
			err ? dispatch(addError(err.message)) : dispatch(addError('Api endpoint could not be accessed!'));
		}
	};

	const confirmProvider = () => {
		setLoadingText('Creating Order');
		showConfirmDialog(false);
		setLoading(true);
		assign(provider.id);
	};

	const assign = useCallback(
		driverId => {
			setLoadingText('Creating Order');
			setLoading(true);
			dispatch(assignDriver(deliveryParams, apiKey, driverId))
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
						setLoading(false);
						setJob(newJob);
						showJobModal(true);
					}
				)
				.catch(err => {
					setLoading(false);
					console.log(err);
					err ? dispatch(addError(err.message)) : dispatch(addError('Api endpoint could not be accessed!'));
				});
		},
		[deliveryParams, provider]
	);

	return (
		<LoadingOverlay active={loading} spinner classNamePrefix='view_order_loading_' text={loadingText}>
			<div ref={modalRef} className='container-fluid my-auto'>
				<ReorderForm show={reorderForm} toggleShow={showReOrderForm} onSubmit={handleSubmit} prevJob={order} />
				<DeliveryJob job={deliveryJob} show={jobModal} onHide={showJobModal} />
				<ConfirmCancel show={confirmCancel} toggleShow={showCancelDialog} orderId={order.id} showMessage={showMessage} />
				<SelectDriver
					show={driversModal}
					onHide={() => showDriversModal(false)}
					drivers={drivers}
					selectDriver={selectProvider}
					showConfirmDialog={showConfirmDialog}
					createUnassigned={assign}
				/>
				<UpdateJob
					deliveryDetails={delivery}
					show={updateModal}
					onHide={() => showUpdateModal(false)}
					onSubmit={data => {
						data.fullAddress = `${data.addressLine1} ${data.addressLine2} ${data.city} ${data.postcode}`;
						dispatch(updateDelivery(apiKey, order.id, data))
							.then(res => {
								showUpdateModal(false);
								showMessage('Job Updated Successfully!');
							})
							.catch(err => showUpdateModal(false));
					}}
				/>
				<ConfirmProvider show={confirmDialog} provider={provider} toggleShow={showConfirmDialog} onConfirm={confirmProvider} />
				<DeliveryProof show={proofModal} onHide={showProofModal} signature={deliverySignature} photo={deliveryPhoto} />
				<SuccessMessage ref={modalRef} show={!!message} onHide={() => showMessage('')} message={message} />
				{errorModal}
				<div className='row mx-5'>
					<div className='col-4'>
						<div className='row d-flex justify-content-end'>
							<Card styles='border position-relative'>
								<Item label='Customer name' value={`${delivery.firstName} ${delivery.lastName}`} styles='my-2' />
								<Item label='Address' value={delivery.address} styles='my-2' />
								<Item label='Email' value={delivery.email} styles='my-2' />
								<Item label='Phone number' value={delivery.phoneNumber} styles='my-2' />
								{![STATUS.COMPLETED, STATUS.CANCELLED].includes(order.status) &&
									[PROVIDERS.PRIVATE, PROVIDERS.UNASSIGNED].includes(order.providerId) && (
										<div className='position-absolute bottom-0 end-0 p-3'>
											<button className='btn btn-outline-info' onClick={() => showUpdateModal(true)}>
												Update
											</button>
										</div>
									)}
							</Card>
						</div>
						<div className='row d-flex justify-content-end'>
							<Card styles='mt-3 border position-relative'>
								<Item
									label='Delivery provider'
									value={order.providerId}
									type={[PROVIDERS.PRIVATE, PROVIDERS.UNASSIGNED].includes(order.providerId) ? undefined : 'image'}
									styles='my-2'
								/>
								<Item label='Driver name' value={order.driverName} styles='my-2' />
								<Item label='Phone number' value={order.driverPhone} styles='my-2' />
								<Item label='Transport' value={order.driverVehicle} styles='my-2' />
								{order.status === STATUS.COMPLETED && order.providerId === PROVIDERS.PRIVATE && (
									<div className='position-absolute bottom-0 end-0 p-3'>
										<button className='btn btn-outline-success' onClick={() => showProofModal(true)}>
											Proof of Delivery
										</button>
									</div>
								)}
							</Card>
						</div>
					</div>
					<div className='col-8'>
						<Card styles='border-top border-end border-start'>
							<div className='d-flex justify-content-between my-2'>
								<Item label='Job Reference' value={order.reference} />
								<div>
									{delivery.trackingURL && (
										<a href={delivery.trackingURL} target='_blank' className='btn btn-outline-primary me-3'>
											Track
										</a>
									)}
									{order.status && order.status.toUpperCase() === STATUS.CANCELLED && order.deliveries.length < 2 ? (
										<button className='btn btn-outline-info' onClick={() => showReOrderForm(true)}>
											Re-order
										</button>
									) : order.status && ![STATUS.COMPLETED, STATUS.CANCELLED].includes(order.status.toUpperCase()) ? (
										<button className='btn btn-outline-secondary' onClick={() => showCancelDialog(true)}>
											Cancel Order
										</button>
									) : null}
								</div>
							</div>
							<div className='d-flex mt-2 mb-3 justify-content-evenly'>
								<Panel
									label='Delivery ETA'
									value={
										order.status === STATUS.CANCELLED
											? 'Cancelled'
											: !delivery.dropoffEndTime || order.providerId === PROVIDERS.UNASSIGNED
											? 'Estimating...'
											: moment(delivery.dropoffEndTime).diff(moment(), 'minutes') < 0
											? `Delivered`
											: `${moment().to(moment(delivery.dropoffEndTime))}`
									}
									styles='me-1'
								/>
								<Panel label='Price' value={`£${order.deliveryFee.toFixed(2)}`} styles='mx-2' />
								<Panel label='Status' value={capitalize(order.status)} styles='ms-1' />
							</div>
						</Card>
						<Map height={358} markers={markers} />
					</div>
				</div>
			</div>
		</LoadingOverlay>
	);
};

export default ViewOrder;
