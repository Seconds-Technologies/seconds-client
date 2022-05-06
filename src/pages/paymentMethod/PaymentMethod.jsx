import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(String(process.env.REACT_APP_STRIPE_PUBLIC_KEY));

const PaymentMethod = props => {
	return (
		<div className="pt-5">
			<div className='d-flex align-items-center justify-content-center'>

			</div>
		</div>
	);
};



export default PaymentMethod;