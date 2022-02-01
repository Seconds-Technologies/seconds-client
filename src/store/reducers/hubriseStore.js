import { SET_HUBRISE, UPDATE_HUBRISE } from '../actionTypes';

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
	}
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_HUBRISE:
			return {
				isIntegrated: Object.keys(action.credentials).length > 0,
				credentials: action.credentials
			};
		case UPDATE_HUBRISE:
			return {
				...state,
				credentials: { ...state.credentials, catalog: action.catalog }
			};
		default:
			return state;
	}
};