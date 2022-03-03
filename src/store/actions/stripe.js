import { apiCall } from '../../api';
import { addError } from './errors';
import { Mixpanel } from '../../config/mixpanel';
import { updateCurrentUser } from './auth';

export function setupStripeCustomer(data) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log(data);
			return apiCall('POST', '/server/auth/stripe-customer', data)
				.then(customer => {
					dispatch(updateCurrentUser({ stripeCustomerId: customer.id }));
					resolve(customer);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

export function setupIntent(id) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log('stripeCustomerId:', id);
			return apiCall('POST', `/server/payment/setup-intent`, { stripeCustomerId: id })
				.then(intent => resolve(intent))
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

export function addPaymentMethod(email, stripeCustomerId, paymentMethodId) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('POST', `/server/payment/add-payment-method`, {
				email,
				stripeCustomerId,
				paymentMethodId,
			})
				.then(res => {
					console.log(paymentMethodId);
					dispatch(updateCurrentUser({ paymentMethodId: paymentMethodId }));
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
					dispatch(updateCurrentUser({ paymentMethodId: '' }));
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

export function checkSubscriptionStatus(email) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log(email);
			apiCall('GET', '/server/subscription/fetch-stripe-subscription', null, { params: { email }})
				.then(({ id: subscriptionId, status, items }) => {
					console.table({subscriptionId, status});
					Mixpanel.people.set({
						subscribed: !!subscriptionId,
					});
					dispatch(updateCurrentUser({ subscriptionId }));
					resolve({status, items });
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

export function fetchInvoices(email){
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log(email);
			apiCall('GET', '/server/subscription/fetch-invoices', null, { params: { email } })
				.then(invoices => resolve(invoices))
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}
