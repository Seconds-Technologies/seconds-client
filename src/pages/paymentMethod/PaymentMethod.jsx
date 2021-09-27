import React, { useMemo } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import CardSetupForm from "./CardSetupForm";
import './PaymentMethod.css'

const stripePromise = loadStripe('pk_live_51JdEkaEJUYyCW3GHvJM0z1jCiy2mv078mWcFnGB62wkHySznwxN0Hkvzlh4eytlpA6of9VGIjp42lXmsLuJoRRq400PKk3zJAF');


const PaymentMethod = props => {

      
    return  <div className='payment-method-container'>
                    <div className='d-flex h-100 align-items-center justify-content-center'>
                        <div className='card position-relative pt-1 pb-1' style={{width:'90%', height:'auto'}}>
                                <Elements stripe={stripePromise}>
                                    <CardSetupForm {...props} />
                                </Elements>
                        </div>
				</div>
			</div>
                    
  };

export default PaymentMethod;