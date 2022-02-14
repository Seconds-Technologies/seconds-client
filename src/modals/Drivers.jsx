import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';

const Drivers = ({ show, toggleShow, drivers, showConfirmDialog, selectDriver }) => {
	return (
		<Modal show={show} onHide={() => toggleShow(false)} size='lg'>
			<Modal.Header closeButton>
				<Modal.Title>Assign To Your Driver</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					<table className='table'>
						<thead>
						<tr>
							<th scope='col'>Name</th>
							<th scope='col'>
								Phone Number
							</th>
							<th scope='col'>Status</th>
							<th scope='col'>Vehicle</th>
							<th scope='col' />
						</tr>
						</thead>
						<tbody>
						{drivers.map(({ id, firstname, lastname, phone, status, vehicle }, index) => (
							<tr key={index}>
								<td className='col text-capitalize'>
									{firstname} {lastname}
								</td>
								<td className='col'>
									{phone}
								</td>
								<td className='col'>{status}</td>
								<td className='col text-capitalize'>{vehicle}</td>
								<td className='col'>
									<button
										className='d-flex justify-content-center align-items-center OrdersListEdit'
										onClick={() => {
											toggleShow(false);
											selectDriver(id);
											showConfirmDialog(true);
										}}
									>
										<span className='text-decoration-none'>Select</span>
									</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			</Modal.Body>
		</Modal>
	)
};

Drivers.propTypes = {
	drivers: PropTypes.array.isRequired,
	show: PropTypes.bool.isRequired,
	toggleShow: PropTypes.func.isRequired,
	selectDriver: PropTypes.func.isRequired,
	showConfirmDialog: PropTypes.func.isRequired
};

export default Drivers;
