import { apiCall } from '../../api';
import { Mixpanel } from '../../config/mixpanel';
import { addError, removeError } from './errors';
import { SET_HUBRISE } from '../actionTypes';

export const setHubrise = credentials => ({
	type: SET_HUBRISE,
	credentials
})

export function connectHubrise(data){
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
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}

export function disconnectHubrise(email) {
	console.log("disconnecting hubrise")
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
					else dispatch(addError('Api endpoint could not be accessed!'));
					reject(err);
				});
		});
	};
}