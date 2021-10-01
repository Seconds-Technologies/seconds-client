import { apiCall, setTokenHeader } from '../../api';
import { SET_PAYMENT_ID } from '../actionTypes';
import { addError, removeError } from './errors';

export const setPaymentMethodId = paymentMethodId => {
	return {
		type: SET_PAYMENT_ID,
		paymentMethodId,
	};
};

export function setupIntent(user) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log('stripeCustomerId:', user.stripeCustomerId);
			return apiCall('POST', `/api/v1/payments/setup-intent`, { stripeCustomerId: user.stripeCustomerId }, {
                headers: {
					'X-Seconds-Api-Key': user.apiKey,
				},
            })
            .then((intent) => {
                resolve(intent);
            })
            .catch(err => {
                if (err) dispatch(addError(err.message));
                else dispatch(addError('Api endpoint could not be accessed!'));
                reject(err);
            });
            
		});
	};
}

export function addPaymentMethod(user, paymentMethodId) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('POST', `/api/v1/payments/add-payment-method`, { email: user.email, paymentMethodId: paymentMethodId }, {
                headers: {
					'X-Seconds-Api-Key': user.apiKey,
				},
            })
            .then((res) => {
                console.log(res)
                console.log(paymentMethodId)
                dispatch(setPaymentMethodId(paymentMethodId))
                resolve(null);
            })
            .catch(err => {
                if (err) dispatch(addError(err.message));
                else dispatch(addError('Api endpoint could not be accessed!'));
                reject(err);
            });
		});
	};
}


export function fetchStripeCard(user) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('POST', `/api/v1/payments/fetch-stripe-card`, { paymentMethodId: user.paymentMethodId }, {
                headers: {
					'X-Seconds-Api-Key': user.apiKey,
				},
            })
            .then((card) => {
                resolve(card);
            })
            .catch(err => {
                if (err) dispatch(addError(err.message));
                else dispatch(addError('Api endpoint could not be accessed!'));
                reject(err);
            });
		});
	};
}