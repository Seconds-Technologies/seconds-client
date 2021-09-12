import { apiCall, setTokenHeader } from '../../api';
import { SET_API_KEY, SET_CURRENT_USER, UPDATE_CURRENT_USER } from '../actionTypes';
import { addError, removeError } from './errors';
import { clearAllOrders, clearAllProducts, setShopify } from './shopify';

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
	}
}

export const setApiKey = apiKey => {
	return {
		type: SET_API_KEY,
		apiKey
	}
}

export const setAuthorizationToken = token => {
	setTokenHeader(token);
};

export function logout() {
	return dispatch => {
		localStorage.removeItem('jwt_token');
		setAuthorizationToken(false);
		dispatch(setCurrentUser({}));
		dispatch(setShopify({}));
		dispatch(clearAllOrders());
		dispatch(clearAllProducts());
	};
}

export function authUser(type, userData) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log('User data:', userData);
			return apiCall('POST', `/server/auth/${type}`, userData)
				.then(({ token, message, ...user }) => {
					console.log(message, token)
					localStorage.setItem('jwt_token', token);
					setAuthorizationToken(token);
					dispatch(setCurrentUser(user));
					apiCall('POST', `/server/shopify`, { email: user.email })
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

export function authorizeAPI(userData) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log('User data:', userData);
			return apiCall('POST', `/server/auth/token`, userData)
				.then(({ apiKey }) => {
					dispatch(setApiKey(apiKey))
					resolve(apiKey)
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

export function updateProfile(data){
	return dispatch => {
		return new Promise((resolve, reject) => {
			console.log(data);
			return apiCall("POST", '/server/auth/update', data)
				.then(({ message, ...data }) => {
					dispatch(updateCurrentUser(data))
					resolve(message)
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				})
		})
	}
}