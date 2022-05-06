import React, { useCallback, useContext, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Mixpanel } from '../../../config/mixpanel';
import { addPaymentMethod, setupIntent, setupSubscription } from '../../../store/actions/stripe';
import { useDispatch, useSelector } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';
import { ProductContext } from '../../../context/ProductContext';

const ErrorMessage = ({ children }) => (
	<div className='text-danger' role='alert'>
		{children}
	</div>
);

const Payment = ({ onSuccess }) => {
	const [error, setError] = useState(null);
	const [cardComplete, setCardComplete] = useState(false);
	const [loading, setLoading] = useState(false);
	const { key: lookupKey } = useContext(ProductContext)
	const stripe = useStripe();
	const elements = useElements();
	const { user } = useSelector(state => state['currentUser']);
	const dispatch = useDispatch();
	const [fullName, setFullName] = useState("")
	const [emailAddress, setEmailAddress] = useState("")

	const handleError = e => {
		setError(e.error);
		setCardComplete(e.complete);
	};

	const handleSubmit = useCallback(
		async event => {
			event.preventDefault();
			if (!stripe || !elements) {
				return;
			}

			if (error) {
				return;
			}

			if (cardComplete) {
				setLoading(true);
			}

			const intent = await dispatch(setupIntent(user.stripeCustomerId));
			console.log(intent)
			const result = await stripe.confirmCardSetup(intent.client_secret, {
				payment_method: {
					card: elements.getElement(CardElement),
					billing_details: { name: `${user.firstname} ${user.lastname}`, email: user.email }
				}
			});
			setLoading(false);
			if (result.error) {
				console.log(result.error);
				setError(result.error);
				Mixpanel.track('Add payment method', {
					$type: 'FAILURE'
				});
			} else {
				console.log('success', result.setupIntent.payment_method);
				Mixpanel.track('Add payment method', {
					$type: 'SUCCESS'
				});
				await dispatch(addPaymentMethod(user.email, user.stripeCustomerId, result.setupIntent.payment_method));
				await dispatch(setupSubscription(user.email, user.stripeCustomerId, result.setupIntent.payment_method, lookupKey))
				onSuccess()
			}
		},
		[stripe, elements]
	);

	return (
		<form onSubmit={handleSubmit}>
			<div className='row'>
				<div className='col-12 mb-3'>
					<label htmlFor='' className='text-muted signup-form-label text-uppercase mb-2'>
						Full Name
					</label>
					<input type='text' name='cardHolderName' className='form-control py-2' required />
				</div>
				<div className='col-12 mb-3'>
					<label htmlFor='' className='text-muted signup-form-label text-uppercase mb-2'>
						Email
					</label>
					<input type='email' autoComplete='email' name='email' className='form-control py-2' required />
				</div>
				<div className='col-12 mb-3'>
					<label htmlFor='cardNumber' className='text-muted signup-form-label text-uppercase mb-2'>
						Card Details
					</label>
					<CardElement className='form-control form-border rounded-0 py-3' onChange={handleError} />
				</div>
				{error && <ErrorMessage>{error.message}</ErrorMessage>}
			</div>
			<div className='mt-4 d-flex flex-column justify-content-center align-items-center px-5'>
				<button type="submit" className='btn btn-dark btn-lg mt-4 rounded-0 w-100'>
					<span className='me-3'>Complete</span>
					<ClipLoader color='white' loading={loading} size={20} />
				</button>
			</div>
		</form>
	);
};

export default Payment;