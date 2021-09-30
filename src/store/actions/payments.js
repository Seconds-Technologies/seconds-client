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

export function addPaymentMethod(user, id) {
	return dispatch => {
		return new Promise((resolve, reject) => {
            console.log('------+++_____')
            console.log(user.email)
            console.log(user)
			return apiCall('POST', `/api/v1/payments/add-payment-method`, { email: user.email, paymentMethodId: id }, {
                headers: {
					'X-Seconds-Api-Key': user.apiKey,
				},
            })
            .then((intent) => {
                dispatch(setPaymentMethodId(id))
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