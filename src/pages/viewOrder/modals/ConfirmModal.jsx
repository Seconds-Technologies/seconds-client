import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { cancelDelivery } from '../../../store/actions/delivery';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const ConfirmModal = ({ show, toggleShow, orderId, showMessage }) => {
	const { apiKey } = useSelector(state => state['currentUser'].user)
	const dispatch = useDispatch();
	return (
		<Modal show={show} onHide={() => toggleShow(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Confirm Selection</Modal.Title>
			</Modal.Header>
			<Modal.Body className='d-flex justify-content-center align-items-center border-0'>
				<span className='fs-5'>Are you sure you want to cancel this order?</span>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={() => toggleShow(false)}>
					Cancel
				</Button>
				<Button
					onClick={() => {
						toggleShow(false);
						dispatch(cancelDelivery(apiKey, orderId)).then(message => showMessage(message));
					}}
				>
					Confirm
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

ConfirmModal.propTypes = {
	show: PropTypes.bool.isRequired,
	toggleShow: PropTypes.func.isRequired,
	orderId: PropTypes.string.isRequired,
	showMessage: PropTypes.func.isRequired
};

export default ConfirmModal;
