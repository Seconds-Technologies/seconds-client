import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ReviewOrders = ({ show, onHide, orders, onConfirm }) => {
	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Review Orders</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					<h1 className='fs-6'>The following orders do not fit within your allocated time window.</h1>
					<div className='d-flex flex-column'>
						{orders.map(({ jobSpecification: { orderNumber } }, index) => (
							<div>
								<span>⚠️{orderNumber}</span>
							</div>
						))}
					</div>
					<div className="mt-3">
						<span>Would you still like to proceed?</span>
					</div>
				</div>
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

ReviewOrders.propTypes = {};

export default ReviewOrders;
