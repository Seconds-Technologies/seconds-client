import './Orders.css';
import React, { useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BACKGROUND, STATUS_COLOURS, PATHS, STATUS } from '../../constants';
import { subscribe, unsubscribe } from '../../store/actions/delivery';
import { Mixpanel } from '../../config/mixpanel';
import moment from 'moment';

export default function Orders() {
	const dispatch = useDispatch();
	const { email, apiKey } = useSelector(state => state['currentUser'].user);

	const jobs = useSelector(state => {
		const { allJobs } = state['deliveryJobs'];
		return apiKey
			? allJobs.map(({ status, jobSpecification: { orderNumber, deliveries }, createdAt }) => {
					let {
						dropoffLocation: { fullAddress: address, phoneNumber, firstName, lastName },
					} = deliveries[0];
					let customerName = `${firstName} ${lastName}`;
					phoneNumber = phoneNumber === null || undefined ? 'N/A' : phoneNumber;
					let date = moment(createdAt).format('DD/MM/YYYY');
					let time = moment(createdAt).format('HH:mm:ss');
					return { id: orderNumber, status, customerName, phoneNumber, address, date, time, createdAt };
			  })
			: [];
	});

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		apiKey && dispatch(subscribe(apiKey, email));
		return () => apiKey && dispatch(unsubscribe());
	}, []);

	const columns = [
		{ field: 'id', headerName: 'Order No.', width: 150 },
		{
			field: 'status',
			headerName: 'Status',
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
									: BACKGROUND.UNKNOWN,
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
										: STATUS_COLOURS.UNKNOWN,
							}}
						>
							{params.value.toLowerCase()}
						</span>
					</div>
				</div>
			),
		},
		{ field: 'customerName', headerName: 'Customer', width: 150 },
		{ field: 'phoneNumber', headerName: 'Phone', width: 150 },
		{ field: 'address', headerName: 'Address', width: 200 },
		{ field: 'date', headerName: 'Date', type: 'date', width: 130 },
		{ field: 'time', headerName: 'Time', width: 130 },
		{
			field: 'createdAt',
			sortComparator: (v1, v2) => moment(v2).diff(moment(v1)),
			hide: true,
		},
		{
			field: 'action',
			headerName: 'Action',
			width: 150,
			renderCell: params => {
				return (
					<Link
						to={{
							pathname: `${PATHS.VIEW_ORDER}/${params.row.id}`,
						}}
						className='text-decoration-none'
					>
						<button className='d-flex justify-content-center align-items-center OrdersListEdit'>
							<span className='text-decoration-none'>View</span>
						</button>
					</Link>
				);
			},
		},
	];

	return (
		<div className='ordersContainer d-flex flex-column bg-light px-2 py-4'>
			<h3 className='ms-3'>Your Orders</h3>
			<DataGrid
				sortingOrder={['desc', 'asc']}
				sortModel={[
					{
						field: 'createdAt',
						sort: 'asc',
					},
				]}
				autoHeight={false}
				className='mt-3 mx-3'
				rows={jobs}
				disableSelectionOnClick
				columns={columns}
				checkboxSelection
				autoPageSize
				pagination
			/>
		</div>
	);
}
