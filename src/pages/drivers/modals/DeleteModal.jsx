import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';

const DeleteModal = ({ type, onHide, show, centered, onConfirm, ids }) => {
	const drivers = useSelector(state => state['driversStore'].filter(driver => ids.includes(driver.id)))
	return (
		<Modal show={show} onHide={onHide} centered={!!centered}>
			<Modal.Header closeButton>
				<Modal.Title>Delete Drivers</Modal.Title>
			</Modal.Header>
			<Modal.Body className='d-flex flex-column justify-content-center align-items-center border-0'>
				<span className='fs-6'>The following drivers will be deleted</span>
				{drivers.map(driver => <span className="fw-bold">{driver.firstname} {driver.lastname}</span>)}
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={onHide}>
					Cancel
				</Button>
				<Button	onClick={() => onConfirm(type, ids)}>
					Confirm
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

DeleteModal.propTypes = {
	ids: PropTypes.array,
	type: PropTypes.string.isRequired,
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired
};

export default DeleteModal;
