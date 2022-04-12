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
				<span className='fw-bold mb-3'>{`Your card will be charged £${price.toFixed(2)} when you checkout`}</span>
				<small>
					*£{commission.price} / order after the first {commission.orders} orders
				</small>
			</div>
		</section>
	);
};

const Plans = ({ isComponent, stripeCustomerId, subscriptionPlan, price, showModal }) => {
	return (
		<div>
			<h1 className='fs-3 py-2'>Plans</h1>
			<div className='d-flex flex-column border p-3'>
				<div className='d-flex justify-content-between align-items-center py-2'>
					<span className='display-5 text-capitalize plan-text'>{subscriptionPlan}</span>
					<span className='display-6 price-text'>{`£${price}/mo`}</span>
				</div>
				<p>Ideal for small businesses with less than 350 orders per month. The platform will not accept anymore than 350 orders.</p>
				<form action={`${String(process.env.REACT_APP_SERVER_HOST)}/server/subscription/create-portal-session`} method='POST'>
					<input type='hidden' name='onboarding' value={isComponent} />
					<input type='hidden' id='stripe-customer-id' name='stripe_customer_id' value={stripeCustomerId} />
					<button id='checkout-and-portal-button' className='btn btn-primary text-white mt-4' type='submit'>
						Change Plan
					</button>
					<button id='checkout-and-portal-button' className='ms-4 btn btn-outline-dark mt-4' type='button' onClick={showModal}>
						Cancel Subscription
					</button>
				</form>
			</div>
		</div>
	);
};

const InvoiceHistory = ({ invoices }) => (
	<div className="table-responsive">
		<h1 className='fs-3 py-2'>Invoice History</h1>
		<div className='table table-borderless d-flex flex-column border p-3 w-100'>
			{/*<thead className='d-flex justify-content-evenly'>
				<tr>
					<th scope="col">#</th>
					<th scope="col">Date</th>
					<th scope="col">Total Price</th>
					<th scope="col">Status</th>
					<th scope="col">Plan</th>
				</tr>
			</thead>*/}
			{invoices.map(({ created, total, status, hosted_invoice_url }) => (
				<a href={hosted_invoice_url} target="_blank" role="button" className='d-flex justify-content-evenly py-3 my-2 border rounded-3 text-decoration-none text-dark'>
					<img src={invoice} className="img-fluid" width={20} height={30} alt='' />
					<span>{moment.unix(created).format("DD MMM YYYY")}</span>
					<span>£{total / 100}</span>
					<span className="text-capitalize">{status}</span>
					<span>Growth Commission</span>
				</a>
			))}
		</div>
	</div>
);

const Subscription = props => {
	const { user } = useSelector(state => state['currentUser']);
	const dispatch = useDispatch();
	let [successMessage, setSuccessMessage] = useState('')
	let [showModal, setShowModal] = useState(false);
	let [isSubscribed, setSubscribed] = useState(false);
	let [invoiceHistory, setInvoices] = useState([]);
	let [currentPlan, setCurrentPlan] = useState({
		amount: 2500
	});
	const handleOpen = () => setShowModal(true)
	const handleClose = () => setShowModal(false)
	const modalRef = useRef()

	useEffect(() => {
		dispatch(checkSubscriptionStatus(user.email)).then(({ status, items }) => {
			items.length && setCurrentPlan(prevState => items[0].plan);
			setSubscribed(status === 'active' || status === 'trialing');
		});
		dispatch(fetchInvoices(user.email)).then(invoices => setInvoices(invoices))
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
			<CancelSubscription centered show={showModal} onHide={handleClose} onComplete={(timestamp) => setSuccessMessage(`Your subscription plan will cancel on ${moment.unix(timestamp).calendar()}`)}/>
			<SuccessModal ref={modalRef} show={!!successMessage} message={successMessage} onHide={() => setSuccessMessage('')}/>
			{user.subscriptionId || isSubscribed ? (
				<div className='row'>
					<div className='col-md-6 col-sm-12'>
						<Plans
							isComponent={props.isComponent}
							stripeCustomerId={user.stripeCustomerId}
							subscriptionPlan={user.subscriptionPlan}
							price={currentPlan.amount / 100}
							showModal={handleOpen}
						/>
					</div>
					<div className='col-md-6 col-sm-12'>
						<InvoiceHistory invoices={invoiceHistory}/>
					</div>
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