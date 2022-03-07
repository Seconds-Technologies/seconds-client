import './Orders.css';
import React, { useEffect, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BACKGROUND, STATUS_COLOURS, PATHS, STATUS, PROVIDERS, DISPATCH_MODES } from '../../constants';
import { subscribe, unsubscribe } from '../../store/actions/delivery';
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

export default function Orders(props) {
	const dispatch = useDispatch();
	const { email, apiKey } = useSelector(state => state['currentUser'].user);
	const drivers = useSelector(state => state['driversStore']);

	const jobs = useSelector(state => {
		const { allJobs } = state['deliveryJobs'];
		return apiKey
			? allJobs.map(
					({ status, dispatchMode, jobSpecification: { orderNumber, deliveries }, selectedConfiguration: { providerId }, createdAt }) => {
						let {
							dropoffLocation: { fullAddress: address, phoneNumber, firstName, lastName }
						} = deliveries[0];
						let customerName = `${firstName} ${lastName}`;
						phoneNumber = phoneNumber === null || undefined ? 'N/A' : phoneNumber;
						let driver = providerId;
						return { id: orderNumber, status, customerName, phoneNumber, address, driver, createdAt, dispatchMode };
					}
			  )
			: [];
	});

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		apiKey && dispatch(subscribe(apiKey, email));
		return () => apiKey && dispatch(unsubscribe());
	}, []);

	useEffect(() => {
		dispatch(removeError());
	}, [props.location]);

	const columns = useMemo(
		() => [
			{ field: 'id', headerName: 'Order No.', width: 150 },
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
								className='me-3'
								width={25}
								height={25}
							/>
							{params.row.dispatchMode === DISPATCH_MODES.MANUAL && (
								<FormControl variant='standard' sx={{ m: 1, minWidth: 150, display: 'flex' }}>
									<InputLabel id='demo-simple-select-standard-label'>Manual Dispatch</InputLabel>
									<Select
										labelId='demo-simple-select-label'
										id='demo-simple-select'
										value={null}
										label='Age'
										onChange={e => console.log(e)}
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
				field: 'createdAt',
				sortComparator: (v1, v2) => moment(v2).diff(moment(v1)),
				hide: true
			},
			{
				field: 'dispatchMode',
				hide: true
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
		],
		[]
	);

	return (
		<div className='page-container d-flex flex-column px-2 py-4'>
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
			/>
		</div>
	);
}
