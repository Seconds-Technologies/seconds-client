import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';

const DeliveryJob = ({ job, show, onHide }) => {
	return (
		<Modal show={show} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title>Your delivery Job!</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					<ul className='list-group list-group-flush'>
						{Object.entries(job).map(([key, value], index) => (
							<li key={index} className='list-group-item'>
								<h5 className='mb-1 text-capitalize'>{key.replace(/([A-Z])/g, ' $1').trim()}</h5>
								<div className='text-capitalize'>{key === "deliveryFee" ? `£${value.toFixed(2)}` : value}</div>
							</li>
						))}
					</ul>
				</div>
			</Modal.Body>
		</Modal>
	);
};

DeliveryJob.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	job: PropTypes.object.isRequired
};

export default DeliveryJob;
