import React, { useEffect, useState } from 'react';
import secondsLogo from '../../img/logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { createCheckoutSession } from '../../store/actions/subscriptions';
import { STRIPE } from '../../constants';
import './subscription.css';

const ProductDisplay = ({ plan, price, description, email, customerId, lookupKey, numUsers, checkoutText }) => (
	<section className='d-flex flex-column mx-4 p-5 h-100 w-100 plan-wrapper'>
		<span className='text-uppercase text-muted mb-4 plan-text'>{`${plan} account`}</span>
		<span className='h1 price-text'>{`£${price.toFixed(2)} / month`}</span>
		<div className='d-flex flex-column mt-4'>
			<span className='text-uppercase text-muted mb-4 plan-text'>User Account</span>
			<div className='border border-2 border-grey py-4 ps-3'>{numUsers}</div>
			<div className='mt-3 text-muted description-text'>{description}</div>
		</div>
		<form
			action={
				!!process.env.REACT_APP_STRIPE_CHECKOUT_SESSION
					? String(process.env.REACT_APP_STRIPE_CHECKOUT_SESSION)
					: STRIPE.CHECKOUT_SESSION
			}
			method='POST'
		>
			<input type='hidden' name='lookup_key' value={lookupKey} />
			<input type='hidden' name='email' value={email} />
			<input type='hidden' name='stripe_customer_id' value={customerId} />
			<button
				className='mt-4 btn btn-lg btn-primary rounded-3'
				id='checkout-and-portal-button'
				type='submit'
				style={{ width: 175, height: 50 }}
			>
				<span className='text-uppercase'>{checkoutText}</span>
			</button>
		</form>
		<div className='py-4'>
			<span className='fw-bold'>{`Your card will be charged ${price} when you checkout`}</span>
		</div>
	</section>
);

const SuccessDisplay = ({ stripeCustomerId }) => {
	return (
		<section className='d-flex flex-column align-items-center justify-content-center m-1 w-100'>
			<div className='product Box-root'>
				<img className='img-fluid seconds-logo my-4' src={secondsLogo} alt='' />
				<div className='description Box-root'>
					<h3>Subscription to starter plan successful!</h3>
				</div>
			</div>
			<form
				action={
					!!process.env.REACT_APP_STRIPE_PORTAL_SESSION
						? String(process.env.REACT_APP_STRIPE_PORTAL_SESSION)
						: STRIPE.PORTAL_SESSION
				}
				method='POST'
			>
				<input type='hidden' id='stripe-customer-id' name='stripe_customer_id' value={stripeCustomerId} />
				<button id='checkout-and-portal-button' type='submit'>
					Manage your billing information
				</button>
			</form>
		</section>
	);
};

const Message = ({ message }) => (
	<div className='d-flex h-100 justify-content-center align-items-center'>
		<div className='alert alert-danger w-50 text-center'>{message}</div>
	</div>
);

const Subscription = () => {
	const { user } = useSelector(state => state['currentUser']);
	const dispatch = useDispatch();
	console.log(!!process.env.REACT_APP_STRIPE_CHECKOUT_SESSION);
	let [message, setMessage] = useState('');
	let [success, setSuccess] = useState(false);
	let [portalLink, setPortalLink] = useState('');

	/*useEffect(() => {
		return () => {
			const query = new URLSearchParams(window.location.search);
			setSuccess(true);
			window.fetch(STRIPE.PORTAL_SESSION, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					stripe_customer_id: user.stripeCustomerId
				})
			})
				.then(res => res.json())
				.then(data => {
					console.log('********************************');
					console.log('DATA:', data);
					console.log('********************************');
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
	}, [portalLink]);*/

	const initiateSubscription = async lookupKey => {
		await dispatch(createCheckoutSession(user, lookupKey));
	};

	return (
		<div className='subscription bg-light justify-content-center align-items-center py-5'>
			{!success && !message ? (
				<div className='d-flex px-5 h-100 w-100 align-items-center justify-content-center'>
					<ProductDisplay
						lookupKey={'basic'}
						plan={'Basic'}
						price={49.0}
						email={user.email}
						customerId={user.stripeCustomerId}
						numUsers={1}
						checkoutText={'Checkout'}
						description={'For developers and small businesses doing small or medium order volume'}
					/>
					<ProductDisplay
						lookupKey={'pro'}
						plan={'Pro'}
						price={499.0}
						email={user.email}
						customerId={user.stripeCustomerId}
						numUsers={5}
						description={
							'For medium, large and fast-growing businesses \n' + 'doing medium to large order volume'
						}
						checkoutText={'Upgrade'}
					/>
				</div>
			) : success && portalLink !== '' ? (
				<SuccessDisplay stripeCustomerId={user.stripeCustomerId} />
			) : (
				<Message message={message} />
			)}
		</div>
	);
};

export default Subscription;
