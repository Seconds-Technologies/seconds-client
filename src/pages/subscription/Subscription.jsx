import './subscription.css';
import React, { useEffect, useState } from 'react';
import secondsLogo from '../../assets/img/logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { checkSubscriptionStatus } from '../../store/actions/stripe';
import Modal from 'react-bootstrap/Modal';
import { Mixpanel } from '../../config/mixpanel';
import classnames from 'classnames';

const ProductDisplay = ({ isComponent, plan, price, description, customerId, lookupKey, numUsers, checkoutText, commission }) => {
	const container = classnames({
		'd-flex': true,
		'flex-column': true,
		'mx-4': true,
		'px-5': true,
		'py-5': !isComponent,
		'py-4': true,
		'h-100': true,
		'w-100': true,
		'plan-wrapper': true
	});
	return (
		<section className={container}>
			<span className='text-uppercase text-muted mb-4 plan-text'>{`${plan} account`}</span>
			<span className='h1 price-text'>{`£${price} / month`}</span>
			<div className='d-flex flex-column mt-4'>
				<span className='text-uppercase text-muted mb-4 account-text'>User Accounts</span>
				<div className='border border-2 border-grey py-2 ps-3 w-75'>{numUsers}</div>
				<div className='mt-3 text-muted'>{description}</div>
			</div>
			<form action={`${String(process.env.REACT_APP_SERVER_HOST)}/server/subscription/create-checkout-session`} method='POST'>
				<input type='hidden' name='lookup_key' value={lookupKey} />
				<input type='hidden' name='onboarding' value={isComponent} />
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
				<small>
					*£{commission.price} / order after the first {commission.orders} orders
				</small>
			</div>
		</section>
	);
};

const SuccessDisplay = ({ isComponent, stripeCustomerId }) => {
	return (
		<section className='d-flex flex-column align-items-center success-wrapper py-5'>
			<div className='d-flex flex-column'>
				<img className='img-fluid seconds-logo' src={secondsLogo} alt='' />
				<div className='description Box-root'>
					<h3>You are subscribed!</h3>
				</div>
			</div>
			<form action={`${String(process.env.REACT_APP_SERVER_HOST)}/server/subscription/create-portal-session`} method='POST'>
				<input type='hidden' name='onboarding' value={isComponent} />
				<input type='hidden' id='stripe-customer-id' name='stripe_customer_id' value={stripeCustomerId} />
				<button id='checkout-and-portal-button' className='btn btn-primary btn-lg text-white mt-4' type='submit'>
					Manage your billing information
				</button>
			</form>
		</section>
	);
};

const Message = ({ message, onHide }) => (
	<Modal show={message} onHide={onHide} className='alert alert-danger' centered>
		<Modal.Header className='alert' closeButton>
			<Modal.Title>Error</Modal.Title>
		</Modal.Header>
		<Modal.Body>{message}</Modal.Body>
	</Modal>
);

const Subscription = props => {
	const { user } = useSelector(state => state['currentUser']);
	const dispatch = useDispatch();
	let [message, setMessage] = useState('');
	let [isSubscribed, setSubscribed] = useState(false);

	useEffect(() => {
		dispatch(checkSubscriptionStatus(user.email)).then((status) => setSubscribed(status));
		Mixpanel.people.increment('page_views');
	}, []);

	const containerClass = classnames({
		'd-flex': true,
		'pt-5': !props.isComponent,
		'pt-2': true,
		'justify-content-center': true,
		'align-items-center': true
	});

	return (
		<div className={containerClass}>
			<Message message={message} onHide={() => setMessage('')} />
			{user.subscriptionId || isSubscribed ? (
				<div className='d-flex flex-grow-1 flex-column align-items-center justify-content-center h-75 m-1'>
					<SuccessDisplay isComponent={props.isComponent} stripeCustomerId={user.stripeCustomerId} />
				</div>
			) : (
				<div className='d-flex px-5 h-100 w-100 align-items-center justify-content-center'>
					<ProductDisplay
						isComponent={props.isComponent}
						lookupKey={'growth'}
						plan={'Growth'}
						price={25}
						customerId={user.stripeCustomerId}
						numUsers={1}
						checkoutText={'Checkout'}
						description={'For developers and small businesses doing small or medium order volume'}
						commission={{ price: 0.49, orders: 20 }}
					/>
				</div>
			)}
		</div>
	);
};

export default Subscription;
