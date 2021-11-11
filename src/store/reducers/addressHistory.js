import { ADD_DROPOFF, REMOVE_DROPOFF } from '../actionTypes';

export const DEFAULT_STATE = {
	dropoffs: [],
	favourites: []
}

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case ADD_DROPOFF:
			return {...state, dropoffs: [...state.dropoffs, action.dropoff]}
		case REMOVE_DROPOFF:
			return {...state, dropoffs: state.dropoffs.filter((item, index) => index !== action.index)}
		default:
			return state
	}
}