import './Orders.css';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BACKGROUND, STATUS_COLOURS, PATHS, STATUS, PROVIDERS, DISPATCH_MODES } from '../../constants';
import { manuallyDispatchJob, subscribe, unsubscribe } from '../../store/actions/delivery';
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
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import RouteOptimization from './modals/RouteOptimization';

const INIT_STATE = {
	firstname: '',
	lastname: '',
	id: '',
	orderNumber: ''
};

export default function Orders(props) {
	const { email, apiKey } = useSelector(state => state['currentUser'].user);
	const dispatch = useDispatch();
	const drivers = useSelector(state => state['driversStore']);
	const [chosenDriver, selectDriver] = useState(INIT_STATE);
	const [optModal, showOptRoutes] = useState(false);

	const jobs = useSelector(state => {
		const { allJobs } = state['deliveryJobs'];
		return apiKey
			? allJobs.map(
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
			  )
			: [];
	});

	const dispatchToDriver = () => {
		dispatch(manuallyDispatchJob(apiKey, chosenDriver.id, chosenDriver.orderNumber)).then(() => selectDriver(prevState => INIT_STATE));
	};

	const manualDispatchModal = (
		<Modal show={!!chosenDriver.id} onHide={() => selectDriver(prevState => INIT_STATE)}>
			<Modal.Header closeButton>
				<Modal.Title>Confirm Driver</Modal.Title>
			</Modal.Header>
			<Modal.Body className='d-flex justify-content-center align-items-center border-0'>
				<span className='fs-4'>
					You are confirming{' '}
					<span className='fw-bold'>
						{chosenDriver.firstname} {chosenDriver.lastname}
					</span>
					!
				</span>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={() => selectDriver(prevState => INIT_STATE)}>
					Cancel
				</Button>
				<Button onClick={() => dispatchToDriver()}>Confirm</Button>
			</Modal.Footer>
		</Modal>
	);

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		apiKey && dispatch(subscribe(apiKey, email));
		return () => apiKey && dispatch(unsubscribe());
	}, []);

	useEffect(() => {
		dispatch(removeError());
	}, [props.location]);

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
							<FormControl
								error
								variant='filled'
								sx={{
									m: 1,
									minWidth: 150,
									display: 'flex',
									justifyContent: 'center'
								}}
							>
								<InputLabel id='drivers-dropdown' style={{ fontSize: 14 }} error>
									⚠️ Select Driver
								</InputLabel>
								<Select
									labelId='drivers-dropdown'
									id='drivers-dropdown'
									value={null}
									label='Manual Dispatch'
									onChange={e => {
										let driver = drivers.find(({ id }) => id === e.target.value);
										console.log(driver);
										selectDriver(prevState => ({
											...driver,
											orderNumber: params.row.id
										}));
									}}
								>
									{drivers.map(driver => (
										<MenuItem value={driver.id}>
											{driver.firstname} {driver.lastname}
										</MenuItem>
									))}
								</Select>
							</FormControl>
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

	return (
		<div className='page-container d-flex flex-column px-2 py-4'>
			{manualDispatchModal}
			<RouteOptimization show={optModal} onHide={() => showOptRoutes(false)} orders={[]}/>
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
				components={{ Toolbar: CustomToolbar }}
				componentsProps={{
					toolbar: {
						toggleShow: () => {
							showOptRoutes(true);
						}
					}
				}}
			/>
		</div>
	);
}
