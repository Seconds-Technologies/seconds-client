import { SET_SHOPIFY } from "../actionTypes";

const DEFAULT_STATE = {
	isIntegrated: false,
	credentials: {
		accessToken: "",
		baseURL: "",
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
				credentials: action.credentials
			};
		default:
			return state;
	}
};