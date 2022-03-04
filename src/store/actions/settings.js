import { apiCall } from '../../api';
import { Mixpanel } from '../../config/mixpanel';
import { addError } from './errors';
import { updateCurrentUser } from './auth';
import { SET_BUSINESS_WORKFLOW } from '../actionTypes';

export const setSettings = settings => ({
	type: SET_BUSINESS_WORKFLOW,
	settings
})

export function updateBusinessWorkflow(email, data) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('PATCH', '/server/settings/business-workflow', data, { params: { email } })
				.then(({ message, ...settings }) => {
					console.log(settings)
					Mixpanel.track('Business workflow updated successfully');
					dispatch(setSettings(settings))
					resolve(message);
				})
				.catch(err => {
					Mixpanel.track('Unsuccessful update for delivery hours', { $error: err.message });
					if (err.message) dispatch(addError(err.message));
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
					Mixpanel.track('Delivery hours updated successfully');
					dispatch(updateCurrentUser({ deliveryHours }));
					resolve('Your new delivery times have been updated!');
				})
				.catch(err => {
					Mixpanel.track('Unsuccessful update for delivery hours', { $error: err.message });
					if (err.message) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		});
	};
}