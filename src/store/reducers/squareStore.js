import { SET_SQUARE } from "../actionTypes";

const DEFAULT_STATE = {
	isIntegrated: false,
	credentials: {
		accessToken: "",
		shopId: "",
		domain: "",
		country: "",
		clientId: "",
		clientSecret: ""
	}
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_SQUARE:
			return {
				isIntegrated: Object.keys(action.credentials).length > 0,
				credentials: action.credentials
			};
		default:
			return state;
	}
};