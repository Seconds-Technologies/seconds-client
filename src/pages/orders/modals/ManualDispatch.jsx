import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ManualDispatch = ({ show, onHide, driverName, onConfirm }) => {
	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Confirm Driver</Modal.Title>
			</Modal.Header>
			<Modal.Body className='d-flex justify-content-center align-items-center border-0'>
				<span className='fs-4'>
					You are confirming{' '}
					<span className='fw-bold'>
						{driverName}
					</span>
					!
				</span>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={onHide}>
					Cancel
				</Button>
				<Button onClick={onConfirm}>Confirm</Button>
			</Modal.Footer>
		</Modal>
	);
};

ManualDispatch.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	driverName: PropTypes.string.isRequired,
	onConfirm: PropTypes.func.isRequired
};

export default ManualDispatch;
