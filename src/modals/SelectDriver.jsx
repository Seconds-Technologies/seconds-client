import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { BACKGROUND, DRIVER_STATUS, PROVIDER_TYPES, STATUS_COLOURS, VEHICLE_TYPES } from '../constants';
import IconButton from '@mui/material/IconButton';
import { BsInfoCircle } from 'react-icons/bs';
import Tooltip from '@mui/material/Tooltip';

const SelectDriver = ({ show, onHide, drivers, showConfirmDialog, selectDriver, createUnassigned, showCreateBtn=true, disabled=false }) => {

	return (
		<Modal show={show} onHide={onHide} size='lg'>
			<Modal.Header closeButton>
				<Modal.Title>Assign To Your Driver</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					<table className='table'>
						<thead>
							<tr>
								<th scope='col'>Name</th>
								<th scope='col'>Phone Number</th>
								<th scope='col'>Status</th>
								<th scope='col'>Vehicle</th>
								<th scope='col' />
							</tr>
						</thead>
						<tbody>
							{drivers.map(
								({ id, firstname, lastname, phone, status, vehicle, verified }, index) =>
									verified && (
										<tr key={index}>
											<td className='col text-capitalize'>
												{firstname} {lastname}
											</td>
											<td className='col'>{phone}</td>
											<td className='col'>
												<div className='h-75 d-flex align-items-center'>
													<div
														className='h-75 d-flex justify-content-center align-items-center'
														style={{
															width: 110,
															borderRadius: 10,
															backgroundColor:
																status === DRIVER_STATUS.AVAILABLE
																	? BACKGROUND.COMPLETED
																	: status === DRIVER_STATUS.ASSIGNED
																	? BACKGROUND.EN_ROUTE
																	: status === DRIVER_STATUS.BUSY
																	? BACKGROUND.DISPATCHING
																	: status === DRIVER_STATUS.OFFLINE
																	? BACKGROUND.CANCELLED
																	: BACKGROUND.UNKNOWN
														}}
													>
														<span
															className='text-capitalize'
															style={{
																color:
																	status === DRIVER_STATUS.AVAILABLE
																		? STATUS_COLOURS.COMPLETED
																		: status === DRIVER_STATUS.ASSIGNED
																		? STATUS_COLOURS.EN_ROUTE
																		: status === DRIVER_STATUS.BUSY
																		? STATUS_COLOURS.DISPATCHING
																		: status === DRIVER_STATUS.OFFLINE
																		? STATUS_COLOURS.CANCELLED
																		: STATUS_COLOURS.UNKNOWN
															}}
														>
															{status.toLowerCase()}
														</span>
													</div>
												</div>
											</td>
											<td className='col text-capitalize'>{VEHICLE_TYPES.find(({ value }) => value === vehicle).label}</td>
											<td className='col'>
												<button
													id={id}
													disabled={disabled}
													className='d-flex justify-content-center align-items-center action-button'
													onClick={() => {
														onHide();
														selectDriver(prevState => ({
															...prevState,
															type: PROVIDER_TYPES.DRIVER,
															id,
															name: `${firstname} ${lastname}`
														}));
														showConfirmDialog(true);
													}}
												>
													<span className='text-decoration-none'>Select</span>
												</button>
											</td>
										</tr>
									)
							)}
						</tbody>
					</table>
					{showCreateBtn && <div className='d-flex justify-content-end align-content-center'>
						<button
							role="button"
							className='action-button'
							onClick={() => {
								onHide();
								createUnassigned(null);
							}}
						>
							Create
						</button>
						<Tooltip title='Create an unassigned job to dispatch later' className='mx-2' placement='right-start'>
							<IconButton size='small'>
								<BsInfoCircle />
							</IconButton>
						</Tooltip>
					</div>}
				</div>
			</Modal.Body>
		</Modal>
	);
};

SelectDriver.propTypes = {
	drivers: PropTypes.array.isRequired,
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	selectDriver: PropTypes.func.isRequired,
	showConfirmDialog: PropTypes.func.isRequired,
	showCreateBtn: PropTypes.bool,
	disabled: PropTypes.bool
};

export default SelectDriver;
