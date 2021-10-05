import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import ToastFade from 'react-bootstrap/Toast';
import CardSetupForm from './CardSetupForm';
import ToastContainer from 'react-bootstrap/ToastContainer';
import './PaymentMethod.css';

//const stripePromise = loadStripe('pk_live_51JdEkaEJUYyCW3GHvJM0z1jCiy2mv078mWcFnGB62wkHySznwxN0Hkvzlh4eytlpA6of9VGIjp42lXmsLuJoRRq400PKk3zJAF');
const stripePromiseTest = loadStripe('pk_test_51JdEkaEJUYyCW3GHyXT6h77JbzzeO5qfj4JuF98AIC13lLjzHiAyRdbYCH5gmeKi8j6VAZ7l2tXcESsq9xSmJvMx00rPtDSwZO');

const PaymentMethod = props => {
    const [toastMessage, setShowToast] = useState(false);

    const confirmToast = (
        <ToastContainer className='p-3 topRight'>
            <ToastFade onClose={() => setShowToast(false)} show={Boolean(toastMessage)} animation={'true'} delay={3000} autohide>
                <ToastFade.Header closeButton={false}>
                    <img
                        src='holder.js/20x20?text=%20'
                        className='rounded me-2'
                        alt=''
                    />
                    <strong className='me-auto'>Seconds</strong>
                    <small>Now</small>
                </ToastFade.Header>
                <ToastFade.Body>{toastMessage}</ToastFade.Body>
            </ToastFade>
        </ToastContainer>
    )

    return <div className='payment-method-container'>
        <div className='d-flex h-100 align-items-center justify-content-center'>
            {confirmToast}
            <div className='form-wrapper'>
                <h1>Payment Information</h1>
                <div className='card card-3 rounded-3 p-4'>
                    <Elements stripe={stripePromiseTest}>
                        <CardSetupForm {...props} showToast={setShowToast}/>
                    </Elements>
                </div>
            </div>
        </div>
    </div>;
};

export default PaymentMethod;