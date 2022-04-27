import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Elements } from '@stripe/react-stripe-js';
import CardSetupForm from '../../../../paymentMethod/CardSetupForm';
import { loadStripe } from '@stripe/stripe-js';
import { SUBSCRIPTION_PLANS } from '../../../../../constants';

const stripePromise = loadStripe(String(process.env.REACT_APP_STRIPE_PUBLIC_KEY));

const PaymentInformation = ({ show, onHide, newPlan, isLoading, onSubscribe }) => {
	const [toastMessage, setShowToast] = useState('');

	const priceText = useMemo(() => {
		if (newPlan) {
			const price = SUBSCRIPTION_PLANS[newPlan.toUpperCase()].price
			if (typeof price === "number") {
				return `£${price}/month`
			}
		}
		return ""
	}, [newPlan])

	return (
		<Modal show={show} onHide={onHide} centered size='lg'>
			<Modal.Header closeButton>
				<Modal.Title>Payment Information</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='px-4 my-3'>
					<div className="mb-3">
						<span className="fs-2 fw-bold text-capitalize">{newPlan} Plan<small className="ms-2 fs-5 fw-normal text-muted">{priceText}</small></span>
					</div>
					<Elements stripe={stripePromise}>
						<CardSetupForm showToast={setShowToast} lookupKey={newPlan} onSubscribe={onSubscribe} loading={isLoading}/>
					</Elements>
				</div>
			</Modal.Body>
		</Modal>
	);
};

PaymentInformation.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	newPlan: PropTypes.string,
	onSubscribe: PropTypes.func.isRequired,
};

export default PaymentInformation;
