import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Elements } from '@stripe/react-stripe-js';
import CardSetupForm from '../../paymentMethod/CardSetupForm';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(String(process.env.REACT_APP_STRIPE_PUBLIC_KEY));

const PaymentInformation = ({ show, onHide }) => {
	const [toastMessage, setShowToast] = useState('');
	return (
		<Modal show={show} onHide={onHide} centered size='lg'>
			<Modal.Header>
				<Modal.Title>Payment Information</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='card card-3 rounded-3 p-4 my-3'>
					<Elements stripe={stripePromise}>
						<CardSetupForm showToast={setShowToast} />
					</Elements>
				</div>
			</Modal.Body>
		</Modal>
	);
};

PaymentInformation.propTypes = {
	
};

export default PaymentInformation;
