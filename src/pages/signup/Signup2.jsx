import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PATHS, SUBSCRIPTION_PLANS } from '../../constants';
import { authenticateUser } from '../../store/actions/auth';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ProductContext } from '../../context/ProductContext';
import SuccessToast from '../../modals/SuccessToast';
import Payment from './components/Payment';

const stripePromise = loadStripe(String(process.env.REACT_APP_STRIPE_PUBLIC_KEY));
const validFreeTrialKeys = [process.env.REACT_APP_STRIPE_GROWTH_KEY, process.env.REACT_APP_STRIPE_PRO_KEY]  

const Signup2 = props => {
	const { key: lookupKey } = useContext(ProductContext);
	const [toastMessage, setShowToast] = useState('');
	const [cardValid, setCardValid] = useState(false);
	
	const hasFreeTrial = useMemo(() => validFreeTrialKeys.includes(lookupKey), [lookupKey]);
	
	const dispatch = useDispatch();

	const signup = async () => {
		try {
			setShowToast('Your payment method has been saved successfully!');
			dispatch(authenticateUser());
			props.history.push(PATHS.HOME);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		console.log("LOOKUP KEY:", lookupKey)
	}, [])

	return (
		<div className='container-fluid mx-auto py-4 signupPage bg-light'>
			{/*<div className='top-0 w-md p-5 position-absolute' role='button' onClick={() => props.history.goBack()}>
				<img src={backArrow} alt='Go back button' width={40} height={40} />
			</div>
			<span className='text-center fs-4 text-primary'>3/3</span>*/}
			<SuccessToast toggleShow={setShowToast} message={toastMessage} delay={3000} position={'topRight'}/>
			<div className='d-flex flex-column flex-grow-1 align-items-center w-100 h-100'>
				<div className='payment-wrapper bg-white py-4 px-3 h-100'>
					{hasFreeTrial && (
						<div className="d-flex flex-column align-items-center">
							<span className="signup-header fs-3">Activate your 14-day free trial!</span>
							<span className="fs-2 text-decoration-line-through" style={{color:"#A4A4A4"}}>£{SUBSCRIPTION_PLANS[lookupKey.toUpperCase()].price}</span>
							<small className="text-muted">Your monthly payment will begin in 14 days</small>
						</div>
					)}
					<div className='d-flex flex-column px-5'>
						<div className='py-4'>
							<h2 className='signup-header pb-2'>Payment details</h2>
							<span className='text-muted'>You will be charged an invoice every month based on your number of deliveries</span>
						</div>
						<Elements stripe={stripePromise}>
							<Payment onSuccess={signup}/>
						</Elements>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Signup2;
