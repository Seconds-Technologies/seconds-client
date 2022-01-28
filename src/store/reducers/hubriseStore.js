import { SET_HUBRISE } from '../actionTypes';

const DEFAULT_STATE = {
	isIntegrated: false,
	credentials: {
		accessToken: "",
		accountName: "",
		locationId: "",
		locationName: "",
		customerListId: "",
		customerListName: "",
		catalogId: "",
		catalogName: ""
	}
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_HUBRISE:
			return {
				isIntegrated: Object.keys(action.credentials).length > 0,
				credentials: action.credentials
			};
		default:
			return state;
	}
};