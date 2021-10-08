import 'react-credit-cards/es/styles-compiled.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import { PATHS } from '../../constants';
import {
	addPaymentMethod,
	fetchStripeCard,
	removePaymentMethod,
	setupIntent,
	updatePaymentMethod,
} from '../../store/actions/payments';
import Card from '../../components/card/Card';
import './CardSetupForm.css';

const ErrorMessage = ({ children }) => (
	<div className='ErrorMessage ' role='alert'>
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
		<Button className="text-light" variant='submit' type='submit' size='lg' disabled={processing || disabled}>
			{processing ? 'Processing...' : children}
		</Button>
	</div>
);

const Form = ({ handleChange, handleSubmit, handleError, billingDetails, error, processing, stripe }) => (
	<form onSubmit={handleSubmit}>
		<div className='form-group'>
			<label htmlFor='card-holder-name'>Cardholder Name</label>
			<input
				autoComplete='given-name'
				id='card-holder-name'
				name='CardHolderName'
				type='text'
				className='form-control form-border mb-2'
				aria-label='card-holder-name'
				value={billingDetails.name}
				onChange={handleChange}
			/>
		</div>
		<div className='row'>
			<div className='col'>
				<div className='form-group'>
					<label htmlFor='cardNumber'>Card Number</label>
					<CardNumberElement className='form-control form-border mb-2' />
				</div>
			</div>
			<div className='col col-lg-3'>
				<div className='form-group'>
					<label htmlFor='expiry'>Expiry Date</label>
					<CardExpiryElement className='form-control form-border mb-2' />
				</div>
			</div>
			<div className='col col-lg-2'>
				<div className='form-group'>
					<label htmlFor='securityCode'>CVV</label>
					<CardCvcElement className='form-control form-border mb-2' onChange={handleError} />
				</div>
			</div>
		</div>
		{error && <ErrorMessage>{error.message}</ErrorMessage>}
		<div className='d-flex pt-5 justify-content-end'>
			<SubmitButton processing={processing} error={error} disabled={!stripe}>
				Confirm
			</SubmitButton>
		</div>
	</form>
);

