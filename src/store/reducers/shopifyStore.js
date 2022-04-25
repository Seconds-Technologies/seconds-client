import { SET_SHOPIFY, UPDATE_SHOPIFY } from "../actionTypes";

const DEFAULT_STATE = {
	isIntegrated: false,
	isActive: false,
	credentials: {
		accessToken: "",
		shopId: "",
		domain: "",
		country: "",
		shopOwner: ""
	}
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_SHOPIFY:
			return {
				isIntegrated: Object.keys(action.credentials).length > 0,
				isActive: !!action.credentials.active,
				credentials: action.credentials
			};
		case UPDATE_SHOPIFY:
			return { ...state, ...action.data };
		default:
			return state;
	}
};