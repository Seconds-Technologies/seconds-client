import './Orders.css';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BACKGROUND, PATHS, PLATFORMS, PROVIDERS, REVIEW_TYPE, STATUS, STATUS_COLOURS, VEHICLE_TYPES } from '../../constants';
import {
	createMultiDropJob,
	deleteJobs,
	getAllQuotes,
	manuallyDispatchJob,
	manuallyDispatchRoute,
	optimizeRoutes,
	subscribe,
	unsubscribe,
	updateDelivery
} from '../../store/actions/delivery';
import { removeError } from '../../store/actions/errors';
import { Mixpanel } from '../../config/mixpanel';
import dayjs from 'dayjs';
// images
import stuart from '../../assets/img/stuart.svg';
import gophr from '../../assets/img/gophr.svg';
import streetStream from '../../assets/img/street-stream.svg';
import ecofleet from '../../assets/img/ecofleet.svg';
import privateCourier from '../../assets/img/courier.svg';
import infinityIcon from '../../assets/img/infinity.svg';
import secondsPlatform from '../../assets/img/platform.svg';
import hubrise from '../../assets/img/hubrise.svg';
import shopify from '../../assets/img/shopify.svg';
import woocommerce from '../../assets/img/woocommerce-logo.svg';
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
import SuccessToast from '../../modals/SuccessToast';
import CustomFooter from '../../components/CustomFooter';
import { DELETE_TYPES } from '../drivers/constants';
import DeleteModal from '../drivers/modals/DeleteModal';
import { assembleMultiDropPayload, assemblePayload } from '../../helpers';
import CustomNoRowsOverlay from '../../components/CustomNoRowsOverlay';
import { KanaContext } from '../../context';
import MultiDrop from './modals/MultiDrop';

const INIT_STATE = { type: '', id: '', name: '', orderNumber: '' };

