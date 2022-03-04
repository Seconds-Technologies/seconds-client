import { SET_BUSINESS_WORKFLOW, UPDATE_BUSINESS_WORKFLOW } from '../actionTypes';

export const DEFAULT_STATE = {
	defaultDispatch: "DRIVER",
	sms: false, //be true when user logged in
	autoDispatch: {
		enabled: false,
		maxOrders: 1,
		onlineOnly: false
	},
	driverResponseTime: 5,
	driverDeliveryFee: 5,
	courierSelectionCriteria: "eta",
	courierPriceThreshold: 10,
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_BUSINESS_WORKFLOW:
			const { defaultDispatch, sms, autoDispatch, driverResponseTime, driverDeliveryFee, courierSelectionCriteria, courierPriceThreshold } = action.settings
			return { ...state, defaultDispatch, sms, autoDispatch, driverResponseTime, driverDeliveryFee, courierSelectionCriteria, courierPriceThreshold }
		case UPDATE_BUSINESS_WORKFLOW:
			return { state, ...action.settings }
		default:
			return state;
	}
};