import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CardSetupForm from './CardSetupForm';
import { Mixpanel } from '../../config/mixpanel';
import classnames from 'classnames';
import SuccessToast from '../../modals/SuccessToast';

const stripePromise = loadStripe(String(process.env.REACT_APP_STRIPE_PUBLIC_KEY));

const PaymentMethod = props => {
	const [toastMessage, setShowToast] = useState('');

	useEffect(() => {
		Mixpanel.people.increment('page_views');
	}, []);

	const containerClass = classnames({
		'page-container': !props.isComponent,
		'pt-5': true,
	});

	return (
		<div className={containerClass}>
			<div className='d-flex align-items-center justify-content-center'>
				<SuccessToast toggleShow={setShowToast} message={toastMessage} delay={3000} position={'topRight'}/>
				<div className='w-md'>
					<h1>Payment Information</h1>
					{!props.isComponent && <span className='small'>Your card will be used for collecting payments for your deliveries.</span>}
					<div className='card card-3 rounded-3 p-4 my-3'>
						<Elements stripe={stripePromise}>
							<CardSetupForm {...props} showToast={setShowToast} />
						</Elements>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentMethod;