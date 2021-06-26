import {
	CLEAR_ORDERS,
	REMOVE_COMPLETED_ORDER,
	SET_ALL_ORDERS,
	SET_COMPLETED_ORDERS,
	UPDATE_COMPLETED_ORDERS
} from "../actionTypes";

const DEFAULT_STATE = {
	allOrders: [],
	completedOrders: []
};

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_ALL_ORDERS:
			return {...state, allOrders: action.orders}
		case SET_COMPLETED_ORDERS:
			let newCompletedOrders = action.orders.filter(item => item.status === "Completed").map(item => item.id)
			return {...state, completedOrders: newCompletedOrders }
		case UPDATE_COMPLETED_ORDERS:
			return {...state, completedOrders: [...state.completedOrders, action.id]}
		case REMOVE_COMPLETED_ORDER:
			return {...state, completedOrders: state.completedOrders.filter(id => id !== action.id)}
		case CLEAR_ORDERS:
			return DEFAULT_STATE
		default:
			return state;
	}
};