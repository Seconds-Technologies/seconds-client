import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';

const DeleteModal = ({ onHide, show, centered, onConfirm, title, description, data }) => {
	return (
		<Modal show={show} onHide={onHide} centered={!!centered}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='d-flex flex-column justify-content-center align-items-center border-0'>
				<span className='fs-6'>{description}</span>
				{data.map((name, index) => <span key={index} className="fw-bold">{name}</span>)}
			</Modal.Body>
			<Modal.Footer>
				<Button id="cancel-delete" variant='secondary' onClick={onHide}>
					Cancel
				</Button>
				<Button	id="confirm-delete" onClick={onConfirm}>
					Confirm
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

DeleteModal.propTypes = {
	data: PropTypes.array,
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired
};

export default DeleteModal;
