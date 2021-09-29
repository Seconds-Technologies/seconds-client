import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CardSetupForm from './CardSetupForm';
import './PaymentMethod.css';

//const stripePromise = loadStripe('pk_live_51JdEkaEJUYyCW3GHvJM0z1jCiy2mv078mWcFnGB62wkHySznwxN0Hkvzlh4eytlpA6of9VGIjp42lXmsLuJoRRq400PKk3zJAF');
const stripePromiseTest = loadStripe('pk_test_51JdEkaEJUYyCW3GHyXT6h77JbzzeO5qfj4JuF98AIC13lLjzHiAyRdbYCH5gmeKi8j6VAZ7l2tXcESsq9xSmJvMx00rPtDSwZO');

const PaymentMethod = props => {
	return <div className='payment-method-container'>
		<div className='d-flex h-100 align-items-center justify-content-center'>
			<div className='form-wrapper'>
				<h1>Payment Information</h1>
				<div className='border border-2 rounded-3 p-4'>
					<Elements stripe={stripePromiseTest}>
						<CardSetupForm {...props} />
					</Elements>
				</div>
			</div>
		</div>
	</div>;

};

export default PaymentMethod;