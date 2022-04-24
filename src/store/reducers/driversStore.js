import { ADD_DRIVER, SET_DRIVERS, UPDATE_DRIVER, UPDATE_DRIVERS } from '../actionTypes';

export const schema = {
	id: '',
	verified: false, //be true when user logged in
	firstname: '',
	lastname: '',
	phone: '',
	email: '',
	vehicle: '',
	profileImageKey: '',
	status: ''
};

export const DEFAULT_STATE = []

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_DRIVERS:
			return [...action.drivers]
		case UPDATE_DRIVERS:
			return state.map((item, index) => ({ ...item, ...action.drivers[index] }));
		case ADD_DRIVER:
			return [...state, action.driver]
		case UPDATE_DRIVER:
			return [...state, action.driver]
		default:
			return state
	}
}