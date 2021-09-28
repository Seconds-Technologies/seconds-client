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
					console.log(message, token, shopify);
					localStorage.setItem('jwt_token', token);
					setAuthorizationToken(token);
					dispatch(setCurrentUser(user));
					shopify && apiCall('POST', `/server/shopify`, { email: user.email })
						.then(({ baseURL, accessToken, shopId, domain, country, shopOwner }) => {
							dispatch(setShopify({ baseURL, accessToken, shopId, domain, country, shopOwner }));
							resolve({ baseURL, accessToken, shopId, domain, country, shopOwner });
						})
						.catch(err => reject(err));
					dispatch(removeError());
					resolve();
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

export function authorizeAPI(email, strategy) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log('User:', email);
			return apiCall('POST', `/server/auth/token`, { email, strategy })
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
			return apiCall('POST', '/server/auth/update', { img, id, data })
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
						apiCall('POST', '/server/auth/upload', formData, config)
							.then(({ base64Image, message }) => {
								console.log(base64Image);
								dispatch(updateCurrentUser({ profileImageData: base64Image }));
							})
							.catch(err => {
								console.error(err);
								reject(err);
							});
					}
					dispatch(updateCurrentUser({ ...data }));
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