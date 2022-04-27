import {
	SET_HUBRISE,
	UPDATE_HUBRISE,
	CLEAR_HUBRISE,
	UPDATE_HUBRISE_CREDENTIALS,
	UPDATE_HUBRISE_CATALOG,
	UPDATE_HUBRISE_OPTIONS
} from '../actionTypes';

const DEFAULT_STATE = {
	isIntegrated: false,
	isActive: false,
	options: {
		triggers: {
			enabled: false,
			statuses: [],
			serviceTypeRefs: []
		}
	},
	catalog: null,
	credentials: {
		accountName: '',
		locationId: '',
		locationName: '',
		catalogId: '',
		catalogName: ''
	},
	authCode: null
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_HUBRISE:
			return {
				...state,
				isIntegrated: Object.keys(action.hubrise.credentials).length > 0,
				isActive: !!action.hubrise.credentials.active,
				credentials: action.hubrise.credentials,
				catalog: action.hubrise.catalog,
				...(action.hubrise.options && { options: action.hubrise.options }),
				...(action.hubrise.authCode && { authCode: action.hubrise.authCode })
			};
		case UPDATE_HUBRISE:
			return { ...state, ...action.data };
		case UPDATE_HUBRISE_CREDENTIALS:
			return {
				...state,
				credentials: { ...state.credentials, ...action.data }
			};
		case UPDATE_HUBRISE_CATALOG:
			return {
				...state,
				catalog: { ...state.catalog, ...action.data }
			};
		case UPDATE_HUBRISE_OPTIONS:
			return {
				...state,
				options: { ...state.options, ...action.data }
			};
		case CLEAR_HUBRISE:
			return DEFAULT_STATE;
		default:
			return state;
	}
};
