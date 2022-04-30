import React from 'react';
import PropTypes from 'prop-types';

const Plan = ({ isSubscribed, isComponent, stripeCustomerId, description, subscriptionPlan, price, openCancelPlan, openChangePlan }) => {
	return (
		<div>
			<h1 className='fs-3 py-2'>Your plan</h1>
			<div className='border py-4'>
				<div className='d-flex flex-column px-4'>
					<div className='d-flex justify-content-between align-items-center py-2'>
						<span className='display-5 text-capitalize plan-text'>{subscriptionPlan}</span>
						{price !== undefined && <span className='display-6 price-text'>{`£${price}/mo`}</span>}
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

Plan.propTypes = {

};

export default Plan;
