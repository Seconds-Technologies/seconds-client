import { apiCall } from '../../api';
import { Mixpanel } from '../../config/mixpanel';
import { addError } from './errors';
import { updateCurrentUser } from './auth';
import { INTEGRATIONS } from '../../constants';
import { SET_BUSINESS_WORKFLOW, UPDATE_FLEET_PROVIDERS } from '../actionTypes';
import { updateShopify } from './shopify';
import { updateWoo } from './woocommerce';
import { updateSquareSpace } from './squarespace';
import { updateHubrise } from './hubrise';

export const setSettings = settings => ({
	type: SET_BUSINESS_WORKFLOW,
	settings
})

export const updateSettings = providers => ({
	type: UPDATE_FLEET_PROVIDERS,
	providers
})

export function updateBusinessWorkflow(email, data) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('PATCH', '/server/settings/business-workflow', data, { params: { email } })
				.then(({ message, ...settings }) => {
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
			return apiCall('POST', '/server/settings/update-delivery-hours', deliveryHours, { params: { email } })
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

export function updateFleetProviders(email, data){
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('PATCH', '/server/settings/toggle-provider-status', data, { params: { email } })
				.then(({ message, ...activeFleetProviders }) => {
					dispatch(updateSettings(activeFleetProviders))
					resolve(message);
				})
				.catch(err => {
					Mixpanel.track('FAILED - update fleet providers', { $error: err.message });
					if (err.message) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		})
	}
}

export function updateIntegrationStatus(email, data){
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('PATCH', '/server/settings/toggle-integration-status', data, { params: { email } })
				.then(({ message, platform, status }) => {
					platform === INTEGRATIONS.SHOPIFY && dispatch(updateShopify({ isActive: status }));
					platform === INTEGRATIONS.WOOCOMMERCE && dispatch(updateWoo({ isActive: status }));
					platform === INTEGRATIONS.SQUARESPACE && dispatch(updateSquareSpace({ isActive: status }));
					platform === INTEGRATIONS.HUBRISE && dispatch(updateHubrise({ isActive: status }));
					resolve(status)
				})
				.catch(err => {
					Mixpanel.track('FAILED - update integration status', { $error: err.message });
					if (err.message) dispatch(addError(err.message));
					else dispatch(addError('Server is down!'));
					reject(err);
				});
		})
	}
}