import './PaymentMethod.css';
import secondsLogo from '../../img/logo.svg';
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import ToastFade from 'react-bootstrap/Toast';
import CardSetupForm from './CardSetupForm';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { Mixpanel } from '../../config/mixpanel';

const stripePromise = loadStripe(String(process.env.REACT_APP_STRIPE_PUBLIC_KEY));

const PaymentMethod = props => {
    const [toastMessage, setShowToast] = useState(false);
    const [subscriptionPlans, setShowSubscription] = useState(false);

    useEffect(() => {
        console.log(stripePromise)
        Mixpanel.people.increment("page_views")
    }, []);


    const confirmToast = (
        <ToastContainer className='topRight'>
            <ToastFade onClose={() => setShowToast(false)} show={Boolean(toastMessage)} animation={'true'} delay={3000}
                       autohide>
                <ToastFade.Header closeButton={false}>
                    <img
                        src={secondsLogo}
                        className='rounded me-2'
                        alt=''
                    />
                    <strong className='me-auto'>Seconds</strong>
                    <small>Now</small>
                </ToastFade.Header>
                <ToastFade.Body>{toastMessage}</ToastFade.Body>
            </ToastFade>
        </ToastContainer>
    );

    return (
        <div className='payment-method-container pt-5 bg-light'>
            <div className='d-flex align-items-center justify-content-center'>
                {confirmToast}
                <div className='w-md'>
                    <h1>Payment Information</h1>
                    <span className='small'>Your card will be used for collecting payments for your deliveries.</span><br />
                    <span className='small'>The commission fee is <strong>0%</strong> per completed order</span>
                    <div className='card card-3 rounded-3 p-4 my-3'>
                        <Elements stripe={stripePromise}>
                            <CardSetupForm {...props} showToast={setShowToast} showSubscription={setShowSubscription}/>
                        </Elements>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethod;