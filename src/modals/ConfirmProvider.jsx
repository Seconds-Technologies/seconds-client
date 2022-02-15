import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ConfirmProvider = ({ show, toggleShow, onConfirm, provider }) => {
	return (
		<Modal show={show} onHide={() => toggleShow(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Confirm Selection</Modal.Title>
			</Modal.Header>
			<Modal.Body className='d-flex justify-content-center align-items-center border-0'>
				<span className='fs-4'>
					You are confirming <span className='fw-bold'>{provider.name}</span>!
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

ConfirmProvider.propTypes = {
	show: PropTypes.bool.isRequired,
	provider: PropTypes.object.isRequired,
	toggleShow: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired
};

export default ConfirmProvider;
