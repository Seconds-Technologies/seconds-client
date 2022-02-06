import { ADD_DRIVER, UPDATE_DRIVER, SET_DRIVERS } from '../actionTypes';

export const schema = {
	verified: false, //be true when user logged in
	firstname: '',
	lastname: '',
	phone: '',
	email: '',
}

export const DEFAULT_STATE = []

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_DRIVERS:
			return [...action.drivers]
		case ADD_DRIVER:
			return [...state, action.driver]
		case UPDATE_DRIVER:
			return [...state, action.driver]
		default:
			return state
	}
}