import { apiCall } from '../../api';
import { Mixpanel } from '../../config/mixpanel';
import { addError, removeError } from './errors';
import {
	SET_HUBRISE,
	UPDATE_HUBRISE,
	CLEAR_HUBRISE,
	UPDATE_HUBRISE_CREDENTIALS,
	UPDATE_HUBRISE_CATALOG,
	UPDATE_HUBRISE_OPTIONS
} from '../actionTypes';

export const setHubrise = hubrise => ({
	type: SET_HUBRISE,
	hubrise
});

export const updateHubrise = data => ({
	type: UPDATE_HUBRISE,
	data
});

export const updateHubriseCredentials = data => ({
	type: UPDATE_HUBRISE_CREDENTIALS,
	data
});

export const updateHubriseCatalog = data => ({
	type: UPDATE_HUBRISE_CATALOG,
	data
})

export const updateHubriseOptions = data => ({
	type: UPDATE_HUBRISE_OPTIONS,
	data
})

export const clearHubrise = () => ({
	type: CLEAR_HUBRISE,
})

export function connectHubrise(data) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('GET', `/server/hubrise/connect`, null, { params: { ...data } })
				.then(hubrise => {
					Mixpanel.track('Successful Hubrise integration');
					Mixpanel.people.setOnce({ $hubrise: hubrise });
					dispatch(setHubrise({ credentials: hubrise, authCode: data.code }));
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
				.then(({ message }) => {
					Mixpanel.people.setOnce({ $hubrise: null });
					dispatch(clearHubrise());
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
				.then(({ message, catalog, catalogName, catalogId }) => {
					console.table(catalog)
					dispatch(updateHubriseCredentials({ catalogName, catalogId }));
					dispatch(updateHubriseCatalog(catalog))
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
					dispatch(updateHubriseCredentials(catalog));
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
			return apiCall('PATCH', '/server/hubrise/update-catalog', data, { params: { email } })
				.then(({ catalog }) => {
					dispatch(updateHubriseCatalog(catalog));
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

export function configureHubrise(email, data) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('PATCH', '/server/hubrise/update-hubrise', data, { params: { email } })
				.then(({ message }) => {
					dispatch(updateHubriseOptions(data));
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