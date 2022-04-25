import { SET_HUBRISE, UPDATE_HUBRISE, CLEAR_HUBRISE, UPDATE_HUBRISE_CREDENTIALS } from '../actionTypes';

const DEFAULT_STATE = {
	isIntegrated: false,
	isActive: false,
	credentials: {
		accountName: "",
		locationId: "",
		locationName: "",
		customerListId: "",
		customerListName: "",
		catalogId: "",
		catalogName: "",
		catalog: {
			clientId: "",
			products: [],
			categories: []
		}
	},
	authCode: null
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_HUBRISE:
			return {
				isIntegrated: Object.keys(action.hubrise.credentials).length > 0,
				isActive: !!action.hubrise.credentials.active,
				credentials: action.hubrise.credentials,
				authCode: action.hubrise.authCode
			};
		case UPDATE_HUBRISE:
			return { ...state, ...action.data };
		case UPDATE_HUBRISE_CREDENTIALS:
			return {
				...state,
				credentials: { ...state.credentials, ...action.data }
			};
		case CLEAR_HUBRISE:
			return DEFAULT_STATE
		default:
			return state;
	}
};