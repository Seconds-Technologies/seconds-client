import { REMOVE_CURRENT_USER, SET_API_KEY, SET_CURRENT_USER, UPDATE_CURRENT_USER } from '../actionTypes';

export const DEFAULT_STATE = {
	isAuthenticated: false, //be true when user logged in
	user: {
		firstname: '',
		lastname: '',
		company: '',
		email: '',
		apiKey: '',
		profileImageData: '',
	}, //all user info when logged in
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_CURRENT_USER:
			return {
				isAuthenticated: Object.keys(action.user).length > 0,
				user: { ...state.user, ...action.user },
			};
		case UPDATE_CURRENT_USER:
			return {
				...state,
				user: { ...state.user, ...action.data },
			};
		case SET_API_KEY:
			return {
				...state,
				user: { ...state.user, apiKey: action.apiKey },
			};
		case REMOVE_CURRENT_USER:
			return DEFAULT_STATE
		default:
			return state;
	}
};