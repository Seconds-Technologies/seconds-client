import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Confirm = ({ show, toggleShow, onConfirm }) => {
	return (
		<Modal show={show} onHide={() => toggleShow(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Disconnect Hubrise</Modal.Title>
			</Modal.Header>
			<Modal.Body className='d-flex justify-content-center align-items-center border-0'>
				<span className='fs-6'>
					Are you sure you'd like to disconnect your hubrise account?
				</span>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={() => toggleShow(false)}>
					Cancel
				</Button>
				<Button onClick={onConfirm}>Confirm</Button>
			</Modal.Footer>
		</Modal>
	);
};

Confirm.propTypes = {
	show: PropTypes.bool.isRequired,
	toggleShow: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired
};

export default Confirm;
