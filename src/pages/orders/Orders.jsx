import './Orders.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BACKGROUND, DELIVERY_TYPES, DISPATCH_MODES, PATHS, PROVIDERS, STATUS, STATUS_COLOURS } from '../../constants';
import { getAllQuotes, manuallyDispatchJob, optimizeRoutes, subscribe, unsubscribe } from '../../store/actions/delivery';
import { removeError } from '../../store/actions/errors';
import { Mixpanel } from '../../config/mixpanel';
import moment from 'moment';
// images
import stuart from '../../assets/img/stuart.svg';
import gophr from '../../assets/img/gophr.svg';
import streetStream from '../../assets/img/street-stream.svg';
import ecofleet from '../../assets/img/ecofleet.svg';
import privateCourier from '../../assets/img/courier.svg';
// components & modals
import CustomToolbar from '../../components/CustomToolbar';
import RouteOptimization from './modals/RouteOptimization';
import ManualDispatch from './modals/ManualDispatch';
import Error from '../../modals/Error';
import Loading from './modals/Loading';
import ReviewOrders from './modals/ReviewOrders';
import OptimizationResult from './modals/OptimizationResult';
import { StyledButton } from './components/CustomSelect';
import AssignModal from './modals/AssignModal';
import SelectDriver from '../../modals/SelectDriver';
import { jobRequestSchema } from '../../schemas';
import Quotes from '../../modals/Quotes';
import SuccessMessage from '../../modals/SuccessMessage';

const INIT_STATE = { type: '', id: '', name: '', orderNumber: '' };

