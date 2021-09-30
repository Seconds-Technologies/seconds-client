import React, { useState }  from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Toast, Overlay, Tooltip } from 'react-bootstrap';
import  { addPaymentMethod, setupIntent } from '../../store/actions/payments';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import './CardSetupForm.css'

const ErrorMessage = ({ children }) => (
  <div className="ErrorMessage " role="alert">
    {children}
  </div>
);

const SubmitButton = ({ processing, error, children, disabled }) => (
  <button
    className='text-dark'
    type="submit"
    size='lg'
    disabled={processing || disabled}
  >
    {processing ? "Processing..." : children}
  </button>
);


const CardSetupForm = ({ props, setShow }) => {
  const user = useSelector(state => state['currentUser'].user);  
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    address: {
      postal_code: '',
    }
  });
  
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    console.log('-------------')
    console.log(billingDetails);
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (error) {
      elements.getElement("card").focus();
      return;
    }

    if (cardComplete) {
      setProcessing(true);
    }

    console.log(user)
    const intent = await dispatch(setupIntent(user));

    const result = await stripe.confirmCardSetup(intent.client_secret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: { email: user.email }
      }
    });

    setProcessing(false);

    if (result.error) {
      console.log(result.error)
      setError(result.error)
    } else {
      console.log(result);
      console.log('success', result.setupIntent.payment_method);
      setPaymentMethod(result.setupIntent);
      console.log('[[[[[[')
      dispatch(addPaymentMethod(user, result.setupIntent.payment_method))
      console.log(']]]]]]]')
      setShow(true)
    }
  };

  const reset = () => {
    setError(null);
    setProcessing(false);
    setPaymentMethod(null);
    setBillingDetails({
      email: "",
      phone: "",
      name: ""
    });
  };

  return paymentMethod ? 
  (
    <div className="form-group">
      <label htmlFor="fullName">Cardholder Name</label>
      <input
        autoComplete='given-name'
        id='dropoff-first-name'
        name='dropoffFirstName'
        type='text'
        className='form-control form-border mb-2'
        aria-label='dropoff-first-name'
        value={billingDetails.name}
        onChange={(e) => {
          setBillingDetails({ ...billingDetails, name: e.target.value });
        }}
      />
    </div>  
  ) : 
    (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="fullName">Cardholder Name</label>
        <input
          autoComplete='given-name'
          id='dropoff-first-name'
          name='dropoffFirstName'
          type='text'
          className='form-control form-border mb-2'
          aria-label='dropoff-first-name'
          value={billingDetails.name}
          onChange={(e) => {
            setBillingDetails({ ...billingDetails, name: e.target.value });
          }}
        />
      </div>  
      <div className="row">
        <div className="col">
          <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <CardNumberElement className='form-control form-border mb-2'>
              </CardNumberElement>
          </div>
        </div>
        <div className="col col-lg-3">
          <div className="form-group">
          <label htmlFor="expiry">Expiry Date</label>
          <CardExpiryElement className="form-control form-border mb-2"></CardExpiryElement>
          </div>
        </div>
        <div className="col col-lg-2">
          <div className="form-group">
          <label htmlFor="securityCode">CVV</label>
            <CardCvcElement 
              className='form-control form-border mb-2' 
              onChange={(e) => {
                setError(e.error);
                setCardComplete(e.complete);
            }}> 
            </CardCvcElement>
          </div>
        </div>
      </div>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      <div className='d-flex pt-5 justify-content-end'>
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
          <SubmitButton processing={processing} error={error} disabled={!stripe}>
            Confirm
          </SubmitButton>
      </div>   
    </form>
  );
}

export default CardSetupForm;