const CardSetupForm = ({ showToast }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { user } = useSelector(state => state['currentUser']);
	const stripe = useStripe();
	const elements = useElements();
	const [showModal, setShowModal] = useState(false);
	const [error, setError] = useState(null);
	const [cardComplete, setCardComplete] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [paymentAdded, setPaymentAdded] = useState(0);
	const [paymentMethod, setPaymentMethod] = useState({
		last4: '',
		name: '',
		exp_month: '',
		exp_year: '',
		brand: '',
	});
	const [billingDetails, setBillingDetails] = useState({
		name: `${user.firstname} ${user.lastname}`,
		address: {
			postal_code: '',
		},
	});
	const [newPaymentDetails, setNewPaymentDetails] = useState({
		name: '',
		month: '',
		year: '',
	});

	useEffect(() => {
		console.log(paymentAdded);
		if (user.paymentMethodId) {
			(async function fetchStripeCardPromise() {
				const paymentMethod = await dispatch(fetchStripeCard(user));
				setPaymentMethod(prevState => ({
					last4: paymentMethod.card.last4,
					name: paymentMethod.billing_details.name,
					exp_month: paymentMethod.card.exp_month,
					exp_year: paymentMethod.card.exp_year,
					brand: paymentMethod.card.brand,
				}));
				setNewPaymentDetails(prevState => ({
					name: paymentMethod.billing_details.name,
					month: paymentMethod.card.exp_month,
					year: paymentMethod.card.exp_year,
				}));
			})();
		}
	}, [paymentAdded]);

	useEffect(() => {
		console.log('payment method:');
		console.log(paymentMethod);
	}, [paymentMethod]);

	const handleChange = e => setBillingDetails({ ...billingDetails, name: e.target.value });

	const handleError = e => {
		setError(e.error);
		setCardComplete(e.complete);
	};

	const handleSubmit = async event => {
		event.preventDefault();
		if (!stripe || !elements) {
			return;
		}

		if (error) {
			elements.getElement('card').focus();
			return;
		}
		if (cardComplete) {
			setProcessing(true);
		}

		const intent = await dispatch(setupIntent(user));

		const result = await stripe.confirmCardSetup(intent.client_secret, {
			payment_method: {
				card: elements.getElement(CardNumberElement),
				billing_details: { name: billingDetails.name, email: user.email },
			},
		});

		setProcessing(false);

		if (result.error) {
			console.log(result.error);
			setError(result.error);
		} else {
			console.log(result);
			console.log('success', result.setupIntent.payment_method);
			await dispatch(addPaymentMethod(user, result.setupIntent.payment_method));
			showToast('Your payment method has been saved successfully!');
			setPaymentAdded(1);
			console.log(paymentAdded);
		}
	};

	const reset = () => {
		setError(null);
		setProcessing(false);
		setPaymentMethod(null);
		setBillingDetails(prevState => ({
			name: '',
			address: {
				postal_code: '',
			},
		}));
	};

	const edit = () => {
		setShowModal(true);
	};

	const remove = () => {
		dispatch(removePaymentMethod(user));
	};

	return user.paymentMethodId ? (
		<div className='form-group py-4'>
			<Modal size='lg' show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Edit payment method</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className='py-3'>
						<form
							onSubmit={e => {
								e.preventDefault();
								dispatch(
									updatePaymentMethod(user, {
										name: newPaymentDetails.name,
										month: newPaymentDetails.month,
										year: newPaymentDetails.year,
									})
								).then(() => {
									setShowModal(false);
									showToast('Your card details have been updated successfully!');
									setPaymentAdded(2);
								});
							}}
						>
							<div className='row'>
								<div className='col'>
									<div className='form-group'>
										<label htmlFor='cardNumber' className='h5'>
											Payment method
										</label>
										<div className='mt-2'>
											<span className='text-capitalize fw-bold'>
												💳 {paymentMethod.brand}&nbsp;
											</span>
											ending in {paymentMethod.last4}
										</div>
									</div>
								</div>
								<div className='col'>
									<label htmlFor='card-holder-name' className='h5'>
										Cardholder Name
									</label>
									<input
										autoComplete='given-name'
										id='card-holder-name'
										name='CardHolderName'
										type='text'
										className='form-control rounded-3 mt-2'
										aria-label='card-holder-name'
										value={newPaymentDetails.name}
										onChange={e =>
											setNewPaymentDetails(prevState => ({
												...prevState,
												name: e.target.value,
											}))
										}
									/>
								</div>
								<div className='col'>
									<label htmlFor='expiryMM' className='h5'>
										Expiry Date
									</label>
									<div className='row mt-2'>
										<div className='col'>
											<select
												className='form-select'
												name='expiryMM'
												id='expiryMM'
												value={newPaymentDetails.month}
												onChange={e =>
													setNewPaymentDetails(prevState => ({
														...prevState,
														month: e.target.value,
													}))
												}
											>
												<option value='1'>Jan</option>
												<option value='2'>Feb</option>
												<option value='3'>Mar</option>
												<option value='4'>Apr</option>
												<option value='5'>May</option>
												<option value='6'>Jun</option>
												<option value='7'>Jul</option>
												<option value='8'>Aug</option>
												<option value='9'>Sep</option>
												<option value='10'>Oct</option>
												<option value='11'>Nov</option>
												<option value='12'>Dec</option>
											</select>
										</div>
										<div className='col'>
											<select
												className='form-select'
												name='expireYYYY'
												value={newPaymentDetails.year}
												onChange={e =>
													setNewPaymentDetails(prevState => ({
														...prevState,
														year: e.target.value,
													}))
												}
											>
												<option value={moment().format('YYYY')}>
													{moment().format('YYYY')}
												</option>
												<option value={moment().add(1, 'years').format('YYYY')}>
													{moment().add(1, 'years').format('YYYY')}
												</option>
												<option value={moment().add(2, 'years').format('YYYY')}>
													{moment().add(2, 'years').format('YYYY')}
												</option>
												<option value={moment().add(3, 'years').format('YYYY')}>
													{moment().add(3, 'years').format('YYYY')}
												</option>
												<option value={moment().add(4, 'years').format('YYYY')}>
													{moment().add(4, 'years').format('YYYY')}
												</option>
												<option value={moment().add(5, 'years').format('YYYY')}>
													{moment().add(5, 'years').format('YYYY')}
												</option>
												<option value={moment().add(6, 'years').format('YYYY')}>
													{moment().add(6, 'years').format('YYYY')}
												</option>
											</select>
										</div>
									</div>
								</div>
							</div>
							<div className='d-flex justify-content-end pt-5'>
								<button
									className='btn btn-secondary mx-3 rounded-3'
									style={{ width: '15%' }}
									onClick={() => setShowModal(false)}
								>
									Cancel
								</button>
								<button
									className='btn btn-primary mx-3 rounded-3'
									type='submit'
									style={{ width: '15%' }}
								>
									Save
								</button>
							</div>
						</form>
					</div>
				</Modal.Body>
			</Modal>
			<Card
				onCardElementClick={() => console.log(paymentMethod)}
				cardHolder={`${paymentMethod.name}`}
				cardNumber={`···· ···· ···· ${paymentMethod.last4}`}
				cardMonth={`${paymentMethod.exp_month}`}
				cardYear={`${paymentMethod.exp_year}`}
				cardCvv='***'
				brand={`${paymentMethod.brand}`}
			/>
			<div className='d-flex justify-content-between mt-5'>
				<div>
				<button className="btn btn-edit" onClick={() => history.push(PATHS.SUBSCRIPTION)}>
					Manage Subscription
				</button>
				</div>
				<div>
				<button className='btn btn-edit mx-2' onClick={edit}>
					Edit card
				</button>
				<button className='btn btn-danger mx-2' onClick={remove}>
					Remove card
				</button>
				</div>
			</div>
		</div>
	) : (
		<Form
			stripe={stripe}
			error={error}
			processing={processing}
			billingDetails={billingDetails}
			handleSubmit={handleSubmit}
			handleChange={handleChange}
			handleError={handleError}
		/>
	);
};

export default CardSetupForm;