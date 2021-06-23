import { SET_PRODUCTS, REMOVE_PRODUCT, CLEAR_PRODUCTS } from "../actionTypes";

const DEFAULT_STATE = [];

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_PRODUCTS:
			return action.products
		case REMOVE_PRODUCT:
			return [state.filter(product => product["id"] !== action.id)]
		case CLEAR_PRODUCTS:
			return DEFAULT_STATE
		default:
			return state;
	}
};