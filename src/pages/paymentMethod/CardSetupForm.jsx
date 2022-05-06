import 'react-credit-cards/es/styles-compiled.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import {
	addPaymentMethod,
	fetchStripeCard,
	removePaymentMethod,
	setupIntent,
} from '../../store/actions/stripe';
import Card from '../../components/card/Card';
import './CardSetupForm.css';
import { Mixpanel } from '../../config/mixpanel';
import classNames from 'classnames';
import EditPaymentMethod from '../settings/components/EditPaymentMethod';
import ClipLoader from 'react-spinners/ClipLoader';

const ErrorMessage = ({ children }) => (
	<div className='text-danger' role='alert'>
		{children}
	</div>
);

const SubmitButton = ({ processing, error, children, disabled }) => (
	<div>
		<style type='text/css'>
			{`
            .btn-submit {
              background-color: #9400d3;
            }
            .btn-xl {
              padding: 1rem 1rem
            }
          `}
		</style>
		<Button className='text-light' variant='submit' type='submit' size='lg' disabled={processing || disabled}>
			{processing ? 'Processing...' : children}
		</Button>
	</div>
);

const Form = ({ handleSubmit, handleError, error, processing, stripe, elements, confirmBtnClass }) => (
	<form id='payment-form' onSubmit={handleSubmit}>
		<div className='row'>
			<div className='col'>
				<div className='form-group'>
					<label htmlFor='cardNumber' className='font-semibold'>
						Card Number
					</label>
					<CardNumberElement className='form-control form-border my-2 py-2 rounded-3' />
				</div>
			</div>
		</div>
		<div className='row'>
			<div className='col-6 col-lg-6'>
				<div className='form-group'>
					<label htmlFor='expiry'>Expiry Date</label>
					<CardExpiryElement className='form-control form-border my-2 py-2 rounded-3' />
				</div>
			</div>
			<div className='col-6 col-lg-6'>
				<div className='form-group'>
					<label htmlFor='securityCode'>CVV</label>
					<CardCvcElement className='form-control form-border my-2 py-2 rounded-3' onChange={handleError} />
				</div>
			</div>
		</div>
		{error && <ErrorMessage>{error.message}</ErrorMessage>}
		<div className={confirmBtnClass}>
			<SubmitButton processing={processing} error={error} disabled={processing || !stripe || !elements}>
				Confirm
			</SubmitButton>
		</div>
	</form>
);

const CardSetupForm = ({ isComponent, showToast, lookupKey, loading, onSubscribe, ...props }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const stripe = useStripe();
	const elements = useElements();
	const { user } = useSelector(state => state['currentUser']);
	const [error, setError] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [cardComplete, setCardComplete] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [paymentAdded, setPaymentAdded] = useState(0);
	const [paymentMethod, setPaymentMethod] = useState({
		last4: '',
		name: '',
		exp_month: '',
		exp_year: '',
		brand: ''
	});
	const [billingDetails, setBillingDetails] = useState({
		name: `${user.firstname} ${user.lastname}`,
		address: {
			postal_code: user.address.postcode
		}
	});
	const [newPaymentDetails, setNewPaymentDetails] = useState({
		name: '',
		month: '',
		year: ''
	});

	const confirmBtnClass = classNames({
		'd-flex': true,
		'pt-5': true,
		'justify-content-end': true
	});

	useEffect(() => {
		if (user.paymentMethodId) {
			(async () => {
				const paymentMethod = await dispatch(fetchStripeCard(user));
				setPaymentMethod(prevState => ({
					last4: paymentMethod.card.last4,
					name: paymentMethod.billing_details.name,
					exp_month: paymentMethod.card.exp_month,
					exp_year: paymentMethod.card.exp_year,
					brand: paymentMethod.card.brand
				}));
				setNewPaymentDetails(prevState => ({
					name: paymentMethod.billing_details.name,
					month: paymentMethod.card.exp_month,
					year: paymentMethod.card.exp_year
				}));
			})();
		}
	}, [paymentAdded]);

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
				setProcessing(true);
			}

			const intent = await dispatch(setupIntent(user.stripeCustomerId));
			const result = await stripe.confirmCardSetup(intent.client_secret, {
				payment_method: {
					card: elements.getElement(CardNumberElement),
					billing_details: { name: `${user.firstname} ${user.lastname}`, email: user.email }
				}
			});
			setProcessing(false);
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
				showToast('Your payment method has been saved successfully!');
				setPaymentAdded(1);
				console.log(paymentAdded);
			}
		},
		[paymentAdded, paymentMethod, billingDetails, stripe, elements]
	);

	const edit = () => {
		setEditMode(true);
	};

	const remove = () => {
		dispatch(removePaymentMethod(user));
	};

	return editMode ? (
		<EditPaymentMethod
			onSuccess={() => {
				setEditMode(false);
				showToast('Your card details have been updated successfully!');
				setPaymentAdded(2);
			}}
			cancel={() => setEditMode(false)}
			paymentDetails={newPaymentDetails}
			paymentMethod={paymentMethod}
			updatePaymentDetails={setNewPaymentDetails}
		/>
	) : user.paymentMethodId ? (
		<div className='form-group py-4'>
			<Card
				onCardElementClick={() => console.log(paymentMethod)}
				cardHolder={`${paymentMethod.name}`}
				cardNumber={`···· ···· ···· ${paymentMethod.last4}`}
				cardMonth={`${paymentMethod.exp_month}`}
				cardYear={`${paymentMethod.exp_year}`}
				cardCvv='***'
				brand={`${paymentMethod.brand}`}
			/>
			{!isComponent && (
				<div className='d-flex justify-content-between mt-5'>
					<div>
						<button className='btn btn-edit mx-2' onClick={edit}>
							Edit card
						</button>
						<button className='btn btn-danger mx-2' onClick={remove}>
							Remove card
						</button>
					</div>
					<div>
						<button
							className='btn btn-lg btn-primary mx-2 d-flex justify-content-center align-items-center'
							onClick={onSubscribe}
						>
							<span className={loading ? 'mx-3' : undefined}>Confirm</span>
							<ClipLoader color='white' loading={loading} size={20} />
						</button>
					</div>
				</div>
			)}
		</div>
	) : (
		<Form
			confirmBtnClass={confirmBtnClass}
			stripe={stripe}
			elements={elements}
			error={error}
			processing={processing}
			handleSubmit={handleSubmit}
			handleError={handleError}
		/>
	);
};

export default CardSetupForm;
