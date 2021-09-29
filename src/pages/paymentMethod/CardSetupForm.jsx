import React, { useState }  from 'react';
import { useDispatch, useSelector } from "react-redux";
import  { setupIntent } from '../../store/actions/payments';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { Button } from 'react-bootstrap';
import './CardSetupForm.css'


const CardSetupForm = props => {
  const user = useSelector(state => state['currentUser'].user);
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
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

    console.log(user)
    const intent = await dispatch(setupIntent(user));

    const result = await stripe.confirmCardSetup(intent.client_secret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: { email: 'email@gmail.com' }
      }
    });

    if (result.error) {
      console.log(result.error)
      // Display result.error.message in your UI.
    } else {
      console.log('success', result.setupIntent.payment_method);
      // The setup has succeeded. Display a success message and send
      // result.setupIntent.payment_method to your server to save the
      // card to a Customer
    }
  };

  return (
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
            <CardCvcElement className='form-control form-border mb-2 '>
            </CardCvcElement>
          </div>
        </div>
      </div>
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
          <Button
            variant='dark'
            size='lg'
            className='mx-3'
            onClick={(e) => {
              setBillingDetails({ ...billingDetails, name: e.target.value });
            }}
          >
            Edit
          </Button>
          <Button className='text-light' variant='submit' type='submit' size='lg' value='newJob' >
            Confirm
          </Button>
      </div>   
    </form>
  );
}

export default CardSetupForm;