import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import moment from 'moment';

const ReviewOrders = ({ show, onGoBack, onHide, orders, onConfirm, startTime, endTime }) => {
	const [views, setEditable] = useState(
		orders.map(() => ({
			editing: false
		}))
	);

	useEffect(() => {
		console.log(views);
	}, [views]);

	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Review Orders</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					<h1 className='fs-6'>The following orders do not fit within your allocated time window.</h1>
					<span className='text-muted'>
						Time Window:{' '}
						<span className='fw-bold'>
							{startTime} - {endTime}
						</span>
					</span>
					<div className='list-group'>
						{orders.map(({ jobSpecification: { orderNumber, pickupStartTime, deliveries } }, index) => {
							const { dropoffLocation, dropoffEndTime } = deliveries[0];
							return (
								<div className='list-group-item list-group-item-action' aria-current='true' role='button'>
									<div className='d-flex w-100 align-items-center'>
										<h5>⚠️ {orderNumber}</h5>
									</div>
									<span className='fs-5'>{dropoffLocation.fullAddress}</span>
									<div className='d-flex align-items-center justify-content-between'>
										<div className='d-flex flex-column'>
											<span>Pickup: {moment(pickupStartTime).format('DD/MM/YYYY HH:mm')}</span>
											<span>Dropoff: {moment(dropoffEndTime).format('DD/MM/YYYY HH:mm')}</span>
										</div>
										{views[index].editing ? (
											<Button
												variant='success'
												size='sm'
												style={{ width: 50 }}
												onClick={() =>
													setEditable(prevState => {
														prevState[index].editing = false;
														return prevState;
													})
												}
											>
												Done
											</Button>
										) : (
											<Button
												size='sm'
												style={{ width: 50 }}
												onClick={() =>
													setEditable(prevState => {
														prevState[index].editing = true;
														return prevState;
													})
												}
											>
												Edit
											</Button>
										)}
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
				<Button variant='secondary' onClick={onGoBack}>
					Go Back
				</Button>
				<Button onClick={onConfirm}>Confirm</Button>
			</Modal.Footer>
		</Modal>
	);
};

ReviewOrders.propTypes = {};

export default ReviewOrders;
