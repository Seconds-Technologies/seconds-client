import React from 'react';
import Modal from 'react-bootstrap/Modal';

const DeliveryProof = ({ show, onHide, signature = '', photo = '' }) => {
	return (
		<Modal show={show} onHide={onHide} size='lg' centered>
			<Modal.Header closeButton>
				<Modal.Title>Proof of Delivery</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='d-flex justify-content-center'>
					{signature && <img
						src={`data:image/jpeg;base64,${signature}`}
						className={'img-fluid'}
						style={{
							width: '300px',
							height: '300px'
						}}
						alt='signature-'
					/>}
					{photo && <img
						src={`data:image/jpeg;base64,${photo}`}
						className={'img-fluid'}
						style={{
							width: '300px',
							height: '300px'
						}}
						alt='delivery-photo'
					/>}
				</div>
			</Modal.Body>
		</Modal>
	);
};

DeliveryProof.propTypes = {};

export default DeliveryProof;
