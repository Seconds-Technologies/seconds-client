import { SET_WOOCOMMERCE, UPDATE_WOOCOMMERCE } from '../actionTypes';

const DEFAULT_STATE = {
	isIntegrated: false,
	isActive: false,
	credentials: {
		domain: "",
		consumerKey: "",
		consumerSecret: ""
	}
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_WOOCOMMERCE:
			return {
				isIntegrated: Object.keys(action.credentials).length > 0,
				isActive: !!action.credentials.active,
				credentials: action.credentials
			};
		case UPDATE_WOOCOMMERCE:
			return { ...state, ...action.data };
		default:
			return state;
	}
};