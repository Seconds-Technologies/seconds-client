import { SET_SQUARESPACE } from '../actionTypes';

const DEFAULT_STATE = {
	isIntegrated: false,
	credentials: {
		siteId: "",
		storeName: "",
		domain: "",
		secretKey: "",
	}
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_SQUARESPACE:
			return {
				isIntegrated: Object.keys(action.credentials).length > 0,
				credentials: action.credentials
			};
		default:
			return state;
	}
};