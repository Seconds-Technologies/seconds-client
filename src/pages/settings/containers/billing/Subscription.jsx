import './subscription.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkSubscriptionStatus, fetchInvoices, setupSubscription } from '../../../../store/actions/stripe';
import { Mixpanel } from '../../../../config/mixpanel';
import classnames from 'classnames';
import moment from 'moment';
import CancelPlan from '../../modals/CancelPlan';
import SuccessModal from '../../modals/SuccessModal';
import invoice from '../../../../assets/img/invoice.svg';
import ChangePlan from '../../modals/ChangePlan';
import PaymentInformation from '../../modals/PaymentInformation';
import { SUBSCRIPTION_PLANS } from '../../../../constants';
import { syncUser } from '../../../../store/actions/auth';

const Plan = ({ isSubscribed, isComponent, stripeCustomerId, description, subscriptionPlan, price, openCancelPlan, openChangePlan }) => {
	return (
		<div>
			<h1 className='fs-3 py-2'>Your plan</h1>
			<div className='border py-4'>
				<div className='d-flex flex-column px-4'>
					<div className='d-flex justify-content-between align-items-center py-2'>
						<span className='display-5 text-capitalize plan-text'>{subscriptionPlan}</span>
						{price !== undefined &&<span className='display-6 price-text'>{`£${price}/mo`}</span>}
					</div>
					<p>{description}</p>
				</div>
				<hr className='mb-4' />
				<div className='d-flex px-4'>
					<input type='hidden' name='onboarding' value={isComponent} />
					<input type='hidden' id='stripe-customer-id' name='stripe_customer_id' value={stripeCustomerId} />
					<button id='checkout-and-portal-button' className='btn btn-primary text-white' type='button' onClick={openChangePlan}>
						{isSubscribed ? 'Change Plan' : 'Upgrade Plan'}
					</button>
					{isSubscribed && (
						<button id='checkout-and-portal-button' className='ms-4 btn btn-outline-dark' type='button' onClick={openCancelPlan}>
							Cancel Subscription
						</button>
					)}
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
	const { email, stripeCustomerId, paymentMethodId, subscriptionId, subscriptionPlan } = useSelector(state => state['currentUser'].user);
	const dispatch = useDispatch();
	let [successMessage, setSuccessMessage] = useState('');
	let [changeModal, setChangeModal] = useState(false);
	let [cancelModal, setCancelModal] = useState(false);
	let [paymentModal, setPaymentModal] = useState({ show: false, plan: '' });
	let [isSubscribed, setSubscribed] = useState(false);
	let [loading, setLoading] = useState(false);
	let [invoiceHistory, setInvoices] = useState([]);
	let [currentPlan, setCurrentPlan] = useState({
		amount: subscriptionPlan ? SUBSCRIPTION_PLANS[subscriptionPlan.toUpperCase()].price * 100 : '',
		description: subscriptionPlan ? SUBSCRIPTION_PLANS[subscriptionPlan.toUpperCase()].description: ''
	});
	const openCancelSub = () => {
		props.setNavColor('transparent');
		setCancelModal(true);
	};
	const closeCancelSub = () => {
		props.setNavColor('white');
		setCancelModal(false);
	};
	const openChangeSub = () => {
		props.setNavColor('transparent');
		setChangeModal(true);
	};
	const closeChangeSub = () => {
		props.setNavColor('white');
		setChangeModal(false);
	};
	const openPaymentModal = plan => setPaymentModal(prevState => ({ show: true, plan }));
	const closePaymentModal = () => {
		props.setNavColor('white');
		setLoading(false);
		setPaymentModal(prevState => ({ ...prevState, show: false }));
	};
	const modalRef = useRef();

	useEffect(() => {
		dispatch(checkSubscriptionStatus(email)).then(({ status, items, description }) => {
			items.length && setCurrentPlan(prevState => ({ ...items[0].plan, description }));
			setSubscribed(status === 'active' || status === 'trialing');
		});
		dispatch(fetchInvoices(email)).then(invoices => setInvoices(invoices));
		Mixpanel.people.increment('page_views');
	}, [props.location]);

	const containerClass = classnames({
		'container-fluid': !props.isComponent,
		'pt-2': props.isComponent,
		'justify-content-center': true,
		'align-items-center': true
	});

	const subscribe = useCallback(() => {
		setLoading(true);
		dispatch(setupSubscription(email, stripeCustomerId, paymentMethodId, paymentModal.plan))
			.then(res => {
				console.log(res);
				closePaymentModal();
				dispatch(syncUser(email)).then(() => setSubscribed(true))
			})
			.catch(err => {
				closePaymentModal();
			});
	}, [paymentModal]);

	return (
		<div ref={modalRef} className={containerClass}>
			<CancelPlan
				centered
				show={cancelModal}
				onHide={closeCancelSub}
				onComplete={timestamp => setSuccessMessage(`Your subscription plan will cancel on ${moment.unix(timestamp).calendar()}`)}
			/>
			<ChangePlan
				show={changeModal}
				onHide={closeChangeSub}
				centered
				onChange={newPlan => {
					setChangeModal(false);
					openPaymentModal(newPlan);
				}}
			/>
			<PaymentInformation
				show={paymentModal.show}
				newPlan={paymentModal.plan}
				onHide={closePaymentModal}
				onSubscribe={subscribe}
				isLoading={loading}
			/>
			<SuccessModal ref={modalRef} show={!!successMessage} message={successMessage} onHide={() => setSuccessMessage('')} />
			<div className='row'>
				<div className='col-md-6 col-sm-12'>
					{subscriptionId || isSubscribed ? (
						<Plan
							isSubscribed={true}
							isComponent={props.isComponent}
							stripeCustomerId={stripeCustomerId}
							subscriptionPlan={subscriptionPlan}
							description={currentPlan.description}
							price={currentPlan.amount / 100}
							openChangePlan={openChangeSub}
							openCancelPlan={openCancelSub}
						/>
					) : (
						<Plan
							isSubscribed={false}
							isComponent={props.isComponent}
							stripeCustomerId={stripeCustomerId}
							subscriptionPlan={'You are not subscribed!'}
							description={undefined}
							price={undefined}
							openChangePlan={openChangeSub}
							openCancelPlan={openCancelSub}
						/>
					)}
				</div>
				<div className='col-md-6 col-sm-12'>
					<InvoiceHistory invoices={invoiceHistory} />
				</div>
			</div>
		</div>
	);
};

export default Subscription;
