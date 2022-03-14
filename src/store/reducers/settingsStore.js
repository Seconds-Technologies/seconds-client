import { SET_BUSINESS_WORKFLOW, UPDATE_BUSINESS_WORKFLOW } from '../actionTypes';

export const DEFAULT_STATE = {
	defaultDispatch: 'DRIVER',
	sms: false, //be true when user logged in
	jobAlerts: {
		new: false,
		expired: false
	},
	autoDispatch: {
		enabled: true,
		maxOrders: 1,
		onlineOnly: true
	},
	driverResponseTime: 5,
	driverDeliveryFee: 5,
	courierSelectionCriteria: 'eta',
	courierPriceThreshold: 10,
	activeFleetProviders: {
		stuart: true,
		gophr: true,
		street_stream: true,
		ecofleet: true,
		addison_lee: true
	}
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_BUSINESS_WORKFLOW:
			let {
				defaultDispatch,
				sms,
				jobAlerts,
				autoDispatch,
				driverResponseTime,
				driverDeliveryFee,
				courierSelectionCriteria,
				courierPriceThreshold,
				activeFleetProviders
			} = action.settings;
			return {
				defaultDispatch,
				sms,
				jobAlerts,
				autoDispatch,
				driverResponseTime,
				driverDeliveryFee,
				courierSelectionCriteria,
				courierPriceThreshold,
				activeFleetProviders
			};
		case UPDATE_BUSINESS_WORKFLOW:
			return { ...state, activeFleetProviders: { ...action.data } };
		default:
			return state;
	}
};