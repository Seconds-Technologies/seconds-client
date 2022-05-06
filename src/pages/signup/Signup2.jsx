import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PATHS, SUBSCRIPTION_PLANS } from '../../constants';
import { authenticateUser } from '../../store/actions/auth';
import { CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ProductContext } from '../../context/ProductContext';

const stripePromise = loadStripe(String(process.env.REACT_APP_STRIPE_PUBLIC_KEY));
const validFreeTrialKeys = [process.env.REACT_APP_STRIPE_GROWTH_KEY, process.env.REACT_APP_STRIPE_PRO_KEY]  

const Signup2 = props => {
	const { key: lookupKey } = useContext(ProductContext);
	const [cardValid, setCardValid] = useState(false);
	const [error, setError] = useState(null);
	const [cardComplete, setCardComplete] = useState(false);
	const { user: userData } = useSelector(state => state['currentUser']);
	
	const hasFreeTrial = useMemo(() => validFreeTrialKeys.includes(lookupKey), [lookupKey]);
	
	const dispatch = useDispatch();

	const signup = async () => {
		try {
			dispatch(authenticateUser());
			props.history.push(PATHS.HOME);
		} catch (err) {
			console.error(err);
		}
	};

	const handleError = e => {
		setError(e.error);
		setCardComplete(e.complete);
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
							<form action=''>
								<div className='row'>
									<div className='col-12 mb-3'>
										<label htmlFor='' className='text-muted signup-form-label text-uppercase mb-2'>
											Full Name
										</label>
										<input type='text' name='cardHolderName' className='form-control py-2' />
									</div>
									<div className='col-12 mb-3'>
										<label htmlFor='' className='text-muted signup-form-label text-uppercase mb-2'>
											Email
										</label>
										<input type='email' autoComplete='email' name='email' className='form-control py-2' />
									</div>
									<div className='col-12 mb-3'>
										<label htmlFor='cardNumber' className='text-muted signup-form-label text-uppercase mb-2'>
											Card Details
										</label>
										<CardElement className='form-control form-border rounded-0 py-3' />
									</div>
									{/*<div className='col-12 mb-3'>
										<div className='form-group'>
											<label htmlFor='cardNumber' className='text-muted signup-form-label text-uppercase mb-2'>
												Card Number
											</label>
											<CardNumberElement className='form-control form-border py-2 rounded-0' />
										</div>
									</div>
									<div className='col-6 col-lg-6 mb-3'>
										<div className='form-group'>
											<label htmlFor='expiry' className='text-muted signup-form-label text-uppercase mb-2'>
												Expiry Date
											</label>
											<CardExpiryElement className='form-control form-border py-2 rounded-0' />
										</div>
									</div>
									<div className='col-6 col-lg-6 mb-3'>
										<div className='form-group'>
											<label htmlFor='securityCode' className='text-muted signup-form-label text-uppercase mb-2'>
												CVV
											</label>
											<CardCvcElement className='form-control form-border py-2 rounded-0' onChange={handleError} />
										</div>
									</div>*/}
								</div>
							</form>
						</Elements>
						<div className='mt-4 d-flex flex-column justify-content-center align-items-center px-5'>
							<button disabled={!userData.paymentMethodId} onClick={signup} className='btn btn-dark btn-lg mt-4 rounded-0 w-100'>
								Complete
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Signup2;
