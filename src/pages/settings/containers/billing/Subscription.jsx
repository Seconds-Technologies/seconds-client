import './subscription.css';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkSubscriptionStatus, fetchInvoices } from '../../../../store/actions/stripe';
import { Mixpanel } from '../../../../config/mixpanel';
import classnames from 'classnames';
import moment from 'moment';
import CancelSubscription from '../../modals/CancelSubscription';
import SuccessModal from '../../modals/SuccessModal';
import invoice from '../../../../assets/img/invoice.svg';
import ChangeSubscription from '../../modals/ChangeSubscription';

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
			<span className='text-uppercase text-muted mb-4 plan-text'>{plan}</span>
			<span className='h1 price-text'>
				{typeof price === 'number' ? `£${price}` : price}
				{typeof price === 'number' && <small className='sub-price-text'>/ month</small>}
			</span>
			<div className='d-flex flex-column mt-4'>
				<span className='text-uppercase text-muted mb-4 account-text'>User Accounts</span>
				<div className='border border-2 border-grey py-2 ps-3' style={{ width: 300 }}>
					{numUsers}
				</div>
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
				<span className='fw-bold mb-3'>
					{typeof price === 'number'
						? `Your card will be charged £${price.toFixed(2)} when you checkout`
						: `Your card will not be charged at checkout`}
				</span>
				<small>{commission}</small>
			</div>
		</section>
	);
};

const Plan = ({ isComponent, stripeCustomerId, description, subscriptionPlan, price, openCancelPlan, openChangePlan }) => {
	return (
		<div>
			<h1 className='fs-3 py-2'>Your plan</h1>
			<div className='border py-4'>
				<div className='d-flex flex-column px-4'>
					<div className='d-flex justify-content-between align-items-center py-2'>
						<span className='display-5 text-capitalize plan-text'>{subscriptionPlan}</span>
						<span className='display-6 price-text'>{`£${price}/mo`}</span>
					</div>
					<p>{description}</p>
				</div>
				<hr className='mb-4' />
				<div className='d-flex px-4'>
					<input type='hidden' name='onboarding' value={isComponent} />
					<input type='hidden' id='stripe-customer-id' name='stripe_customer_id' value={stripeCustomerId} />
					<button id='checkout-and-portal-button' className='btn btn-primary text-white' type='button' onClick={openChangePlan}>
						Change Plan
					</button>
					<button id='checkout-and-portal-button' className='ms-4 btn btn-outline-dark' type='button' onClick={openCancelPlan}>
						Cancel Subscription
					</button>
				</div>
			</div>
		</div>
	);
};

const InvoiceHistory = ({ invoices }) => (
	<div className='table-responsive'>
		<h1 className='fs-3 py-2'>Invoice History</h1>
		<div className='table table-borderless d-flex flex-column border p-3 w-100'>
			{invoices.map(({ created, total, status, hosted_invoice_url }, index) => (
				<a
					key={index}
					href={hosted_invoice_url}
					target='_blank'
					role='button'
					className='d-flex justify-content-evenly py-3 my-2 border rounded-3 text-decoration-none text-dark'
				>
					<img src={invoice} className='img-fluid' width={20} height={30} alt='' />
					<span>{moment.unix(created).format('DD MMM YYYY')}</span>
					<span>£{total / 100}</span>
					<span className='text-capitalize'>{status}</span>
					<span>Growth Commission</span>
				</a>
			))}
		</div>
	</div>
);

const Subscription = props => {
	const { user } = useSelector(state => state['currentUser']);
	const dispatch = useDispatch();
	let [successMessage, setSuccessMessage] = useState('');
	let [changeModal, setChangeModal] = useState(false);
	let [cancelModal, setCancelModal] = useState(false);
	let [isSubscribed, setSubscribed] = useState(false);
	let [invoiceHistory, setInvoices] = useState([]);
	let [currentPlan, setCurrentPlan] = useState({
		amount: "Free",
		description: "Ideal for small businesses with small delivery volume who want to outsource their deliveries."
	});
	const openCancelSub = () => {
		props.setNavColor("transparent");
		setCancelModal(true);
	}
	const closeCancelSub = () => {
		setCancelModal(false);
	}
	const openChangeSub = () => {
		props.setNavColor("transparent");
		setChangeModal(true);
	}
	const closeChangeSub = () => setChangeModal(false);
	const modalRef = useRef();

	useEffect(() => {
		dispatch(checkSubscriptionStatus(user.email)).then(({ status, items, description }) => {
			items.length && setCurrentPlan(prevState => ({ ...items[0].plan, description }));
			setSubscribed(status === 'active' || status === 'trialing');
		});
		dispatch(fetchInvoices(user.email)).then(invoices => setInvoices(invoices));
		Mixpanel.people.increment('page_views');
	}, [props.location]);

	const containerClass = classnames({
		'container-fluid': !props.isComponent,
		'pt-2': props.isComponent,
		'justify-content-center': true,
		'align-items-center': true
	});

	return (
		<div ref={modalRef} className={containerClass}>
			<CancelSubscription
				centered
				show={cancelModal}
				onHide={closeCancelSub}
				onComplete={timestamp => setSuccessMessage(`Your subscription plan will cancel on ${moment.unix(timestamp).calendar()}`)}
			/>
			<ChangeSubscription show={changeModal} onHide={closeChangeSub} centered onChange={(newPlan) => alert(newPlan)}/>
			<SuccessModal ref={modalRef} show={!!successMessage} message={successMessage} onHide={() => setSuccessMessage('')} />
			{user.subscriptionId || isSubscribed ? (
				<div className='row'>
					<div className='col-md-6 col-sm-12'>
						<Plan
							isComponent={props.isComponent}
							stripeCustomerId={user.stripeCustomerId}
							subscriptionPlan={user.subscriptionPlan}
							description={currentPlan.description}
							price={currentPlan.amount / 100}
							openChangePlan={openChangeSub}
							openCancelPlan={openCancelSub}
						/>
					</div>
					<div className='col-md-6 col-sm-12'>
						<InvoiceHistory invoices={invoiceHistory} />
					</div>
				</div>
			) : (
				<div className='d-flex px-5 h-100 w-100 align-items-center justify-content-center'>
					<ProductDisplay
						isComponent={props.isComponent}
						lookupKey={'starter'}
						plan={'Starter'}
						price={'Free'}
						customerId={user.stripeCustomerId}
						numUsers={1}
						checkoutText={'Checkout'}
						description={'For businesses doing up to 120 orders per month.'}
						commission={`Zero commission`}
					/>
					<ProductDisplay
						isComponent={props.isComponent}
						lookupKey={'growth'}
						plan={'Growth'}
						price={49}
						customerId={user.stripeCustomerId}
						numUsers={1}
						checkoutText={'Checkout'}
						description={'For businesses doing up to 250 orders per month + 0.20p per order.'}
						commission={`*£0.20 per order`}
					/>
					<ProductDisplay
						isComponent={props.isComponent}
						lookupKey={'pro'}
						plan={'Pro'}
						price={89}
						customerId={user.stripeCustomerId}
						numUsers={1}
						checkoutText={'Checkout'}
						description={'For businesses doing up to 350 orders per month + 0.10p per order.'}
						commission={`*£0.10 per order`}
					/>
				</div>
			)}
		</div>
	);
};

export default Subscription;
