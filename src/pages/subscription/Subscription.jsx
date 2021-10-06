import React, { useEffect, useState } from 'react';
import secondsLogo from '../../img/logo.svg';
import './subscription.css';
import { useDispatch, useSelector } from 'react-redux';
import { createCheckoutSession } from '../../store/actions/subscriptions';
import { STRIPE } from '../../constants';

const ProductDisplay = ({ plan, price, email, customerId }) => (
	<section className='d-flex flex-column align-items-center justify-content-between m-1 w-100'>
		<div className='d-flex flex-column'>
			<img className='img-fluid seconds-logo my-4' src={secondsLogo} alt='' />
			<div className='description'>
				<h3>Basic Plan</h3>
				<h5>£25.00 / month</h5>
			</div>
		</div>
		<form action={STRIPE.CHECKOUT_SESSION} method="POST">
			<input type='hidden' name='lookup_key' value='seconds' />
			<input type='hidden' name='email' value={email} />
			<input type='hidden' name='stripe_customer_id' value={customerId} />
			<button className='mt-4 btn btn-lg btn-primary rounded-3' id='checkout-and-portal-button' type='submit'>
				Checkout
			</button>
		</form>
	</section>
);

const SuccessDisplay = ({ stripeCustomerId }) => {
	return (
		<section className="d-flex flex-column align-items-center justify-content-center m-1 w-100">
			<div className='product Box-root'>
				<img className='img-fluid seconds-logo my-4' src={secondsLogo} alt='' />
				<div className='description Box-root'>
					<h3>Subscription to starter plan successful!</h3>
				</div>
			</div>
			<form action={STRIPE.PORTAL_SESSION} method='POST'>
				<input type='hidden' id='stripe-customer-id' name='stripe_customer_id' value={stripeCustomerId} />
				<button id='checkout-and-portal-button' type='submit'>
					Manage your billing information
				</button>
			</form>
		</section>
	);
};

const Message = ({ message }) => (
	<div className="d-flex h-100 justify-content-center align-items-center">
		<p>{message}</p>
	</div>
);

const Subscription = () => {
	const { user } = useSelector(state => state['currentUser']);
	const dispatch = useDispatch();
	let [message, setMessage] = useState('');
	let [success, setSuccess] = useState(false);
	let [portalLink, setPortalLink] = useState('');

	useEffect(() => {
		return () => {
			const query = new URLSearchParams(window.location.search);
			setSuccess(true);
			window
				.fetch(STRIPE.PORTAL_SESSION, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						session_id: query.get('session_id'),
					}),
				})
				.then(res => res.json())
				.then(data => {
					console.log(data)
					if (data.portal_url) {
						setPortalLink(data.portal_url);
					}
				})
				.catch(error => {
					setMessage(`Error occurred ${error}`);
				});
			if (query.get('canceled')) {
				setSuccess(false);
				setMessage('Order canceled');
			}
		};
	}, [portalLink]);

	const initiateSubscription = async lookupKey => {
		await dispatch(createCheckoutSession(user, lookupKey));
	};

	return (
		<div className='subscription justify-content-center align-items-center py-5'>
			{!success && !message ? (
				<ProductDisplay email={user.email} customerId={user.stripeCustomerId} />
			) : success && portalLink !== '' ? (
				<SuccessDisplay stripeCustomerId={user.stripeCustomerId} />
			) : (
				<Message message={message} />
			)}
		</div>
	);
};

export default Subscription;
