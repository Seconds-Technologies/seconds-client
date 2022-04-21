import { SET_WOOCOMMERCE, UPDATE_WOOCOMMERCE } from '../actionTypes';
import { apiCall } from '../../api';
import { Mixpanel } from '../../config/mixpanel';
import { addError, removeError } from './errors';

export const setWoo = credentials => ({
	type: SET_WOOCOMMERCE,
	credentials,
});

export const updateWoo = data => ({
	type: UPDATE_WOOCOMMERCE,
	data,
});

export function validateWoocommerce(email) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('GET', `/server/woocommerce`, null, { params: { "email": email } })
				.then(shop => {
					Mixpanel.track("Successful Woocommerce integration")
					Mixpanel.people.setOnce({$woocommerce: shop})
					dispatch(setWoo(shop));
					dispatch(removeError());
					resolve(shop);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError("Api endpoint could not be accessed!"));
					reject(err);
				});
		});
	};
}