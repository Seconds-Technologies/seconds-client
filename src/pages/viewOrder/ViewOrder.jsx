import './viewOrder.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { createDeliveryJob, subscribe, unsubscribe } from '../../store/actions/delivery';
import { addError, removeError } from '../../store/actions/errors';
import { Mixpanel } from '../../config/mixpanel';
import Modal from 'react-bootstrap/Modal';
import ReorderForm from './modals/ReorderForm';
import DeliveryJob from '../../modals/DeliveryJob';
import LoadingOverlay from 'react-loading-overlay';
import { parseAddress, validateAddress } from '../../helpers';
import { geocodeByAddress } from 'react-google-places-autocomplete';
import Item from './components/Item';
import Card from './components/Card';
import Panel from './components/Panel';
import Map from '../../components/Map/Map';
import ConfirmModal from './modals/ConfirmModal';
import { PROVIDERS, STATUS } from '../../constants';
import { useIntercom } from 'react-use-intercom';

const ViewOrder = props => {
	const dispatch = useDispatch();
	const { firstname, lastname, email, apiKey } = useSelector(state => state['currentUser'].user);
	const error = useSelector(state => state['errors']);
	const { allJobs } = useSelector(state => state['deliveryJobs']);
	// const [order, setOrder] = useState({});
	const [message, showMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [confirmDialog, showConfirmDialog] = useState(false);
	const [reorderForm, showReOrderForm] = useState(false);
	const [jobModal, showJobModal] = useState(false);
	const [activeIndex, setIndex] = useState(0);
	const [deliveryJob, setJob] = useState({});
	const modalRef = useRef(null);
	const { boot, hide } = useIntercom();

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
						status: status[0].toUpperCase() + status.toLowerCase().slice(1),
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
			? order.deliveries.map(({ orderReference, dropoffEndTime, dropoffLocation, trackingURL, description, status }) => ({
					dropoffEndTime: dropoffEndTime,
					firstName: dropoffLocation.firstName,
					lastName: dropoffLocation.lastName,
					email: dropoffLocation.email,
					latitude: dropoffLocation.latitude,
					longitude: dropoffLocation.longitude,
					phoneNumber: dropoffLocation.phoneNumber,
					address: dropoffLocation.fullAddress,
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
		console.log('booting stuart widget...');
		return boot({
			email: 'secondsdelivery@gmail.com',
			userId: process.env.REACT_APP_STUART_USER_ID,
			userHash: process.env.REACT_APP_STUART_USER_HASH
		});
	}, [boot]);

	useEffect(() => {
		console.table({ COURIER: order.providerId });
	}, [order]);

	useEffect(() => {
		apiKey && dispatch(subscribe(apiKey, email));
		stuartWidget();
		return () => {
			apiKey && dispatch(unsubscribe());
			hide()
		}
	}, []);

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		dispatch(removeError());
	}, [props.location]);

	const successModal = (
		<Modal
			show={!!message}
			container={modalRef}
			onHide={() => showMessage('')}
			size='lg'
			aria-labelledby='example-custom-modal-styling-title'
			// className='alert alert-success' //Add class name here
		>
			<div className='alert alert-success mb-0'>
				<h2 className='text-center'>{message}</h2>
			</div>
		</Modal>
	);

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

	const handleSubmit = async (values, actions) => {
		showReOrderForm(false);
		setLoading(true);
		try {
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
		} catch (err) {
			setLoading(false);
			console.log(err);
			err ? dispatch(addError(err.message)) : dispatch(addError('Api endpoint could not be accessed!'));
		}
	};

	return (
		<LoadingOverlay active={loading} spinner classNamePrefix='view_order_loading_' text='Creating Order'>
			<div ref={modalRef} className='viewOrder bg-light pt-2 pb-1 px-5'>
				<ReorderForm show={reorderForm} toggleShow={showReOrderForm} onSubmit={handleSubmit} prevJob={order} />
				<DeliveryJob job={deliveryJob} show={jobModal} onHide={showJobModal} />
				<ConfirmModal show={confirmDialog} toggleShow={showConfirmDialog} orderId={order.id} showMessage={showMessage} />
				{successModal}
				{errorModal}
				<div className='row mx-5'>
					<div className='col-4'>
						<div className='row d-flex justify-content-end'>
							<Card styles>
								<Item label='Customer name' value={`${delivery.firstName} ${delivery.lastName}`} styles='my-2' />
								<Item label='Address' value={delivery.address} styles='my-2' />
								<Item label='Email' value={delivery.email} styles='my-2' />
								<Item label='Phone number' value={delivery.phoneNumber} styles='my-2' />
							</Card>
						</div>
						<div className='row d-flex justify-content-end'>
							<Card styles='mt-3'>
								<Item label='Delivery provider' value={order.providerId} type='image' styles='my-2' />
								<Item label='Driver name' value={order.driverName} styles='my-2' />
								<Item label='Phone number' value={order.driverPhone} styles='my-2' />
								<Item label='Transport' value={order.driverVehicle} styles='my-2' />
							</Card>
						</div>
					</div>
					<div className='col-8'>
						<Card>
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
										<button className='btn btn-outline-secondary' onClick={() => showConfirmDialog(true)}>
											Cancel Order
										</button>
									) : null}
								</div>
							</div>
							<div className='d-flex mt-2 mb-3 justify-content-evenly'>
								<Panel
									label='Delivery ETA'
									value={
										!delivery.dropoffEndTime
											? 'Estimating...'
											: moment(delivery.dropoffEndTime).diff(moment(), 'minutes') < 0
											? `Delivered`
											: `${moment().to(moment(delivery.dropoffEndTime))}`
									}
									styles='me-1'
								/>
								<Panel label='Price' value={`£${order.deliveryFee.toFixed(2)}`} styles='mx-2' />
								<Panel label='Status' value={order.status} styles='ms-1' />
							</div>
						</Card>
						<Map height={340} markers={markers} />
					</div>
				</div>
			</div>
		</LoadingOverlay>
	);
};

export default ViewOrder;
