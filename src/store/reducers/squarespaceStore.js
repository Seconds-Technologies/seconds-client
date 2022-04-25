import { SET_SQUARESPACE, UPDATE_SQUARESPACE } from '../actionTypes';

const DEFAULT_STATE = {
	isIntegrated: false,
	isActive: false,
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
				isActive: !!action.credentials.active,
				credentials: action.credentials
			};
		case UPDATE_SQUARESPACE:
			return { ...state, ...action.data };
		default:
			return state;
	}
};