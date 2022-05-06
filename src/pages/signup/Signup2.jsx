import React, { useState } from 'react';
import PaymentMethod from '../paymentMethod/PaymentMethod';
import { useDispatch, useSelector } from 'react-redux';
import backArrow from '../../assets/img/noun-go-back-vector.svg';
import { PATHS } from '../../constants';
import { authenticateUser } from '../../store/actions/auth';
import { CardCvcElement, CardExpiryElement, CardNumberElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(String(process.env.REACT_APP_STRIPE_PUBLIC_KEY));

const Signup2 = props => {
	const [cardValid, setCardValid] = useState(false);
	const [error, setError] = useState(null);
	const [cardComplete, setCardComplete] = useState(false);
	const { user: userData } = useSelector(state => state['currentUser']);
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

	return (
		<div className='container-fluid mx-auto my-auto py-4 signupPage bg-light'>
			<div className='top-0 w-md p-5 position-absolute' role='button' onClick={() => props.history.goBack()}>
				<img src={backArrow} alt='Go back button' width={40} height={40} />
			</div>
			<div className='d-flex flex-column flex-grow-1 align-items-center w-100'>
				<span className='fs-4 text-primary'>3/3</span>
				<div className='payment-wrapper bg-white py-4 px-3'>
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
										<input type='text' name='cardHolderName' className='form-control py-1' />
									</div>
									<div className='col-12 mb-3'>
										<label htmlFor='' className='text-muted signup-form-label text-uppercase mb-2'>
											Email
										</label>
										<input type='email' autoComplete='email' name='email' className='form-control py-1' />
									</div>
									<div className='col-12 mb-3'>
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
									</div>
								</div>
							</form>
						</Elements>
						<div className='d-flex flex-column justify-content-center align-items-end '>
							<button disabled={!userData.paymentMethodId} onClick={signup} className='btn btn-dark btn-lg w-sm mt-4 rounded-0'>
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
