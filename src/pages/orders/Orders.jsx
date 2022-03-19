import './Orders.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BACKGROUND, DISPATCH_MODES, PATHS, PROVIDERS, STATUS, STATUS_COLOURS } from '../../constants';
import { manuallyDispatchJob, optimizeRoutes, subscribe, unsubscribe } from '../../store/actions/delivery';
import { Mixpanel } from '../../config/mixpanel';
import moment from 'moment';
import stuart from '../../assets/img/stuart.svg';
import gophr from '../../assets/img/gophr.svg';
import streetStream from '../../assets/img/street-stream.svg';
import ecofleet from '../../assets/img/ecofleet.svg';
import privateCourier from '../../assets/img/courier.svg';
import { removeError } from '../../store/actions/errors';
import CustomToolbar from '../../components/CustomToolbar';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import RouteOptimization from './modals/RouteOptimization';
import ManualDispatch from './modals/ManualDispatch';
import Error from '../../modals/Error';
import Loading from './modals/Loading';
import ReviewOrders from './modals/ReviewOrders';
import OptimizationResult from './modals/OptimizationResult';
import CustomSelect, { StyledOption } from './components/CustomSelect';

const INIT_STATE = {
	firstname: '',
	lastname: '',
	id: '',
	orderNumber: ''
};

export default function Orders(props) {
	const { email, apiKey } = useSelector(state => state['currentUser'].user);
	const error = useSelector(state => state['errors']);
	const { allJobs } = useSelector(state => state['deliveryJobs']);
	const dispatch = useDispatch();
	const drivers = useSelector(state => state['driversStore']);
	const [chosenDriver, selectDriver] = useState(INIT_STATE);
	const [optModal, showOptRoutes] = useState(false);
	const [params, setParams] = useState({});
	const [routes, setOptimizedRoutes] = useState([]);
	const [reviewModal, showReviewModal] = useState({ show: false, orders: [], startTime: '', endTime: '' });
	const [loading, setLoading] = useState(false);
	const [selectionModel, setSelectionModel] = useState([]);
	const modalRef = useRef(null);

	const renderValue = useCallback(option => {
		if (option == null) {
			return <span>Set Courier </span>;
		}

		return <span className="text-wrap">{option.label.join(' ')}</span>;
	}, []);

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
			field: 'driverId',
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
							className={`${params.row.dispatchMode === DISPATCH_MODES.MANUAL && !params.row.driverId && 'img-red'} me-3`}
							width={25}
							height={25}
						/>
						{params.row.dispatchMode === DISPATCH_MODES.MANUAL && !params.row.driverId && (
							<CustomSelect
								renderValue={renderValue}
								onChange={value => {
									let driver = drivers.find(({ id }) => id === value);
									console.log(driver);
									selectDriver(prevState => ({
										...driver,
										orderNumber: params.row.id
									}));
								}}
							>
								{drivers.map((driver, index) => (
									<StyledOption key={index} value={driver.id}>
										{driver.firstname} {driver.lastname}
									</StyledOption>
								))}
							</CustomSelect>
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
					dispatchMode,
					driverInformation,
					jobSpecification: { orderNumber, deliveries },
					selectedConfiguration: { providerId },
					createdAt
				}) => {
					let {
						dropoffLocation: { fullAddress: address, phoneNumber, firstName, lastName }
					} = deliveries[0];
					let customerName = `${firstName} ${lastName}`;
					phoneNumber = phoneNumber === null || undefined ? 'N/A' : phoneNumber;
					let driver = providerId;
					return {
						id: orderNumber,
						driverId: driverInformation.id,
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
	const dispatchToDriver = () => {
		dispatch(manuallyDispatchJob(apiKey, chosenDriver.id, chosenDriver.orderNumber)).then(() => selectDriver(prevState => INIT_STATE));
	};

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
			setLoading(true);
			const { startTime, endTime } = values;
			let { allValid, badOrders } = validateTimeWindows(startTime, endTime);
			if (!allValid) {
				setLoading(false);
				setParams(values);
				//dispatch(addError("Your selection contains orders that can't be delivered today. Delivery dates must be for today only"));
				showReviewModal({ show: true, orders: badOrders, startTime: moment(startTime).calendar(), endTime: moment(endTime).calendar() });
			} else {
				dispatch(optimizeRoutes(email, values, selectionModel))
					.then(routes => {
						setLoading(false);
						setOptimizedRoutes(routes);
					})
					.catch(err => setLoading(false));
			}
		},
		[selectionModel]
	);

	return (
		<div ref={modalRef} className='page-container d-flex flex-column px-2 py-4'>
			<Loading show={loading} onHide={() => setLoading(false)} />
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
					setLoading(true);
					dispatch(optimizeRoutes(email, params, selectionModel))
						.then(routes => {
							setLoading(false);
							setOptimizedRoutes(routes);
						})
						.catch(err => setLoading(false));
				}}
				startTime={reviewModal.startTime}
				endTime={reviewModal.endTime}
			/>
			<Error ref={modalRef} show={!!error.message} onHide={() => dispatch(removeError())} message={error.message} />
			<OptimizationResult show={!!routes.length} onHide={() => setOptimizedRoutes(prevState => [])} routes={routes} />
			<ManualDispatch
				show={!!chosenDriver.id}
				onHide={() => selectDriver(prevState => INIT_STATE)}
				driverName={`${chosenDriver.firstname} ${chosenDriver.lastname}`}
				onConfirm={dispatchToDriver}
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
	);
}
