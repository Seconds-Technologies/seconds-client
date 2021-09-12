import React, { useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { fetchOrders } from '../../store/actions/shopify';
import { PATHS } from '../../constants';
import './Orders.css';
import clsx from 'clsx';

export default function Orders() {
	const dispatch = useDispatch();
	const orders = useSelector(state => {
		const allOrders = state['shopifyOrders'].allOrders;
		return allOrders.map(({ order_number, status, shipping_address, phone, created_at, customer }) => {
			let { address1, city, zip } = shipping_address;
			let customerName = `${customer['first_name']} ${customer['last_name']}`;
			let address = `${address1} ${city} ${zip}`;
			phone = phone === null || undefined ? 'N/A' : phone;
			let date = moment(created_at).format('DD/MM/YYYY');
			let time = moment(created_at).format('HH:MM:SS');
			return { id: order_number, status, customerName, phoneNumber: phone, address, date, time };
		});
	});
	const { isIntegrated } = useSelector(state => state['shopifyUser']);
	const { email } = useSelector(state => state['currentUser'].user);

	useEffect(() => {
		dispatch(fetchOrders(email));
	}, []);

	const columns = [
		{ field: 'id', headerName: 'ID', width: 100 },
		{
			field: 'status',
			headerName: 'Status',
			width: 150,
			cellClassName: params =>
				clsx({
					completed: params.value === 'Completed',
					inProgress: params.value === 'In Progress',
					unpacked: params.value === 'Unpacked',
				}),
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
						field: 'date',
						sort: 'desc',
					},
				]}
				autoHeight
				className='grid'
				rows={orders}
				disableSelectionOnClick
				columns={columns}
				pageSize={10}
				checkboxSelection
			/>
		</div>
	);
}