export default function Orders(props) {
	const { email, apiKey } = useSelector(state => state['currentUser'].user);
	const { allJobs } = useSelector(state => state['deliveryJobs']);
	const error = useSelector(state => state['errors']);
	const dispatch = useDispatch();
	const drivers = useSelector(state => state['driversStore']);
	const [provider, selectProvider] = useState(INIT_STATE);
	const [optModal, showOptRoutes] = useState(false);
	const [selectDriverModal, showDriversModal] = useState(false);
	const [params, setParams] = useState({});
	const [assignModal, showAssignModal] = useState(false);
	const [routes, setOptimizedRoutes] = useState([]);
	const [reviewModal, showReviewModal] = useState({ show: false, orders: [], startTime: '', endTime: '' });
	const [optLoading, setOptLoading] = useState(false);
	const [jobLoader, setJobLoader] = useState({ loading: false, text: '' });
	const [selectionModel, setSelectionModel] = useState([]);
	const [quotes, setQuotes] = useState({ show: false, values: [] });
	const [confirmModal, showConfirmDialog] = useState(false);
	const [deliveryParams, setDeliveryParams] = useState({
		...jobRequestSchema
	});
	const [message, setMessage] = useState("");
	const modalRef = useRef(null);

	const columns = [
		{ field: 'id', headerName: 'Order No.', width: 150 },
		{
			field: 'createdAt',
			sortComparator: (v1, v2) => moment(v2).diff(moment(v1)),
			hide: true
		},
		{
			field: 'dispatchMode',
			hide: true
		},
		{
			field: 'status',
			headerName: 'Status',
			type: 'singleSelect',
			valueOptions: Object.values(STATUS),
			width: 150,
			renderCell: params => (
				<div className='h-75 d-flex align-items-center'>
					<div
						className='h-75 d-flex justify-content-center align-items-center'
						style={{
							width: 110,
							borderRadius: 10,
							backgroundColor:
								params.value === STATUS.NEW
									? BACKGROUND.NEW
									: params.value === STATUS.PENDING
									? BACKGROUND.PENDING
									: params.value === STATUS.DISPATCHING
									? BACKGROUND.DISPATCHING
									: params.value === STATUS.EN_ROUTE
									? BACKGROUND.EN_ROUTE
									: params.value === STATUS.COMPLETED
									? BACKGROUND.COMPLETED
									: params.value === STATUS.CANCELLED
									? BACKGROUND.CANCELLED
									: BACKGROUND.UNKNOWN
						}}
					>
						<span
							className='text-capitalize'
							style={{
								color:
									params.value === STATUS.NEW
										? STATUS_COLOURS.NEW
										: params.value === STATUS.PENDING
										? STATUS_COLOURS.PENDING
										: params.value === STATUS.DISPATCHING
										? STATUS_COLOURS.DISPATCHING
										: params.value === STATUS.EN_ROUTE
										? STATUS_COLOURS.EN_ROUTE
										: params.value === STATUS.COMPLETED
										? STATUS_COLOURS.COMPLETED
										: params.value === STATUS.CANCELLED
										? STATUS_COLOURS.CANCELLED
										: STATUS_COLOURS.UNKNOWN
							}}
						>
							{params.value.toLowerCase()}
						</span>
					</div>
				</div>
			)
		},
		{ field: 'customerName', headerName: 'Customer', flex: 0.4, width: 150 },
		{ field: 'phoneNumber', headerName: 'Phone', width: 150 },
		{ field: 'address', headerName: 'Address', flex: 0.6, width: 250 },
		{
			field: 'driver',
			headerName: 'Driver',
			width: 200,
			type: 'singleSelect',
			valueOptions: Object.values(PROVIDERS),
			renderCell: params => {
				return (
					<div className='h-75 d-flex align-items-center'>
						<img
							src={
								params.value === PROVIDERS.STUART
									? stuart
									: params.value === PROVIDERS.GOPHR
									? gophr
									: params.value === PROVIDERS.STREET_STREAM
									? streetStream
									: params.value === PROVIDERS.ECOFLEET
									? ecofleet
									: privateCourier
							}
							alt=''
							className={`${
								params.row.dispatchMode === DISPATCH_MODES.MANUAL && params.row.driver === PROVIDERS.UNASSIGNED && 'img-red'
							} me-3`}
							width={25}
							height={25}
						/>
						{params.row.dispatchMode === DISPATCH_MODES.MANUAL && params.row.driver === PROVIDERS.UNASSIGNED && (
							<StyledButton
								onClick={() => {
									selectProvider(prevState => ({ ...prevState, orderNumber: params.row.id }));
									showAssignModal(true);
								}}
							>
								Assign
							</StyledButton>
						)}
					</div>
				);
			}
		},
		{
			field: 'action',
			headerName: 'Action',
			width: 150,
			renderCell: params => {
				return (
					<Link
						to={{
							pathname: `${PATHS.VIEW_ORDER}/${params.row.id}`
						}}
						className='text-decoration-none'
					>
						<button className='d-flex justify-content-center align-items-center table-edit-btn'>
							<span className='text-decoration-none'>View</span>
						</button>
					</Link>
				);
			}
		}
	];

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		apiKey && dispatch(subscribe(apiKey, email));
		return () => apiKey && dispatch(unsubscribe());
	}, []);

	useEffect(() => {
		dispatch(removeError());
	}, [props.location]);

	const jobs = useMemo(
		() =>
			allJobs.map(
				({ _id, status, dispatchMode, jobSpecification: { orderNumber, deliveries }, selectedConfiguration: { providerId }, createdAt }) => {
					let {
						dropoffLocation: { fullAddress: address, phoneNumber, firstName, lastName }
					} = deliveries[0];
					let customerName = `${firstName} ${lastName}`;
					phoneNumber = phoneNumber === null || undefined ? 'N/A' : phoneNumber;
					let driver = providerId;
					return {
						id: orderNumber,
						status,
						customerName,
						phoneNumber,
						address,
						driver,
						createdAt,
						dispatchMode
					};
				}
			),
		[allJobs]
	);

	const { earliestPickupTime, latestDeliveryTime } = useMemo(() => {
		let earliestPickupTime;
		let latestDeliveryTime;
		const jobs = allJobs.filter(({ jobSpecification: { orderNumber } }) => selectionModel.includes(orderNumber));
		for (let job of jobs) {
			const isEarlier = earliestPickupTime ? moment(job['jobSpecification'].pickupStartTime).isBefore(earliestPickupTime) : true;
			const isLater = latestDeliveryTime ? moment(job['jobSpecification'].deliveries[0].dropoffEndTime).isAfter(latestDeliveryTime) : true;
			if (isEarlier) earliestPickupTime = moment(job['jobSpecification'].pickupStartTime).format('YYYY-MM-DDTHH:mm');
			if (isLater) latestDeliveryTime = moment(job['jobSpecification'].deliveries[0].dropoffEndTime).format('YYYY-MM-DDTHH:mm');
		}
		return { earliestPickupTime, latestDeliveryTime };
	}, [selectionModel]);

	const canOptimize = useMemo(() => {
		return selectionModel.length
			? selectionModel.every(orderNo => {
					let job = allJobs.find(({ jobSpecification: { orderNumber } }) => orderNumber === orderNo);
					return job.dispatchMode === DISPATCH_MODES.MANUAL && !job.driverInformation.id;
			  })
			: false;
	}, [selectionModel]);

	const dispatchJob = () => {
		showConfirmDialog(false)
		setJobLoader(prevState => ({ ...prevState, loading: true, text: 'Creating Job' }));
		dispatch(manuallyDispatchJob(apiKey, provider.type, provider.id, provider.orderNumber))
			.then(() => {
				setJobLoader(prevState => ({ ...prevState, loading: false }));
				selectProvider(prevState => INIT_STATE);
				setMessage("Your order has been assigned!")
			})
			.catch(err => {
				setJobLoader(prevState => ({ ...prevState, loading: false }));
			});
	};

	function assemblePayload({ jobSpecification, vehicleType }) {
		let payload = {
			...jobRequestSchema,
			pickupFirstName: jobSpecification.pickupLocation.firstName,
			pickupLastName: jobSpecification.pickupLocation.lastName,
			pickupBusinessName: jobSpecification.pickupLocation.businessName,
			pickupAddress: jobSpecification.pickupLocation.fullAddress,
			pickupAddressLine1: jobSpecification.pickupLocation.streetAddress,
			pickupCity: jobSpecification.pickupLocation.city,
			pickupPostcode: jobSpecification.pickupLocation.postcode,
			pickupLongitude: jobSpecification.pickupLocation.longitude,
			pickupLatitude: jobSpecification.pickupLocation.latitude,
			pickupEmailAddress: jobSpecification.pickupLocation.email,
			pickupPhoneNumber: jobSpecification.pickupLocation.phoneNumber,
			pickupInstructions: jobSpecification.pickupLocation.instructions,
			packagePickupStartTime: jobSpecification.pickupStartTime,
			...(jobSpecification.pickupEndTime && { packagePickupEndTime: jobSpecification.pickupStartTime }),
			drops: jobSpecification.deliveries.map(({ description, dropoffLocation, dropoffEndTime }) => ({
				dropoffFirstName: dropoffLocation.firstName,
				dropoffLastName: dropoffLocation.lastName,
				dropoffBusinessName: dropoffLocation.businessName,
				dropoffAddress: dropoffLocation.fullAddress,
				dropoffAddressLine1: dropoffLocation.streetAddress,
				dropoffCity: dropoffLocation.city,
				dropoffPostcode: dropoffLocation.postcode,
				dropoffLatitude: dropoffLocation.latitude,
				dropoffLongitude: dropoffLocation.longitude,
				dropoffEmailAddress: dropoffLocation.email,
				dropoffPhoneNumber: dropoffLocation.phoneNumber,
				dropoffInstructions: dropoffLocation.instructions,
				packageDropoffEndTime: dropoffEndTime,
				packageDescription: description
			})),
			packageDeliveryType: jobSpecification.deliveryType,
			vehicleType
		};
		console.log(payload);
		return payload;
	}

	const fetchQuotes = useCallback(async () => {
		showAssignModal(false);
		setJobLoader(prevState => ({ loading: true, text: 'Fetching Quotes' }));
		const job = allJobs.find(({ jobSpecification: { orderNumber } }) => orderNumber === provider.orderNumber);
		const payload = assemblePayload(job);
		setDeliveryParams(prevState => ({ ...payload }));
		const { quotes } = await dispatch(getAllQuotes(apiKey, payload));
		setJobLoader(prevState => ({ ...prevState, loading: false }));
		setQuotes(prevState => ({ show: true, values: quotes }));
	}, [provider]);

	const validateTimeWindows = useCallback(
		(start, end) => {
			let badOrders = [];
			let validStates = selectionModel.map(orderNo => {
				let isValid = false;
				let order = allJobs.find(({ jobSpecification: { orderNumber } }) => orderNumber === orderNo);
				if (order) {
					// check pickup is not earlier than start time
					isValid = moment(order['jobSpecification'].pickupStartTime).isSameOrAfter(moment(start));
					// check if the order's pickup / delivery time fit within the optimization time window
					if (isValid) {
						const deliveries = order['jobSpecification'].deliveries;
						isValid = deliveries.every(delivery => {
							return moment(delivery.dropoffEndTime).isSameOrBefore(end);
						});
					}
					!isValid && badOrders.push(order);
				}
				return isValid;
			});
			return { allValid: validStates.every(item => item), badOrders };
		},
		[selectionModel]
	);

	const optimize = useCallback(
		values => {
			showOptRoutes(false);
			setOptLoading(true);
			const { startTime, endTime } = values;
			let { allValid, badOrders } = validateTimeWindows(startTime, endTime);
			if (!allValid) {
				setOptLoading(false);
				setParams(values);
				//dispatch(addError("Your selection contains orders that can't be delivered today. Delivery dates must be for today only"));
				showReviewModal({ show: true, orders: badOrders, startTime: moment(startTime).calendar(), endTime: moment(endTime).calendar() });
			} else {
				dispatch(optimizeRoutes(email, values, selectionModel))
					.then(routes => {
						setOptLoading(false);
						setOptimizedRoutes(routes);
					})
					.catch(err => setOptLoading(false));
			}
		},
		[selectionModel]
	);

	return (
		<LoadingOverlay active={jobLoader.loading} spinner text={jobLoader.text} classNamePrefix='order_loader_'>
			<div ref={modalRef} className='page-container d-flex flex-column px-2 py-4'>
				<Loading show={optLoading} onHide={() => setOptLoading(false)} />
				<SuccessMessage ref={modalRef} show={!!message} onHide={() => setMessage('')} message={message} centered/>
				<Error ref={modalRef} show={!!error.message} onHide={() => dispatch(removeError())} message={error.message} />
				<ReviewOrders
					show={reviewModal.show}
					onGoBack={() => {
						showReviewModal(prevState => ({ ...prevState, show: false }));
						showOptRoutes(true);
					}}
					onHide={() => showReviewModal(prevState => ({ ...prevState, show: false }))}
					orders={reviewModal.orders}
					onConfirm={() => {
						showReviewModal(prevState => ({ ...prevState, show: false }));
						setOptLoading(true);
						dispatch(optimizeRoutes(email, params, selectionModel))
							.then(routes => {
								setOptLoading(false);
								setOptimizedRoutes(routes);
							})
							.catch(err => setOptLoading(false));
					}}
					startTime={reviewModal.startTime}
					endTime={reviewModal.endTime}
				/>
				<AssignModal
					show={assignModal}
					onHide={() => showAssignModal(false)}
					assignToDriver={() => {
						showAssignModal(false);
						showDriversModal(true);
					}}
					outsourceToCourier={fetchQuotes}
				/>
				<OptimizationResult show={!!routes.length} onHide={() => setOptimizedRoutes(prevState => [])} routes={routes} />
				<ManualDispatch
					show={confirmModal}
					onHide={() => selectProvider(prevState => INIT_STATE)}
					driverName={provider.name}
					onConfirm={dispatchJob}
				/>
				<SelectDriver
					show={selectDriverModal}
					onHide={() => showDriversModal(false)}
					drivers={drivers}
					selectDriver={selectProvider}
					showConfirmDialog={showConfirmDialog}
					showCreateBtn={false}
				/>
				<Quotes
					show={quotes.show}
					onHide={() => setQuotes(prevState => ({ ...prevState, show: false }))}
					quotes={quotes.values}
					selectCourier={selectProvider}
					showConfirmDialog={showConfirmDialog}
				/>
				<RouteOptimization
					show={optModal}
					onHide={() => showOptRoutes(false)}
					orders={selectionModel}
					onSubmit={optimize}
					defaultStartTime={earliestPickupTime}
					defaultEndTime={latestDeliveryTime}
				/>
				<h3 className='ms-3'>Your Orders</h3>
				<DataGrid
					sx={{
						'& .MuiDataGrid-cell:focus': {
							outline: 'none !important'
						},
						'& .MuiDataGrid-cell': {
							outline: 'none !important'
						}
					}}
					sortingOrder={['desc', 'asc']}
					initialState={{
						sorting: {
							sortModel: [
								{
									field: 'createdAt',
									sort: 'asc'
								}
							]
						}
					}}
					autoHeight={false}
					className='mt-3 mx-3'
					rows={jobs}
					disableSelectionOnClick
					columns={columns}
					checkboxSelection
					autoPageSize
					pagination
					onSelectionModelChange={newSelectionModel => {
						setSelectionModel(newSelectionModel);
					}}
					selectionModel={selectionModel}
					components={{ Toolbar: CustomToolbar }}
					componentsProps={{
						toolbar: {
							toggleShow: () => {
								showOptRoutes(true);
							},
							canOptimize
						}
					}}
				/>
			</div>
		</LoadingOverlay>
	);
}
