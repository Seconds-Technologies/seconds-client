import { SET_BUSINESS_WORKFLOW, UPDATE_BUSINESS_WORKFLOW, UPDATE_FLEET_PROVIDERS } from '../actionTypes';
import { BATCH_TYPES, DISPATCH_TYPES } from '../../constants';

export const DEFAULT_STATE = {
	defaultDispatch: DISPATCH_TYPES.DRIVER,
	defaultBatchMode: BATCH_TYPES.DAILY,
	sms: false, //be true when user logged in
	jobAlerts: {
		new: false,
		cancelled: false,
		expired: false
	},
	autoDispatch: {
		enabled: true,
		maxOrders: 1,
		onlineOnly: true
	},
	autoBatch: {
		enabled: false,
		daily: {
			deadline: '17:00',
			pickupTime: '18:00'
		},
		incremental: {
			batchInterval: 2,
			waitTime: 30
		}
	},
	routeOptimization: {
		vehicleTypes: {
			BIC: false,
			MTB: false,
			CGB: false,
			CAR: false,
			VAN: false
		},
		objectives: {
			mileage: true,
			duration: true,
			cost: true
		}
	},
	driverResponseTime: 5,
	driverDeliveryFee: 5,
	courierSelectionCriteria: 'eta',
	courierVehicles: {
		BIC: {
			enabled: true,
			minDispatchAmount: 0,
			maxDispatchAmount: 100,
			maxTransitTime: 720
		},
		MTB: {
			enabled: true,
			minDispatchAmount: 0,
			maxDispatchAmount: 100,
			maxTransitTime: 720
		},
		CGB: {
			enabled: true,
			minDispatchAmount: 0,
			maxDispatchAmount: 100,
			maxTransitTime: 720
		},
		CAR: {
			enabled: true,
			minDispatchAmount: 0,
			maxDispatchAmount: 100,
			maxTransitTime: 720
		},
		VAN: {
			enabled: true,
			minDispatchAmount: 0,
			maxDispatchAmount: 100,
			maxTransitTime: 720
		},
	},
	activeFleetProviders: {
		stuart: true,
		gophr: true,
		street_stream: true,
		ecofleet: true,
		addison_lee: true
	},
	dispatchSupportTeam: [],
	pickupInstructions: ""
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_BUSINESS_WORKFLOW:
			let {
				_id,
				_v,
				clientId,
				...workflowSetting
			} = action.settings;
			return workflowSetting;
		case UPDATE_BUSINESS_WORKFLOW:
			return { ...state, ...action.settings }
		case UPDATE_FLEET_PROVIDERS:
			return { ...state, activeFleetProviders: { ...action.providers } };
		default:
			return state;
	}
};