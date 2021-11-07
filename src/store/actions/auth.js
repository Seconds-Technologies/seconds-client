import { apiCall, setTokenHeader } from '../../api';
import { REMOVE_CURRENT_USER, SET_API_KEY, SET_CURRENT_USER, UPDATE_CURRENT_USER } from '../actionTypes';
import { addError, removeError } from './errors';
import { clearAllOrders, clearAllProducts, setShopify } from './shopify';
import { clearAllJobs } from './delivery';

export const removeUser = () => {
	return {
		type: REMOVE_CURRENT_USER,
	};
};

export const setCurrentUser = user => {
	return {
		type: SET_CURRENT_USER,
		user,
	};
};

export const updateCurrentUser = data => {
	return {
		type: UPDATE_CURRENT_USER,
		data,
	};
};

export const setApiKey = apiKey => {
	return {
		type: SET_API_KEY,
		apiKey,
	};
};

export const setAuthorizationToken = token => {
	setTokenHeader(token);
};

export function logout() {
	return dispatch => {
		localStorage.removeItem('jwt_token');
		setAuthorizationToken(false);
		dispatch(removeUser());
		dispatch(setShopify({}));
		dispatch(clearAllOrders());
		dispatch(clearAllProducts());
		dispatch(clearAllJobs());
	};
}

export function authUser(type, userData) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log('User data:', userData);
			return apiCall('POST', `/server/auth/${type}`, userData)
				.then(({ token, message, shopify, ...user }) => {
					console.log(message);
					console.log('Auth token', token);
					console.log('shopify', !!shopify);
					localStorage.setItem('jwt_token', token);
					setAuthorizationToken(token);
					dispatch(setCurrentUser(user));
					shopify &&
						apiCall('POST', `/server/shopify`, { email: user.email })
							.then(({ baseURL, accessToken, shopId, domain, country, shopOwner }) => {
								dispatch(setShopify({ baseURL, accessToken, shopId, domain, country, shopOwner }));
								resolve({ baseURL, accessToken, shopId, domain, country, shopOwner });
							})
							.catch(err => reject(err));
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

export function authorizeAPI(email, strategy) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log('User:', email);
			return apiCall('POST', `/server/main/token`, { email, strategy })
				.then(({ apiKey }) => {
					dispatch(setApiKey(apiKey));
					resolve(apiKey);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
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
					if (img) {
						const formData = new FormData();
						console.log(img);
						formData.append('img', img);
						formData.append('id', id);
						const config = {
							headers: {
								'content-type': 'multipart/form-data',
							},
						};
						apiCall('POST', '/server/main/upload', formData, config)
							.then(({ base64Image, message }) => {
								console.log(message);
								dispatch(updateCurrentUser({ profileImageData: base64Image }));
							})
							.catch(err => {
								console.error(err);
								reject(err);
							});
					}
					dispatch(updateCurrentUser({ ...data }));
					dispatch(removeError());
					resolve(message);
				})
				.catch(err => {
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
				.then(res => resolve(res))
				.catch(err => {
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
				.then(res => resolve(res))
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		});
	};
}

export function updateDeliveryTimes(email, deliveryHours) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log(email);
			return apiCall('POST', '/server/main/update-delivery-hours', deliveryHours, { params: { email } })
				.then(res => {
					dispatch(updateCurrentUser({ deliveryHours }));
					resolve('New delivery times set!');
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		});
	};
}
