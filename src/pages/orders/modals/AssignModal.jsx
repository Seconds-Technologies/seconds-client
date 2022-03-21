import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';

const AssignModal = ({ show, onHide, assignToDriver, outsourceToCourier }) => {
	return (
		<Modal show={show} onHide={onHide} centered className='bg-transparent'>
			<Modal.Header closeButton>
				<Modal.Title>Assign Your Order</Modal.Title>
			</Modal.Header>
			<div className='container py-5'>
				<div className='d-flex align-items-center justify-content-around'>
					<button className='btn btn-lg btn-primary' style={{ width: 150, height: 50 }} onClick={assignToDriver}>
						Select Driver
					</button>
					<button className='btn btn-lg btn-primary' style={{ width: 150, height: 50 }} onClick={outsourceToCourier}>
						Outsource
					</button>
				</div>
			</div>
		</Modal>
	);
};

AssignModal.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired
};

export default AssignModal;
