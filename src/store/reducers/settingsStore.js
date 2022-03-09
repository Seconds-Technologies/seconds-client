import { SET_BUSINESS_WORKFLOW } from '../actionTypes';

export const DEFAULT_STATE = {
	defaultDispatch: "DRIVER",
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
	courierSelectionCriteria: "eta",
	courierPriceThreshold: 10,
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_BUSINESS_WORKFLOW:
			let { defaultDispatch, sms, jobAlerts, autoDispatch, driverResponseTime, driverDeliveryFee, courierSelectionCriteria, courierPriceThreshold } = action.settings
			return { defaultDispatch, sms, jobAlerts, autoDispatch, driverResponseTime, driverDeliveryFee, courierSelectionCriteria, courierPriceThreshold }
		default:
			return state;
	}
};