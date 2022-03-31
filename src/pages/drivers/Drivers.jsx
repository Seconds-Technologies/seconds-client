import './drivers.css';
import React, { useCallback, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import DriverModal from './modals/DriverModal';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { changeDriver, createDriver, deleteDrivers, subscribe, unsubscribe } from '../../store/actions/drivers';
import SuccessToast from '../../modals/SuccessToast';
import Switch from 'react-switch';
import { BACKGROUND, STATUS_COLOURS, DRIVER_STATUS, VEHICLE_TYPES } from '../../constants';
import { Mixpanel } from '../../config/mixpanel';
import CustomFooter from '../../components/CustomFooter';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import DeleteModal from './modals/DeleteModal';
import { DELETE_TYPES } from './constants';

const Drivers = props => {
	const dispatch = useDispatch();
	const [driverFormType, showDriverForm] = useState('');
	const [deleteModal, setDeleteModal] = useState({ show: false, type: DELETE_TYPES.BATCH, ids: [] });
	const [selectionModel, setSelectionModel] = React.useState([]);
	const [successMessage, setSuccess] = useState('');
	const [selectedDriver, selectDriver] = useState({
		firstname: '',
		lastname: '',
		email: '',
		phone: '',
		vehicle: ''
	});
	const { email } = useSelector(state => state['currentUser'].user);
	const drivers = useSelector(state => {
		return state['driversStore'].map(driver => {
			let vehicleType = VEHICLE_TYPES.find(({ value }) => value === driver.vehicle);
			return {
				id: driver.id,
				firstname: driver.firstname,
				lastname: driver.lastname,
				phone: driver.phone,
				email: driver.email,
				vehicleCode: driver.vehicle,
				vehicleName: vehicleType ? vehicleType.label : driver.vehicle,
				status: driver.status,
				isOnline: driver.isOnline,
				verified: driver.verified
			};
		});
	});
	const saveDriver = useCallback(values => {
		console.log(values);
		values.type === 'create'
			? dispatch(createDriver(values, email)).then(driver => {
					console.table(driver);
					showDriverForm('');
					setSuccess('Your driver has been notified. Once verified, you will be able to assign orders to them');
			  })
			: dispatch(changeDriver(values, email)).then(driver => {
					console.table(driver);
					showDriverForm('');
					setSuccess('Driver details have been updated!');
			  });
	}, []);

	const onIcon = <div className='switch-icon'>On</div>;
	const offIcon = <div className='switch-icon'>Off</div>;
	const handleOpen = (type, ids) => setDeleteModal(prevState => ({ show: true, type, ids }));
	const handleClose = () => setDeleteModal(prevState => ({ ...prevState, show: false }));

	const confirmDelete = useCallback(
		() => {
			console.log(deleteModal)
			dispatch(deleteDrivers(email, deleteModal.ids)).then(() => console.log("Drivers deleted successfully!"));
			handleClose()
		},
		[selectionModel, deleteModal.ids]
	);

	const columns = [
		{ field: 'id', headerName: 'Driver Id', width: 150, hide: true },
		{ field: 'firstname', headerName: 'First Name', width: 150, flex: 0.5 },
		{ field: 'lastname', headerName: 'Last Name', width: 150, flex: 0.5 },
		{ field: 'phone', headerName: 'Phone Number', width: 150 },
		{ field: 'vehicleCode', headerName: 'Vehicle Code', hide: true },
		{ field: 'vehicleName', headerName: 'Vehicle', width: 150 },
		{
			field: 'status',
			headerName: 'Job Status',
			width: 150,
			renderCell: params => (
				<div className='h-75 d-flex align-items-center'>
					<div
						className='h-75 d-flex justify-content-center align-items-center'
						style={{
							width: 110,
							borderRadius: 10,
							backgroundColor:
								params.value === DRIVER_STATUS.AVAILABLE
									? BACKGROUND.COMPLETED
									: params.value === DRIVER_STATUS.ASSIGNED
									? BACKGROUND.EN_ROUTE
									: params.value === DRIVER_STATUS.BUSY
									? BACKGROUND.DISPATCHING
									: params.value === DRIVER_STATUS.OFFLINE
									? BACKGROUND.CANCELLED
									: BACKGROUND.UNKNOWN
						}}
					>
						<span
							className='text-capitalize'
							style={{
								color:
									params.value === DRIVER_STATUS.AVAILABLE
										? STATUS_COLOURS.COMPLETED
										: params.value === DRIVER_STATUS.ASSIGNED
										? STATUS_COLOURS.EN_ROUTE
										: params.value === DRIVER_STATUS.BUSY
										? STATUS_COLOURS.DISPATCHING
										: params.value === DRIVER_STATUS.OFFLINE
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
		{
			field: 'isOnline',
			headerName: 'Shift Status',
			type: 'boolean',
			width: 120,
			renderCell: params => {
				return (
					<Switch
						onColor={'#9FEA86'}
						checkedIcon={onIcon}
						uncheckedIcon={offIcon}
						handleDiameter={20}
						onChange={() => console.log(null)}
						checked={params.value}
					/>
				);
			}
		},
		{
			field: 'createdAt',
			sortComparator: (v1, v2) => moment(v2).diff(moment(v1)),
			hide: true
		},
		{ field: 'verified', headerName: 'Verified', type: 'boolean', width: 120 },
		{
			field: 'action',
			headerName: 'Action',
			width: 150,
			renderCell: params => {
				return (
					<div className='d-flex align-items-center justify-content-between'>
						<button
							className='d-flex justify-content-center align-items-center table-edit-btn'
							onClick={() => {
								selectDriver(params.row);
								showDriverForm('update');
							}}
						>
							<span className='text-decoration-none'>Edit</span>
						</button>
						<Button color='error' size='small' onClick={() => handleOpen(DELETE_TYPES.SINGLE, [params.row.id])}>
							<DeleteIcon />
						</Button>
					</div>
				);
			}
		}
	];

	useEffect(() => {
		Mixpanel.people.increment('page_views');
		dispatch(subscribe(email));
		return () => dispatch(unsubscribe());
	}, []);

	useEffect(() => {
		console.log(deleteModal)
	}, [deleteModal]);


	return (
		<div className='page-container d-flex flex-column px-2 py-4'>
			<DriverModal type={driverFormType} show={!!driverFormType} toggleShow={showDriverForm} onSubmit={saveDriver} details={selectedDriver} />
			<SuccessToast message={successMessage} toggleShow={setSuccess} delay={5000} position='bottomRight' />
			<DeleteModal
				data={drivers.filter(({ id }) => deleteModal.ids.includes(id)).map(({firstname, lastname}) => `${firstname} ${lastname}`)}
				show={deleteModal.show}
				onHide={handleClose}
				title="Delete Drivers"
				description="The following drivers will be deleted"
				centered
				onConfirm={confirmDelete}
			/>
			<div className='d-flex mx-3 justify-content-between '>
				<h3>Your Drivers</h3>
				<button
					className='btn btn-primary btn-lg'
					style={{ width: 150 }}
					onClick={() => {
						selectDriver({
							firstname: '',
							lastname: '',
							email: '',
							phone: '',
							vehicle: ''
						});
						showDriverForm('create');
					}}
				>
					<span className='btn-text'>+ New Driver</span>
				</button>
			</div>
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
				onSelectionModelChange={newSelectionModel => {
					setSelectionModel(newSelectionModel);
					console.log(newSelectionModel);
				}}
				autoHeight={false}
				className='mt-3 mx-3'
				rows={drivers}
				disableSelectionOnClick
				columns={columns}
				checkboxSelection
				autoPageSize
				pagination
				components={
					selectionModel.length
						? {
								Footer: () => <CustomFooter onDelete={() => handleOpen(DELETE_TYPES.BATCH, selectionModel)} title="Bulk Delete"/>
						  }
						: undefined
				}
			/>
		</div>
	);
};

export default Drivers;
