import './payroll.css';
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CustomNoRowsOverlay from '../../../../components/CustomNoRowsOverlay';

const Payroll = props => {
	const drivers = useSelector(state => state['driversStore']);
	const [manual, setManual] = useState(false);
	const [scheduled, setSchedule] = useState(false);

	const invoices = useMemo(() => {
		return drivers.map(({ id, firstname, lastname }) => ({
			id,
			driverName: `${firstname} ${lastname}`,
			completedDeliveries: 25,
			basePay: '£100',
			bonuses: '£4.50',
			totalEarning: '£179.56',
			reimbursements: '£0',
			subtotal: 349.06
		}));
	}, [drivers]);

	const currencyFormatter = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP',
	});

	const gbpPrice = {
		type: 'number',
		width: 130,
		valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
		cellClassName: 'font-tabular-nums',
	};

	const columns = [
		{ field: 'id', headerName: 'driverId', width: 150, hide: true },
		{ field: 'driverName', headerName: 'Name', width: 150, flex: 0.1 },
		{
			field: 'completedDeliveries',
			headerName: 'Completed',
			width: 150
		},
		{
			field: 'basePay',
			headerName: 'Base Pay',
			width: 150,
			flex: 0.1
		},
		{
			field: 'bonuses',
			headerName: 'Bonuses',
			width: 150
		},
		{
			field: 'totalEarning',
			headerName: 'Total Earnings',
			width: 150
		},
		{
			field: 'reimbursements',
			headerName: 'Reimbursements',
			width: 150
		},
		{
			field: 'subtotal',
			headerName: 'SubTotal',
			width: 150,
			...gbpPrice
		},
		{
			field: 'action',
			headerName: 'Action',
			width: 150,
			flex: 0.2,
			renderCell: params => {
				return (
					<div className='d-flex align-items-center justify-content-center'>
						<button
							className='d-flex justify-content-center align-items-center table-edit-btn'
							onClick={() => alert(`You have paid ${params.row.subtotal} to ${params.row.driverName}!`)}
						>
							<span className='text-decoration-none'>Pay</span>
						</button>
					</div>
				);
			}
		}
	];

	return (
		<div className='tab-container px-3'>
			<div className='container-fluid'>
				<div className='mb-4'>
					<h1 className='workflow-header fs-4'>Select Payroll Option</h1>
					<p className='text-muted'>Let us know how you want to pay your drivers</p>
					<div>
						<div className='form-check'>
							<input
								className='form-check-input'
								type='radio'
								name='manualPay'
								id='dispatch-radio-3'
								onChange={e => {
									setSchedule(false)
									setManual(e.target.checked)
								}}
								checked={manual}
							/>
							<label className='form-check-label' htmlFor='dispatch-radio-3'>
								Manual Pay
							</label>
						</div>
						<div className='form-check'>
							<input
								className='form-check-input'
								type='radio'
								name='scheduledPay'
								id='dispatch-radio-4'
								onChange={e => {
									setManual(false);
									setSchedule(e.target.checked)
								}}
								checked={scheduled}
							/>
							<label className='form-check-label' htmlFor='dispatch-radio-4'>
								Schedule Pay
							</label>
						</div>
					</div>
				</div>
				<div className="mb-4 payroll-table">
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
						disableSelectionOnClick
						pagination
						autoPageSize
						autoHeight={false}
						checkboxSelection={false}
						components={{
							NoRowsOverlay: CustomNoRowsOverlay,
							Toolbar: GridToolbar
						}}
						columns={columns}
						rows={invoices}
					/>
				</div>
				<div className='d-flex justify-content-between'>
					<button
						className='btn btn-primary me-5'
						style={{
							height: 50,
							width: 150
						}}
					>
						Pay all
					</button>
					<div className="d-flex flex-column">
						<span className="fs-3">£{invoices[0].subtotal * 4}</span>
						<span className="fs-6">Total Payment</span>
					</div>
				</div>
			</div>
		</div>
	);
};

Payroll.propTypes = {};

export default Payroll;
