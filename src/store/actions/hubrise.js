import { apiCall } from '../../api';
import { Mixpanel } from '../../config/mixpanel';
import { addError, removeError } from './errors';
import { SET_HUBRISE, UPDATE_HUBRISE } from '../actionTypes';

export const updateHubrise = catalog => ({
	type: UPDATE_HUBRISE,
	catalog
});

export const setHubrise = credentials => ({
	type: SET_HUBRISE,
	credentials
});

export function connectHubrise(data) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('GET', `/server/hubrise/connect`, null, { params: { ...data } })
				.then(hubrise => {
					Mixpanel.track('Successful Hubrise integration');
					Mixpanel.people.setOnce({ $hubrise: hubrise });
					dispatch(setHubrise(hubrise));
					dispatch(removeError());
					resolve(hubrise);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		});
	};
}

export function disconnectHubrise(email) {
	console.log('disconnecting hubrise');
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('PATCH', `/server/hubrise/disconnect`, { email })
				.then(({ message, ...hubrise }) => {
					Mixpanel.people.setOnce({ $hubrise: null });
					dispatch(setHubrise(hubrise));
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

export function pullCatalog(email) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('GET', '/server/hubrise/pull-catalog', null, { params: { email } })
				.then(({ message, catalog }) => {
					console.table(catalog)
					dispatch(updateHubrise(catalog));
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

export function fetchCatalog(email) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('GET', '/server/hubrise/fetch-catalog', null, { params: { email } })
				.then(({ message, catalog }) => {
					dispatch(updateHubrise(catalog));
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

export function updateCatalog(email, data) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('POST', '/server/hubrise/update-catalog', { data }, { params: { email } })
				.then(({ catalog }) => {
					dispatch(updateHubrise(catalog));
					dispatch(removeError());
					resolve(catalog);
				})
				.catch(err => {
					if (err) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		});
	};
}