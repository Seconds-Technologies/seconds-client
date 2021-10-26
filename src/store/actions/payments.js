import { apiCall } from '../../api';
import { SET_PAYMENT_ID } from '../actionTypes';
import { addError } from './errors';

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
			return apiCall('POST', `/server/payment/setup-intent`, { stripeCustomerId: user.stripeCustomerId })
				.then(intent => {
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
			return apiCall('POST', `/server/payment/add-payment-method`, {
				email: user.email,
				customerId: user.stripeCustomerId,
				paymentMethodId: paymentMethodId,
			})
				.then(res => {
					console.log(paymentMethodId);
					dispatch(setPaymentMethodId(paymentMethodId));
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

export function updatePaymentMethod(user, paymentDetails) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('POST', `/server/payment/update-payment-method`, {
				email: user.email,
				paymentMethodId: user.paymentMethodId,
				paymentDetails,
			})
				.then(res => resolve(res))
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

export function removePaymentMethod(user) {
	return dispatch => {
		console.log(user.paymentMethodId);
		return new Promise((resolve, reject) => {
			return apiCall('POST', `/server/payment/remove-payment-method`, {
				email: user.email,
				paymentMethodId: user.paymentMethodId,
			})
				.then(({ message }) => {
					console.log(message);
					dispatch(setPaymentMethodId(''));
					resolve(message);
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
			return apiCall('POST', `/server/payment/fetch-stripe-card`, { paymentMethodId: user.paymentMethodId })
				.then(card => {
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