import { ADD_DROPOFF, REMOVE_DROPOFF, SET_BATCH, CLEAR_DROPOFFS } from '../actionTypes';

export const DEFAULT_STATE = {
	batch: [],
	favourites: []
}

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case ADD_DROPOFF:
			return {...state, batch: [...state.batch, action.batch]}
		case REMOVE_DROPOFF:
			return {...state, batch: state.batch.filter((item, index) => index !== action.index)}
		case SET_BATCH:
			return { ...state, batch: action.batch }
		case CLEAR_DROPOFFS:
			return { ...state, batch: []}
		default:
			return state
	}
}