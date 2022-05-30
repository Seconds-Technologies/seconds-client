import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PATHS, SUBSCRIPTION_PLANS } from '../../constants';
import { authenticateUser } from '../../store/actions/auth';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ProductContext } from '../../context';
import LoadingOverlay from 'react-loading-overlay';
import SuccessToast from '../../modals/SuccessToast';
import Payment from './components/Payment';

const stripePromise = loadStripe(String(process.env.REACT_APP_STRIPE_PUBLIC_KEY));
const validFreeTrialKeys = [process.env.REACT_APP_STRIPE_GROWTH_KEY, process.env.REACT_APP_STRIPE_PRO_KEY];

const Signup2 = props => {
	const { key: lookupKey } = useContext(ProductContext);
	const [toastMessage, setShowToast] = useState('');
	const [cardValid, setCardValid] = useState(false);
	const [isLoading, setLoading] = useState({
		show: false,
		text: ''
	});

	const hasFreeTrial = useMemo(() => validFreeTrialKeys.includes(lookupKey), [lookupKey]);

	const dispatch = useDispatch();

	const signup = () => {
		setLoading(prevState => ({
			...prevState,
			show: false
		}));
		dispatch(authenticateUser());
		props.history.push(PATHS.HOME);
	};

	return (
		<LoadingOverlay active={isLoading.show} spinner text={isLoading.text} classNamePrefix='signup_loader_'>
			<div className='container-fluid mx-auto py-4 signup-page bg-light d-flex flex-column'>
				<SuccessToast toggleShow={setShowToast} message={toastMessage} delay={3000} position={'topRight'} />
				<div className='d-flex flex-column flex-grow-1 justify-content-center align-items-center w-100 h-100'>
					<div className='payment-wrapper bg-white py-4 px-3 h-100'>
						{hasFreeTrial && (
							<div className='d-flex flex-column align-items-center'>
								<span className='signup-header fs-3'>Activate your 14-day free trial!</span>
								<span className='fs-2 text-decoration-line-through' style={{ color: '#A4A4A4' }}>
									£{SUBSCRIPTION_PLANS[lookupKey.toUpperCase()].price}
								</span>
								<small className='text-muted'>Your monthly payment will begin in 14 days</small>
							</div>
						)}
						<div className='d-flex flex-column px-5'>
							<div className='py-4'>
								<h2 className='signup-header pb-2'>Payment details</h2>
								<span className='text-muted'>{`You will be charged an invoice every ${
									hasFreeTrial ? 'month' : 'week'
								} based on your number of deliveries`}</span>
							</div>
							<Elements stripe={stripePromise}>
								<Payment setLoading={setLoading} onSuccess={signup} />
							</Elements>
						</div>
					</div>
				</div>
			</div>
		</LoadingOverlay>
	);
};

export default Signup2;
