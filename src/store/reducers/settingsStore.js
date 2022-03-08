import { SET_BUSINESS_WORKFLOW } from '../actionTypes';

export const DEFAULT_STATE = {
	defaultDispatch: "DRIVER",
	sms: false, //be true when user logged in
	autoDispatch: {
		enabled: true,
		maxOrders: 1,
		onlineOnly: true
	},
	driverResponseTime: 5,
	expiredJobAlerts: false,
	driverDeliveryFee: 5,
	courierSelectionCriteria: "eta",
	courierPriceThreshold: 10,
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_BUSINESS_WORKFLOW:
			let { defaultDispatch, sms, autoDispatch, driverResponseTime, driverDeliveryFee, courierSelectionCriteria, courierPriceThreshold, expiredJobAlerts } = action.settings
			return { defaultDispatch, sms, autoDispatch, driverResponseTime, driverDeliveryFee, courierSelectionCriteria, courierPriceThreshold, expiredJobAlerts }
		default:
			return state;
	}
};