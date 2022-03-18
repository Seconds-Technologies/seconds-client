import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import moment from 'moment';

const ReviewOrders = ({ show, onHide, orders, onConfirm }) => {
	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Review Orders</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					<h1 className='fs-6'>The following orders do not fit within your allocated time window.</h1>
					<div className='list-group'>
						{orders.map(({ jobSpecification: { orderNumber, pickupStartTime, deliveries } }, index) => {
							const { dropoffLocation, dropoffEndTime } = deliveries[0];
							return (
								<div className='list-group-item list-group-item-action' aria-current='true' role="button">
									<div className='d-flex w-100 align-items-center'>
										<h5>⚠️ {orderNumber}</h5>
									</div>
									<span className="fs-5">{dropoffLocation.fullAddress}</span>
									<div className="d-flex flex-column">
									<span>Pickup: {moment(pickupStartTime).calendar()}</span>
									<span>Dropoff: {moment(dropoffEndTime).calendar()}</span>
									</div>
								</div>
							);
						})}
					</div>
					<div className='mt-3'>
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
