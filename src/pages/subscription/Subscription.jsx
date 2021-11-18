import './subscription.css';
import React, { useEffect, useState } from 'react';
import secondsLogo from '../../assets/img/logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { checkSubscriptionStatus } from '../../store/actions/subscriptions';
import Modal from 'react-bootstrap/Modal';
import { Mixpanel } from '../../config/mixpanel';

const ProductDisplay = ({ plan, price, description, email, customerId, lookupKey, numUsers, checkoutText, commission }) => (
	<section className='d-flex flex-column mx-4 p-5 h-100 w-100 plan-wrapper'>
		<span className='text-uppercase text-muted mb-4 plan-text'>{`${plan} account`}</span>
		<span className='h1 price-text'>{`£${price} / month`}</span>
		<div className='d-flex flex-column mt-4'>
			<span className='text-uppercase text-muted mb-4 account-text'>User Accounts</span>
			<div className='border border-2 border-grey py-2 ps-3 w-75'>{numUsers}</div>
			<div className='mt-3 text-muted'>{description}</div>
		</div>
		<form
			action={`${String(process.env.REACT_APP_SERVER_HOST)}/server/subscription/create-checkout-session`}
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
		<div className='py-4 d-flex flex-column'>
			<span className='fw-bold mb-3'>{`Your card will be charged £${price.toFixed(2)} when you checkout`}</span>
			<small>*£{commission.price} / order after the first {commission.orders} orders</small>
		</div>
	</section>
);

const SuccessDisplay = ({ stripeCustomerId }) => {
	return (
		<section className='d-flex flex-column align-items-center success-wrapper py-5'>
			<div className="d-flex flex-column">
				<img className='img-fluid seconds-logo' src={secondsLogo} alt='' />
				<div className='description Box-root'>
					<h3>You are subscribed!</h3>
				</div>
			</div>
			<form
				action={`${String(process.env.REACT_APP_SERVER_HOST)}/server/subscription/create-portal-session`}
				method='POST'
			>
				<input type='hidden' id='stripe-customer-id' name='stripe_customer_id' value={stripeCustomerId} />
				<button id='checkout-and-portal-button' className='btn btn-primary btn-lg text-white mt-4' type='submit'>
					Manage your billing information
				</button>
			</form>
		</section>
	);
};

const Message = ({ message, onHide }) => (
	<Modal show={message} onHide={onHide} className="alert alert-danger" centered>
		<Modal.Header className='alert' closeButton>
			<Modal.Title>Error</Modal.Title>
		</Modal.Header>
		<Modal.Body>{message}</Modal.Body>
	</Modal>
);

const Subscription = () => {
	const { user } = useSelector(state => state['currentUser']);
	const dispatch = useDispatch();
	let [message, setMessage] = useState('');
	let [portalLink, setPortalLink] = useState('');

	useEffect(() => {
		(async function fetchSubscription(){
			await dispatch(checkSubscriptionStatus(user.email))
		})()
		Mixpanel.people.increment("page_views")
		return () => {
			const query = new URLSearchParams(window.location.search);
			window.fetch(`${process.env.REACT_APP_SERVER_HOST}/server/subscription/create-portal-session`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						stripe_customer_id: user.stripeCustomerId,
					}),
				})
				.then(res => {
					console.log(res);
					return res.json();
				})
				.then(data => {
					if (data.portal_url) {
						setPortalLink(data.portal_url);
					}
				})
				.catch(error => {
					setMessage(`Error occurred ${error}`);
				});
			if (query.get('canceled')) {
				setMessage('Order canceled');
			}
		};
	}, [portalLink]);

	return (
		<div className='subscription d-flex bg-light justify-content-center align-items-center py-5'>
			<Message message={message} onHide={() => setMessage('')} />
			{!user.subscriptionId ? (
				<div className='d-flex px-5 h-100 w-100 align-items-center justify-content-center'>
					<ProductDisplay
						lookupKey={'growth'}
						plan={'Growth'}
						price={25}
						email={user.email}
						customerId={user.stripeCustomerId}
						numUsers={1}
						checkoutText={'Checkout'}
						description={'For developers and small businesses doing small or medium order volume'}
						commission={{price: 0.49, orders: 20}}
					/>
					<ProductDisplay
						lookupKey={'enterprise'}
						plan={'Enterprise'}
						price={49}
						email={user.email}
						customerId={user.stripeCustomerId}
						numUsers={5}
						description={
							'For medium, large and fast-growing businesses \n' + 'doing medium to large order volume'
						}
						checkoutText={'Upgrade'}
						commission={{price: 0.99, orders: 50}}
					/>
				</div>
			) : (
				<div className="d-flex flex-grow-1 flex-column align-items-center justify-content-center h-75 m-1">
					<SuccessDisplay stripeCustomerId={user.stripeCustomerId} />
				</div>
			)}
		</div>
	);
};

export default Subscription;
