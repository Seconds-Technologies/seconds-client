import React, { useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { fetchOrders } from '../../store/actions/shopify';
import { COLOURS, PATHS, STATUS } from '../../constants';
import './Orders.css';
import { getAllJobs } from '../../store/actions/delivery';

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
						dropoffLocation: { address, phoneNumber: phone, firstName, lastName },
					} = packages[0];
					let customerName = `${firstName} ${lastName}`;
					phone = phone === null || undefined ? 'N/A' : phone;
					let date = moment(createdAt).format('DD/MM/YYYY');
					let time = moment(createdAt).format('HH:mm:ss');
					return { id: orderNumber, status, customerName, phoneNumber: phone, address, date, time };
			  })
			: [];
	});

	useEffect(() => {
		isIntegrated ? dispatch(fetchOrders(email)) : dispatch(getAllJobs(apiKey, email));
	}, []);

	const columns = [
		{ field: 'id', headerName: 'ID', width: 100 },
		{
			field: 'status',
			headerName: 'Status',
			width: 150,
			renderCell: params => (
				<div className='h-75 d-flex align-items-center'>
					<div
						className='h-75 d-flex justify-content-center align-items-center'
						style={{
							paddingLeft: 20,
							paddingRight: 20,
							borderRadius: 50,
							backgroundColor:
								params.value === STATUS.NEW
									? COLOURS.NEW
									: params.value === STATUS.DISPATCHING
									? COLOURS.DISPATCHING
									: params.value === STATUS.EN_ROUTE
									? COLOURS.EN_ROUTE
									: params.value === STATUS.COMPLETED
									? COLOURS.COMPLETED
									: params.value === STATUS.CANCELLED
									? COLOURS.CANCELLED
									: COLOURS.EXPIRED,
						}}
					>
						<span className='text-light text-capitalize'>{params.value.toLowerCase()}</span>
					</div>
				</div>
			),
		},
		{ field: 'customerName', headerName: 'Customer', width: 150 },
		{ field: 'phoneNumber', headerName: 'Number', type: 'number', width: 150 },
		{ field: 'address', headerName: 'Address', width: 150 },
		{ field: 'date', headerName: 'Date', width: 150 },
		{ field: 'time', headerName: 'Time', width: 150 },
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
		<div className='ordersList'>
			<h3 className='totalOrders'>Total Orders</h3>
			<DataGrid
				sortingOrder={['desc', 'asc']}
				sortModel={[
					{
						field: 'id',
						sort: 'asc',
					},
				]}
				autoHeight
				className='grid'
				rows={isIntegrated ? orders : jobs}
				disableSelectionOnClick
				columns={columns}
				pageSize={10}
				checkboxSelection
			/>
		</div>
	);
}