export default function Orders(props) {
	const dispatch = useDispatch();
	const { features, errors } = useContext(KanaContext);
	const { email, apiKey, deliveryHours } = useSelector(state => state['currentUser'].user);
	const { allJobs } = useSelector(state => state['deliveryJobs']);
	const error = useSelector(state => state['errors']);
	const drivers = useSelector(state => state['driversStore']);
	const [provider, selectProvider] = useState(INIT_STATE);
	const [optModal, showOptRoutes] = useState(false);
	const [multiDropModal, showMultiDropModal] = useState({ show: false, orders: [], startTime: null, endTime: null, vehicleType: "" });
	const [selectDriverModal, showDriversModal] = useState({ show: false, drivers });
	const [params, setParams] = useState({});
	const [assignModal, showAssignModal] = useState(false);
	const [routesModal, setOptimizedRoutes] = useState({
		show: false,
		routes: [],
		unreachable: [],
		startTime: dayjs(deliveryHours[dayjs().day()].open),
		endTime: dayjs(deliveryHours[dayjs().day()].close)
	});
	const [reviewModal, showReviewModal] = useState({
		show: false,
		orders: [],
		startTime: dayjs(deliveryHours[dayjs().day()].open),
		endTime: dayjs(deliveryHours[dayjs().day()].close)
	});
	const [optLoading, setOptLoading] = useState(false);
	const [jobLoader, setJobLoader] = useState({ loading: false, text: '' });
	const [selectionModel, setSelectionModel] = useState([]);
	const [quotes, setQuotes] = useState({ show: false, values: [] });
	const [confirmModal, showConfirmDialog] = useState(false);
	const [deliveryParams, setDeliveryParams] = useState({
		...jobRequestSchema
	});
	const [message, setMessage] = useState('');
	const [toast, setToast] = useState('');
	const [deleteModal, setDeleteModal] = useState({ show: false, ids: [] });
	const handleOpen = ids => setDeleteModal(prevState => ({ show: true, ids }));
	const handleClose = () => setDeleteModal(prevState => ({ ...prevState, show: false }));

	const modalRef = useRef(null);

	const columns = [
		{ field: 'id', headerName: 'Order No.', width: 150 },
		{
			field: 'createdAt',
			sortComparator: (v1, v2) => dayjs(v2).diff(dayjs(v1)),
			hide: true
		},
		{
			field: 'pickupTime',
			headerName: 'Pickup'
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
		{ field: 'address', headerName: 'Address', flex: 0.4, width: 200 },
		{
			field: 'platform',
			headerName: 'Platform',
			width: 100,
			renderCell: params => {
				return (
					<img
						src={
							params.value === PLATFORMS.SHOPIFY
								? shopify
								: params.value === PLATFORMS.WOOCOMMERCE
								? woocommerce
								: params.value === PLATFORMS.HUBRISE
								? hubrise
								: secondsPlatform
						}
						width={25}
						height={25}
						alt='logo'
					/>
				);
			}
		},
		{
			field: 'provider',
			headerName: 'Delivery Provider',
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
							className={`${params.row.provider === PROVIDERS.UNASSIGNED && 'img-red'} me-3`}
							width={25}
							height={25}
						/>
						{params.row.routeOptimization && <img src={infinityIcon} alt='' width={25} height={25} />}
						{params.row.provider === PROVIDERS.UNASSIGNED && (
							<StyledButton
								onClick={() => {
									selectProvider(prevState => ({ ...prevState, orderNumber: params.row.id }));
									showAssignModal(true);
								}}
							>
								Dispatch
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
				({
					_id,
					status,
					platform,
					jobSpecification: { orderNumber, deliveries, pickupStartTime },
					selectedConfiguration: { providerId },
					createdAt,
					routeOptimization
				}) => {
					let {
						dropoffLocation: { fullAddress: address, phoneNumber, firstName, lastName }
					} = deliveries[0];
					let customerName = `${firstName} ${lastName}`;
					phoneNumber = phoneNumber === null || undefined ? 'N/A' : phoneNumber;
					let provider = providerId;
					const pickupTime = dayjs(pickupStartTime).isValid() ? dayjs(pickupStartTime).format('HH:mm a') : 'Estimating...';
					return {
						id: orderNumber,
						pickupTime,
						status,
						customerName,
						phoneNumber,
						address,
						provider,
						platform,
						createdAt,
						routeOptimization
					};
				}
			),
		[allJobs]
	);

	const vehicles = useMemo(() => {
		const driverVehicles = drivers.filter(({ verified }) => verified).map(({ vehicle }) => vehicle);
		const uniqueVehicles = [...new Set(driverVehicles)];
		return uniqueVehicles.map(code => VEHICLE_TYPES.find(item => item.value === code));
	}, [drivers]);

	const canMultiDrop = useMemo(() => {
		const allUnassigned = selectionModel.every(orderNo => {
			let job = allJobs.find(({ jobSpecification: { orderNumber } }) => orderNumber === orderNo);
			return job['selectedConfiguration'].providerId === PROVIDERS.UNASSIGNED;
		});
		return selectionModel.length >= 3 && allUnassigned;
	}, [selectionModel]);

	const canOptimize = useMemo(() => {
		if (selectionModel.length) {
			const validPlan = Boolean(features && features.routeOptimization);
			const allUnassigned = selectionModel.every(orderNo => {
				let job = allJobs.find(({ jobSpecification: { orderNumber } }) => orderNumber === orderNo);
				return job['selectedConfiguration'].providerId === PROVIDERS.UNASSIGNED;
			});
			return allUnassigned && validPlan;
		}
		return false;
	}, [selectionModel, features]);

	const canDelete = useMemo(() => {
		return allJobs
			.filter(({ jobSpecification: { orderNumber } }) => selectionModel.includes(orderNumber))
			.every(({ selectedConfiguration: { providerId } }) => providerId === PROVIDERS.UNASSIGNED);
	}, [selectionModel]);

	const dispatchJob = useCallback(() => {
		showConfirmDialog(false);
		setJobLoader(prevState => ({ ...prevState, loading: true, text: 'Creating Job' }));
		dispatch(manuallyDispatchJob(apiKey, provider.type, provider.id, provider.orderNumber))
			.then(() => {
				setJobLoader(prevState => ({ ...prevState, loading: false }));
				selectProvider(prevState => INIT_STATE);
				setMessage('Your order has been assigned!');
			})
			.catch(err => {
				setJobLoader(prevState => ({ ...prevState, loading: false }));
			});
	}, [provider]);

	const fetchQuotes = useCallback(async () => {
		showAssignModal(false);
		setJobLoader(prevState => ({ loading: true, text: 'Fetching Quotes' }));
		const job = allJobs.find(({ jobSpecification: { orderNumber } }) => orderNumber === provider.orderNumber);
		const payload = assemblePayload(job);
		setDeliveryParams(prevState => ({ ...payload }));
		try {
			const { quotes } = await dispatch(getAllQuotes(apiKey, payload));
			setJobLoader(prevState => ({ ...prevState, loading: false }));
			setQuotes(prevState => ({ show: true, values: quotes }));
		} catch (err) {
			setJobLoader(prevState => ({ ...prevState, loading: false }));
			console.error(err);
		}
	}, [provider]);

	const calculateTimeWindow = useCallback(orders => {
		const firstOrder = orders.shift();
		let earliestPickupTime = firstOrder['jobSpecification'].pickupStartTime;
		let latestDropoffTime = firstOrder['jobSpecification'].deliveries[0].dropoffEndTime;
		orders.map(({ jobSpecification: { pickupStartTime, deliveries } }) => {
			let pickupTime = pickupStartTime;
			let dropoffTime = deliveries[0].dropoffEndTime;
			earliestPickupTime = dayjs(pickupTime).isBefore(earliestPickupTime, 'm') ? pickupTime : earliestPickupTime;
			latestDropoffTime = dayjs(dropoffTime).isAfter(latestDropoffTime, 'm') ? dropoffTime : latestDropoffTime;
		});
		return { startTime: dayjs(earliestPickupTime).format('YYYY-MM-DDTHH:mm'), endTime: dayjs(latestDropoffTime).format('YYYY-MM-DDTHH:mm') };
	}, []);

	const validateTimeWindows = useCallback(
		(start, end) => {
			let badOrders = [];
			let validStates = selectionModel.map(orderNo => {
				let isValid = false;
				let order = allJobs.find(({ jobSpecification: { orderNumber } }) => orderNumber === orderNo);
				if (order) {
					// check if the order's pickup / delivery time fit within the optimization time window
					const deliveries = order['jobSpecification'].deliveries;
					isValid = deliveries.every(delivery => {
						return (
							dayjs(delivery.dropoffStartTime).isSameOrAfter(dayjs(start)) &&
							dayjs(delivery.dropoffEndTime).isSameOrBefore(end) &&
							dayjs(delivery.dropoffStartTime).isBefore(dayjs(delivery.dropoffEndTime))
						);
					});
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
				showReviewModal({ show: true, orders: badOrders, startTime: dayjs(startTime), endTime: dayjs(endTime) });
			} else {
				dispatch(optimizeRoutes(email, values, selectionModel))
					.then(({ routes, unreachable }) => {
						setOptLoading(false);
						setOptimizedRoutes(prevState => ({ ...prevState, show: true, routes, unreachable, startTime, endTime }));
					})
					.catch(err => setOptLoading(false));
			}
		},
		[selectionModel]
	);

	const newMultiDrop = useCallback(async values => {
		showMultiDropModal(prevState => ({
			...prevState,
			show: false
		}));
		setJobLoader(prevState => ({ loading: true, text: 'Checking your dropoff times...' }));
		const { windowStartTime, windowEndTime, vehicleType, orderNumbers } = values;
		let { allValid, badOrders } = validateTimeWindows(windowStartTime, windowEndTime);
		if (!allValid) {
			setParams(prevState => values);
			setJobLoader(prevState => ({ ...prevState, loading: false }));
			showReviewModal({ show: true, orders: badOrders, startTime: dayjs(windowStartTime), endTime: dayjs(windowEndTime), vehicleType });
		} else {
			try {
				setJobLoader(prevState => ({ loading: true, text: 'Creating Multi Drop' }));
				const selectedJobs = allJobs.filter(({ jobSpecification: { orderNumber } }) => orderNumbers.includes(orderNumber));
				const deliveryParams = assembleMultiDropPayload(selectedJobs, vehicleType);
				console.log(deliveryParams);
				// create multi-drop job
				const job = await dispatch(createMultiDropJob({ ...deliveryParams, windowStartTime, windowEndTime }, apiKey, 'stuart'));
				// delete existing jobs
				await dispatch(deleteJobs(email, orderNumbers)).then(res => console.log(res));
				console.log(job);
			} catch (err) {
				setJobLoader(prevState => ({ ...prevState, loading: false }));
				console.error(err);
			}
		}
	}, []);

	const assignRoute = useCallback((driverId, route) => {
		setOptimizedRoutes(prevState => ({ ...prevState, show: false }));
		setJobLoader(prevState => ({ ...prevState, loading: true, text: 'Assigning route to driver...' }));
		dispatch(manuallyDispatchRoute(apiKey, driverId, route, { startTime: routesModal.startTime.format(), endTime: routesModal.endTime.format() }))
			.then(message => {
				setJobLoader(prevState => ({ ...prevState, loading: false }));
				setToast(message);
				setOptimizedRoutes(prevState => ({ ...prevState, show: true }));
			})
			.catch(err => console.error(err));
	}, []);

	const confirmDelete = useCallback(() => {
		dispatch(deleteJobs(email, selectionModel)).then(res => console.log(res));
		handleClose();
	}, [selectionModel]);

	const confirmReview = useCallback(type => {
		showReviewModal(prevState => ({ ...prevState, show: false }));
		if (type === REVIEW_TYPE.OPTIMIZE) {
			setOptLoading(true);
			dispatch(optimizeRoutes(email, params, selectionModel))
				.then(({ routes, unreachable }) => {
					setOptLoading(false);
					setOptimizedRoutes(prevState => ({
						...prevState,
						show: true,
						routes,
						unreachable,
						startTime: reviewModal.startTime,
						endTime: reviewModal.endTime
					}));
				})
				.catch(err => {
					setOptLoading(false)
					console.error(err.message)
				});
		} else if (type === REVIEW_TYPE.MULTI_DROP) {
			setJobLoader(prevState => ({ loading: true, text: 'Creating Multi Drop' }));
			const selectedJobs = allJobs.filter(({ jobSpecification: { orderNumber } }) => selectionModel.includes(orderNumber));
			const deliveryParams = assembleMultiDropPayload(selectedJobs, multiDropModal.vehicleType);
			console.log(deliveryParams);
			dispatch(
				createMultiDropJob(
					{
						...deliveryParams,
						windowStartTime: multiDropModal.startTime,
						windowEndTime: multiDropModal.endTime
					},
					apiKey,
					'stuart'
				)
			)
				.then(job => {
					setJobLoader(prevState => ({ ...prevState, loading: false }));
					console.log(job);
				})
				.catch(err => {
					setJobLoader(prevState => ({ ...prevState, loading: false }));
					console.error(err);
				});
		}
	}, []);

	return (
		<LoadingOverlay active={jobLoader.loading} spinner text={jobLoader.text} classNamePrefix='order_loader_'>
			<div ref={modalRef} className='page-container d-flex flex-column px-2 py-4'>
				<Loading show={optLoading} onHide={() => setOptLoading(false)} />
				<SuccessMessage ref={modalRef} show={!!message} onHide={() => setMessage('')} message={message} centered />
				<SuccessToast position='topRight' toggleShow={setToast} message={toast} />
				<Error ref={modalRef} show={!!error.message} onHide={() => dispatch(removeError())} message={error.message} />
				<ReviewOrders
					show={reviewModal.show}
					onGoBack={() => {
						showReviewModal(prevState => ({ ...prevState, show: false }));
						showOptRoutes(true);
					}}
					onHide={() => showReviewModal(prevState => ({ ...prevState, show: false }))}
					orders={reviewModal.orders}
					onConfirm={confirmReview}
					onUpdate={(values, jobId) =>
						dispatch(updateDelivery(apiKey, jobId, values))
							.then(message => setToast(message))
							.catch(err => console.error(err))
					}
					windowStartTime={reviewModal.startTime}
					windowEndTime={reviewModal.endTime}
				/>
				<AssignModal
					show={assignModal}
					onHide={() => showAssignModal(false)}
					assignToDriver={() => {
						showAssignModal(false);
						showDriversModal(prevState => ({ ...prevState, show: true }));
					}}
					outsourceToCourier={fetchQuotes}
				/>
				<OptimizationResult
					show={routesModal.show}
					onHide={() => setOptimizedRoutes(prevState => ({ ...prevState, show: false }))}
					routes={routesModal.routes}
					unreachable={routesModal.unreachable}
					onAssign={assignRoute}
				/>
				<ManualDispatch
					show={confirmModal}
					onHide={() => selectProvider(prevState => INIT_STATE)}
					driverName={provider.name}
					onConfirm={dispatchJob}
				/>
				<SelectDriver
					show={selectDriverModal.show}
					onHide={() => showDriversModal(prevState => ({ ...prevState, show: false }))}
					drivers={selectDriverModal.drivers}
					selectDriver={selectProvider}
					showConfirmDialog={showConfirmDialog}
					showCreateBtn={false}
					disabled={!!routesModal.routes.length}
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
					availableVehicles={vehicles}
					onSubmit={optimize}
					defaultStartTime={dayjs(deliveryHours[dayjs().day()].open).format('YYYY-MM-DDTHH:mm')}
					defaultEndTime={dayjs(deliveryHours[dayjs().day()].close).format('YYYY-MM-DDTHH:mm')}
				/>
				<MultiDrop
					show={multiDropModal.show}
					onHide={() => showMultiDropModal(prevState => ({ ...prevState, show: false }))}
					orderNumbers={selectionModel}
					orders={multiDropModal.orders}
					onSubmit={newMultiDrop}
					onUpdate={(values, jobId) =>
						dispatch(updateDelivery(apiKey, jobId, values))
							.then(message => setToast(message))
							.catch(err => console.error(err))
					}
					windowStartTime={multiDropModal.startTime}
					windowEndTime={multiDropModal.endTime}
				/>
				<DeleteModal
					data={allJobs
						.filter(job => selectionModel.includes(job['jobSpecification'].orderNumber))
						.map(({ jobSpecification: { orderNumber } }) => orderNumber)}
					show={deleteModal.show}
					title='Delete Orders'
					description='The following orders will be cancelled and removed from your account'
					onHide={handleClose}
					centered
					onConfirm={confirmDelete}
				/>
				<div className='d-flex justify-content-between'>
					<h3 className='ms-3'>Orders</h3>
				</div>
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
					className='mt-3 mx-3 orders-table'
					rows={jobs}
					disableSelectionOnClick
					columns={columns}
					checkboxSelection
					autoPageSize
					pagination
					onSelectionModelChange={newSelectionModel => setSelectionModel(newSelectionModel)}
					selectionModel={selectionModel}
					components={{
						NoRowsOverlay: CustomNoRowsOverlay,
						Toolbar: CustomToolbar,
						...(selectionModel.length && { Footer: CustomFooter })
					}}
					componentsProps={{
						noRowsOverlay: {
							title: 'No Orders',
							subtitle: "To create an order, navigate to the 'Create' page"
						},
						toolbar: {
							showMultiDrop: () => {
								const orders = allJobs.filter(job => selectionModel.includes(job['jobSpecification'].orderNumber));
								const { startTime, endTime } = calculateTimeWindow(Object.create(orders));
								showMultiDropModal(prevState => ({
									show: true,
									orders,
									startTime,
									endTime
								}));
							},
							showRouteOpt: () => {
								showOptRoutes(true);
							},
							canMultiDrop,
							canOptimize
						},
						footer: {
							onDelete: () => handleOpen(DELETE_TYPES.BATCH, selectionModel),
							title: 'Delete',
							canDelete
						}
					}}
				/>
			</div>
		</LoadingOverlay>
	);
}
