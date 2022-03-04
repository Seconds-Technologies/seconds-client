import { apiCall, setTokenHeader } from '../../api';
import {
	AUTHENTICATE_USER,
	LOGOUT_USER,
	REMOVE_CURRENT_USER,
	SET_API_KEY,
	SET_CURRENT_USER,
	SET_USER_DETAILS,
	UPDATE_CURRENT_USER
} from '../actionTypes';
import { addError, removeError } from './errors';
import { setShopify } from './shopify';
import { Mixpanel } from '../../config/mixpanel';
import { setWoo } from './woocommerce';
import { setSquareSpace } from './squarespace';
import { setHubrise } from './hubrise';
import { setDrivers } from './drivers';
import { setSettings } from './settings';

export const removeUser = () => ({
	type: REMOVE_CURRENT_USER
});

export const setUserDetails = data => ({
	type: SET_USER_DETAILS,
	data
});

export const setCurrentUser = user => ({
	type: SET_CURRENT_USER,
	user
});

export const authenticateUser = () => ({
	type: AUTHENTICATE_USER
});

export const updateCurrentUser = data => ({
	type: UPDATE_CURRENT_USER,
	data
});

export const setApiKey = apiKey => ({
	type: SET_API_KEY,
	apiKey
});

export const setAuthorizationToken = token => setTokenHeader(token);

export const logout = () => ({
	type: LOGOUT_USER
});

export function authUser(type, userData) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('POST', `/server/auth/${type}`, userData)
				.then(({ token, message, shopify, woocommerce, squarespace, hubrise, drivers, settings, ...user }) => {
					console.table({message, shopify, woocommerce, hubrise, drivers: drivers})
					localStorage.setItem('jwt_token', token);
					setAuthorizationToken(token);
					type === 'register' ? dispatch(setUserDetails(user)) : dispatch(setCurrentUser(user));
					shopify &&
						apiCall('POST', `/server/shopify`, { email: user.email })
							.then(shop => {
								dispatch(setShopify(shop));
								resolve(shop);
							})
							.catch(err => reject(err));
					woocommerce &&
						apiCall('GET', `/server/woocommerce`, null, { params: { email: user.email } })
							.then(storeDetails => {
								dispatch(setWoo(storeDetails));
								resolve(storeDetails);
							})
							.catch(err => reject(err));
					squarespace &&
						apiCall('GET', '/server/squarespace', null, { params: { email: user.email } })
							.then(storeDetails => {
								dispatch(setSquareSpace(storeDetails));
								resolve(storeDetails);
							})
							.catch(err => reject(err));
					hubrise &&
						apiCall('GET', '/server/hubrise', null, { params: { email: user.email } })
							.then(account => {
								console.log("HUBRISE", account)
								dispatch(setHubrise({ credentials: account, authCode: null }));
								resolve(account);
							})
							.catch(err => reject(err));
					drivers && dispatch(setDrivers(drivers))
					settings && dispatch(setSettings({ settings }));
					dispatch(removeError());
					resolve(user);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		});
	};
}

export function syncUser(email, authenticated = true) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('GET', `/server/main/sync-user`, null, { params: { email: email } })
				.then(({ message, drivers, ...user }) => {
					if (authenticated) {
						dispatch(setCurrentUser(user));
						dispatch(setDrivers(drivers));
					} else {
						dispatch(setUserDetails(user));
					}
					resolve(user);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		});
	};
}

export function validateRegistration(userData) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log('User data:', userData);
			return apiCall('POST', '/server/auth/validate', userData)
				.then(({ user }) => {
					dispatch(setUserDetails(user));
					resolve(user);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		});
	};
}

export function updateProfile({ img, id, ...data }) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log('Image:', img);
			console.log('Data:', data);
			return apiCall('POST', '/server/main/update-profile', { img, id, data })
				.then(({ message, ...data }) => {
					Mixpanel.track('Successful updated profile');
					if (img) {
						const formData = new FormData();
						console.log(img);
						formData.append('img', img);
						formData.append('id', id);
						const config = {
							headers: {
								'content-type': 'multipart/form-data'
							}
						};
						apiCall('POST', '/server/main/upload', formData, config)
							.then(({ base64Image, message }) => {
								Mixpanel.track('Successful profile image upload');
								console.log(message);
								dispatch(updateCurrentUser({ profileImageData: base64Image }));
							})
							.catch(err => {
								Mixpanel.track('Unsuccessful profile image upload', { $error: err.message });
								console.error(err);
								reject(err);
							});
					}
					dispatch(updateCurrentUser({ ...data }));
					dispatch(removeError());
					resolve(message);
				})
				.catch(err => {
					Mixpanel.track('Unsuccessful profile update', { $error: err.message });
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		});
	};
}

export function sendPasswordResetEmail(email) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log(email);
			return apiCall('POST', '/server/auth/send-reset-email', { email })
				.then(res => {
					Mixpanel.track('Successful request to reset password');
					resolve(res);
				})
				.catch(err => {
					Mixpanel.track('Unsuccessful request to reset password', { $error: err.message });
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		});
	};
}

export function resetPassword({ password }, token) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			const config = { params: { token } };
			return apiCall('PATCH', '/server/auth/reset-password', { password }, config)
				.then(res => {
					Mixpanel.track('Successful password reset');
					resolve(res);
				})
				.catch(err => {
					Mixpanel.track('Unsuccessful password reset', { $error: err.message });
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		});
	};
}

export function updateDeliveryStrategies(email, strategies) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.table(email, strategies);
			return apiCall('POST', '/server/main/update-delivery-strategies', strategies, { params: { email } })
				.then(res => {
					Mixpanel.track('Delivery strategies updated successfully');
					dispatch(updateCurrentUser({ deliveryStrategies: strategies }));
					resolve('Delivery strategies have been saved to your account');
				})
				.catch(err => {
					Mixpanel.track('Unsuccessful update of delivery strategies', { $error: err.message });
					if (err.message) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		});
	};
}

