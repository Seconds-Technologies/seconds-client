import React from 'react';
import PropTypes from 'prop-types';
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
			<form action={`${String(process.env.VITE_SERVER_HOST)}/server/subscription/create-checkout-session`} method='POST'>
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

ProductDisplay.propTypes = {

};

export default ProductDisplay;
