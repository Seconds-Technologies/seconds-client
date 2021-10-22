import React, { useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { fetchOrders } from '../../store/actions/shopify';
import { BACKGROUND, COLOURS, PATHS, STATUS } from '../../constants';
import { getAllJobs, subscribe, unsubscribe } from '../../store/actions/delivery';
import './Orders.css';

export default function Orders() {
	const dispatch = useDispatch();
	const { email, apiKey } = useSelector(state => state['currentUser'].user);
	const { isIntegrated } = useSelector(state => state['shopifyStore']);
	const orders = useSelector(state => {
		const allOrders = state['shopifyOrders'].allOrders;
		return isIntegrated
			? allOrders.map(({ order_number, status, shipping_address, phone, created_at, customer }) => {
					let { address1, city, zip } = shipping_address;
					let customerName = `${customer['first_name']} ${customer['last_name']}`;
					let address = `${address1} ${city} ${zip}`;
					phone = phone === null || undefined ? 'N/A' : phone;
					let date = moment(created_at).format('DD/MM/YYYY');
					let time = moment(created_at).format('HH:mm:ss');
					return { id: order_number, status, customerName, phoneNumber: phone, address, date, time };
			  })
			: [];
	});
	const jobs = useSelector(state => {
		const { allJobs } = state['deliveryJobs'];
		return apiKey
			? allJobs.map(({ status, jobSpecification: { orderNumber, packages }, createdAt }) => {
					let {
						dropoffLocation: { fullAddress: address, phoneNumber, firstName, lastName },
					} = packages[0];
					let customerName = `${firstName} ${lastName}`;
					phoneNumber = phoneNumber === null || undefined ? 'N/A' : phoneNumber;
					let date = moment(createdAt).utc(true).format('DD/MM/YYYY');
					let time = moment(createdAt).utc(true).format('HH:mm:ss');
					return { id: orderNumber, status, customerName, phoneNumber, address, date, time };
			  })
			: [];
	});

	useEffect(() => {
		isIntegrated && dispatch(fetchOrders(email));
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
										? COLOURS.NEW
										: params.value === STATUS.PENDING
										? COLOURS.PENDING
										: params.value === STATUS.DISPATCHING
										? COLOURS.DISPATCHING
										: params.value === STATUS.EN_ROUTE
										? COLOURS.EN_ROUTE
										: params.value === STATUS.COMPLETED
										? COLOURS.COMPLETED
										: params.value === STATUS.CANCELLED
										? COLOURS.CANCELLED
										: COLOURS.UNKNOWN,
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
		{ field: 'date', headerName: 'Date', width: 130 },
		{ field: 'time', headerName: 'Time', width: 130 },
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
						field: 'id',
						sort: 'desc',
					},
				]}
				autoHeight
				className='mt-3 mx-3'
				rows={isIntegrated ? orders : jobs}
				disableSelectionOnClick
				columns={columns}
				pageSize={10}
				checkboxSelection
			/>
		</div>
	);
}
