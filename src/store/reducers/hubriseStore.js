import { SET_HUBRISE, UPDATE_HUBRISE, CLEAR_HUBRISE } from '../actionTypes';

const DEFAULT_STATE = {
	isIntegrated: false,
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
				credentials: action.hubrise.credentials,
				authCode: action.hubrise.authCode
			};
		case UPDATE_HUBRISE:
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